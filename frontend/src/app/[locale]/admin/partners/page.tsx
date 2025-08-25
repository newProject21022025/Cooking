// src/app/[locale]/admin/partners/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { api } from "@/api/partnersApi";
import { Partner } from "@/types/partner";
import styles from "./page.module.scss";

export default function Partners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // ✅ отримання всіх партнерів
  const fetchPartners = async () => {
    try {
      setLoading(true);
      const res = await api.getPartners();
      setPartners(res.data);
    } catch (error) {
      console.error("Помилка при отриманні партнерів:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // ✅ схема валідації
  const validationSchema = Yup.object({
    email: Yup.string().email("Некоректний email").required("Email обов'язковий"),
    password: Yup.string().min(6, "Мінімум 6 символів").required("Пароль обов'язковий"),
  });

  // ✅ відправка форми
  const handleSubmit = async (values: { email: string; password: string }, { resetForm }: any) => {
    try {
      await api.createPartner(values);
      await fetchPartners(); // оновити список
      resetForm();
    } catch (error) {
      console.error("Помилка при створенні партнера:", error);
    }
  };

  // ✅ видалення партнера
  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цього партнера?")) return;
    try {
      await api.deletePartner(id);
      await fetchPartners();
    } catch (error) {
      console.error("Помилка при видаленні партнера:", error);
    }
  };

  // ✅ блокування партнера
const handleBlock = async (id: string) => {
  try {
    await api.blockPartner(id);
    await fetchPartners();
  } catch (error) {
    console.error("Помилка при блокуванні партнера:", error);
  }
};

  return (
    <div className={styles.container}>
      <h1>Партнери</h1>

      {/* ✅ Форма створення */}
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={styles.form}>
            <div>
              <label>Email</label>
              <Field name="email" type="email" />
              <ErrorMessage name="email" component="div" className={styles.error} />
            </div>

            <div>
              <label>Пароль</label>
              <Field name="password" type="password" />
              <ErrorMessage name="password" component="div" className={styles.error} />
            </div>

            <button type="submit" disabled={isSubmitting}>
              Додати партнера
            </button>
          </Form>
        )}
      </Formik>

      {/* ✅ Список партнерів */}
      <h2>Список партнерів</h2>
      {loading ? (
        <p>Завантаження...</p>
      ) : partners.length > 0 ? (
        <ul className={styles.list}>
  {partners.map((p) => (
    <li key={p.id} className={styles.partnerItem}>
      <div>
        <strong>{p.email}</strong>
        {p.isBlocked && <span className={styles.blocked}> (Заблокований)</span>}
      </div>
      <div className={styles.actions}>
        <button onClick={() => handleDelete(p.id)} className={styles.deleteBtn}>
          Видалити
        </button>
        <button onClick={() => handleBlock(p.id)} className={styles.blockBtn}>
          {p.isBlocked ? "Розблокувати" : "Блокувати"}
        </button>
      </div>
    </li>
  ))}
</ul>

      ) : (
        <p>Партнерів ще немає</p>
      )}
    </div>
  );
}
