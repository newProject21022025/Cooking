// src/app/buyDishes/info/page.tsx

"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchPartnerMenu } from "@/redux/slices/partnersSlice";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.scss";

export default function Info() {
  const searchParams = useSearchParams();
  const partnerId = searchParams.get("partnerId");

  const dispatch = useDispatch<AppDispatch>();
  const { partners, loading, error, partnerDishes } = useSelector(
    (state: RootState) => state.partners
  );

  useEffect(() => {
    if (partnerId) {
      // Завантажуємо меню обраного партнера при завантаженні сторінки
      dispatch(fetchPartnerMenu(partnerId));
    }
  }, [dispatch, partnerId]);

  // Знаходимо обраного партнера в Redux-сховищі
  const selectedPartner = partners.find((p) => p.id === partnerId);

  if (loading) return <p className={styles.loading}>Завантаження...</p>;
  if (error) return <p className={styles.error}>Помилка: {error}</p>;

  // Перевірка наявності партнера та його опису
  if (!selectedPartner) {
    return <p className={styles.notFound}>Партнер не знайдений.</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.tittle}>Інформація про партнера</h1>
      <div className={styles.partnerInfo}>
        <div className={styles.avatarContainer}>
          {selectedPartner.photo ? (
            <img
              src={selectedPartner.photo}
              alt={`${selectedPartner.firstName} ${selectedPartner.lastName}`}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.placeholder}>
              {selectedPartner.firstName?.[0] ?? ""}
              {selectedPartner.lastName?.[0] ?? ""}
            </div>
          )}
        </div>
        <div className={styles.details}>
          <h2 className={styles.name}>
            {selectedPartner.firstName} {selectedPartner.lastName}
          </h2>
          {selectedPartner.description && (
            <p className={styles.description}>{selectedPartner.description}</p>
          )}
          {selectedPartner.phoneNumber && (
            <p className={styles.contact}>
              **Телефон:** {selectedPartner.phoneNumber}
            </p>
          )}
          {selectedPartner.email && (
            <p className={styles.contact}>
              **Email:** {selectedPartner.email}
            </p>
          )}
          {selectedPartner.deliveryAddress && (
            <p className={styles.contact}>
              **Адреса:** {selectedPartner.deliveryAddress}
            </p>
          )}
        </div>
      </div>

      
    </div>
  );
}