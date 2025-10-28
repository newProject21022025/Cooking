// src/components/ToggleFavoriteButton.tsx

import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Припустимо, це ваші шляхи
import { RootState } from '@/redux/store';
import { User } from '@/types/user';
import { setUserData } from '@/redux/userSlice'; 
import { addDishToFavorites, removeDishFromFavorites } from '@/api/usersApi'; 

// Імпорти іконок
import Icon_heart_green from '@/svg/Icon_heart/Icon_heart_green';
import Icons_heart_green_full from '@/svg/Icon_heart/Icon_heart_green_full';
// Стилі
import styles from './ToggleFavoriteButton.module.css'; // Створіть відповідний CSS-модуль

interface ToggleFavoriteButtonProps {
  dishId: string;
}

const ToggleFavoriteButton: React.FC<ToggleFavoriteButtonProps> = ({ dishId }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  
  // Отримання стану користувача та автентифікації
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.user.data as User | null);

  // Визначення, чи страва вже в обраному
  // Використовуємо !! для приведення до булевого типу
  const isFavorite = !!user?.favorites?.includes(dishId);

  const handleToggleFavorite = useCallback(async () => {
    if (!isAuthenticated) {
      alert('Будь ласка, увійдіть, щоб керувати обраним!');
      return;
    }
    
    if (isLoading) return; // Запобігання подвійному кліку

    setIsLoading(true);
    
    try {
      let updatedUser: User;
      
      if (isFavorite) {
        // Видалення
        updatedUser = await removeDishFromFavorites(dishId);
      } else {
        // Додавання
        updatedUser = await addDishToFavorites(dishId);
      }

      // Оновлення Redux-сховища
      dispatch(setUserData(updatedUser)); 
      
    } catch (error) {
      console.error('Помилка при оновленні обраного:', error);
      // Додаткова обробка помилок
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isFavorite, dishId, dispatch, isLoading]);

  return (
    <span 
      className={`${styles.iconButton} ${isLoading ? styles.disabled : ''}`} 
      onClick={handleToggleFavorite}
      aria-disabled={isLoading} 
      title={isFavorite ? 'Видалити з обраного' : 'Додати до обраного'}
    >
      {/* Відображення відповідної іконки */}
      {isFavorite 
        ? <Icons_heart_green_full /> 
        : <Icon_heart_green />
      }
    </span>
  );
};

export default ToggleFavoriteButton;