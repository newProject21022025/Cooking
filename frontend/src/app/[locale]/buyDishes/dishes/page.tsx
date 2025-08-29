// src/app/[locale]/buyDishes/dishes/page.tsx

"use client";

import { useSearchParams } from "next/navigation";
import styles from "./page.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function Dishes() {
  const searchParams = useSearchParams();
  const partnerIdFromQuery = searchParams.get("partnerId");

  // беремо id з Redux, якщо query немає
  const selectedPartnerId = useSelector(
    (state: RootState) => state.partners.selectedPartnerId
  );
  const partnerId = partnerIdFromQuery || selectedPartnerId;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Сторінка страв</h2>
      {partnerId ? (
        <p>Вибраний партнер: {partnerId}</p>
      ) : (
        <p>Партнера не вибрано</p>
      )}
    </div>
  );
}
