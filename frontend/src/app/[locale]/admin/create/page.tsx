// src/app/admin/create/page.tsx

"use client";

import React from "react";
import styles from "./page.module.scss";
import CreateDishForm from "@/components/createDishForm/CreateDishForm";
import { FormValues, CreateDishDto } from "@/types/dish";
import { createDishApi } from "@/api/dishesApi";

export default function AdminPage() {
  const handleSubmit = async (values: FormValues) => {
    const dto: CreateDishDto = {
      ...values,
      important_ingredients: values.important_ingredients.map(({ name_ua, name_en, quantity, unit }) => ({
        name_ua,
        name_en,
        quantity: quantity ?? 0,
        unit,
      })),
      optional_ingredients: values.optional_ingredients.map(({ name_ua, name_en, quantity, unit }) => ({
        name_ua,
        name_en,
        quantity: quantity ?? 0,
        unit,
      })),
      standard_servings: values.standard_servings ?? 1,
    };

    try {
      await createDishApi(dto);
      alert("Страву створено успішно!");
    } catch (err) {
      console.error(err);
      alert("Помилка при створенні страви");
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <h1 className={styles.title}>Панель Адміністратора</h1>
        <p className={styles.description}>
          Тут буде вміст сторінки адміністратора. Доступ лише для авторизованих адміністраторів.
        </p>

        <CreateDishForm onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
