// src/components/partners/PartnerProfileForm.tsx
"use client";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { uploadToCloudinary } from "@/api/cloudinaryApi";
import { changePartnerPassword } from "@/api/partnersApi";
import styles from "./PartnerProfileForm.module.scss";
import { useState } from "react";
import { PartnerProfileFormValues } from "@/app/[locale]/partners/personal/page";

// Валідація форми
const validationSchema = Yup.object({
  firstName: Yup.string().max(50, "Ім'я занадто довге").nullable(),
  lastName: Yup.string().max(50, "Прізвище занадто довге").nullable(),
  phoneNumber: Yup.string()
    .test("isValidPhoneNumber", "Невірний формат телефону", (value) => {
      if (!value) return true;
      const cleaned = value.replace(/\D/g, "");
      return cleaned.length >= 10 && cleaned.length <= 15;
    })
    .nullable(),
  deliveryAddressUk: Yup.string().max(200).nullable(),
  deliveryAddressEn: Yup.string().max(200).nullable(),
  descriptionUk: Yup.string().max(500).nullable(),
  descriptionEn: Yup.string().max(500).nullable(),
  socials: Yup.object({
    facebook: Yup.string().url("Невірний URL").nullable(),
    telegram: Yup.string().url("Невірний URL").nullable(),
    linkedin: Yup.string().url("Невірний URL").nullable(),
    whatsapp: Yup.string().url("Невірний URL").nullable(),
  }),
});

