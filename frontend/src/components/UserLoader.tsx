// src/components/UserLoader.tsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, clearUser } from "@/redux/userSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { setAuthToken } from "@/api/commentsApi"; // 👈 Імпортуємо функцію setAuthToken
import { logout } from "@/redux/slices/authSlice"; // 💡 Імпортуємо logout

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile`;

interface UserLoaderProps {
  children: React.ReactNode;
}

const UserLoader: React.FC<UserLoaderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>(); // 💡 Отримуємо стан завантаження та дані з userSlice
  const { loading, data: userProfile } = useSelector(
    (state: RootState) => state.user
  ); // Отримуємо токен та стан автентифікації з authSlice
  const { token } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!token;

  useEffect(() => {
    setAuthToken(token); // Налаштовуємо токен для API-запитів

    if (!token) {
      dispatch(clearUser()); // Очищуємо userSlice
      return;
    }

    const loadUser = async () => {
      try {
        // Використовуємо токен, відновлений із localStorage
        const response = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // 💡 Якщо токен недійсний:
            // localStorage.removeItem("token");
            // localStorage.removeItem("user"); // Очищуємо також дані користувача з localStorage
            dispatch(logout()); // 💡 Викликаємо logout, щоб очистити authSlice
            dispatch(clearUser());
            return;
          }
          throw new Error("Не вдалося завантажити профіль");
        }

        const userData = await response.json(); // 💡 Оновлюємо userSlice, щоб Header міг відобразити роль // Використовуємо userData.id як 'meta.arg' для fulfill action
        dispatch(fetchUser.fulfilled(userData, "", userData.id));
      } catch (err: unknown) {
        const error = err as { message?: string };
        console.error(
          "Помилка завантаження користувача:",
          error.message ?? err
        );
        dispatch(clearUser());
      }
    }; // 💡 Завантажуємо дані, лише якщо вони ще не були завантажені

    if (!userProfile) {
      loadUser();
    }
  }, [token, dispatch, userProfile]); // 💡 Показуємо завантаження, лише якщо є токен, але дані ще не завантажені

  if (loading && isAuthenticated && !userProfile) {
    return <div>Завантаження користувача...</div>;
  }

  return <>{children}</>;
};

export default UserLoader;
