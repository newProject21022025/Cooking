// src/app/admin/create/page.tsx
"use client";

import React from "react";
import styles from "./page.module.scss";
import CreateDishForm, { FormValues } from "@/components/createDishForm/CreateDishForm";
import { createDishApi } from "@/api/dishesApi";

export default function AdminPage() {
  const handleSubmit = async (values: FormValues) => {
    try {
      // Додаємо стандартну порцію, щоб відповідало CreateDishDto
      const dto = {
        ...values,
        standard_servings: 1, // значення за замовчуванням
      };

      await createDishApi(dto);
      alert("Страву створено успішно!");
    } catch (error) {
      console.error(error);
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

        {/* Передаємо handleSubmit у CreateDishForm */}
        <CreateDishForm onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
