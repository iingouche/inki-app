import axios from 'axios';
import {
  User,
  Movie,
  Ticket,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from '@/types';
import { MOCK_USER, MOCK_MOVIES, MOCK_TICKETS } from '@/data/mockData';

const API_BASE_URL = process.env.HOST;

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

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: credentials.email,
        password: credentials.password
      });
      return response.data;

      // await new Promise((resolve) => setTimeout(resolve, 1000));

      // if (credentials.email && credentials.password) {
      //   const token = 'mock_token_' + Date.now();
      //   return {
      //     token,
      //     user: MOCK_USER,
      //   };
      // }
      // throw new Error('Неверный email или пароль');
    } catch (error) {
      throw error;
    }
  },

  register: async (
    credentials: RegisterCredentials
  ): Promise<AuthResponse> => {
    try {
      // TODO: Раскомментировать для работы с реальным API
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email: credentials.email,
        password: credentials.password,
        confirmPassword: credentials.confirmPassword,
        name: credentials.name
      });
      return response.data;

      // await new Promise((resolve) => setTimeout(resolve, 1000));

      // if (credentials.password !== credentials.confirmPassword) {
      //   throw new Error('Пароли не совпадают');
      // }

      // if (credentials.email && credentials.password && credentials.name) {
      //   const token = 'mock_token_' + Date.now();
      //   return {
      //     token,
      //     user: {
      //       ...MOCK_USER,
      //       email: credentials.email,
      //       name: credentials.name,
      //     },
      //   };
      // }
      throw new Error('Заполните все поля');
    } catch (error) {
      throw error;
    }
  },
};

export const moviesAPI = {
  getNowPlaying: async (): Promise<Movie[]> => {
    try {
      // TODO: Раскомментировать для работы с реальным API
      const response = await axios.get(`${API_BASE_URL}/movies/now-playing`);
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
      const response = await axios.get(`${API_BASE_URL}/movies/${id}`);
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
      const response = await axios.get(`${API_BASE_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
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
      const response = await axios.get(`${API_BASE_URL}/user/tickets`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      return response.data;

      // await new Promise((resolve) => setTimeout(resolve, 600));
      // return MOCK_TICKETS;
    } catch (error) {
      throw error;
    }
  },
};
