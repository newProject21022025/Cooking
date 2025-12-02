// src/redux/slices/authSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { loginUser } from "@/api/authApi";
import { LoginRequest, LoginResponse } from "@/types/auth";
import { jwtDecode, JwtPayload } from "jwt-decode";

// 🔹 Тип користувача
interface User {
  id: string | number;
  email: string;
  firstName: string;
  lastName: string | null;
  role: string;
}

// 🔹 Стан аутентифікації
interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const decoded: JwtPayload = jwtDecode(token);
    // Якщо немає exp або час exp менше поточного часу (в секундах)
    if (!decoded.exp) return false;
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (e) {
    // Якщо токен невалідний або помилка декодування - вважаємо його простроченим
    console.error("Помилка декодування токена:", e);
    return true;
  }
};

// 🔹 Ініціалізація з localStorage
const tokenFromStorage =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;
const userFromStorage =
  typeof window !== "undefined" ? localStorage.getItem("user") : null;

// 💡 Визначаємо валідність токена
const isTokenValid = !isTokenExpired(tokenFromStorage);

const initialState: AuthState = {
  token: isTokenValid ? tokenFromStorage : null, // ⬅️ Якщо прострочений, токен = null
  user: isTokenValid && userFromStorage ? JSON.parse(userFromStorage) : null,
  isAuthenticated: isTokenValid, // ⬅️ Стан залежить від ВАЛІДНОСТІ
  loading: false,
  error: null,
};

// 🔹 Логін
export const login = createAsyncThunk<
  LoginResponse, // тип даних при успішному логіні
  LoginRequest, // тип параметрів (credentials)
  { rejectValue: string } // тип для rejectWithValue
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await loginUser(credentials);
    return response;
  } catch (error: unknown) {
    // Без any, ESLint задоволений
    if (error instanceof Error) return rejectWithValue(error.message);

    // Якщо axios/fetch повертає structured error
    const err = error as { response?: { data?: { message?: string } } };
    if (err.response?.data?.message)
      return rejectWithValue(err.response.data.message);

    return rejectWithValue("Login failed");
  }
});

// 🔹 Логаут
export const logout = createAsyncThunk("auth/logout", async () => true);

// 🔹 Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // логін
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.token = action.payload.access_token;
          state.user = action.payload.user;
          state.isAuthenticated = true;

          if (typeof window !== "undefined") {
            localStorage.setItem("token", action.payload.access_token);
            localStorage.setItem("user", JSON.stringify(action.payload.user));
          }
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Помилка входу";
      })
      // логаут
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;

        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      });
  },
});

export default authSlice.reducer;
