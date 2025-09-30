// src/components/partnersCard/PartnersCard.tsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchPartners,
  setSelectedPartner,
} from "@/redux/slices/partnersSlice";
import { useRouter, usePathname } from "next/navigation";
import styles from "./PartnersCard.module.scss";

// Примітка: Припускаємо, що у об'єкта Partner є поля name, rating, description, 
// хоча у вашій структурі це firstName/lastName. 
// Тут використовуємо firstName як основну назву.

const PartnersCard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const { partners, loading, error } = useSelector(
    (state: RootState) => state.partners
  );

  useEffect(() => {
    dispatch(fetchPartners());
  }, [dispatch]);

  const handlePartnerClick = (partnerId: string) => {
    dispatch(setSelectedPartner(partnerId));
    router.push(`/${locale}/buyDishes/dishes?partnerId=${partnerId}`);
  };

  if (loading) return <div className={styles.loading}>Завантаження партнерів...</div>;
  if (error) return <div className={styles.error}>Помилка: {error}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Наші партнери</h2>
      <p className={styles.text}>
        Смачно та швидко! Замовляйте у наших перевірених партнерів вже сьогодні!
      </p>
      
      <div className={styles.list}>
        {partners.map((partner) => {
          // Використовуємо firstName та/або lastName для назви ресторану
          const partnerName = partner.firstName || 'Партнер'; 
          // Припускаємо, що рейтинг є, або ставимо 4.5 за замовчуванням
          const rating = partner.rating ?? 4.5; 

          return (
            <div
              key={partner.id}
              className={styles.card}
            >
              {/* 1. Секція зображення */}
              <div className={styles.imageWrapper}>
                {partner.photo ? (
                  <img
                    src={partner.photo}
                    alt={partnerName}
                    className={styles.partnerImage}
                  />
                ) : (
                  <div className={styles.placeholderImage}>
                    {partnerName}
                  </div>
                )}
              </div>

              {/* 2. Секція вмісту */}
              <div className={styles.content}>
                <div className={styles.header}>
                  <h3 className={styles.partnerName}>{partnerName}</h3>
                  <div className={styles.rating}>
                    <span className={styles.heartIcon}>❤️</span>
                    <span className={styles.ratingValue}>{rating}</span>
                    <span className={styles.reviewCount}>(49)</span> {/* Приклад */}
                  </div>
                </div>

                <p className={styles.description}>
                  {partner.description || "Смачні страви вдома за 30 - 45 хв"}
                </p>
                <p className={styles.callToAction}>Замовляйте зараз!</p>
                
                {/* 3. Секція доставки (Приклад) */}
                <div className={styles.deliveryInfo}>
                    <span className={styles.deliveryIcon}>&#9201;</span> {/* Іконка годинника */}
                    Безкоштовна доставка по місту від 500 ₴
                </div>

                {/* 4. Кнопка дії */}
                <button
                  className={styles.orderButton}
                  onClick={() => handlePartnerClick(partner.id)}
                >
                  Замовити страви
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PartnersCard;