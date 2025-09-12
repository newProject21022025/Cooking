// src/components/partners/PartnerProfileForm.tsx
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { UpdatePartnerProfileData } from "@/types/partner";
import { formatPhoneNumber } from "./formatters";
import styles from "@/app/[locale]/partners/personal/page.module.scss";
import { useState } from "react";

const validationSchema = Yup.object({
  firstName: Yup.string().required("Ім'я обов'язкове").max(50, "Ім'я занадто довге"),
  lastName: Yup.string().required("Прізвище обов'язкове").max(50, "Прізвище занадто довге"),
  phoneNumber: Yup.string()
    .test("isValidPhoneNumber", "Невірний формат телефону", (value) => {
      if (!value) return true;
      const cleaned = value.replace(/\D/g, "");
      return cleaned.length >= 10 && cleaned.length <= 15;
    })
    .nullable(),
  deliveryAddress: Yup.string().max(200, "Адреса занадто довга").nullable(),
  description: Yup.string().max(500, "Опис занадто довгий").nullable(),
});

interface PartnerProfileFormProps {
  initialValues: UpdatePartnerProfileData;
  onSubmit: (values: UpdatePartnerProfileData, helpers: FormikHelpers<UpdatePartnerProfileData>) => void;
  onCancel: () => void;
}

export default function PartnerProfileForm({ initialValues, onSubmit, onCancel }: PartnerProfileFormProps) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isSubmitting, dirty, setFieldValue, values }) => (
        <Form className={styles.form}>
          <div className={styles.avatarSection}>
            {/* Логіка відображення аватара */}
            <div className={styles.avatarContainer}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="Новий аватар" className={styles.avatar} />
              ) : initialValues.photo ? (
                <img src={initialValues.photo} alt="Аватар партнера" className={styles.avatar} />
              ) : (
                <div className={styles.placeholderAvatar}>
                  {values.firstName?.charAt(0)}
                  {values.lastName?.charAt(0)}
                </div>
              )}
            </div>
            {/* Завантаження нового аватара */}
            <div className={styles.avatarUpload}>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              {avatarFile && <span>{avatarFile.name}</span>}
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="firstName" className={styles.label}>Ім&apos;я</label>
            <Field name="firstName" placeholder="Ім'я" className={styles.input} />
            <ErrorMessage name="firstName" component="div" className={styles.errorText} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastName" className={styles.label}>Прізвище</label>
            <Field name="lastName" placeholder="Прізвище" className={styles.input} />
            <ErrorMessage name="lastName" component="div" className={styles.errorText} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phoneNumber" className={styles.label}>Телефон</label>
            <Field
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              className={styles.input}
              placeholder="+380 (XX) XXX-XX-XX"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const formatted = formatPhoneNumber(e.target.value);
                setFieldValue("phoneNumber", formatted);
              }}
              value={values.phoneNumber || ""}
            />
            <ErrorMessage name="phoneNumber" component="div" className={styles.errorText} />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="deliveryAddress" className={styles.label}>Адреса доставки</label>
            <Field name="deliveryAddress" placeholder="Адреса доставки" as="textarea" className={styles.textarea} />
            <ErrorMessage name="deliveryAddress" component="div" className={styles.errorText} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>Опис про себе</label>
            <Field name="description" placeholder="Опис про себе" as="textarea" className={styles.textarea} />
            <ErrorMessage name="description" component="div" className={styles.errorText} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="photo" className={styles.label}>Посилання на фото</label>
            <Field name="photo" placeholder="Фото URL" className={styles.input} />
            <ErrorMessage name="photo" component="div" className={styles.errorText} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="socials.facebook" className={styles.label}>Facebook</label>
            <Field name="socials.facebook" placeholder="Посилання на Facebook" className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="socials.telegram" className={styles.label}>Telegram</label>
            <Field name="socials.telegram" placeholder="Посилання на Telegram" className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="socials.linkedin" className={styles.label}>LinkedIn</label>
            <Field name="socials.linkedin" placeholder="Посилання на LinkedIn" className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="socials.whatsapp" className={styles.label}>WhatsApp</label>
            <Field name="socials.whatsapp" placeholder="Посилання на WhatsApp" className={styles.input} />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={`${styles.button} ${styles.saveButton}`}
              disabled={isSubmitting || !dirty}
            >
              Зберегти
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={onCancel}
            >
              Скасувати
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}