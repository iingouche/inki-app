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
import { MOCK_USER, MOCK_MOVIES, MOCK_TICKETS } from '@/data/mockData';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || process.env.HOST || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
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

axios.interceptors.response.use(
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


export const moviesAPI = {
  getNowPlaying: async (): Promise<Movie[]> => {
    try {
      // TODO: Раскомментировать для работы с реальным API
      const response = await api.get(`/movies/now-playing`);
      return response.data;

      // await new Promise((resolve) => setTimeout(resolve, 800));
      // return MOCK_MOVIES;
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
      // const movie = MOCK_MOVIES.find((m) => m.id === id);
      // if (!movie) {
      //   throw new Error('Фильм не найден');
      // }
      // return movie;
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
