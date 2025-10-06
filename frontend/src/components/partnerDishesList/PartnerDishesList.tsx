"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchPartnerMenu } from "@/redux/slices/partnersSlice";
import { fetchAllDishesApi } from "@/api/dishesApi";
import { addToBasket } from "@/redux/slices/basketSlice";
import { PartnerDish } from "@/types/partner"; // Предполагается, что этот импорт верный
import { Dish, Ingredient } from "@/types/dish"; // ✅ Импорт для типизации
import styles from "./PartnerDishesList.module.scss";

// Интерфейс для объединенного объекта блюда, который отображается в списке
interface DisplayedDish {
  partnerDish: PartnerDish;
  dish: Dish;
  finalPrice: number;
}

interface PartnerDishesListProps {
  partnerId: string;
}

export default function PartnerDishesList({
  partnerId,
}: PartnerDishesListProps) {
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Типизируем состояния
  const [allDishes, setAllDishes] = useState<Dish[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DisplayedDish[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showIngredients, setShowIngredients] = useState<Record<string, boolean>>({});

  const { partnerDishes, loading: loadingPartnerDishes } = useSelector(
    (state: RootState) => state.partners
  );

  const basketItems = useSelector((state: RootState) => state.basket.items);

  // Загружаем все блюда
  useEffect(() => {
    fetchAllDishesApi()
      .then((data: Dish[]) => setAllDishes(data))
      .catch((err) => console.error("Failed to fetch all dishes:", err));
  }, []);

  // Загружаем меню партнера
  useEffect(() => {
    if (partnerId) {
      dispatch(fetchPartnerMenu(partnerId));
    }
  }, [partnerId, dispatch]);

  const handleSearch = () => {
    setLoadingSearch(true);
    setHasSearched(true);

    if (!searchQuery) {
      setSearchResults([]);
      setHasSearched(false);
      setLoadingSearch(false);
      return;
    }
    
    // Результаты поиска всегда должны быть отфильтрованы по partnerId
    const results: DisplayedDish[] = partnerDishes
      .filter(pd => pd.partner_id === partnerId)
      .map(pd => {
        const dish = allDishes.find(d => d.id === pd.dish_id);
        if (!dish) return null;
        
        // Фильтрация по поисковому запросу
        if (
          dish.name_ua.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dish.name_en.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          const finalPrice = pd.discount
            ? pd.price - pd.price * (pd.discount / 100)
            : pd.price;
          return { partnerDish: pd, dish, finalPrice } as DisplayedDish;
        }
        return null;
      })
      .filter(Boolean) as DisplayedDish[];

    setSearchResults(results);
    setLoadingSearch(false);
  };

  const handleIngredientsToggle = (dishId: number) => {
    setShowIngredients(prev => ({
      ...prev,
      [dishId]: !prev[dishId],
    }));
  };

  if (loadingPartnerDishes || loadingSearch) {
    return <p>Завантаження меню...</p>;
  }

  // ✅ ИСПРАВЛЕНИЕ: Разделение логики для правильного типизирования
  let displayedPartnerDishes: DisplayedDish[] = [];

  if (hasSearched && searchQuery) {
    // Используем уже обработанные результаты поиска
    displayedPartnerDishes = searchResults;
  } else {
    // Обработка всего меню: сначала фильтруем PartnerDish, потом преобразуем в DisplayedDish
    displayedPartnerDishes = partnerDishes
      .filter(pd => pd.partner_id === partnerId) // pd здесь гарантированно имеет тип PartnerDish
      .map(pd => {
        const dish = allDishes.find(d => d.id === pd.dish_id);
        if (!dish) return null;
        const finalPrice = pd.discount
          ? pd.price - pd.price * (pd.discount / 100)
          : pd.price;
        return { partnerDish: pd, dish, finalPrice } as DisplayedDish;
      })
      .filter(Boolean) as DisplayedDish[];
  }

  if (!displayedPartnerDishes.length) {
    return <p>Меню пусте або не знайдено страв за вашим запитом.</p>;
  }

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

      <div className={styles.cards}>
        {displayedPartnerDishes.map(({ partnerDish, dish, finalPrice }) => {
          // dish гарантированно имеет тип Dish, а partnerDish — PartnerDish
          const isAdded = basketItems.some(item => item.partnerDish.id === partnerDish.id);

          return (
            <div key={partnerDish.id} className={styles.card}>
              <img src={dish.photo} alt={dish.name_ua} className={styles.image} />
              <h3>{dish.name_ua}</h3>
              <p>{dish.description_ua}</p>
              <p>
                Ціна: {partnerDish.price} грн
                {(partnerDish.discount ?? 0) > 0 &&
                  `(Знижка ${partnerDish.discount}%)`}
              </p>
              <p>Кінцева ціна: {finalPrice.toFixed(2)} грн</p>
              <button
                className={`${styles.buyButton} ${isAdded ? styles.addedButton : ""}`}
                onClick={() =>
                  !isAdded &&
                  dispatch(addToBasket({ partnerDish, dish, quantity: 1 }))
                }
                disabled={isAdded}
              >
                {isAdded ? "Товар доданий до кошика" : "Купити"}
              </button>

              <button
                onClick={() => handleIngredientsToggle(dish.id)}
                className={styles.ingredientsButton}
              >
                {showIngredients[dish.id] ? "Приховати інгредієнти" : "Інгредієнти"}
              </button>

              {showIngredients[dish.id] && (
                <div className={styles.ingredientsList}>
                  <h4>Основні інгредієнти:</h4>
                  <ul>
                    {/* ✅ ingredient теперь имеет явный тип Ingredient */}
                    {dish.important_ingredients.map((ingredient: Ingredient, index) => (
                      <li key={index}>{ingredient.name_ua}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}