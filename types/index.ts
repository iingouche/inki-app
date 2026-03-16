export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface Movie {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  previewImage?: string | null;
  videoUrl?: string | null;
  price?: number;
  isPaid?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Ticket {
  id: string;
  movieTitle: string;
  date: string;
  time: string;
  row: number;
  seat: number;
  poster: string;
}