// Валідація зміни пароля
const passwordValidationSchema = Yup.object({
  currentPassword: Yup.string().required("Поточний пароль обов'язковий"),
  newPassword: Yup.string().min(5, "Мінімум 5 символів").required("Новий пароль обов'язковий"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Паролі не збігаються")
    .required("Підтвердіть пароль"),
});

interface PartnerProfileFormProps {
  initialValues: PartnerProfileFormValues;
  onSubmit: (
    values: PartnerProfileFormValues,
    helpers: FormikHelpers<PartnerProfileFormValues>
  ) => void;
  onCancel: () => void;
}

export default function PartnerProfileForm({
  initialValues,
  onSubmit,
  onCancel,
}: PartnerProfileFormProps) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
    const reader = new FileReader();
    reader.onload = (event) => setPreview(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handlePasswordChange = async (
    values: { currentPassword: string; newPassword: string; confirmPassword: string },
    helpers: FormikHelpers<{ currentPassword: string; newPassword: string; confirmPassword: string }>
  ) => {
    try {
      setPasswordError(null);
      setPasswordSuccess(false);

      if (!initialValues.id) throw new Error("Не знайдено ID партнера.");

      await changePartnerPassword(initialValues.id, values.currentPassword, values.newPassword);
      setPasswordSuccess(true);
      helpers.resetForm();
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setPasswordError(e.message || "Помилка при зміні пароля");
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, helpers) => {
          try {
            // Завантаження аватару/фото
            if (avatarFile) {
              const result = await uploadToCloudinary(avatarFile);
              values.avatar = result.secure_url;
            } else if (values.avatar === "") values.avatar = null;

            if (photoFile) {
              const result = await uploadToCloudinary(photoFile);
              values.photo = result.secure_url;
            } else if (values.photo === "") values.photo = null;

            // Викликаємо onSubmit з PartnerProfileFormValues
            await onSubmit(values, helpers);
          } catch (e) {
            helpers.setStatus({ error: "Помилка завантаження зображень. Спробуйте пізніше." });
            console.error(e);
            helpers.setSubmitting(false);
          }
        }}
        enableReinitialize
      >
        {({ isSubmitting, dirty, setFieldValue, values }) => (
          <Form className={styles.form}>
            {/* Аватар */}
            <div className={styles.avatarSection}>
              <div className={styles.avatarContainer}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Новий аватар" className={styles.avatar} />
                ) : initialValues.avatar ? (
                  <img src={initialValues.avatar} alt="Аватар партнера" className={styles.avatar} />
                ) : (
                  <div className={styles.placeholderAvatar}>
                    {values.firstName?.charAt(0) || ""}
                    {values.lastName?.charAt(0) || ""}
                  </div>
                )}
              </div>
              <div className={styles.avatarUpload}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setAvatarFile, setAvatarPreview)}
                />
                {avatarFile && <span>{avatarFile.name}</span>}
              </div>
            </div>

            {/* Фото */}
            <div className={styles.photoSection}>
              <div className={styles.photoContainer}>
                {photoPreview ? (
                  <img src={photoPreview} alt="Нове фото партнера" className={styles.photo} />
                ) : initialValues.photo ? (
                  <img src={initialValues.photo} alt="Фото партнера" className={styles.photo} />
                ) : (
                  <div className={styles.placeholderAvatar}>
                    {values.firstName?.charAt(0) || ""}
                    {values.lastName?.charAt(0) || ""}
                  </div>
                )}
              </div>
              <div className={styles.photoUpload}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setPhotoFile, setPhotoPreview)}
                />
                {photoFile && <span>{photoFile.name}</span>}
              </div>
            </div>

            {/* Поля профілю */}
            <div className={styles.formGroup}>
              <label>Ім'я</label>
              <Field name="firstName" placeholder="Ім'я" className={styles.input} />
              <ErrorMessage name="firstName" component="div" className={styles.errorText} />
            </div>

            <div className={styles.formGroup}>
              <label>Прізвище</label>
              <Field name="lastName" placeholder="Прізвище" className={styles.input} />
              <ErrorMessage name="lastName" component="div" className={styles.errorText} />
            </div>

            <div className={styles.formGroup}>
              <label>Телефон</label>
              <Field
                type="tel"
                name="phoneNumber"
                className={styles.input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFieldValue("phoneNumber", e.target.value)
                }
                value={values.phoneNumber || ""}
              />
              <ErrorMessage name="phoneNumber" component="div" className={styles.errorText} />
            </div>

            {/* Двомовна адреса */}
            <div className={styles.formGroup}>
              <label>Адреса доставки (укр)</label>
              <Field name="deliveryAddressUk" as="textarea" className={styles.textarea} />
              <ErrorMessage name="deliveryAddressUk" component="div" className={styles.errorText} />
            </div>
            <div className={styles.formGroup}>
              <label>Адреса доставки (англ)</label>
              <Field name="deliveryAddressEn" as="textarea" className={styles.textarea} />
              <ErrorMessage name="deliveryAddressEn" component="div" className={styles.errorText} />
            </div>

            {/* Двомовний опис */}
            <div className={styles.formGroup}>
              <label>Опис (укр)</label>
              <Field name="descriptionUk" as="textarea" className={styles.textarea} />
              <ErrorMessage name="descriptionUk" component="div" className={styles.errorText} />
            </div>
            <div className={styles.formGroup}>
              <label>Опис (англ)</label>
              <Field name="descriptionEn" as="textarea" className={styles.textarea} />
              <ErrorMessage name="descriptionEn" component="div" className={styles.errorText} />
            </div>

            {/* Соцмережі */}
            <div className={styles.socialsSection}>
              <h3>Соцмережі</h3>
              {["facebook", "telegram", "linkedin", "whatsapp"].map((social) => (
                <div key={social} className={styles.formGroup}>
                  <label>{social.charAt(0).toUpperCase() + social.slice(1)}</label>
                  <Field
                    name={`socials.${social}`}
                    placeholder={`https://${social}.com/...`}
                    className={styles.input}
                  />
                  <ErrorMessage name={`socials.${social}`} component="div" className={styles.errorText} />
                </div>
              ))}
            </div>

            {/* Кнопки */}
            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.saveButton} disabled={isSubmitting || !dirty}>
                Зберегти
              </button>
              <button type="button" className={styles.cancelButton} onClick={onCancel}>
                Скасувати
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {/* Форма зміни пароля */}
      <div className={styles.passwordCard}>
        <h2>Змінити пароль</h2>
        {passwordSuccess && <div className={styles.success}>Пароль успішно змінено!</div>}
        {passwordError && <div className={styles.error}>{passwordError}</div>}

        <Formik
          initialValues={{ currentPassword: "", newPassword: "", confirmPassword: "" }}
          validationSchema={passwordValidationSchema}
          onSubmit={handlePasswordChange}
        >
          {({ isSubmitting }) => (
            <Form className={styles.form}>
              <div className={styles.formGroup}>
                <label>Поточний пароль</label>
                <Field type="password" name="currentPassword" className={styles.input} />
                <ErrorMessage name="currentPassword" component="div" className={styles.errorText} />
              </div>

              <div className={styles.formGroup}>
                <label>Новий пароль</label>
                <Field type="password" name="newPassword" className={styles.input} />
                <ErrorMessage name="newPassword" component="div" className={styles.errorText} />
              </div>

              <div className={styles.formGroup}>
                <label>Підтвердіть пароль</label>
                <Field type="password" name="confirmPassword" className={styles.input} />
                <ErrorMessage name="confirmPassword" component="div" className={styles.errorText} />
              </div>

              <button type="submit" className={styles.saveButton} disabled={isSubmitting}>
                {isSubmitting ? "Збереження..." : "Змінити пароль"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
