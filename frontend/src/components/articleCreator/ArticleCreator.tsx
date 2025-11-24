// src/components/ArticleCreator.tsx

import React, { useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { articlesApi, CreateArticleDto } from "@/api/articleApi"; // Ваш API
import {
  ArticleValidationSchema,
  initialArticleValues,
} from "./articleValidation";
import { uploadToCloudinary } from "@/api/cloudinaryApi";

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
    <div className="mb-4 border p-3 rounded bg-gray-50">
      <label className="block text-sm font-medium text-gray-700">
        {label} {isOptional ? "(Опціонально)" : ""}
      </label>

      {/* Поле для UKR */}
      <Field name={nameUk}>
        {({ field, meta }: { field: any; meta: any }) => (
          <div>
            <InputComponent
              {...field}
              placeholder={`${label} (Українська)`}
              className={`mt-1 block w-full border ${
                meta.touched && meta.error
                  ? "border-red-500"
                  : "border-gray-300"
              } p-2 rounded-md shadow-sm`}
              rows={isTextArea ? 3 : 1}
            />
            <ErrorMessage
              name={nameUk}
              component="p"
              className="text-red-500 text-xs mt-1"
            />
          </div>
        )}
      </Field>

      {/* Поле для ENG */}
      <Field name={nameEn}>
        {({ field, meta }: { field: any; meta: any }) => (
          <div>
            <InputComponent
              {...field}
              placeholder={`${label} (English)`}
              className={`mt-1 block w-full border ${
                meta.touched && meta.error
                  ? "border-red-500"
                  : "border-gray-300"
              } p-2 rounded-md shadow-sm`}
              rows={isTextArea ? 3 : 1}
            />
            <ErrorMessage
              name={nameEn}
              component="p"
              className="text-red-500 text-xs mt-1"
            />
          </div>
        )}
      </Field>
    </div>
  );
};

// --- Основний компонент ArticleCreator ---

export const ArticleCreator: React.FC = () => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // ---------------------------------
  // ФУНКЦІЯ ВІДПРАВКИ ФОРМИ
  // ---------------------------------
  const handleSubmit = async (
    values: CreateArticleDto,
    { setSubmitting, resetForm }: any
  ) => {
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Виклик API для створення статті
      const newArticle = await articlesApi.create(values);
      console.log("Стаття успішно створена:", newArticle);

      // Очищення форми та повідомлення про успіх
      resetForm();
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Помилка при створенні статті:", error);
      setSubmitError(
        "Не вдалося створити статтю. Перевірте з'єднання та дані."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        ✍️ Створити нову статтю
      </h2>

      <Formik
        initialValues={initialArticleValues}
        validationSchema={ArticleValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, isValid }) => (
          <Form className="space-y-6">
            {/* === ОСНОВНА ІНФОРМАЦІЯ === */}
            <section className="border-b pb-4">
              <h3 className="text-xl font-semibold mb-3">Основні дані</h3>

              {/* Заголовок статті (MultiLang) */}
              <MultiLangField
                label="Заголовок Статті"
                nameUk="title.uk"
                nameEn="title.en"
              />

              {/* Короткий опис статті (MultiLang) */}
              <MultiLangField
                label="Короткий Опис"
                nameUk="description.uk"
                nameEn="description.en"
                isTextArea
              />

              {/* Фото з автоматичним завантаженням */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Фото Статті
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={async (
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    const file = event.target.files?.[0];
                    if (!file) return;

                    try {
                      // Показати статус завантаження
                      setSubmitError(null);
                      setSubmitSuccess(false);

                      // Завантаження на Cloudinary
                      const upload = await uploadToCloudinary(file);

                      // Встановлення URL у значення форми
                      values.photo = upload.secure_url;

                      alert("Фото успішно завантажено!");
                    } catch (error) {
                      setSubmitError("Помилка завантаження фото");
                      console.error(error);
                    }
                  }}
                  className="mt-1 block w-full border border-gray-300 p-2 rounded-md shadow-sm bg-white"
                />
              </div>
            </section>

            {/* === БЛОКИ СТАТТІ (FieldArray) === */}
            <section className="border-b pb-4">
              <h3 className="text-xl font-semibold mb-3">Блоки Контенту</h3>

              <FieldArray name="blocks">
                {({ push, remove }) => (
                  <>
                    {values.blocks.map((block, index) => (
                      <div
                        key={index}
                        className="p-4 mb-4 border border-blue-200 rounded-md bg-blue-50"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-blue-700">
                            Блок #{index + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                            disabled={values.blocks.length === 1} // Заборона видалення останнього блоку
                          >
                            Видалити блок
                          </button>
                        </div>

                        {/* Заголовок Блоку (MultiLang, Optional) */}
                        <MultiLangField
                          label="Заголовок Блоку"
                          nameUk={`blocks.${index}.title.uk`}
                          nameEn={`blocks.${index}.title.en`}
                          isOptional
                        />

                        {/* Опис/Текст Блоку (MultiLang, Required) */}
                        <MultiLangField
                          label="Текст Блоку"
                          nameUk={`blocks.${index}.description.uk`}
                          nameEn={`blocks.${index}.description.en`}
                          isTextArea
                        />
                      </div>
                    ))}

                    {/* Кнопка додавання нового блоку */}
                    <button
                      type="button"
                      onClick={() =>
                        push({
                          title: { uk: "", en: "" },
                          description: { uk: "", en: "" },
                        })
                      }
                      className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      ➕ Додати Блок
                    </button>
                    <ErrorMessage
                      name="blocks"
                      component="p"
                      className="text-red-500 text-xs mt-1"
                    />
                  </>
                )}
              </FieldArray>
            </section>

            {/* === ПІДВАЛ (КНОПКА ТА СТАТУС) === */}
            <div className="pt-4 flex justify-end items-center">
              {submitError && (
                <p className="text-red-600 mr-4 font-medium">
                  Помилка: {submitError}
                </p>
              )}
              {submitSuccess && (
                <p className="text-green-600 mr-4 font-medium">
                  ✅ Стаття успішно створена!
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Створення..." : "Створити Статтю"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
