export type UserRole = 'user' | 'partner' | 'admin';

export interface User {
  id: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  deliveryAddress: string | null;
  role: UserRole | null;
  averageRating: number | null;
}

export interface UserState extends User {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
