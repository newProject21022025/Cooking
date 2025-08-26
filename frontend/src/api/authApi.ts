// src/api/authApi.ts

import axios from "axios";
import { LoginRequest, LoginResponse } from "@/types/auth";

const API_URL = "http://localhost:3000/auth"; // заміни на свій бекенд

export const loginUser = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}/login`, data);
  return response.data;
};
