// src/components/UserLoader.tsx
"use client";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// Changed import path to relative for userSlice
import { userLoading, userLoaded, userLoadError, userLoggedOut } from '../redux/userSlice'; 
import { AppDispatch, RootState } from '../redux'; // Changed import path to relative for store types
import { useSelector } from 'react-redux';

interface UserLoaderProps {
  children: React.ReactNode;
}

const UserLoader: React.FC<UserLoaderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const loadUser = async () => {
      dispatch(userLoading()); 

      const token = localStorage.getItem('access_token'); 

      if (!token) {
        dispatch(userLoadError('Токен не найден. Пользователь не авторизован.'));
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/users/profile', { 
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            localStorage.removeItem('access_token'); 
            dispatch(userLoggedOut());
            return;
          }
          throw new Error(errorData.message || 'Ошибка при получении профиля пользователя.');
        }

        const userData = await response.json();
        dispatch(userLoaded(userData)); 
      } catch (err: any) {
        console.error("Ошибка загрузки пользователя:", err);
        dispatch(userLoadError(err.message || 'Неизвестная ошибка загрузки пользователя.'));
      }
    };

    if (!isAuthenticated && isLoading) {
      loadUser();
    }
  }, [dispatch, isAuthenticated, isLoading]); 

  if (isLoading && !isAuthenticated) {
     return <div>Загрузка пользователя...</div>;
  }

  return <>{children}</>;
};

export default UserLoader;
