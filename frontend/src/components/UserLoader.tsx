// src/components/UserLoader.tsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, clearUser } from "@/redux/userSlice";
import { RootState, AppDispatch } from "@/redux/store";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile`;

interface UserLoaderProps {
  children: React.ReactNode;
}

const UserLoader: React.FC<UserLoaderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: user, loading } = useSelector((state: RootState) => state.user);
  const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!token) {
      dispatch(clearUser());
      return;
    }

    const loadUser = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            dispatch(clearUser());
            return;
          }
          throw new Error("Не вдалося завантажити профіль");
        }

        const userData = await response.json();
        dispatch(fetchUser.fulfilled(userData, "", userData.id));
      } catch (err: any) {
        console.error("Помилка завантаження користувача:", err);
        dispatch(clearUser());
      }
    };

    loadUser();
  }, [token, dispatch]);

  if (loading && !isAuthenticated) {
    return <div>Завантаження користувача...</div>;
  }

  return <>{children}</>;
};

export default UserLoader;
