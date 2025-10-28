// src/app/[locale]/profile/favorites/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import styles from './page.module.scss';

// ✅ Імпорти
import { RootState } from '@/redux/store'; 
import { Dish } from '@/types/dish'; 
import { fetchDishesByIdsApi } from '@/api/dishesApi'; 
// ✅ НОВИЙ ІМПОРТ: Компонент картки страви
import DishCard from '@/components/dishCard/DishCard'; 


export default function FavoritesPage() {
    const isAuthLoading = useSelector((state: RootState) => state.auth.loading); 
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const user = useSelector((state: RootState) => state.user.data);
    
    const favoriteDishIds = useMemo(() => user?.favorites || [], [user?.favorites]); 

    const [favoriteDishes, setFavoriteDishes] = useState<Dish[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 1. useEffect для завантаження даних
    useEffect(() => {
        const loadFavorites = async () => {
            if (isAuthLoading || !isAuthenticated) {
                if (isLoadingData) setIsLoadingData(false);
                return;
            }

            if (favoriteDishIds.length === 0) {
                if (isLoadingData) setIsLoadingData(false);
                setFavoriteDishes([]);
                return;
            }

            setIsLoadingData(true);
            setError(null);

            try {
                const dishes = await fetchDishesByIdsApi(favoriteDishIds as string[]);
                setFavoriteDishes(dishes);
            } catch (err) {
                console.error("Помилка завантаження обраних страв:", err);
                setError((err as Error).message || "Не вдалося завантажити улюблені страви.");
                setFavoriteDishes([]);
            } finally {
                setIsLoadingData(false);
            }
        };

        loadFavorites();
        
    }, [favoriteDishIds, isAuthenticated, isAuthLoading]); 

    
    // --- Логіка рендерингу ---
    
    if (isAuthLoading) {
        return (
            <div className={styles.container}>
                <h2>Улюблені страви</h2> 
                <p>Перевірка статусу користувача...</p> 
            </div>
        );
    }

    const renderContent = () => {
        if (!isAuthenticated) {
            return <p>Будь ласка, увійдіть у профіль, щоб переглянути ваші улюблені страви.</p>;
        }

        if (isLoadingData) {
            return <p>Завантаження улюблених страв...</p>;
        }

        if (error) {
            return <p className={styles.error}>Помилка: {error}</p>;
        }
        
        if (favoriteDishes.length === 0) {
            return <p>На жаль, ви ще не додали жодної страви до обраного. ❤️ Почніть перегляд меню, щоб додати улюблені страви!</p>;
        }

        return (
            // ✅ ВИКОРИСТОВУЄМО DISHCARD та СІТКУ
            <div className={styles.dishesGrid}>
                {favoriteDishes.map((dish) => (
                    <div key={dish.id} className={styles.dishItem}> 
                        <DishCard dish={dish} /> {/* ✅ Ваш компонент */}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            <h2>Улюблені страви ({favoriteDishes.length})</h2> 
            {renderContent()}
        </div>
    );
}