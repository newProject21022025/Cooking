// src/app/[locale]/buyDishes/info/page.tsx

"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchPartnerMenu } from "@/redux/slices/partnersSlice";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.scss";
import Link from "next/link";
import TelegramIcon from "@/svg/TelegramIcon/TelegramIcon";
import FacebookIcon from "@/svg/FacebookIcon/FacebookIcon";
import InstagramIcon from "@/svg/InstagramIcon/InstagramIcon";
import YoutubeIcon from "@/svg/YoutubeIcon/YoutubeIcon";
import Icon_Time from "@/svg/Icon_Time/Icon_Time";
import LocationIcon from "@/svg/LocationIcon/LocationIcon";
import PhoneIcon from "@/svg/PhoneIcon/PhoneIcon";
import EmailIcon from "@/svg/EmailIcon/EmailIcon";
import Icon_menu_partner from "@/svg/Icon_partners/Icon_menu_partner";
import Icon_home_partner from "@/svg/Icon_partners/Icon_home_partner";
import Icon_flower_partner from "@/svg/Icon_partners/Icon_flower_partner";
import Icon_diamond_partner from "@/svg/Icon_partners/Icon_diamond_partner";
import Icon_people_partner from "@/svg/Icon_partners/Icon_people_partner";

// 🛑 ІМПОРТ ЛОКАЛІЗАЦІЇ
import { useLocale, useTranslations } from "next-intl";

