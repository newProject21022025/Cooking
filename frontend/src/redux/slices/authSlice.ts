// src/redux/slices/authSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "@/api/authApi";
import { LoginRequest, LoginResponse } from "@/types/auth";

interface User {
  id: string | number; 
  email: string;
  firstName: string;
  lastName: string | null;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// 🔹 Ініціалізація з localStorage
const tokenFromStorage = typeof window !== "undefined" ? localStorage.getItem("token") : null;
const userFromStorage = typeof window !== "undefined" ? localStorage.getItem("user") : null;

const initialState: AuthState = {
  token: tokenFromStorage,
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  isAuthenticated: !!tokenFromStorage,
  loading: false,
  error: null,
};

// 🔹 Логін
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response: LoginResponse = await loginUser(credentials);
      return response; // { access_token, user }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// 🔹 Логаут
export const logout = createAsyncThunk("auth/logout", async () => true);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.user = action.payload.user; // ⚡ тут зберігаємо правильну роль
        state.isAuthenticated = true;

        localStorage.setItem("token", action.payload.access_token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;

        localStorage.removeItem("token");
        localStorage.removeItem("user");
      });
  },
});

export default authSlice.reducer;

