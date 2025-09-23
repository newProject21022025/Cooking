// src/components/PartnerDishesList/PartnerDishesList.tsx

"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchPartnerMenu } from "@/redux/slices/partnersSlice";
import { fetchDishes } from "@/redux/slices/dishesSlice";
import { addToBasket } from "@/redux/slices/basketSlice";
import { searchPartnerDishesApi } from "@/api/partnerDishesApi";
import { PartnerDish } from "@/types/partner";
import styles from "./PartnerDishesList.module.scss";

interface PartnerDishesListProps {
  partnerId: string;
}

export default function PartnerDishesList({ partnerId }: PartnerDishesListProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PartnerDish[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const { partnerDishes, loading: loadingPartnerDishes } = useSelector(
    (state: RootState) => state.partners
  );
  const { items: dishes, loading: loadingDishes } = useSelector(
    (state: RootState) => state.dishes
  );
  // ✅ Додаємо useSelector для доступу до стану кошика
  const basketItems = useSelector((state: RootState) => state.basket.items);

  useEffect(() => {
    dispatch(fetchDishes());
  }, [dispatch]);

  useEffect(() => {
    if (!hasSearched && partnerId) {
      dispatch(fetchPartnerMenu(partnerId));
    }
  }, [partnerId, dispatch, hasSearched]);

  const handleSearch = async () => {
    setLoadingSearch(true);
    setHasSearched(true);
    try {
      if (searchQuery) {
        const data = await searchPartnerDishesApi(partnerId, searchQuery);
        setSearchResults(data);
      } else {
        dispatch(fetchPartnerMenu(partnerId));
        setHasSearched(false);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Failed to fetch dishes:", error);
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  if (loadingPartnerDishes || loadingDishes || loadingSearch) {
    return <p>Завантаження меню...</p>;
  }

  const displayedPartnerDishes = hasSearched && searchQuery ? searchResults : partnerDishes;

  const mergedDishes = displayedPartnerDishes
    .map((pd) => {
      const dish = dishes.find((d) => d.id === pd.dish_id);
      if (!dish) return null;
      const finalPrice = pd.discount
        ? pd.price - pd.price * (pd.discount / 100)
        : pd.price;
      return { partnerDish: pd, dish, finalPrice };
    })
    .filter(Boolean) as {
    partnerDish: typeof partnerDishes[0];
    dish: typeof dishes[0];
    finalPrice: number;
  }[];

  return (
    <div className={styles.container}>
      <h2>Меню партнера</h2>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Пошук страви..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchBar}
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          Пошук
        </button>
      </div>

      {mergedDishes.length === 0 ? (
        <p>Меню пусте або не знайдено страв за вашим запитом.</p>
      ) : (
        <div className={styles.cards}>
          {mergedDishes.map(({ partnerDish, dish, finalPrice }) => {
            // ✅ Перевіряємо, чи є товар у кошику
            const isAdded = basketItems.some(
              (item) => item.partnerDish.id === partnerDish.id
            );

            return (
              <div key={partnerDish.id} className={styles.card}>
                <img src={dish.photo} alt={dish.name_ua} className={styles.image} />
                <h3>{dish.name_ua}</h3>
                <p>{dish.description_ua}</p>
                <p>
                  Ціна: {partnerDish.price} грн{" "}
                  {partnerDish.discount && `(Знижка ${partnerDish.discount}%)`}
                </p>
                <p>Кінцева ціна: {finalPrice.toFixed(2)} грн</p>
                <button
                  className={`${styles.buyButton} ${isAdded ? styles.addedButton : ""}`}
                  onClick={() =>
                    !isAdded && // ✅ Викликаємо екшн тільки якщо товару немає в кошику
                    dispatch(
                      addToBasket({
                        partnerDish: partnerDish,
                        dish,
                        quantity: 1,
                      })
                    )
                  }
                  disabled={isAdded} // ✅ Вимикаємо кнопку, якщо товар додано
                >
                  {isAdded ? "Товар доданий до кошика" : "Купити"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}