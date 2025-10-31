// src/components/partners/PartnersListFooter.tsx
// src/components/partners/PartnersInfoFooter.tsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchPartners } from "@/redux/slices/partnersSlice";
// Імпорт SVG компонентів для іконок (припускаємо, що вони існують)
import LocationIcon from "@/svg/LocationIcon/LocationIcon"; 
import  PhoneIcon  from "@/svg/PhoneIcon/PhoneIcon"; 
import EmailIcon from "@/svg/EmailIcon/EmailIcon"; 
import styles from "./PartnersListFooter.module.scss"; // Новий модуль стилів

// Примітка: Для реалізації цього коду вам потрібно створити компоненти
// GeoIcon, PhoneIcon, MailIcon (або використовувати ваші існуючі SVG компоненти).

const PartnersInfoFooter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { partners, loading, error } = useSelector(
    (state: RootState) => state.partners
  );

  useEffect(() => {
    // Завантажуємо дані про партнерів
    dispatch(fetchPartners());
  }, [dispatch]);

  if (loading) return <p>Завантаження інформації про партнерів...</p>;
  if (error) return <p>Помилка: {error}</p>;
  if (!partners || partners.length === 0)
    return <p>Інформація про партнерів відсутня.</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Локації, інформація про Партнерів</h2>
      <ul className={styles.list}>
        {partners.map((partner) => (
          // !!! УВАГА: Прибираємо обробник onClick, щоб уникнути переходу.
          // Елемент <li> більше не клікабельний.
          <li key={partner.id} className={styles.item}>
            <p className={styles.partnerName}>
              {partner.firstName} {partner.lastName}
            </p>

            {/* Адреса */}
            {partner.deliveryAddress && (
              <div className={styles.contactItem}>
                {/*  */}
                {/* <GeoIcon className={styles.icon} /> */}
                <span className={styles.iconPlaceholder}><LocationIcon/></span>
                <span className={styles.value}>{partner.deliveryAddress}</span>
              </div>
            )}

            {/* Телефон */}
            {partner.phoneNumber && (
              <div className={styles.contactItem}>
                {/*  */}
                {/* <PhoneIcon className={styles.icon} /> */}
                <span className={styles.iconPlaceholder}><PhoneIcon/> </span>
                {/* Створюємо посилання для зручного дзвінка */}
                <a href={`tel:${partner.phoneNumber}`} className={styles.valueLink}>
                  {partner.phoneNumber}
                </a>
              </div>
            )}

            {/* Email */}
            {partner.email && (
              <div className={styles.contactItem}>
                {/*  */}
                {/* <MailIcon className={styles.icon} /> */}
                <span className={styles.iconPlaceholder}><EmailIcon/></span>
                {/* Створюємо посилання для зручного надсилання email */}
                <a href={`mailto:${partner.email}`} className={styles.valueLink}>
                  {partner.email}
                </a>
              </div>
            )}
            
            <hr className={styles.divider} /> {/* Відокремлювач між партнерами */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PartnersInfoFooter;