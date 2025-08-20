// src/store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState } from '@/types/user';

const initialState: UserState = {
  id: null,
  email: null,
  firstName: null,
  lastName: null,
  phoneNumber: null,
  deliveryAddress: null,
  role: null,
  averageRating: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    userLoaded(
      state,
      action: PayloadAction<Omit<UserState, 'isLoading' | 'error' | 'isAuthenticated'>>
    ) {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.phoneNumber = action.payload.phoneNumber;
      state.deliveryAddress = action.payload.deliveryAddress;
      state.role = action.payload.role;
      state.averageRating = action.payload.averageRating;
    },
    userLoadError(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload;

      state.id = null;
      state.email = null;
      state.firstName = null;
      state.lastName = null;
      state.phoneNumber = null;
      state.deliveryAddress = null;
      state.role = null;
      state.averageRating = null;
    },
    userLoggedOut(state) {
      Object.assign(state, initialState, { isLoading: false });
    },
  },
});

export const { userLoading, userLoaded, userLoadError, userLoggedOut } = userSlice.actions;
export default userSlice.reducer;
