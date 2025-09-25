// src/components/CommentForm/CommentForm.tsx

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addComment } from '@/api/commentsApi';
import styles from './CommentForm.module.scss';
import { useLocale } from 'next-intl';

// Інтерфейс для початкових значень форми
interface FormValues {
  commentText: string;
  rating: number;
}

// Інтерфейс для властивостей компонента
interface CommentFormProps {
  dishId: number;
  onCommentAdded: () => void; // Функція, що викликається після успішної відправки
}

// Схема валідації за допомогою Yup
const validationSchema = Yup.object({
  commentText: Yup.string()
    .trim()
    .min(10, 'Коментар має бути не менше 10 символів.')
    .max(500, 'Коментар не може перевищувати 500 символів.')
    .required('Текст коментаря обов\'язковий.'),
  rating: Yup.number()
    .min(0, 'Рейтинг має бути не менше 0.')
    .max(5, 'Рейтинг має бути не більше 5.')
    .required('Рейтинг обов\'язковий.'),
});

const CommentForm: React.FC<CommentFormProps> = ({ dishId, onCommentAdded }) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const locale = useLocale();

  const formik = useFormik<FormValues>({
    initialValues: {
      commentText: '',
      rating: 0,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitError(null);
      try {
        await addComment({
          dish_id: dishId,
          comment_text: values.commentText,
          rating: values.rating,
        });
        resetForm(); // Очищаємо форму після успішної відправки
        onCommentAdded(); // Повідомляємо батьківський компонент про успіх
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("Щось пішло не так:", msg);        
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className={styles.commentFormContainer}>
      <h3>{locale === 'uk' ? 'Залишити коментар' : 'Leave a comment'}</h3>
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="commentText" className={styles.label}>
            {locale === 'uk' ? 'Коментар' : 'Comment'}
          </label>
          <textarea
            id="commentText"
            name="commentText"
            className={styles.textarea}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.commentText}
            rows={4}
          />
          {formik.touched.commentText && formik.errors.commentText ? (
            <div className={styles.error}>{formik.errors.commentText}</div>
          ) : null}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="rating" className={styles.label}>
            {locale === 'uk' ? 'Рейтинг (0-5)' : 'Rating (0-5)'}
          </label>
          <input
            id="rating"
            name="rating"
            type="number"
            className={styles.input}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.rating}
            min="0"
            max="5"
          />
          {formik.touched.rating && formik.errors.rating ? (
            <div className={styles.error}>{formik.errors.rating}</div>
          ) : null}
        </div>

        {submitError && <div className={styles.submitError}>{submitError}</div>}
        
        <button
          type="submit"
          className={styles.submitButton}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Відправка...' : 'Надіслати'}
        </button>
      </form>
    </div>
  );
};

export default CommentForm;