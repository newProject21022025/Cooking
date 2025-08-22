// src/api/usersApi.ts
import axios from "axios";
import { User } from "@/types/user";

const API_URL = "http://localhost:3000/users"; // змінити на свій бекенд

const getToken = () => {
  return localStorage.getItem("token"); // або ваш метод зберігання JWT
};

export const getAllUsers = async (): Promise<User[]> => {
  const token = getToken();
  const { data } = await axios.get<User[]>(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const blockUser = async (userId: string) => {
  const token = getToken();
  await axios.patch(`${API_URL}/${userId}/block`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const unblockUser = async (userId: string) => {
  const token = getToken();
  await axios.patch(`${API_URL}/${userId}/unblock`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


