export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    access_token: string;
  }
  
  export interface AuthState {
    token: string | null;
    loading: boolean;
    error: string | null;
  }
  