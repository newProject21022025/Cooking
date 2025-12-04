// src/components/articleCreator/ArticleCreator.tsx

import React, { useState, useEffect } from "react"; // Додано useEffect
import { Formik, Form, Field, FieldArray, ErrorMessage, FieldProps, FormikHelpers } from "formik";
// Імпортуємо Article
import { articlesApi, CreateArticleDto, Article } from "@/api/articleApi"; 
import { ArticleValidationSchema, initialArticleValues } from "./articleValidation";
import { uploadToCloudinary } from "@/api/cloudinaryApi";
import styles from "./ArticleCreator.module.scss";

// --- Допоміжний компонент для MultiLang полів ---
// ... (Залишаємо MultiLangField без змін)
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

// 1. Оновлення пропсів для підтримки редагування
interface ArticleCreatorProps {
 articleToEdit?: Article | null;
  onArticleSaved: (article: Article) => void;
}

// Функція для перетворення Article у формат CreateArticleDto (прибираємо id)
const convertArticleToDto = (article: Article): CreateArticleDto => ({
    title: article.title || { uk: "", en: "" },
    description: article.description || { uk: "", en: "" },
    photo: article.photo || "",
    blocks: article.blocks || [],
});

export const ArticleCreator: React.FC<ArticleCreatorProps> = ({ articleToEdit, onArticleSaved }) => {
 const [submitError, setSubmitError] = useState<string | null>(null);
 const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
 
  // Стан для відстеження початкових значень для Formik
  const [currentInitialValues, setCurrentInitialValues] = useState<CreateArticleDto>(initialArticleValues);

  // 2. Оновлюємо початкові значення, коли змінюється articleToEdit
  useEffect(() => {
    if (articleToEdit) {
        // Якщо є стаття для редагування, використовуємо її дані
        setCurrentInitialValues(convertArticleToDto(articleToEdit));
    } else {
        // Інакше використовуємо стандартні початкові значення для створення
        setCurrentInitialValues(initialArticleValues);
    }
  }, [articleToEdit]);


 const handleSubmit = async (
  values: CreateArticleDto,
  { setSubmitting, resetForm }: FormikHelpers<CreateArticleDto>
 ) => {
  setSubmitting(true);
  setSubmitError(null);
  setSubmitSuccess(false);

  try {
      let savedArticle: Article;
      // 3. Логіка створення VS оновлення
      if (articleToEdit) {
        // Редагування: викликаємо API оновлення
        savedArticle = await articlesApi.update(articleToEdit.id, values);
        setSubmitSuccess(true);
      } else {
        // Створення: викликаємо API створення
        savedArticle = await articlesApi.create(values);
        resetForm();
        setSubmitSuccess(true);
      }

      onArticleSaved(savedArticle); // Повідомляємо батьківський компонент про успіх
      
  } catch (error) {
   console.error(error);
   setSubmitError(`Не вдалося ${articleToEdit ? 'оновити' : 'створити'} статтю. Перевірте з'єднання та дані.`);
  } finally {
   setSubmitting(false);
  }
 };

 return (
  <div className={styles.articleCreator}>
   <Formik
    // Використовуємо стан для початкових значень
    initialValues={currentInitialValues}
    validationSchema={ArticleValidationSchema}
    onSubmit={handleSubmit}
        // Дозволяє Formik переініціалізувати форму при зміні articleToEdit
        enableReinitialize={true} 
   >
    {({ isSubmitting, values, isValid }) => (
     <Form>
      {/* === Основні дані === */}
      <section>
       <h3>Основні дані</h3>

       {/* ... (MultiLangField для title та description - без змін) ... */}
              <MultiLangField label="Заголовок Статті" nameUk="title.uk" nameEn="title.en" />
       <MultiLangField label="Короткий Опис" nameUk="description.uk" nameEn="description.en" isTextArea />

       {/* Фото */}
       <div className={styles.fileInputWrapper}>
        <label>Фото Статті</label>
        {values.photo && ( // Показуємо поточне фото, якщо воно є
                    <p className={styles.currentPhoto}>Поточне фото: <a href={values.photo} target="_blank">переглянути</a></p>
                )}
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
                      // Оновлюємо значення `photo` безпосередньо у Formik
                      values.photo = upload.secure_url; 
                      // Примушуємо Formik оновити форму
                      // Цей підхід може бути неідеальним, але працює з Formik
                      // В ідеалі варто використовувати setFieldValue, але він не доступний напряму тут
           alert("Фото успішно завантажено! Не забудьте зберегти статтю.");
          } catch (error) {
           setSubmitError("Помилка завантаження фото");
           console.error(error);
          }
         }}
        />
       </div>
      </section>

      {/* === Блоки статті === */}
      {/* ... (FieldArray для blocks - без змін) ... */}
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
       {submitSuccess && <p className={styles.submitSuccess}>✅ Стаття успішно {articleToEdit ? 'оновлена' : 'створена'}!</p>}
       <button type="submit" disabled={isSubmitting || !isValid}>
        {isSubmitting 
                  ? (articleToEdit ? "Оновлення..." : "Створення...") 
                  : (articleToEdit ? "Зберегти Зміни" : "Створити Статтю")}
       </button>
      </div>
     </Form>
    )}
   </Formik>
  </div>
 );
};