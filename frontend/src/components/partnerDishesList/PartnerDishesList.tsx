// src/components/PartnerDishesList/PartnerDishesList.tsx

"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchPartnerMenu } from "@/redux/slices/partnersSlice";
import { fetchDishes } from "@/redux/slices/dishesSlice";
import { addToBasket } from "@/redux/slices/basketSlice";
import { searchPartnerDishesApi, fetchPartnerMenuApi } from "@/api/partnerDishesApi";
import { PartnerDish } from "@/types/partner";
import styles from "./PartnerDishesList.module.scss";



interface PartnerDishesListProps {
  partnerId: string;
}

export default function PartnerDishesList({
  partnerId,
}: PartnerDishesListProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PartnerDish[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showIngredients, setShowIngredients] = useState<
    Record<string, boolean>
  >({}); // ✅ Новий стан для відображення інгредієнтів

  const { partnerDishes, loading: loadingPartnerDishes } = useSelector(
    (state: RootState) => state.partners
  );
  // ✅ ЗМІНА: Додаємо перевірку, що items - це масив, інакше встановлюємо порожній масив.
  const { items, loading: loadingDishes } = useSelector(
    (state: RootState) => state.dishes
  );
  const dishes = Array.isArray(items) ? items : []; 
  
  const basketItems = useSelector((state: RootState) => state.basket.items);

  useEffect(() => {
    dispatch(fetchDishes());
  }, [dispatch]);

  useEffect(() => {
    if (partnerId) {
      setLoadingSearch(true);
      fetchPartnerMenuApi(partnerId)
        .then((data) => {
          setSearchResults(data); // тут зберігаємо усі страви партнера
          setHasSearched(true);   // щоб displayedPartnerDishes використовував searchResults
        })
        .catch(console.error)
        .finally(() => setLoadingSearch(false));
    }
  }, [partnerId]);
  
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

  // ... handleIngredientsToggle

  // ✅ Нова функція-обробник для перемикання інгредієнтів
  const handleIngredientsToggle = (dishId: number) => {
    setShowIngredients((prev) => ({
      ...prev,
      [dishId]: !prev[dishId],
    }));
  };

  if (loadingPartnerDishes || loadingDishes || loadingSearch) {
    return <p>Завантаження меню...</p>;
  }

 const displayedPartnerDishes = searchResults;
    
  // ⚠️ Увага: переконайтеся, що dishes.find - це функція.
  // Завдяки рядку `const dishes = Array.isArray(items) ? items : [];` вище,
  // ми гарантуємо, що dishes є масивом.
  const mergedDishes = displayedPartnerDishes
    .map((pd) => {
      // Рядок 98 (проблема): dishes тепер точно масив.
      const dish = dishes.find((d) => d.id === pd.dish_id); 
      if (!dish) return null;
      const finalPrice = pd.discount
        ? pd.price - pd.price * (pd.discount / 100)
        : pd.price;
      return { partnerDish: pd, dish, finalPrice };
    })
    .filter(Boolean) as {
    partnerDish: (typeof partnerDishes)[0];
    dish: (typeof dishes)[0];
    finalPrice: number;
  }[];

  // ... return JSX
  return (
    <div className={styles.container}>
      <h2 className={styles.container}>Меню партнера</h2>

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
            const isAdded = basketItems.some(
              (item) => item.partnerDish.id === partnerDish.id
            );

            return (
              <div key={partnerDish.id} className={styles.card}>
                <img
                  src={dish.photo}
                  alt={dish.name_ua}
                  className={styles.image}
                />
                <h3>{dish.name_ua}</h3>
                <p>{dish.description_ua}</p>
                <p>
                  Ціна: {partnerDish.price} грн
                  {(partnerDish.discount ?? 0) > 0 &&
                    `(Знижка ${partnerDish.discount}%)`}
                </p>
                <p>Кінцева ціна: {finalPrice.toFixed(2)} грн</p>
                <button
                  className={`${styles.buyButton} ${
                    isAdded ? styles.addedButton : ""
                  }`}
                  onClick={() =>
                    !isAdded &&
                    dispatch(
                      addToBasket({
                        partnerDish: partnerDish,
                        dish,
                        quantity: 1,
                      })
                    )
                  }
                  disabled={isAdded}
                >
                  {isAdded ? "Товар доданий до кошика" : "Купити"}
                </button>
                {/* ✅ Кнопка для відображення інгредієнтів */}
                <button
                  onClick={() => handleIngredientsToggle(dish.id)} // ✅ Викликаємо функцію з ID страви
                  className={styles.ingredientsButton}
                >
                  {showIngredients[dish.id]
                    ? "Приховати інгредієнти"
                    : "Інгредієнти"}
                </button>

                {/* ✅ Умовне відображення списку інгредієнтів */}
                {showIngredients[dish.id] && ( // ✅ Перевіряємо стан для конкретної страви
                  <div className={styles.ingredientsList}>
                    <h4>Основні інгредієнти:</h4>
                    <ul>
                      {dish.important_ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient.name_ua}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}