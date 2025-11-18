// src/components/partners/PartnerProfileView.tsx

import { Partner } from "@/types/partner";
import { formatPhoneNumber } from "./formatters";
import styles from "./PartnerProfileView.module.scss";

// 1. ІМПОРТУЄМО NEXT-INTL
import { useTranslations, useLocale } from "next-intl"; 

interface PartnerProfileViewProps {
  partner: Partner;
  onEdit: () => void;
}

// 2. Допоміжна функція для динамічного вибору локалі
const getLocalizedValue = (
  field: Partner["deliveryAddress"] | Partner["description"],
  locale: string,
  fallbackText: string
) => {
  if (!field) return fallbackText;
  
  const currentLang = locale as keyof typeof field;

  // 1. Спробуємо отримати значення за поточною локаллю
  const localizedValue = field[currentLang];

  if (localizedValue) return localizedValue;
  
  // 2. Резерв на іншу мову (наприклад, якщо вибрано 'en', але є лише 'uk')
  if (currentLang === 'uk' && field.en) return field.en;
  if (currentLang === 'en' && field.uk) return field.uk;

  return fallbackText;
};


export default function PartnerProfileView({
  partner,
  onEdit,
}: PartnerProfileViewProps) {
  // ІНІЦІАЛІЗАЦІЯ ПЕРЕКЛАДУ
  const t = useTranslations("PartnerProfile"); // Припускаємо простір імен "PartnerProfile"
  const locale = useLocale();

  const renderSocials = () => {
    if (!partner.socials) return null;
    const { facebook, telegram, linkedin, whatsapp } = partner.socials;

    if (!facebook && !telegram && !linkedin && !whatsapp) return null;

    return (
      <div className={styles.socials}>
        {/* Перекладаємо заголовок */}
        <strong>{t("socialsTitle")}:</strong>
        <ul>
          {facebook && (
            <li>
              <a href={facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
            </li>
          )}
          {telegram && (
            <li>
              <a href={telegram} target="_blank" rel="noreferrer">
                Telegram
              </a>
            </li>
          )}
          {linkedin && (
            <li>
              <a href={linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
          )}
          {whatsapp && (
            <li>
              <a href={whatsapp} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </li>
          )}
        </ul>
      </div>
    );
  };

  // Визначення локалізованих значень
  const addressToDisplay = getLocalizedValue(
    partner.deliveryAddress,
    locale,
    t("notSpecified")
  );

  const descriptionToDisplay = getLocalizedValue(
    partner.description,
    locale,
    t("notSpecified")
  );


  return (
    <>
      <div className={styles.avatarSection}>
        {/* ... (Аватар та Фото - без змін) ... */}
        <div className={styles.avatarContainer}>
          {partner.avatar ? (
            <img
              src={partner.avatar}
              // Перекладаємо alt
              alt={t("partnerAvatarAlt")} 
              className={styles.avatar}
            />
          ) : (
            <div className={styles.placeholderAvatar}>
              {partner.firstName?.charAt(0)}
            </div>
          )}

          {partner.photo ? (
            <img
              src={partner.photo}
              // Перекладаємо alt
              alt={t("partnerPhotoAlt")}
              className={styles.photo}
            />
          ) : (
            <div className={styles.placeholderAvatar}>
              {partner.firstName?.charAt(0)}
              {partner.lastName?.charAt(0)}
            </div>
          )}
        </div>
      </div>
      <div className={styles.infoGrid}>
        <div>
          <strong>ID:</strong> {partner.id}
        </div>
        <div>
          {/* Перекладаємо підпис */}
          <strong>{t("email")}:</strong> {partner.email}
        </div>
        <div>
          <strong>{t("firstName")}:</strong> {partner.firstName}
        </div>
        <div>
          <strong>{t("lastName")}:</strong> {partner.lastName}
        </div>
        {partner.phoneNumber && (
          <div>
            <strong>{t("phoneNumber")}:</strong>{" "}
            {formatPhoneNumber(partner.phoneNumber)}
          </div>
        )}
        
        {/* 3. ВИПРАВЛЕННЯ ПОМИЛКИ: Рендеримо STRING, а не OBJECT */}
        {partner.deliveryAddress && (
          <div>
            <strong>{t("deliveryAddress")}:</strong> {addressToDisplay}
          </div>
        )}
        
        {/* 4. ВИПРАВЛЕННЯ ПОМИЛКИ: Рендеримо STRING, а не OBJECT */}
        {partner.description && (
          <div>
            <strong>{t("description")}:</strong> {descriptionToDisplay}
          </div>
        )}
        
        {renderSocials()}
        
        {partner.rating !== undefined && (
          <div>
            <strong>{t("rating")}:</strong> {partner.rating}
          </div>
        )}
        
        {partner.isBlocked !== undefined && (
          <div>
            <strong>{t("status")}:</strong>{" "}
            <span
              className={
                partner.isBlocked ? styles.statusBlocked : styles.statusActive
              }
            >
              {/* Перекладаємо статус */}
              {partner.isBlocked ? t("statusBlocked") : t("statusActive")}
            </span>
          </div>
        )}
      </div>
      {/* Перекладаємо текст кнопки */}
      <button onClick={onEdit} className={styles.editButton}>
        {t("editProfile")}
      </button>
    </>
  );
}