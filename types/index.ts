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
  id: string;
  title: string;
  genre: string;
  rating: number;
  poster: string;
  year: number;
  duration: number;
  description: string;
  showtimes: Showtime[];
}

export interface Showtime {
  id: string;
  time: string;
  hall: string;
  available: boolean;
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