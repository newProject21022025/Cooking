// src/components/createDishForm/CreateDishForm.tsx
"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./CreateDishForm.module.scss";
import { createDishApi } from "@/api/dishesApi";
import IngredientsTable from "./constants/IngredientsTable";

const validationSchema = Yup.object({
  name_ua: Yup.string().required("Обов'язково"),
  name_en: Yup.string().required("Required"),
  type: Yup.string().required("Оберіть тип страви"),
  description_ua: Yup.string().required("Обов'язково"),
  description_en: Yup.string().required("Required"),
  photo: Yup.string().url("Має бути посилання").required("Обов'язково"),
  // standard_servings: Yup.number().min(1).required("Обов'язково"), // ✅ Видалено
  recipe_ua: Yup.string().required("Обов'язково"),
  recipe_en: Yup.string().required("Required"),
});

const dishTypes = [
  { value: "first_course", label: "🥘 Перше блюдо / First course" },
  { value: "side_dish", label: "🍚 Гарнір / Side dish" },
  { value: "salad", label: "🥗 Салат / Salad" },
  { value: "appetizer", label: "🍢 Закуска / Appetizer" },
];

export default function CreateDishForm() {
  return (
    <div className={styles.formWrapper}>
      <h2 className={styles.title}>Створити страву</h2>
      <Formik
        initialValues={{
          name_ua: "",
          name_en: "",
          type: "",
          description_ua: "",
          description_en: "",
          photo: "",
          // standard_servings: 1, // ✅ Видалено
          important_ingredients: [],
          optional_ingredients: [],
          recipe_ua: "",
          recipe_en: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            // ✅ Додаємо стандартну кількість порцій
            const dataToSend = {
              ...values,
              standard_servings: 1,
              // ✅ Видаляємо поле category з інгредієнтів
              important_ingredients: values.important_ingredients.map(({ category, ...rest }) => rest),
              optional_ingredients: values.optional_ingredients.map(({ category, ...rest }) => rest),
            };

            await createDishApi(dataToSend);
            alert("✅ Страва створена успішно!");
            resetForm();
          } catch (err) {
            console.error(err);
            alert("❌ Помилка при створенні страви");
          }
        }}
      >
        {({ values }) => (
          <Form className={styles.form}>
            {/* Назви */}
            <div className={styles.field}>
              <label>Назва (UA)</label>
              <Field name="name_ua" placeholder="Борщ" />
              <ErrorMessage
                name="name_ua"
                component="div"
                className={styles.error}
              />
            </div>

            <div className={styles.field}>
              <label>Name (EN)</label>
              <Field name="name_en" placeholder="Borscht" />
              <ErrorMessage
                name="name_en"
                component="div"
                className={styles.error}
              />
            </div>

            {/* Тип страви */}
            <div className={styles.field}>
              <label>Тип страви</label>
              <Field as="select" name="type">
                <option value="">-- Оберіть тип --</option>
                {dishTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="type"
                component="div"
                className={styles.error}
              />
            </div>

            {/* Опис */}
            <div className={styles.field}>
              <label>Опис (UA)</label>
              <Field as="textarea" name="description_ua" />
            </div>
            <div className={styles.field}>
              <label>Description (EN)</label>
              <Field as="textarea" name="description_en" />
            </div>

            {/* Фото */}
            <div className={styles.field}>
              <label>Фото (URL)</label>
              <Field name="photo" placeholder="https://example.com/image.jpg" />
            </div>

            {/* ✅ Блок для "Кількості порцій" видалено */}
            
            {/* Основні інгредієнти */}
            <IngredientsTable
              name="important_ingredients"
              label="Основні інгредієнти"
              type="main"
            />

            {/* Необов'язкові інгредієнти */}
            <IngredientsTable
              name="optional_ingredients"
              label="Необов'язкові інгредієнти"
              type="optional"
            />

            {/* Рецепт */}
            <div className={styles.field}>
              <label>Рецепт (UA)</label>
              <Field as="textarea" name="recipe_ua" />
            </div>
            <div className={styles.field}>
              <label>Recipe (EN)</label>
              <Field as="textarea" name="recipe_en" />
            </div>

            <button type="submit" className={styles.submitBtn}>
              ✅ Зберегти
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}