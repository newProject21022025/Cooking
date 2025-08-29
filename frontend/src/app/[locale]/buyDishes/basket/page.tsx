// src/app/[locale]/buyDishes/basket/page.tsx

"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  removeFromBasket,
  updateQuantity,
  clearBasket,
} from "@/redux/slices/basketSlice";
import styles from "./page.module.scss";

export default function Basket() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.basket.items);

  const handleIncrease = (id: string) => {
    const item = items.find((i) => i.partnerDish.id === id);
    if (item) {
      dispatch(updateQuantity({ partnerDishId: id, quantity: item.quantity + 1 }));
    }
  };

  const handleDecrease = (id: string) => {
    const item = items.find((i) => i.partnerDish.id === id);
    if (item && item.quantity > 1) {
      dispatch(updateQuantity({ partnerDishId: id, quantity: item.quantity - 1 }));
    }
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromBasket(id));
  };

  const handleClear = () => {
    dispatch(clearBasket());
  };

  const calculateFinalPrice = (price: number, discount?: number) => {
    return discount ? price - (price * discount) / 100 : price;
  };

  const totalSum = items.reduce(
    (sum, item) => sum + calculateFinalPrice(item.partnerDish.price, item.partnerDish.discount) * item.quantity,
    0
  );

  return (
    <div className={styles.container}>
      <h2>Кошик</h2>
      {items.length === 0 ? (
        <p>Кошик порожній</p>
      ) : (
        <>
          <ul className={styles.basketList}>
            {items.map((item) => {
              const { partnerDish, dish, quantity } = item;
              const finalPrice = calculateFinalPrice(partnerDish.price, partnerDish.discount);
              return (
                <li key={partnerDish.id} className={styles.basketItem}>
                  <img src={dish.photo} alt={dish.name_ua} className={styles.dishPhoto} />
                  <div className={styles.details}>
                    <h3>{dish.name_ua}</h3>
                    <p>{dish.description_ua}</p>
                    <p>Ціна: {partnerDish.price} грн</p>
                    <p>Знижка: {partnerDish.discount || 0}%</p>
                    <p>Сума: {finalPrice * quantity} грн</p>
                    <div className={styles.controls}>
                      <button onClick={() => handleDecrease(partnerDish.id)}>-</button>
                      <span>{quantity}</span>
                      <button onClick={() => handleIncrease(partnerDish.id)}>+</button>
                      <button onClick={() => handleRemove(partnerDish.id)}>Видалити</button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className={styles.total}>
            <h3>Загальна сума: {totalSum} грн</h3>
            <button onClick={handleClear}>Очистити кошик</button>
          </div>
        </>
      )}
    </div>
  );
}
