// src/components/partners/PartnersList.tsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchPartners,
  setSelectedPartner,
} from "@/redux/slices/partnersSlice";
import { useRouter, usePathname } from "next/navigation";
import styles from "./PartnersList.module.scss";

const PartnersList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname(); // поточний шлях
  const locale = pathname.split("/")[1]; // витягуємо locale з URL

  const { partners, loading, error } = useSelector(
    (state: RootState) => state.partners
  );

  useEffect(() => {
    dispatch(fetchPartners());
  }, [dispatch]);

  if (loading) return <p>Завантаження партнерів...</p>;
  if (error) return <p>Помилка: {error}</p>;

  const handlePartnerClick = (partnerId: string) => {
    dispatch(setSelectedPartner(partnerId)); // зберігаємо у Redux
    router.push(`/${locale}/buyDishes/dishes?partnerId=${partnerId}`);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.tittle}>Наші партнери</h2>
      <p className={styles.text}>
        Смачно та швидко! Замовляйте у наших перевірених партнерів вже сьогодні!
      </p>
      <ul className={styles.list}>
        {partners.map((partner) => (
          <li
            key={partner.id}
            className={styles.item}
            onClick={() => handlePartnerClick(partner.id)}
          >
            <span className={styles.avatar}>
              {partner.photo ? (
                <img
                  src={partner.photo}
                  alt={`${partner.firstName} ${partner.lastName}`}
                />
              ) : (
                <span className={styles.placeholder}>
                  {partner.firstName?.[0] ?? ""}
                  {partner.lastName?.[0] ?? ""}
                </span>
              )}
            </span>
            <span className={styles.name}>
              {partner.firstName} {partner.lastName}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PartnersList;
