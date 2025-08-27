// src/redux/slices/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "@/api/authApi";
import { LoginRequest, LoginResponse } from "@/types/auth";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// 🔹 Завантажуємо дані з localStorage при старті
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
        state.user = action.payload.user;
        state.isAuthenticated = true;

        // 🔹 Зберігаємо у localStorage
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

        // 🔹 Видаляємо з localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      });
  },
});

export default authSlice.reducer;



// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // import axios from "axios";
// import { loginUser } from "@/api/authApi"; // ✅ імпорт з authApi.ts

// interface AuthState {
//   token: string | null;
//   isAuthenticated: boolean;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: AuthState = {
//   token: null,
//   isAuthenticated: false,
//   loading: false,
//   error: null,
// };

// // 🔹 Логін
// export const login = createAsyncThunk(
//   "auth/login",
//   async (credentials: { email: string; password: string }, { rejectWithValue }) => {
//     try {
//       const response = await loginUser(credentials); // ✅ використовує прямий URL з authApi.ts
//       return response; // { access_token, user }
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "Login failed");
//     }
//   }
// );

// // 🔹 Логаут
// export const logout = createAsyncThunk("auth/logout", async () => {
//   return true;
// });

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(login.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.loading = false;
//         state.token = action.payload.access_token;
//         state.isAuthenticated = true;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(logout.fulfilled, (state) => {
//         state.token = null;
//         state.isAuthenticated = false;
//       });
//   },
// });

// export default authSlice.reducer;
