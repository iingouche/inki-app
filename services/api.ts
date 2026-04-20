import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import {
  User,
  Movie,
  Ticket,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from '@/types';
import { MOCK_USER, MOCK_TICKETS } from '@/data/mockData';

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, '');

const ensureApiSuffix = (value: string) => {
  const normalized = normalizeBaseUrl(value);

  try {
    const parsed = new URL(normalized);
    if (!/\/api$/i.test(parsed.pathname)) {
      parsed.pathname = `${normalizeBaseUrl(parsed.pathname || '')}/api`;
    }
    return normalizeBaseUrl(parsed.toString());
  } catch {
    if (/\/api$/i.test(normalized)) {
      return normalized;
    }
    return `${normalized}/api`;
  }
};

const resolveBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  if (envUrl) {
    return ensureApiSuffix(envUrl);
  }

  const host = process.env.HOST?.trim();
  if (host) {
    const withProtocol = host.startsWith('http') ? host : `http://${host}`;
    return ensureApiSuffix(withProtocol);
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }

  return 'http://localhost:5000/api';
};

export const API_BASE_URL = resolveBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

const persistToken = async (token: string | null) => {
  if (token) {
    await AsyncStorage.setItem('token', token);
  } else {
    await AsyncStorage.removeItem('token');
  }
};

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post(`/auth/login`, {
        email: credentials.email,
        password: credentials.password,
      });

      if (response.data.token) {
        await persistToken(response.data.token);
        setAuthToken(response.data.token);
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (
    credentials: RegisterCredentials
  ): Promise<AuthResponse> => {
    try {
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Пароли не совпадают');
      }

      const response = await api.post(`/auth/register`, {
        email: credentials.email,
        password: credentials.password,
        name: credentials.name
      });

      if (response.data.token) {
        await persistToken(response.data.token);
        setAuthToken(response.data.token);
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  logout: () => {
    persistToken(null);
    setAuthToken(null);
  },
  
  checkAuth: async (): Promise<AuthResponse | null> => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return null;
    
    try {
      setAuthToken(token);
      // Здесь можно добавить запрос для проверки токена, если есть соответствующий эндпоинт
      // const response = await api.get(`/auth/me`);
      // return response.data;
      return null;
    } catch (error) {
      await persistToken(null);
      setAuthToken(null);
      return null;
    }
  }
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Неавторизован - удаляем токен и перенаправляем на страницу входа
      persistToken(null);
      setAuthToken(null);
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

type UploadAsset = {
  uri: string;
  name?: string;
  mimeType?: string;
  file?: any;
};

type CreateMoviePayload = {
  title: string;
  description: string;
  price?: number | string;
  poster?: UploadAsset | null;
  movie?: UploadAsset | null;
};

const appendFormFile = (
  formData: FormData,
  fieldName: string,
  asset: UploadAsset
) => {
  if (asset.file) {
    formData.append(fieldName, asset.file as any);
    return;
  }

  const name = asset.name || `${fieldName}-${Date.now()}`;
  const type = asset.mimeType || 'application/octet-stream';
  formData.append(fieldName, { uri: asset.uri, name, type } as any);
};

export const moviesAPI = {
  getNowPlaying: async (): Promise<Movie[]> => {
    try {
      // TODO: Раскомментировать для работы с реальным API
      const response = await api.get(`/movies`);
      return response.data;

      // await new Promise((resolve) => setTimeout(resolve, 800));
      // return [];
    } catch (error) {
      throw error;
    }
  },

  getMovieById: async (id: string): Promise<Movie> => {
    try {
      // TODO: Раскомментировать для работы с реальным API
      const response = await api.get(`/movies/${id}`);
      return response.data;

      // await new Promise((resolve) => setTimeout(resolve, 600));
      // const movie = null;
      // if (!movie) {
      //   throw new Error('Фильм не найден');
      // }
      // return movie;
    } catch (error) {
      throw error;
    }
  },

  createMovie: async (payload: CreateMoviePayload): Promise<Movie> => {
    try {
      const formData = new FormData();
      formData.append('title', payload.title);
      formData.append('description', payload.description);
      if (payload.price !== undefined && payload.price !== null) {
        formData.append('price', String(payload.price));
      }
      if (payload.poster) {
        appendFormFile(formData, 'poster', payload.poster);
      }
      if (payload.movie) {
        appendFormFile(formData, 'movie', payload.movie);
      }

      const response = await api.post(`/movies`, formData, {
        headers: {
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      });
      return response.data.movie ?? response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const userAPI = {
  getProfile: async (): Promise<User> => {
    try {
      // TODO: Раскомментировать для работы с реальным API
      const response = await api.get(`/user/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      return response.data;

      // await new Promise((resolve) => setTimeout(resolve, 500));
      // return MOCK_USER;
    } catch (error) {
      throw error;
    }
  },

  getTickets: async (): Promise<Ticket[]> => {
    try {
      // TODO: Раскомментировать для работы с реальным API
      const response = await api.get(`/user/tickets`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      return response.data;

      // await new Promise((resolve) => setTimeout(resolve, 600));
      // return MOCK_TICKETS;
    } catch (error) {
      throw error;
    }
  },
};
