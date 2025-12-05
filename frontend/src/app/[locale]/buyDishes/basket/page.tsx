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

// 🛑 ІМПОРТ НОВОГО КОМПОНЕНТА МОДАЛЬНОГО ВІКНА
import OrderSuccessModal from "@/components/orderSuccessModal/OrderSuccessModal";

// 🛑 ДОДАНО: useLocale та useTranslations
import { useLocale, useTranslations } from "next-intl";

export default function BasketPage() {
  const dispatch = useDispatch<AppDispatch>(); // 🛑 Ініціалізація хуків локалізації
  const locale = useLocale();
  const t = useTranslations("BasketPage");

  const items = useSelector((state: RootState) => state.basket.items);
  const user = useSelector((state: RootState) => state.user.data);
  const [isClient, setIsClient] = React.useState(false); // 🆕 СТАН ДЛЯ КЕРУВАННЯ МОДАЛЬНИМ ВІКНОМ

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // 🆕 ФУНКЦІЯ ВІДКРИТТЯ МОДАЛЬНОГО ВІКНА ПІСЛЯ УСПІШНОГО ЗАМОВЛЕННЯ

  const handleOrderSuccess = () => {
    setIsModalOpen(true); // Очистити кошик після підтвердження замовлення
    dispatch(clearBasket());
  }; // 🆕 ФУНКЦІЯ ЗАКРИТТЯ МОДАЛЬНОГО ВІКНА
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
        id: user.id || undefined,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        email: user.email || undefined,
        phoneNumber: user.phoneNumber || undefined,
        deliveryAddress: user.deliveryAddress || undefined,
      }
    : null;

  return (
    <UserLoader>
      <div className={styles.checkoutContainer}>
        {items.length === 0 && !isModalOpen ? ( // Показуємо порожній кошик, якщо кошик порожній І модалка не відкрита
          <p className={styles.empty}>{t("emptyBasket")}</p>
        ) : (
          <div className={styles.checkoutContent}>
            {/* Basket */}
            <div className={styles.basket}>
              <ul className={styles.basketList}>
                {items.map((item) => {
                  const { partnerDish, dish, quantity } = item;
                  const finalPrice = partnerDish.discount
                    ? partnerDish.price -
                      (partnerDish.price * partnerDish.discount) / 100
                    : partnerDish.price;
                  const generalPriceTotal = partnerDish.price * quantity;
                  const hasDiscount = (partnerDish.discount ?? 0) > 0;

                  const dishName =
                    locale === "uk" ? dish.name_ua : dish.name_en;
                  const dishDescription =
                    locale === "uk" ? dish.description_ua : dish.description_en;

                  return (
                    <li key={partnerDish.id} className={styles.basketCard}>
                      <div className={styles.basketItemHeader}>
                        <img
                          src={dish.photo}
                          alt={dishName}
                          className={styles.dishPhoto}
                        />

                        <div>
                          <h3 className={styles.titleName}>{dishName}</h3>

                          <p className={styles.cardDescription}>
                            {dishDescription}
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
                          <Icon_delete />
                        </span>
                        {t("removeButton")}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className={styles.total}>
                <div>
                  <h3>
                    {t("totalSum")}:
                    <span className={styles.cardFinalPrice}>
                      {totalSum.toFixed(2)} ₴
                    </span>
                  </h3>

                  <p className={styles.freeDelivery}>{t("freeDelivery")}</p>
                </div>

                <button onClick={() => dispatch(clearBasket())}>
                  {t("clearBasketButton")}
                </button>
              </div>
            </div>
            {/* Order Form */}
            <div className={styles.orderFormContainer}>
              <OrderForm
                user={orderFormUser}
                currentLocale={locale} // 🆕 ПЕРЕДАЄМО ФУНКЦІЮ ДЛЯ ВІДКРИТТЯ МОДАЛКИ
                onOrderSuccess={handleOrderSuccess}
              />
            </div>
          </div>
        )}
      </div>
      {/* 🆕 РЕНДЕР НОВОГО МОДАЛЬНОГО ВІКНА */}

      <OrderSuccessModal isVisible={isModalOpen} onClose={handleCloseModal} />
    </UserLoader>
  );
}
