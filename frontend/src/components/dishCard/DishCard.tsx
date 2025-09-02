// src/components/DishCard/DishCard.tsx
"use client";

import React from "react";
import styles from "./DishCard.module.scss";
import { Dish } from "@/types/dish";
import { useLocale } from "next-intl";
import Link from "next/link";

interface DishCardProps {
  dish: Dish;
}

export default function DishCard({ dish }: DishCardProps) {
  const locale = useLocale();

  return (
    <Link href={`/dishes/${dish.id}`} className={styles.dishCard}>
      <img src={dish.photo} alt={dish.name_ua} className={styles.dishPhoto} />
      <div className={styles.dishInfo}>
        <h3 className={styles.dishTitle}>
          {locale === "uk" ? dish.name_ua : dish.name_en}
        </h3>
        <p className={styles.dishDescription}>
          {locale === "uk" ? dish.description_ua : dish.description_en}
        </p>
      </div>
    </Link>
  );
}