export default function Info() {
  const searchParams = useSearchParams(); // 🛑 ВИПРАВЛЕННЯ: Тепер partnerId беремо з Redux-стану (якщо він зберігається)
  const { partners, loading, error, selectedPartnerId } = useSelector(
    (state: RootState) => state.partners // <-- ДОДАЙТЕ selectedPartnerId У СЕЛЕКТОР
  );

  const dispatch = useDispatch<AppDispatch>();
  const locale = useLocale();
  const t = useTranslations("PartnerInfoPage"); // 💡 Якщо ви використовуєте `partnerId` з URL, а він порожній, // то беремо ідентифікатор, збережений у Redux-стані

  const urlPartnerId = searchParams.get("partnerId");
  const partnerIdToUse = urlPartnerId || selectedPartnerId; // Якщо ідентифікатора немає ніде, ми не можемо продовжувати

  if (!partnerIdToUse) {
    return <p className={styles.notFound}>{t("notFound")}</p>;
  } // Тепер використовуємо partnerIdToUse

  const selectedPartner = partners.find((p) => p.id === partnerIdToUse);

  useEffect(() => {
    // 💡 Умовна логіка знаходиться всередині хука
    if (partnerIdToUse) {
      const selectedPartner = partners.find((p) => p.id === partnerIdToUse);

      // Викликаємо завантаження лише якщо партнер відсутній або при зміні локалі,
      // або якщо дані ще не завантажувались.
      if (!selectedPartner) { 
        dispatch(fetchPartnerMenu(partnerIdToUse));
      }
    }
  }, [dispatch, partnerIdToUse, locale, partners]); // Додаємо всі необхідні залежності

  if (loading || !selectedPartner)
    return <p className={styles.loading}>{t("loading")}</p>;
  if (error)
    return (
      <p className={styles.error}>
        {t("error")}: {error}
      </p>
    );

  const partnerName = `${selectedPartner.firstName} ${selectedPartner.lastName}`;

  // 🛑 Логіка вибору опису та адреси залежно від локалі
  const partnerDescription =
    locale === "uk"
      ? selectedPartner.description?.uk || selectedPartner.description?.en
      : selectedPartner.description?.en || selectedPartner.description?.uk;

  const partnerAddress =
    locale === "uk"
      ? selectedPartner.deliveryAddress?.uk ||
        selectedPartner.deliveryAddress?.en
      : selectedPartner.deliveryAddress?.en ||
        selectedPartner.deliveryAddress?.uk;

  return (
    <div className={styles.container}>
      <div className={styles.avatarContainer}>
        {selectedPartner.photo ? (
          <img
            src={selectedPartner.photo}
            alt={partnerName}
            className={styles.avatar}
          />
        ) : (
          <div className={styles.placeholder}>
            {selectedPartner.firstName?.[0] ?? ""}
            {selectedPartner.lastName?.[0] ?? ""}
          </div>
        )}
      </div>
      {/* Додаткова інформація про партнера */}
      <section className={styles.partnerExtra}>
        {partnerDescription && (
          <p className={styles.description}>
            <span className={styles.titleName}>{partnerName} - </span>
            {/* 🛑 ВИКОРИСТАННЯ ДИНАМІЧНОГО ОПИСУ */}
            {partnerDescription}
          </p>
        )}
        <h2 className={styles.titleName}>{t("sections.historyTitle")}</h2>
        <p className={styles.description}>
          {t("sections.historyText", { partnerName })}{" "}
          {/* 🛑 Переклад з інтерполяцією */}
        </p>
        <h2 className={styles.titleName}>{t("sections.valuesTitle")}</h2>
        <ul className={styles.description}>
          <li>{t("values.quality")}</li>
          <li>{t("values.hospitality")}</li>
          <li>{t("values.convenience")}</li>
          <li>{t("values.innovation")}</li>
          <li>{t("values.authenticity")}</li>
        </ul>
        <h2 className={styles.titleName}>{t("sections.offersTitle")}</h2>
        <div className={styles.offerContainer}>
          <div>
            <h3>
              <span>
                <Icon_menu_partner />
              </span>
              {t("offers.restaurantMenuTitle")}
            </h3>
            <ul className={styles.description}>
              <li>{t("offers.restaurantMenuPoint1")}</li>
              <li>{t("offers.restaurantMenuPoint2")}</li>
              <li>{t("offers.restaurantMenuPoint3")}</li>
            </ul>
          </div>
          <div>
            <h3>
              <span>
                <Icon_home_partner />
              </span>
              {t("offers.deliveryTitle")}
            </h3>
            <ul className={styles.description}>
              <li>{t("offers.deliveryPoint1")}</li>
              <li>{t("offers.deliveryPoint2")}</li>
              <li>{t("offers.deliveryPoint3")}</li>
            </ul>
          </div>
          <div>
            <h3>
              <span>
                <Icon_flower_partner />
              </span>
              {t("offers.healthyFoodTitle")}
            </h3>
            <ul className={styles.description}>
              <li>{t("offers.healthyFoodPoint1")}</li>
              <li>{t("offers.healthyFoodPoint2")}</li>
              <li>{t("offers.healthyFoodPoint3")}</li>
            </ul>
          </div>
          <div>
            <h3>
              <span>
                <Icon_diamond_partner />
              </span>
              {t("offers.specialOffersTitle")}
            </h3>
            <ul className={styles.description}>
              <li>{t("offers.specialOffersPoint1")}</li>
              <li>{t("offers.specialOffersPoint2")}</li>
              <li>{t("offers.specialOffersPoint3")}</li>
            </ul>
          </div>
          <div>
            <h3>
              <span>
                <Icon_people_partner />
              </span>
              {t("offers.forEveryOccasionTitle")}
            </h3>
            <ul className={styles.description}>
              <li>{t("offers.forEveryOccasionPoint1")}</li>
              <li>{t("offers.forEveryOccasionPoint2")}</li>
              <li>{t("offers.forEveryOccasionPoint3")}</li>
            </ul>
          </div>
        </div>
      </section>

      <div className={styles.contactContainer}>
        <div className={styles.details}>
          {selectedPartner.phoneNumber && (
            <p className={styles.contact}>
              <span className={styles.iconPlaceholder}>
                <PhoneIcon />{" "}
              </span>
              {t("contact.phone")}: {selectedPartner.phoneNumber}
            </p>
          )}
          {selectedPartner.email && (
            <p className={styles.contact}>
              <span className={styles.iconPlaceholder}>
                <EmailIcon />
              </span>
              {t("contact.email")}: {selectedPartner.email}
            </p>
          )}
          {partnerAddress && (
            <p className={styles.contact}>
              <span className={styles.iconPlaceholder}>
                <LocationIcon />
              </span>
              {t("contact.address")}:{partnerAddress}
            </p>
          )}
        </div>

        {/* Соціальні мережі */}
        <div className={styles.socials}>
          <div className={styles.socialIconContainer}>
            <Link href="#" aria-label="Telegram" className={styles.socialIcon}>
              <TelegramIcon />
            </Link>
            <Link href="#" aria-label="Facebook" className={styles.socialIcon}>
              <FacebookIcon />
            </Link>
            <Link href="#" aria-label="Instagram" className={styles.socialIcon}>
              <InstagramIcon />
            </Link>
            <Link href="#" aria-label="Youtube" className={styles.socialIcon}>
              <YoutubeIcon />
            </Link>
          </div>
          <div>
            <p className={styles.freeDelivery}>
              <span className={styles.iconTime}>
                <Icon_Time />
              </span>
              {t("contact.freeDelivery")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
