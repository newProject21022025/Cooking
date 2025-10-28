// src/store/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
// import { User, UserRole } from "@/types/user";


export type UserRole = 'user' | 'partner' | 'admin';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photo?: string;
  role: UserRole;
  favorites: string[]; // Масив ID улюблених страв
}

interface UserState {
  data: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
};

// 🔹 Отримати дані користувача (наприклад, після login)
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get<User>(`/api/users/${userId}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || "Failed to load user");
      } else if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("Failed to load user");
      }
    }
  }
);


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.data = null;
    },
    setUserData: (state, action: PayloadAction<User>) => {
      state.data = action.payload;
      state.error = null;
  },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUser, setUserData } = userSlice.actions;
export default userSlice.reducer;
