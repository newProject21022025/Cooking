// src/api/authApi.ts

import axios from "axios";
import { LoginRequest, LoginResponse } from "@/types/auth";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth`; // заміни на свій бекенд

export const loginUser = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}/login`, data);
  return response.data;
};
