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
import Icon_heart_yellow from "@/svg/Icon_heart/Icon_heart_yellow";
import Icon_Time_green from "@/svg/Icon_Time/Icon_Time_green";

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

  if (loading)
    return <div className={styles.loading}>Завантаження партнерів...</div>;
  if (error) return <div className={styles.error}>Помилка: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {partners.map((partner) => {
          // Використовуємо firstName та/або lastName для назви ресторану
          const partnerName = partner.firstName || "Партнер";
          // Припускаємо, що рейтинг є, або ставимо 4.5 за замовчуванням
          // 💡 ЗМІНА ТУТ: Встановлюємо мінімальний рейтинг 4.2
          const minRating = 4.2; // Використовуємо Math.max, щоб переконатися, що рейтинг не менший за 4.2 // Якщо partner.rating відсутній (null/undefined), беремо 4.2.
          const rating = Math.max(partner.rating ?? minRating, minRating);

          return (
            <div key={partner.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                {partner.photo ? (
                  <img
                    src={partner.photo}
                    alt={partnerName}
                    className={styles.partnerImage}
                  />
                ) : (
                  <div className={styles.placeholderImage}>{partnerName}</div>
                )}
              </div>

              <div className={styles.content}>
                <div className={styles.header}>
                  <h3 className={styles.partnerName}>{partnerName}</h3>

                  <div className={styles.rating}>
                    <span className={styles.heartIcon}>
                      <Icon_heart_yellow />
                    </span>
                    <span className={styles.ratingValue}>{rating}</span>
                    {/* <span className={styles.reviewCount}>(49)</span>{" "} */}
                  </div>
                </div>
                <div>
                  <p className={styles.description}>
                    {partner.description || "Смачні страви вдома за 30 - 45 хв"}
                  </p>
                  <p className={styles.callToAction}>Замовляйте зараз!</p>
                </div>

                {/* 3. Секція доставки (Приклад) */}
                <div className={styles.deliveryInfo}>
                  <span className={styles.deliveryIcon}><Icon_Time_green/>  </span>                 
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
