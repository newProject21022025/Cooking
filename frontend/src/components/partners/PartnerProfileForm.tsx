// src/components/partners/PartnerProfileForm.tsx

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { UpdatePartnerProfileData } from "@/types/partner";
import { formatPhoneNumber } from "./formatters";
import styles from "@/app/[locale]/partners/personal/page.module.scss";
import { useState } from "react";
import { changePartnerPassword } from "@/api/partnersApi"; // новий API для зміни пароля

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

// Валідація для зміни пароля
const passwordValidationSchema = Yup.object({
  currentPassword: Yup.string().required("Поточний пароль обов'язковий"),
  newPassword: Yup.string().min(5, "Мінімум 5 символів").required("Новий пароль обов'язковий"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Паролі не збігаються")
    .required("Підтвердіть пароль"),
});

interface PartnerProfileFormProps {
  initialValues: UpdatePartnerProfileData;
  onSubmit: (values: UpdatePartnerProfileData, helpers: FormikHelpers<UpdatePartnerProfileData>) => void;
  onCancel: () => void;
}

export default function PartnerProfileForm({ initialValues, onSubmit, onCancel }: PartnerProfileFormProps) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handlePasswordChange = async (
    values: { currentPassword: string; newPassword: string; confirmPassword: string },
    helpers: FormikHelpers<{ currentPassword: string; newPassword: string; confirmPassword: string }>
  ) => {
    try {
      setPasswordError(null);
      setPasswordSuccess(false);
  
      // 💡 Отримайте id партнера. Припустимо, він є в initialValues.
      const partnerId = initialValues.id;
      if (!partnerId) {
        throw new Error("Не знайдено ID партнера.");
      }
  
      await changePartnerPassword(partnerId, values.currentPassword, values.newPassword);
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
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ isSubmitting, dirty, setFieldValue, values }) => (
          <Form className={styles.form}>
            {/* Аватар */}
            <div className={styles.avatarSection}>
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
              <div className={styles.avatarUpload}>
                <input type="file" accept="image/*" onChange={handleAvatarChange} />
                {avatarFile && <span>{avatarFile.name}</span>}
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
                placeholder="+380 (XX) XXX-XX-XX"
                className={styles.input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue("phoneNumber", formatPhoneNumber(e.target.value));
                }}
                value={values.phoneNumber || ""}
              />
              <ErrorMessage name="phoneNumber" component="div" className={styles.errorText} />
            </div>

            <div className={styles.formGroup}>
              <label>Адреса доставки</label>
              <Field name="deliveryAddress" as="textarea" className={styles.textarea} />
              <ErrorMessage name="deliveryAddress" component="div" className={styles.errorText} />
            </div>

            <div className={styles.formGroup}>
              <label>Опис про себе</label>
              <Field name="description" as="textarea" className={styles.textarea} />
              <ErrorMessage name="description" component="div" className={styles.errorText} />
            </div>

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


// import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
// import * as Yup from "yup";
// import { UpdatePartnerProfileData } from "@/types/partner";
// import { formatPhoneNumber } from "./formatters";
// import styles from "@/app/[locale]/partners/personal/page.module.scss";
// import { useState } from "react";

// const validationSchema = Yup.object({
//   firstName: Yup.string().required("Ім'я обов'язкове").max(50, "Ім'я занадто довге"),
//   lastName: Yup.string().required("Прізвище обов'язкове").max(50, "Прізвище занадто довге"),
//   phoneNumber: Yup.string()
//     .test("isValidPhoneNumber", "Невірний формат телефону", (value) => {
//       if (!value) return true;
//       const cleaned = value.replace(/\D/g, "");
//       return cleaned.length >= 10 && cleaned.length <= 15;
//     })
//     .nullable(),
//   deliveryAddress: Yup.string().max(200, "Адреса занадто довга").nullable(),
//   description: Yup.string().max(500, "Опис занадто довгий").nullable(),
// });

// interface PartnerProfileFormProps {
//   initialValues: UpdatePartnerProfileData;
//   onSubmit: (values: UpdatePartnerProfileData, helpers: FormikHelpers<UpdatePartnerProfileData>) => void;
//   onCancel: () => void;
// }

// export default function PartnerProfileForm({ initialValues, onSubmit, onCancel }: PartnerProfileFormProps) {
//   const [avatarFile, setAvatarFile] = useState<File | null>(null);
//   const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

//   const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;
//     setAvatarFile(file);
//     const reader = new FileReader();
//     reader.onload = (e) => setAvatarPreview(e.target?.result as string);
//     reader.readAsDataURL(file);
//   };

//   return (
//     <Formik
//       initialValues={initialValues}
//       validationSchema={validationSchema}
//       onSubmit={onSubmit}
//       enableReinitialize
//     >
//       {({ isSubmitting, dirty, setFieldValue, values }) => (
//         <Form className={styles.form}>
//           <div className={styles.avatarSection}>
//             {/* Логіка відображення аватара */}
//             <div className={styles.avatarContainer}>
//               {avatarPreview ? (
//                 <img src={avatarPreview} alt="Новий аватар" className={styles.avatar} />
//               ) : initialValues.photo ? (
//                 <img src={initialValues.photo} alt="Аватар партнера" className={styles.avatar} />
//               ) : (
//                 <div className={styles.placeholderAvatar}>
//                   {values.firstName?.charAt(0)}
//                   {values.lastName?.charAt(0)}
//                 </div>
//               )}
//             </div>
//             {/* Завантаження нового аватара */}
//             <div className={styles.avatarUpload}>
//               <input
//                 type="file"
//                 id="avatar"
//                 accept="image/*"
//                 onChange={handleAvatarChange}
//               />
//               {avatarFile && <span>{avatarFile.name}</span>}
//             </div>
//           </div>
          
//           <div className={styles.formGroup}>
//             <label htmlFor="firstName" className={styles.label}>Ім&apos;я</label>
//             <Field name="firstName" placeholder="Ім'я" className={styles.input} />
//             <ErrorMessage name="firstName" component="div" className={styles.errorText} />
//           </div>

//           <div className={styles.formGroup}>
//             <label htmlFor="lastName" className={styles.label}>Прізвище</label>
//             <Field name="lastName" placeholder="Прізвище" className={styles.input} />
//             <ErrorMessage name="lastName" component="div" className={styles.errorText} />
//           </div>

//           <div className={styles.formGroup}>
//             <label htmlFor="phoneNumber" className={styles.label}>Телефон</label>
//             <Field
//               type="tel"
//               id="phoneNumber"
//               name="phoneNumber"
//               className={styles.input}
//               placeholder="+380 (XX) XXX-XX-XX"
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                 const formatted = formatPhoneNumber(e.target.value);
//                 setFieldValue("phoneNumber", formatted);
//               }}
//               value={values.phoneNumber || ""}
//             />
//             <ErrorMessage name="phoneNumber" component="div" className={styles.errorText} />
//           </div>
          
//           <div className={styles.formGroup}>
//             <label htmlFor="deliveryAddress" className={styles.label}>Адреса доставки</label>
//             <Field name="deliveryAddress" placeholder="Адреса доставки" as="textarea" className={styles.textarea} />
//             <ErrorMessage name="deliveryAddress" component="div" className={styles.errorText} />
//           </div>

//           <div className={styles.formGroup}>
//             <label htmlFor="description" className={styles.label}>Опис про себе</label>
//             <Field name="description" placeholder="Опис про себе" as="textarea" className={styles.textarea} />
//             <ErrorMessage name="description" component="div" className={styles.errorText} />
//           </div>

//           <div className={styles.formGroup}>
//             <label htmlFor="photo" className={styles.label}>Посилання на фото</label>
//             <Field name="photo" placeholder="Фото URL" className={styles.input} />
//             <ErrorMessage name="photo" component="div" className={styles.errorText} />
//           </div>

//           <div className={styles.formGroup}>
//             <label htmlFor="socials.facebook" className={styles.label}>Facebook</label>
//             <Field name="socials.facebook" placeholder="Посилання на Facebook" className={styles.input} />
//           </div>

//           <div className={styles.formGroup}>
//             <label htmlFor="socials.telegram" className={styles.label}>Telegram</label>
//             <Field name="socials.telegram" placeholder="Посилання на Telegram" className={styles.input} />
//           </div>

//           <div className={styles.formGroup}>
//             <label htmlFor="socials.linkedin" className={styles.label}>LinkedIn</label>
//             <Field name="socials.linkedin" placeholder="Посилання на LinkedIn" className={styles.input} />
//           </div>

//           <div className={styles.formGroup}>
//             <label htmlFor="socials.whatsapp" className={styles.label}>WhatsApp</label>
//             <Field name="socials.whatsapp" placeholder="Посилання на WhatsApp" className={styles.input} />
//           </div>

//           <div className={styles.buttonGroup}>
//             <button
//               type="submit"
//               className={`${styles.button} ${styles.saveButton}`}
//               disabled={isSubmitting || !dirty}
//             >
//               Зберегти
//             </button>
//             <button
//               type="button"
//               className={`${styles.button} ${styles.cancelButton}`}
//               onClick={onCancel}
//             >
//               Скасувати
//             </button>
//           </div>
//         </Form>
//       )}
//     </Formik>
//   );
// }