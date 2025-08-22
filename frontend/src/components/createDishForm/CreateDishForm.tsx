// src/components/createDishForm/CreateDishForm.tsx
"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./CreateDishForm.module.scss";
import IngredientsTable from "./constants/IngredientsTable";
import { Dish, CreateDishDto } from "@/types/dish";
import { ingredientsByCategory } from "./constants/ingredientsData";

// 👇 Додаємо допоміжний тип для форми (бо потрібна category)
export interface IngredientForm {
  name_ua: string;
  name_en: string;
  quantity?: number;
  unit: string;
  category: string; // main | optional | інші підкатегорії
}

interface FormValues extends Omit<CreateDishDto, "standard_servings"> {
  important_ingredients: IngredientForm[];
  optional_ingredients: IngredientForm[];
}

interface CreateDishFormProps {
  initialData?: Partial<Dish>; // для редагування
  onSubmit: (values: FormValues) => Promise<void>; // обробник submit
}

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

const dishTypes = [
  { value: "first_course", label: "🥘 Перше блюдо / First course" },
  { value: "side_dish", label: "🍚 Гарнір / Side dish" },
  { value: "salad", label: "🥗 Салат / Salad" },
  { value: "appetizer", label: "🍢 Закуска / Appetizer" },
];

export default function CreateDishForm({ initialData, onSubmit }: CreateDishFormProps) {
  // Функція для визначення категорії інгредієнта по назві
  const mapIngredientWithCategory = (ing: any, defaultCategory: string): IngredientForm => {
    const foundCategory = Object.keys(ingredientsByCategory).find((cat) =>
      ingredientsByCategory[cat].some((item) => item.name_ua === ing.name_ua)
    );
    return {
      ...ing,
      category: foundCategory || defaultCategory,
    };
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
          important_ingredients: (initialData?.important_ingredients || []).map((ing) =>
            mapIngredientWithCategory(ing, "main")
          ),
          optional_ingredients: (initialData?.optional_ingredients || []).map((ing) =>
            mapIngredientWithCategory(ing, "optional")
          ),
          recipe_ua: initialData?.recipe_ua || "",
          recipe_en: initialData?.recipe_en || "",
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {() => (
          <Form className={styles.form}>
            {/* Назви */}
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
              <ErrorMessage name="type" component="div" className={styles.error} />
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
