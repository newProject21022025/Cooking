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
      dispatch(fetchPartnerMenu(partnerId));
    }
  }, [dispatch, partnerId]);

  const selectedPartner = partners.find((p) => p.id === partnerId);

  if (loading) return <p className={styles.loading}>Завантаження...</p>;
  if (error) return <p className={styles.error}>Помилка: {error}</p>;
  if (!selectedPartner) return <p className={styles.notFound}>Партнер не знайдений.</p>;

  const partnerName = `${selectedPartner.firstName} ${selectedPartner.lastName}`;

  return (
    <div className={styles.container}>
      <h1 className={styles.tittle}>Інформація про партнера</h1>
      <div className={styles.partnerInfo}>
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
        <div className={styles.details}>
          <h2 className={styles.name}>{partnerName}</h2>
          {selectedPartner.description && (
            <p className={styles.description}>{selectedPartner.description}</p>
          )}
          {selectedPartner.phoneNumber && (
            <p className={styles.contact}>Телефон: {selectedPartner.phoneNumber}</p>
          )}
          {selectedPartner.email && (
            <p className={styles.contact}>Email: {selectedPartner.email}</p>
          )}
          {selectedPartner.deliveryAddress && (
            <p className={styles.contact}>Адреса: {selectedPartner.deliveryAddress}</p>
          )}
        </div>
      </div>

      {/* Дополнительная информация о партнере */}
      <section className={styles.partnerExtra}>
        <h2 className={styles.tittle}>Our History</h2>
        <p>
          Ідея заснувати {partnerName} виникла з бажання мати заклад, де їжа - це не просто задоволення смаку, а спосіб поділитися турботою та гостинністю.
          Починали з невеликого меню, акцентуючи увагу на якості продуктів, чистоті рецептів та сервісі. З перших днів вирішили, що доставка повинна бути не просто швидкою, а й естетичною: увага до упаковки, температури страв, збереження смаку.
          З часом {partnerName} розширив асортимент, впровадив авторські рецепти, сезонні пропозиції, системи зворотного зв’язку з клієнтами, щоб удосконалюватися.
        </p>

        <h2 className={styles.tittle}>Our Values</h2>
        <ul>
          <li>Якість у дрібницях - кожен інгредієнт, кожен метод приготування важливий, адже саме деталі формують смак.</li>
          <li>Гостинність і увага до клієнта - ми прагнемо, щоб кожен відчував себе бажаним гостем, навіть коли замовляє з дому.</li>
          <li>Час та зручність - замовлення має бути простим, доставка - швидкою, а страви - такими, що зберігають свій смак і вигляд.</li>
          <li>Інноваційний підхід - адаптація до сучасних трендів, нових форматів меню, екологічної упаковки і цифрових рішень.</li>
          <li>Справжність і прозорість - чесний склад, відкриті ціни, відповідальне ставлення до постачальників та стандартів.</li>
        </ul>

        <h2 className={styles.tittle}>Our Offers</h2>
        <div>
          <h3>Меню ресторану</h3>
          <ul>
            <li>Різноманітні страви - від традиційних класиків до авторських позицій нашого шеф-кухаря</li>
            <li>Свіжі салати, закуски, гарячі страви та десерти для будь-якого настрою</li>
            <li>Щотижневі спеціальні та сезонні пропозиції</li>
          </ul>

          <h3>Доставка додому</h3>
          <ul>
            <li>Зручне онлайн-замовлення через сайт або мобільний додаток</li>
            <li>Швидка та акуратна доставка в екологічній упаковці</li>
            <li>Можливість передзамовлення на певний час</li>
          </ul>

          <h3>Корисне харчування</h3>
          <ul>
            <li>Опції для вегетаріанців та веганів</li>
            <li>Страви без глютену та лактози</li>
            <li>Баланс смаку та користі для здоров&apos;я</li>
          </ul>

          <h3>Спеціальні пропозиції</h3>
          <ul>
            <li>Подарункові сети та бокси для друзів і колег</li>
            <li>Бізнес-ланчі з доставкою в офіс</li>
            <li>Знижки для постійних клієнтів та програма лояльності</li>
          </ul>

          <h3>Для кожного випадку</h3>
          <ul>
            <li>Сімейні вечері вдома</li>
            <li>Романтичні вечері</li>
            <li>Святкування й корпоративні замовлення</li>
          </ul>
        </div>
      </section>
    </div>
  );
}


// "use client";

// import { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { AppDispatch, RootState } from "@/redux/store";
// import { fetchPartnerMenu } from "@/redux/slices/partnersSlice";
// import { useSearchParams } from "next/navigation";
// import styles from "./page.module.scss";

// export default function Info() {
//   const searchParams = useSearchParams();
//   const partnerId = searchParams.get("partnerId");

//   const dispatch = useDispatch<AppDispatch>();
//   const { partners, loading, error, partnerDishes } = useSelector(
//     (state: RootState) => state.partners
//   );

//   useEffect(() => {
//     if (partnerId) {
//       // Завантажуємо меню обраного партнера при завантаженні сторінки
//       dispatch(fetchPartnerMenu(partnerId));
//     }
//   }, [dispatch, partnerId]);

//   // Знаходимо обраного партнера в Redux-сховищі
//   const selectedPartner = partners.find((p) => p.id === partnerId);

//   if (loading) return <p className={styles.loading}>Завантаження...</p>;
//   if (error) return <p className={styles.error}>Помилка: {error}</p>;

//   // Перевірка наявності партнера та його опису
//   if (!selectedPartner) {
//     return <p className={styles.notFound}>Партнер не знайдений.</p>;
//   }

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.tittle}>Інформація про партнера</h1>
//       <div className={styles.partnerInfo}>
//         <div className={styles.avatarContainer}>
//           {selectedPartner.photo ? (
//             <img
//               src={selectedPartner.photo}
//               alt={`${selectedPartner.firstName} ${selectedPartner.lastName}`}
//               className={styles.avatar}
//             />
//           ) : (
//             <div className={styles.placeholder}>
//               {selectedPartner.firstName?.[0] ?? ""}
//               {selectedPartner.lastName?.[0] ?? ""}
//             </div>
//           )}
//         </div>
//         <div className={styles.details}>
//           <h2 className={styles.name}>
//             {selectedPartner.firstName} {selectedPartner.lastName}
//           </h2>
//           {selectedPartner.description && (
//             <p className={styles.description}>{selectedPartner.description}</p>
//           )}
//           {selectedPartner.phoneNumber && (
//             <p className={styles.contact}>
//               Телефон: {selectedPartner.phoneNumber}
//             </p>
//           )}
//           {selectedPartner.email && (
//             <p className={styles.contact}>
//               Email: {selectedPartner.email}
//             </p>
//           )}
//           {selectedPartner.deliveryAddress && (
//             <p className={styles.contact}>
//               Адреса: {selectedPartner.deliveryAddress}
//             </p>
//           )}
//         </div>
//       </div>

      
//     </div>
//   );
// }