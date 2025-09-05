// src/components/createDishForm/CreateDishForm.tsx
"use client";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import styles from "./CreateDishForm.module.scss";
import IngredientsTable from "./constants/IngredientsTable";
import { Dish, CreateDishDto, FormValues, Ingredient, IngredientForm } from "@/types/dish";
import { ingredientsByCategory } from "./constants/ingredientsData";
import { uploadToCloudinary } from "@/api/cloudinaryApi";
import { useState } from "react";

interface CreateDishFormProps {
  initialData?: Partial<Dish>;
  onSubmit: (values: FormValues) => Promise<void>;
}

const dishTypes = [
  { value: "first_course", label: "🥘 Перше блюдо / First course" },
  { value: "side_dish", label: "🍚 Гарнір / Side dish" },
  { value: "salad", label: "🥗 Салат / Salad" },
  { value: "appetizer", label: "🍢 Закуска / Appetizer" },
];

const validationSchema = Yup.object({
  name_ua: Yup.string().required("Обов'язково"),
  name_en: Yup.string().required("Required"),
  type: Yup.string().required("Оберіть тип страви"),
  description_ua: Yup.string().required("Обов'язково"),
  description_en: Yup.string().required("Required"),
  photo: Yup.string().url("Має бути посилання").required("Обов'язково"),
  recipe_ua: Yup.string().required("Обов'язково"),
  recipe_en: Yup.string().required("Required"),
});

export default function CreateDishForm({ initialData, onSubmit }: CreateDishFormProps) {
  const [uploading, setUploading] = useState(false);

  // Додаємо категорію до інгредієнта
  const mapIngredientWithCategory = (ing: Ingredient, defaultCategory: string): IngredientForm => {
    const foundCategory = Object.keys(ingredientsByCategory).find(cat =>
      ingredientsByCategory[cat].some(item => item.name_ua === ing.name_ua)
    );
    return { ...ing, category: foundCategory || defaultCategory };
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: FormikHelpers<FormValues>["setFieldValue"]
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadToCloudinary(file);
      setFieldValue("photo", result.secure_url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Помилка завантаження фото:", msg);
      alert("Не вдалося завантажити фото");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      await onSubmit(values); // передаємо в AdminPage, де конвертуємо в CreateDishDto
    } catch (err) {
      console.error("Помилка створення страви:", err);
      alert("Помилка при створенні страви");
    }
  };

  return (
    <div className={styles.formWrapper}>
      <h2 className={styles.title}>
        {initialData ? "Редагувати страву" : "Створити страву"}
      </h2>

      <Formik<FormValues>
        initialValues={{
          name_ua: initialData?.name_ua || "",
          name_en: initialData?.name_en || "",
          type: initialData?.type || "",
          description_ua: initialData?.description_ua || "",
          description_en: initialData?.description_en || "",
          photo: initialData?.photo || "",
          important_ingredients: (initialData?.important_ingredients || []).map(ing =>
            mapIngredientWithCategory(ing, "main")
          ),
          optional_ingredients: (initialData?.optional_ingredients || []).map(ing =>
            mapIngredientWithCategory(ing, "optional")
          ),
          recipe_ua: initialData?.recipe_ua || "",
          recipe_en: initialData?.recipe_en || "",
          standard_servings: initialData?.standard_servings || 1,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className={styles.form}>
            <div className={styles.field}>
              <label>Назва (UA)</label>
              <Field name="name_ua" placeholder="Борщ" />
              <ErrorMessage name="name_ua" component="div" className={styles.error} />
            </div>

            <div className={styles.field}>
              <label>Name (EN)</label>
              <Field name="name_en" placeholder="Borscht" />
              <ErrorMessage name="name_en" component="div" className={styles.error} />
            </div>

            <div className={styles.field}>
              <label>Тип страви</label>
              <Field as="select" name="type">
                <option value="">-- Оберіть тип --</option>
                {dishTypes.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </Field>
              <ErrorMessage name="type" component="div" className={styles.error} />
            </div>

            <div className={styles.field}>
              <label>Опис (UA)</label>
              <Field as="textarea" name="description_ua" />
            </div>
            <div className={styles.field}>
              <label>Description (EN)</label>
              <Field as="textarea" name="description_en" />
            </div>

            <div className={styles.field}>
              <label>Фото</label>
              <input type="file" accept="image/*" onChange={e => handleFileChange(e, setFieldValue)} />
              {uploading && <p>Завантаження...</p>}
              <Field name="photo" placeholder="Або вставте URL" />
              <ErrorMessage name="photo" component="div" className={styles.error} />
            </div>

            <IngredientsTable name="important_ingredients" label="Основні інгредієнти" type="main" />
            <IngredientsTable name="optional_ingredients" label="Необов'язкові інгредієнти" type="optional" />

            <div className={styles.field}>
              <label>Рецепт (UA)</label>
              <Field as="textarea" name="recipe_ua" />
            </div>
            <div className={styles.field}>
              <label>Recipe (EN)</label>
              <Field as="textarea" name="recipe_en" />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={uploading}>✅ Зберегти</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
