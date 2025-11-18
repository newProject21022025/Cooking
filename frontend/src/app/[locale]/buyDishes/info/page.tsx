// src/app/buyDishes/info/page.tsx

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

export default function Info() {
  const searchParams = useSearchParams();
  const partnerId = searchParams.get("partnerId");

  const dispatch = useDispatch<AppDispatch>();
  const { partners, loading, error, partnerDishes } = useSelector(
    (state: RootState) => state.partners
  );

  useEffect(() => {
    if (partnerId) {
      dispatch(fetchPartnerMenu(partnerId));
    }
  }, [dispatch, partnerId]);

  const selectedPartner = partners.find((p) => p.id === partnerId);

  if (loading) return <p className={styles.loading}>Завантаження...</p>;
  if (error) return <p className={styles.error}>Помилка: {error}</p>;
  if (!selectedPartner)
    return <p className={styles.notFound}>Партнер не знайдений.</p>;

  const partnerName = `${selectedPartner.firstName} ${selectedPartner.lastName}`;

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
      {/* Дополнительная информация о партнере */}
      <section className={styles.partnerExtra}>
        {selectedPartner.description && (
          <p className={styles.description}>
            <span className={styles.titleName}>{partnerName}-</span>
            {/* 👇 ВИПРАВЛЕНО: Відображаємо рядок, а не об'єкт */} 
            {selectedPartner.description.uk || selectedPartner.description.en} 
          </p>
        )}
        <h2 className={styles.titleName}>Our History</h2>
        <p className={styles.description}>
          Ідея заснувати {partnerName} виникла з бажання мати заклад, де їжа -
          це не просто задоволення смаку, а спосіб поділитися турботою та
          гостинністю. Починали з невеликого меню, акцентуючи увагу на якості
          продуктів, чистоті рецептів та сервісі. З перших днів вирішили, що
          доставка повинна бути не просто швидкою, а й естетичною: увага до
          упаковки, температури страв, збереження смаку. З часом {partnerName}{" "}
          розширив асортимент, впровадив авторські рецепти, сезонні пропозиції,
          системи зворотного зв’язку з клієнтами, щоб удосконалюватися.
        </p>
        <h2 className={styles.titleName}>Our Values</h2>
        <ul className={styles.description}>
          <li>
            Якість у дрібницях - кожен інгредієнт, кожен метод приготування
            важливий, адже саме деталі формують смак.
          </li>
          <li>
            Гостинність і увага до клієнта - ми прагнемо, щоб кожен відчував
            себе бажаним гостем, навіть коли замовляє з дому.
          </li>
          <li>
            Час та зручність - замовлення має бути простим, доставка - швидкою,
            а страви - такими, що зберігають свій смак і вигляд.
          </li>
          <li>
            Інноваційний підхід - адаптація до сучасних трендів, нових форматів
            меню, екологічної упаковки і цифрових рішень.
          </li>
          <li>
            Справжність і прозорість - чесний склад, відкриті ціни,
            відповідальне ставлення до постачальників та стандартів.
          </li>
        </ul>
        <h2 className={styles.titleName}>Our Offers</h2>
        <div className={styles.offerContainer}>
          <div>
            <h3>
              <span>svg</span>Меню ресторану
            </h3>
            <ul className={styles.description}>
              <li>
                Різноманітні страви - від традиційних класиків до авторських
                позицій нашого шеф-кухаря
              </li>
              <li>
                Свіжі салати, закуски, гарячі страви та десерти для будь-якого
                настрою
              </li>
              <li>Щотижневі спеціальні та сезонні пропозиції</li>
            </ul>
          </div>
          <div>
            <h3>
              <span>svg</span>Доставка додому
            </h3>
            <ul className={styles.description}>
              <li>Зручне онлайн-замовлення через сайт або мобільний додаток</li>
              <li>Швидка та акуратна доставка в екологічній упаковці</li>
              <li>Можливість передзамовлення на певний час</li>
            </ul>
          </div>
          <div>
            <h3>
              <span>svg</span>Корисне харчування
            </h3>
            <ul className={styles.description}>
              <li>Опції для вегетаріанців та веганів</li>
              <li>Страви без глютену та лактози</li>
              <li>Баланс смаку та користі для здоров&apos;я</li>
            </ul>
          </div>
          <div>
            <h3>
              <span>svg</span>Спеціальні пропозиції
            </h3>
            <ul className={styles.description}>
              <li>Подарункові сети та бокси для друзів і колег</li>
              <li>Бізнес-ланчі з доставкою в офіс</li>
              <li>Знижки для постійних клієнтів та програма лояльності</li>
            </ul>
          </div>
          <div>
            <h3>
              <span>svg</span>Для кожного випадку
            </h3>
            <ul className={styles.description}>
              <li>Сімейні вечері вдома</li>
              <li>Романтичні вечері</li>
              <li>Святкування й корпоративні замовлення</li>
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
              Телефон: {selectedPartner.phoneNumber}
            </p>
          )}
          {selectedPartner.email && (
            <p className={styles.contact}>
              <span className={styles.iconPlaceholder}>
                <EmailIcon />
              </span>
              Email: {selectedPartner.email}
            </p>
          )}
          {selectedPartner.deliveryAddress && (
            <p className={styles.contact}>
              <span className={styles.iconPlaceholder}>
                <LocationIcon />
              </span>
              Адреса:
              {/* 👇 ВИПРАВЛЕНО: Відображаємо рядок, а не об'єкт */} 
              {selectedPartner.deliveryAddress.uk ||
                selectedPartner.deliveryAddress.en}
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
              Безкоштовна доставка по місту від 500 ₴{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
