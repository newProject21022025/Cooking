// src/components/ArticleCreator.tsx

import React, { useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage, FieldProps, FormikHelpers } from "formik";
import { articlesApi, CreateArticleDto } from "@/api/articleApi";
import { ArticleValidationSchema, initialArticleValues } from "./articleValidation";
import { uploadToCloudinary } from "@/api/cloudinaryApi";
import styles from "./ArticleCreator.module.scss";

// --- Допоміжний компонент для MultiLang полів ---
interface MultiLangFieldProps {
  label: string;
  nameUk: string;
  nameEn: string;
  isTextArea?: boolean;
  isOptional?: boolean;
}

const MultiLangField: React.FC<MultiLangFieldProps> = ({
  label,
  nameUk,
  nameEn,
  isTextArea = false,
  isOptional = false,
}) => {
  const InputComponent = isTextArea ? "textarea" : "input";

  return (
    <div className={styles.multiLangField}>
      <label>
        {label} {isOptional ? "(Опціонально)" : ""}
      </label>

      {/* Поле для UK */}
      <Field name={nameUk}>
        {({ field, meta }: FieldProps) => (
          <>
            <InputComponent
              {...field}
              placeholder={`${label} (Українська)`}
            />
            <ErrorMessage name={nameUk} component="p" className={styles.errorMessage} />
          </>
        )}
      </Field>

      {/* Поле для EN */}
      <Field name={nameEn}>
        {({ field, meta }: FieldProps) => (
          <>
            <InputComponent
              {...field}
              placeholder={`${label} (English)`}
            />
            <ErrorMessage name={nameEn} component="p" className={styles.errorMessage} />
          </>
        )}
      </Field>
    </div>
  );
};

// --- Основний компонент ArticleCreator ---
export const ArticleCreator: React.FC = () => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const handleSubmit = async (
    values: CreateArticleDto,
    { setSubmitting, resetForm }: FormikHelpers<CreateArticleDto>
  ) => {
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await articlesApi.create(values);
      resetForm();
      setSubmitSuccess(true);
    } catch (error) {
      console.error(error);
      setSubmitError("Не вдалося створити статтю. Перевірте з'єднання та дані.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.articleCreator}>
      <h2>✍️ Створити нову статтю</h2>

      <Formik
        initialValues={initialArticleValues}
        validationSchema={ArticleValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, isValid }) => (
          <Form>
            {/* === Основні дані === */}
            <section>
              <h3>Основні дані</h3>

              <MultiLangField label="Заголовок Статті" nameUk="title.uk" nameEn="title.en" />
              <MultiLangField label="Короткий Опис" nameUk="description.uk" nameEn="description.en" isTextArea />

              {/* Фото */}
              <div className={styles.fileInputWrapper}>
                <label>Фото Статті</label>
                <input
                  type="file"
                  accept="image/*"
                  className={styles.fileInput}
                  onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    try {
                      setSubmitError(null);
                      setSubmitSuccess(false);
                      const upload = await uploadToCloudinary(file);
                      values.photo = upload.secure_url;
                      alert("Фото успішно завантажено!");
                    } catch (error) {
                      setSubmitError("Помилка завантаження фото");
                      console.error(error);
                    }
                  }}
                />
              </div>
            </section>

            {/* === Блоки статті === */}
            <section className={styles.blockArray}>
              <h3>Блоки Контенту</h3>
              <FieldArray name="blocks">
                {({ push, remove }) => (
                  <>
                    {values.blocks.map((block, index) => (
                      <div key={index} className={styles.blockItem}>
                        <div className={styles.blockHeader}>
                          <h4>Блок #{index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            disabled={values.blocks.length === 1}
                          >
                            Видалити блок
                          </button>
                        </div>

                        <MultiLangField
                          label="Заголовок Блоку"
                          nameUk={`blocks.${index}.title.uk`}
                          nameEn={`blocks.${index}.title.en`}
                          isOptional
                        />
                        <MultiLangField
                          label="Текст Блоку"
                          nameUk={`blocks.${index}.description.uk`}
                          nameEn={`blocks.${index}.description.en`}
                          isTextArea
                        />
                      </div>
                    ))}

                    <button type="button" className={styles.addBlockButton} onClick={() =>
                      push({ title: { uk: "", en: "" }, description: { uk: "", en: "" } })
                    }>
                      ➕ Додати Блок
                    </button>
                  </>
                )}
              </FieldArray>
            </section>

            {/* === Підвал === */}
            <div className={styles.formFooter}>
              {submitError && <p className={styles.submitError}>{submitError}</p>}
              {submitSuccess && <p className={styles.submitSuccess}>✅ Стаття успішно створена!</p>}
              <button type="submit" disabled={isSubmitting || !isValid}>
                {isSubmitting ? "Створення..." : "Створити Статтю"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
