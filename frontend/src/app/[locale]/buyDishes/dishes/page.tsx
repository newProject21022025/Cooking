// src/app/[locale]/buyDishes/dishes/page.tsx

"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { RootState, AppDispatch } from "@/redux/store";
import { setSelectedPartner } from "@/redux/slices/partnersSlice";
import PartnerDishesList from "@/components/partnerDishesList/PartnerDishesList"; // ✅ Імпортуємо новий компонент
import styles from "./page.module.scss";

export default function DishesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();

  const partnerIdFromQuery = searchParams.get("partnerId");
  const selectedPartnerId = useSelector(
    (state: RootState) => state.partners.selectedPartnerId
  );
  const partnerId = partnerIdFromQuery || selectedPartnerId;

  useEffect(() => {
    if (partnerIdFromQuery) {
      dispatch(setSelectedPartner(partnerIdFromQuery));
    }
  }, [partnerIdFromQuery, dispatch]);

  if (!partnerId) {
    return <p>Партнера не вибрано</p>;
  }

  return (
    <div className={styles.container}>
      {/* ✅ Використовуємо новий компонент */}
      <PartnerDishesList partnerId={partnerId} />
    </div>
  );
}