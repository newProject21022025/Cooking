// src/components/UserLoader.tsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  userLoading,
  userLoaded,
  userLoadError,
  userLoggedOut,
} from "@/redux/userSlice";
import { AppDispatch, RootState } from "@/redux/store"; // або звідти, де ти експортуєш store

interface UserLoaderProps {
  children: React.ReactNode;
}

const UserLoader: React.FC<UserLoaderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    const loadUser = async () => {
      dispatch(userLoading());

      const token = localStorage.getItem("access_token");

      if (!token) {
        dispatch(userLoadError("Токена не знайдено. Користувач не авторизований."));
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/users/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("access_token");
            dispatch(userLoggedOut());
            return;
          }
          const errorData = await response.json();
          throw new Error(errorData.message || "Помилка при отриманні профілю користувача.");
        }

        const userData = await response.json();

        dispatch(
          userLoaded({
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phoneNumber: userData.phoneNumber,
            deliveryAddress: userData.deliveryAddress,
            role: userData.role,
            averageRating: userData.averageRating,
          })
        );
      } catch (err: any) {
        console.error("Помилка завантаження користувача:", err);
        dispatch(
          userLoadError(err.message || "Невідома помилка завантаження користувача.")
        );
      }
    };

    loadUser();
  }, [dispatch]);

  if (isLoading && !isAuthenticated) {
    return <div>Завантаження користувача...</div>;
  }

  return <>{children}</>;
};

export default UserLoader;
