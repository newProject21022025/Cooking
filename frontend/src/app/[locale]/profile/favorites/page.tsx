// src/app/[locale]/profile/favorites/page.tsx
"use client";

import { useEffect, useState } from "react";
import styles from "../layout.module.scss";

interface FavoriteDish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteDish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Заменить на реальный API вызов
    const loadFavorites = async () => {
      try {
        // Пример временных данных
        const mockFavorites: FavoriteDish[] = [
          {
            id: "1",
            name: "Паста Карбонара",
            description: "Класична італійська паста з беконом, яйцями та сиром",
            price: 185,
            image: "/images/carbonara.jpg",
            category: "Паста"
          },
          {
            id: "2",
            name: "Цезар з куркою",
            description: "Салат Цезар з куркою, крутонами та соусом Цезар",
            price: 150,
            image: "/images/caesar.jpg",
            category: "Салати"
          }
        ];
        
        setFavorites(mockFavorites);
      } catch (error) {
        console.error("Помилка завантаження улюблених страв:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const removeFromFavorites = (dishId: string) => {
    setFavorites(favorites.filter(dish => dish.id !== dishId));
  };

  if (loading) {
    return <div className={styles.loading}>Завантаження улюблених страв...</div>;
  }

  return (
    <div>
      <h2>Улюблені страви</h2>
      
      {favorites.length === 0 ? (
        <div className={styles.emptyState}>
          <p>У вас ще немає улюблених страв</p>
          <button 
            className={styles.primaryButton}
            onClick={() => {/* Навигация в меню */}}
          >
            Перейти до меню
          </button>
        </div>
      ) : (
        <div className={styles.favoritesGrid}>
          {favorites.map((dish) => (
            <div key={dish.id} className={styles.dishCard}>
              <img 
                src={dish.image} 
                alt={dish.name}
                className={styles.dishImage}
              />
              <div className={styles.dishInfo}>
                <h3>{dish.name}</h3>
                <p className={styles.dishDescription}>{dish.description}</p>
                <div className={styles.dishMeta}>
                  <span className={styles.category}>{dish.category}</span>
                  <span className={styles.price}>{dish.price} грн</span>
                </div>
                <div className={styles.actions}>
                  <button className={styles.orderButton}>
                    Замовити
                  </button>
                  <button 
                    className={styles.removeButton}
                    onClick={() => removeFromFavorites(dish.id)}
                  >
                    Видалити
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}