// src/app/[locale]/buyDishes/dishes/page.tsx

"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "next/navigation";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchPartnerMenu, setSelectedPartner } from "@/redux/slices/partnersSlice";
import { fetchDishes } from "@/redux/slices/dishesSlice";
import { addToBasket } from "@/redux/slices/basketSlice";
import styles from "./page.module.scss";

export default function DishesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();

  // PartnerId з query або Redux
  const partnerIdFromQuery = searchParams.get("partnerId");
  const selectedPartnerId = useSelector(
    (state: RootState) => state.partners.selectedPartnerId
  );
  const partnerId = partnerIdFromQuery || selectedPartnerId;

  // Синхронізація Redux з query
  useEffect(() => {
    if (partnerIdFromQuery) {
      dispatch(setSelectedPartner(partnerIdFromQuery));
    }
  }, [partnerIdFromQuery, dispatch]);

  // Дані з Redux
  const { partnerDishes, loading: loadingPartnerDishes } = useSelector(
    (state: RootState) => state.partners
  );
  const { items: dishes, loading: loadingDishes } = useSelector(
    (state: RootState) => state.dishes
  );

  // Завантаження меню
  useEffect(() => {
    if (partnerId) {
      dispatch(fetchPartnerMenu(partnerId));
      dispatch(fetchDishes());
    }
  }, [partnerId, dispatch]);

  if (!partnerId) return <p>Партнера не вибрано</p>;
  if (loadingPartnerDishes || loadingDishes) return <p>Завантаження меню...</p>;

  // Мапінг PartnerDish + Dish
  const mergedDishes = partnerDishes
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

  // Рендер
  return (
    <div className={styles.container}>
      <h2>Меню партнера {partnerId}</h2>
      {mergedDishes.length === 0 ? (
        <p>Меню пусте</p>
      ) : (
        <div className={styles.cards}>
          {mergedDishes.map(({ partnerDish, dish, finalPrice }) => (
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
                className={styles.buyButton}
                onClick={() =>
                  dispatch(
                    addToBasket({
                      partnerDish: partnerDish,
                      dish,
                      quantity: 1,
                    })
                  )
                }
              >
                Купити
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
