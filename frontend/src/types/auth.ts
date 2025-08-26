//types/auth.ts

// types/auth.ts

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User; // додано
}

export interface AuthState {
  token: string | null;
  user?: User; // додано
  isAuthenticated: boolean; // додано для slice
  loading: boolean;
  error: string | null;
}
