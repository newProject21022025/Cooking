// src/app/[locale]/admin/ingredients/page.tsx
"use client";

import React, { useState } from 'react';
import styles from './page.module.scss';
import { Formik, Form, Field, FieldArray, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { createIngredient } from '@/api/ingredientsApi';
import { CreateIngredientPayload, Benefit } from '@/types/ingredients';
import { uploadToCloudinary } from '@/api/cloudinaryApi';


// Component for the ingredient creation form
const CreateIngredientForm = () => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null); // ✅ Store the full URL instead of public_id

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

  // Handler for image upload to Cloudinary
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    // ✅ Використовуємо правильний тип для setFieldValue
    setFieldValue: FormikHelpers<CreateIngredientPayload>['setFieldValue']
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

  return (
    <div className={styles.formContainer}>
      <h2>Створити інгредієнт</h2>
      <Formik
        initialValues={{ name_uk: '', name_en: '', image: '', benefits: [] }}
        validationSchema={validationSchema}
        onSubmit={async (values: CreateIngredientPayload, { setSubmitting, resetForm }) => {
          try {
            await createIngredient(values);
            alert("Інгредієнт успішно створено!");
            resetForm();
            setUploadedImageUrl(null); // Reset preview after successful submission
          } catch (error) {
            alert("Помилка при створенні інгредієнта.");
            console.error(error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, isSubmitting, setFieldValue }) => (
          <Form className={styles.form}>
            {/* Input fields for names */}
            <div>
              <label htmlFor="name_uk">Назва (укр.)</label>
              <Field name="name_uk" type="text" className={styles.input} />
              <ErrorMessage name="name_uk" component="div" className={styles.error} />
            </div>

            <div>
              <label htmlFor="name_en">Назва (англ.)</label>
              <Field name="name_en" type="text" className={styles.input} />
              <ErrorMessage name="name_en" component="div" className={styles.error} />
            </div>

            {/* Image upload section */}
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
              {uploadingImage && <div className={styles.uploading}>Завантаження...</div>}
              <ErrorMessage name="image" component="div" className={styles.error} />
              {uploadedImageUrl && (
                <div className={styles.imagePreview}>
                  <img src={uploadedImageUrl} alt="Preview" className={styles.previewImage} />
                </div>
              )}
            </div>

            {/* Dynamic field array for benefits */}
            <FieldArray name="benefits">
              {({ push, remove }) => (
                <div className={styles.benefitsSection}>
                  <h3>Бенефіти</h3>
                  {values.benefits.map((benefit, index) => (
                    <div key={index} className={styles.benefitItem}>
                      <div>
                        <label htmlFor={`benefits.${index}.text_uk`}>Бенефіт (укр.)</label>
                        <Field name={`benefits.${index}.text_uk`} type="text" className={styles.input} />
                        <ErrorMessage name={`benefits.${index}.text_uk`} component="div" className={styles.error} />
                      </div>
                      <div>
                        <label htmlFor={`benefits.${index}.text_en`}>Бенефіт (англ.)</label>
                        <Field name={`benefits.${index}.text_en`} type="text" className={styles.input} />
                        <ErrorMessage name={`benefits.${index}.text_en`} component="div" className={styles.error} />
                      </div>
                      <button type="button" onClick={() => remove(index)} className={styles.removeButton}>
                        Видалити
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => push({ text_uk: '', text_en: '' })} className={styles.addButton}>
                    Додати бенефіт
                  </button>
                </div>
              )}
            </FieldArray>

            <button type="submit" disabled={isSubmitting || uploadingImage} className={styles.submitButton}>
              {isSubmitting ? 'Створення...' : 'Створити інгредієнт'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default function Ingredients() {
  return (
    <div className={styles.container}>
      <CreateIngredientForm />
    </div>
  );
}