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
import { useTranslations } from "next-intl"; 


export default function FavoritesPage() {
    const t = useTranslations("FavoritesPage");
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
                <h2>{t("Title")}</h2> 
                <p>{t("LoadingAuth")}</p> 
            </div>
        );
    }

    const renderContent = () => {
        if (!isAuthenticated) {
            return <p>{t("NotAuthenticated")}</p>; // Змінено
        }

        if (isLoadingData) {
            return <p>{t("LoadingData")}</p>; // Змінено
        }

        if (error) {
            // Використовуємо t("Error.prefix") для "Помилка: "
            return <p className={styles.error}>{t("Error.prefix")}{error}</p>; // Змінено
        }
        
        if (favoriteDishes.length === 0) {
            return <p>{t("EmptyList")}</p>; // Змінено
        }

        return (
            <div className={styles.dishesGrid}>
                {favoriteDishes.map((dish) => (
                    <div key={dish.id} className={styles.dishItem}> 
                        <DishCard dish={dish} /> 
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            {/* Використовуємо Title з динамічним підрахунком */}
            <h2>{t("Title")} ({favoriteDishes.length})</h2> 
            {renderContent()}
        </div>
    );
}