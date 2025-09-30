// src/components/partners/PartnerProfileView.tsx

import { Partner } from "@/types/partner";
import { formatPhoneNumber } from "./formatters";
// import styles from "@/app/[locale]/partners/personal/page.module.scss";
import styles from "./PartnerProfileView.module.scss";

interface PartnerProfileViewProps {
  partner: Partner;
  onEdit: () => void;
}

export default function PartnerProfileView({
  partner,
  onEdit,
}: PartnerProfileViewProps) {
  const renderSocials = () => {
    if (!partner.socials) return null;
    const { facebook, telegram, linkedin, whatsapp } = partner.socials;

    if (!facebook && !telegram && !linkedin && !whatsapp) return null;

    return (
      <div className={styles.socials}>
        <strong>Соцмережі:</strong>
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

  return (
    <>
      <div className={styles.avatarSection}>
        <div className={styles.avatarContainer}>
          {/* Аватар */}
          {partner.avatar ? (
            <img
              src={partner.avatar}
              alt="Аватар партнера"
              className={styles.avatar}
            />
          ) : (
            <div className={styles.placeholderAvatar}>
              {partner.firstName?.charAt(0)}
            </div>
          )}

          {/* Фото */}
          {partner.photo ? (
            <img
              src={partner.photo}
              alt="Фото партнера"
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
          <strong>Email:</strong> {partner.email}
        </div>
        <div>
          <strong>Ім&apos;я:</strong> {partner.firstName}
        </div>
        <div>
          <strong>Прізвище:</strong> {partner.lastName}
        </div>
        {partner.phoneNumber && (
          <div>
            <strong>Телефон:</strong> {formatPhoneNumber(partner.phoneNumber)}
          </div>
        )}
        {partner.deliveryAddress && (
          <div>
            <strong>Адреса доставки:</strong> {partner.deliveryAddress}
          </div>
        )}
        {partner.description && (
          <div>
            <strong>Опис:</strong> {partner.description}
          </div>
        )}
        {renderSocials()}
        {partner.rating !== undefined && (
          <div>
            <strong>Рейтинг:</strong> {partner.rating}
          </div>
        )}
        {partner.isBlocked !== undefined && (
          <div>
            <strong>Статус:</strong>{" "}
            <span
              className={
                partner.isBlocked ? styles.statusBlocked : styles.statusActive
              }
            >
              {partner.isBlocked ? " Заблокований" : " Активний"}
            </span>
          </div>
        )}
      </div>
      <button onClick={onEdit} className={styles.editButton}>Редагувати профіль</button>
    </>
  );
}
