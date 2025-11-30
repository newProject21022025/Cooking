// src/components/partners/PartnersListFooter.tsx
// src/components/partners/PartnersListFooter.tsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchPartners } from "@/redux/slices/partnersSlice";
import LocationIcon from "@/svg/LocationIcon/LocationIcon";
import PhoneIcon from "@/svg/PhoneIcon/PhoneIcon";
import EmailIcon from "@/svg/EmailIcon/EmailIcon";
import styles from "./PartnersListFooter.module.scss";

// 1. ІМПОРТУЄМО НЕОБХІДНІ ХУКИ З NEXT-INTL
import { useTranslations, useLocale } from "next-intl"; 
import { Partner } from "@/types/partner"; // Додаємо імпорт типу для коректної роботи TS


// Функція для безпечного отримання перекладеного поля
// Вона динамічно вибирає мову згідно з поточною локаллю
const getLocalizedValue = (
  field: Partner["deliveryAddress"] | Partner["description"],
  locale: string,
  t: ReturnType<typeof useTranslations>
) => {
  if (!field) return t("notSpecified");
  
  // Приведення типу локалі до ключа об'єкта
  const currentLang = locale as keyof typeof field;

  // 1. Спробуємо отримати значення за поточною локаллю
  const localizedValue = field[currentLang];

  if (localizedValue) return localizedValue;

  // 2. Якщо значення для поточної локалі немає, використовуємо резервне поле
  // Припускаємо, що ваші поля завжди 'uk' або 'en'
  if (currentLang === 'uk' && field.en) return field.en;
  if (currentLang === 'en' && field.uk) return field.uk;

  // 3. Крайній випадок: повертаємо текст про відсутність даних
  return t("notSpecified"); 
};


const PartnersInfoFooter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { partners, loading, error } = useSelector(
    (state: RootState) => state.partners
  );

  // 2. ІНІЦІАЛІЗАЦІЯ ПЕРЕКЛАДУ ТА ЛОКАЛІ
  const t = useTranslations("PartnersListFooter"); // Використовуємо простір імен PartnersList
  const locale = useLocale(); // Отримуємо поточну локаль ('uk' або 'en')


  useEffect(() => {
    dispatch(fetchPartners());
  }, [dispatch]);

  // 3. ВИКОРИСТАННЯ ПЕРЕКЛАДУ ДЛЯ СТАТИЧНИХ РЯДКІВ
  if (loading) return <p>{t("loadingPartners")}</p>;
  if (error) return <p>{t("error")}: {error}</p>;
  if (!partners || partners.length === 0)
    return <p>{t("noPartners")}</p>;

  return (
    <div className={styles.container}>
      {/* Перекладаємо заголовок */}
      <h2 className={styles.title}>{t("title")}</h2> 
      <ul className={styles.list}>
        {partners.map((partner) => {
          // Динамічно отримуємо адресу для поточної мови
          const addressToDisplay = getLocalizedValue(
            partner.deliveryAddress,
            locale,
            t
          );

          return (
            <li key={partner.id} className={styles.item}>
              <p className={styles.partnerName}>
                {partner.firstName} {partner.lastName}
              </p>
              
              {/* Адреса */}
              {partner.deliveryAddress && (
                <div className={styles.contactItem}>
                  <span className={styles.iconPlaceholder}>
                    <LocationIcon />
                  </span>
                  <span className={styles.value}>
                    {/* ВИКОРИСТОВУЄМО ДИНАМІЧНО ВИЗНАЧЕНУ АДРЕСУ */}
                    {addressToDisplay}
                  </span>
                </div>
              )}
              
              {/* Телефон */}
              {partner.phoneNumber && (
                <div className={styles.contactItem}>
                  <span className={styles.iconPlaceholder}>
                    <PhoneIcon />{" "}
                  </span>
                  <a
                    href={`tel:${partner.phoneNumber}`}
                    className={styles.valueLink}
                  >
                    {partner.phoneNumber}
                  </a>
                </div>
              )}
              
              {/* Email */}
              {partner.email && (
                <div className={styles.contactItem}>
                  <span className={styles.iconPlaceholder}>
                    <EmailIcon />
                  </span>
                  <a
                    href={`mailto:${partner.email}`}
                    className={styles.valueLink}
                  >
                    {partner.email}
                  </a>
                </div>
              )}
              <hr className={styles.divider} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PartnersInfoFooter;