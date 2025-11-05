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
import OrderForm from "@/components/orderForm/OrderForm";
import styles from "./page.module.scss";
import UserLoader from "@/components/UserLoader";
import Icon_delete from "@/svg/Icon_delete/Icon_delete";

export default function BasketPage() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.basket.items);
  const user = useSelector((state: RootState) => state.user.data);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const handleIncrease = (id: string) => {
    const item = items.find((i) => i.partnerDish.id === id);
    if (item) {
      dispatch(
        updateQuantity({ partnerDishId: id, quantity: item.quantity + 1 })
      );
    }
  };

  const handleDecrease = (id: string) => {
    const item = items.find((i) => i.partnerDish.id === id);
    if (item && item.quantity > 1) {
      dispatch(
        updateQuantity({ partnerDishId: id, quantity: item.quantity - 1 })
      );
    }
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromBasket(id));
  };

  const totalSum = items.reduce((sum, item) => {
    const finalPrice = item.partnerDish.discount
      ? item.partnerDish.price -
        (item.partnerDish.price * item.partnerDish.discount) / 100
      : item.partnerDish.price;
    return sum + finalPrice * item.quantity;
  }, 0);

  const orderFormUser = user
    ? {
        // Перетворюємо string | null на string | undefined для всіх полів
        id: user.id || undefined,
        firstName: user.firstName || undefined, // <-- ВИПРАВЛЕННЯ
        lastName: user.lastName || undefined, // <-- ВИПРАВЛЕННЯ
        email: user.email || undefined, // <-- ВИПРАВЛЕННЯ
        phoneNumber: user.phoneNumber || undefined, // <-- ВИПРАВЛЕННЯ
        deliveryAddress: user.deliveryAddress || undefined, // <-- ВИПРАВЛЕННЯ
      }
    : null;

  return (
    <UserLoader>
      <div className={styles.checkoutContainer}>
        {items.length === 0 ? (
          <p className={styles.empty}>Кошик порожній</p>
        ) : (
          <div className={styles.checkoutContent}>
            {/* Кошик */}
            <div className={styles.basket}>
              {/* <h2>Кошик</h2> */}
              <ul className={styles.basketList}>
                {items.map((item) => {
                  const { partnerDish, dish, quantity } = item;
                  const finalPrice = partnerDish.discount
                    ? partnerDish.price -
                      (partnerDish.price * partnerDish.discount) / 100
                    : partnerDish.price; // ✅ 1. РОЗРАХУНОК ЗАГАЛЬНОЇ ЦІНИ БЕЗ ЗНИЖКИ ДЛЯ ПОТОЧНОЇ КІЛЬКОСТІ
                  const generalPriceTotal = partnerDish.price * quantity; // ✅ 2. ПЕРЕВІРКА НА НАЯВНІСТЬ ЗНИЖКИ
                  const hasDiscount = (partnerDish.discount ?? 0) > 0;
                  return (
                    <li key={partnerDish.id} className={styles.basketCard}>
                      <div className={styles.basketItemHeader}>
                        <img
                          src={dish.photo}
                          alt={dish.name_ua}
                          className={styles.dishPhoto}
                        />
                        <div>
                          <h3 className={styles.titleName}>{dish.name_ua}</h3>
                          <p className={styles.cardDescription}>
                            {dish.description_ua}
                          </p>
                        </div>
                      </div>

                      <div className={styles.portionCalculator}>
                        <div className={styles.portionInputGroup}>
                          <button
                            className={styles.portionButton}
                            onClick={() => handleDecrease(partnerDish.id)}
                          >
                            -
                          </button>
                          <span className={styles.portionInput}>
                            {quantity}
                          </span>
                          <button
                            className={styles.portionButtonPlus}
                            onClick={() => handleIncrease(partnerDish.id)}
                          >
                            +
                          </button>
                        </div>
                        <div>
                          <p className={styles.cardFinalPrice}>
                            {(finalPrice * quantity).toFixed(2)}₴
                          </p>
                          {hasDiscount && (
                            <p className={styles.cardGeneralPrice}>
                              {generalPriceTotal.toFixed(2)}₴
                            </p>
                          )}
                          {hasDiscount && (
                            <p className={styles.cardDiscountPrice}>
                              -{partnerDish.discount}%
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        className={styles.deleteCartButton}
                        onClick={() => handleRemove(partnerDish.id)}
                      >
                        <span className={styles.deleteIcon}>
                          <Icon_delete />{" "}
                        </span>
                        Видалити
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className={styles.total}>
                <div>
                  <h3>
                    Загальна сума:{" "}
                    <span className={styles.cardFinalPrice}>{totalSum} ₴</span>
                  </h3>
                  <p className={styles.freeDelivery}>
                    Безкоштовна доставка по місту від 500 ₴
                  </p>
                </div>
                <button onClick={() => dispatch(clearBasket())}>
                  Очистити кошик
                </button>
              </div>
            </div>

            {/* Форма замовлення */}
            <div className={styles.orderFormContainer}>
              <OrderForm user={orderFormUser} />
            </div>
          </div>
        )}
      </div>
    </UserLoader>
  );
}
