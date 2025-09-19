// src/components/createIngredientForm/CreateIngredientForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Formik,
  Form,
  Field,
  FieldArray,
  ErrorMessage,
  FormikHelpers,
} from "formik";
import * as Yup from "yup";
import { createIngredient, updateIngredient } from "@/api/ingredientsApi";
import { uploadToCloudinary } from "@/api/cloudinaryApi";
import {
  CreateIngredientPayload,
  UpdateIngredientPayload,
  Benefit,
  Ingredient,
} from "@/types/ingredients";
import styles from "./CreateIngredientForm.module.scss";

// Validation schema using Yup
const validationSchema = Yup.object({
  name_uk: Yup.string().required("Обов'язкове поле"),
  name_en: Yup.string().required("Required field"),
  image: Yup.string().required("Обов'язкове поле"),
  benefits: Yup.array().of(
    Yup.object({
      text_uk: Yup.string().required("Обов'язкове поле"),
      text_en: Yup.string().required("Required field"),
    })
  ),
});

interface CreateIngredientFormProps {
  editingIngredient: Ingredient | null;
  setEditingIngredient: (ingredient: Ingredient | null) => void;
}

const CreateIngredientForm = ({
  editingIngredient,
  setEditingIngredient,
}: CreateIngredientFormProps) => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  // ✅ Використовуємо useEffect для заповнення форми
  useEffect(() => {
    if (editingIngredient) {
      setUploadedImageUrl(editingIngredient.image);
    } else {
      setUploadedImageUrl(null);
    }
  }, [editingIngredient]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: FormikHelpers<CreateIngredientPayload>["setFieldValue"]
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadingImage(true);
      try {
        const response = await uploadToCloudinary(file);
        setFieldValue("image", response.secure_url);
        setUploadedImageUrl(response.secure_url);
        alert("Зображення успішно завантажено!");
      } catch (error) {
        alert("Помилка при завантаженні зображення.");
        console.error(error);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  // ✅ Правильне визначення початкових значень форми всередині компонента
  const initialValues = editingIngredient
    ? {
        name_uk: editingIngredient.name_uk,
        name_en: editingIngredient.name_en,
        image: editingIngredient.image,
        benefits: editingIngredient.benefits || [],
      }
    : {
        name_uk: "",
        name_en: "",
        image: "",
        benefits: [],
      };

  return (
    <div className={styles.formContainer}>
      <h2>
        {editingIngredient ? "Редагувати інгредієнт" : "Створити інгредієнт"}
      </h2>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            if (editingIngredient) {
              // ✅ Видаляємо id з об'єкта `values` перед відправкою
              const { id, ...updatePayload } = values as Ingredient;
              await updateIngredient(
                editingIngredient.id,
                updatePayload as UpdateIngredientPayload
              );
              alert("Інгредієнт успішно оновлено!");
            } else {
              await createIngredient(values as CreateIngredientPayload);
              alert("Інгредієнт успішно створено!");
            }
            resetForm();
            setUploadedImageUrl(null);
            setEditingIngredient(null);
          } catch (error) {
            alert(
              `Помилка при ${
                editingIngredient ? "оновленні" : "створенні"
              } інгредієнта.`
            );
            console.error(error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, isSubmitting, setFieldValue }) => (
          <Form className={styles.form}>
            {/* Решта коду форми без змін */}
            <div>
              <label htmlFor="name_uk">Назва (укр.)</label>
              <Field name="name_uk" type="text" className={styles.input} />
              <ErrorMessage
                name="name_uk"
                component="div"
                className={styles.error}
              />
            </div>

            <div>
              <label htmlFor="name_en">Назва (англ.)</label>
              <Field name="name_en" type="text" className={styles.input} />
              <ErrorMessage
                name="name_en"
                component="div"
                className={styles.error}
              />
            </div>

            <div>
              <label htmlFor="image">Зображення</label>
              <input
                id="file"
                name="file"
                type="file"
                onChange={(event) => handleImageUpload(event, setFieldValue)}
                disabled={isSubmitting || uploadingImage}
                className={styles.fileInput}
              />
              {uploadingImage && (
                <div className={styles.uploading}>Завантаження...</div>
              )}
              <ErrorMessage
                name="image"
                component="div"
                className={styles.error}
              />
              {uploadedImageUrl && (
                <div className={styles.imagePreview}>
                  <img
                    src={uploadedImageUrl}
                    alt="Preview"
                    className={styles.previewImage}
                  />
                </div>
              )}
            </div>

            <FieldArray name="benefits">
              {({ push, remove }) => (
                <div className={styles.benefitsSection}>
                  <h3>Бенефіти</h3>
                  {values.benefits.map((benefit, index) => (
                    <div key={index} className={styles.benefitItem}>
                      <div>
                        <label htmlFor={`benefits.${index}.text_uk`}>
                          Бенефіт (укр.)
                        </label>
                        <Field
                          name={`benefits.${index}.text_uk`}
                          type="text"
                          className={styles.input}
                        />
                        <ErrorMessage
                          name={`benefits.${index}.text_uk`}
                          component="div"
                          className={styles.error}
                        />
                      </div>
                      <div>
                        <label htmlFor={`benefits.${index}.text_en`}>
                          Бенефіт (англ.)
                        </label>
                        <Field
                          name={`benefits.${index}.text_en`}
                          type="text"
                          className={styles.input}
                        />
                        <ErrorMessage
                          name={`benefits.${index}.text_en`}
                          component="div"
                          className={styles.error}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className={styles.removeButton}
                      >
                        Видалити
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => push({ text_uk: "", text_en: "" })}
                    className={styles.addButton}
                  >
                    Додати бенефіт
                  </button>
                </div>
              )}
            </FieldArray>

            <button
              type="submit"
              disabled={isSubmitting || uploadingImage}
              className={styles.submitButton}
            >
              {isSubmitting
                ? "Збереження..."
                : editingIngredient
                ? "Оновити інгредієнт"
                : "Створити інгредієнт"}
            </button>
            {editingIngredient && (
              <button
                type="button"
                onClick={() => setEditingIngredient(null)}
                className={styles.cancelButton}
              >
                Скасувати редагування
              </button>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateIngredientForm;
