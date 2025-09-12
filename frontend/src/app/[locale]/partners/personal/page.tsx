// src/app/partners/personal/page.tsx

"use client";

import { useEffect, useState } from "react";
import { api } from "@/api/partnersApi";
import { Partner, UpdatePartnerProfileData } from "@/types/partner";
import { getUserIdFromStorage } from "@/components/partners/auth";
import { formatPhoneNumber } from "@/components/partners/formatters";
import PartnerProfileView from "@/components/partners/PartnerProfileView";
import PartnerProfileForm from "@/components/partners/PartnerProfileForm";
import styles from "./page.module.scss";
import { FormikHelpers } from "formik";

export default function PartnerAdminPage() {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    loadPartnerProfile();
  }, []);

  const loadPartnerProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = getUserIdFromStorage();
      if (!userId) {
        throw new Error(
          "Не вдалося отримати ID користувача. Будь ласка, увійдіть знову."
        );
      }
      const response = await api.getPartnerById(userId);
      setPartner(response.data);
    } catch (err: unknown) {
      const e = err as { message?: string; response?: { status?: number } };
      console.error("Помилка завантаження профілю:", e);
      if (e.response?.status === 404) {
        setError("Профіль партнера не знайдено.");
      } else {
        setError(e.message || "Помилка завантаження профілю");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (
    values: UpdatePartnerProfileData,
    { setSubmitting }: FormikHelpers<UpdatePartnerProfileData>
  ) => {
    try {
      setError(null);
      setUpdateSuccess(false);
      if (!partner) throw new Error("Дані партнера відсутні");

      const cleanPhoneNumber = values.phoneNumber?.replace(/\D/g, "");
      const updateData: UpdatePartnerProfileData = {
        ...values,
        phoneNumber: cleanPhoneNumber,
      };

      const response = await api.updatePartner(partner.id, updateData);
      setPartner(response.data);
      setIsEditing(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      console.error("Помилка оновлення профілю:", err);
      setError("Не вдалося оновити профіль");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className={styles.loading}>Завантаження профілю...</div>;
  if (error && !partner) return <div className={styles.error}>{error}</div>;
  if (!partner) return <div className={styles.error}>Дані партнера відсутні</div>;

  const initialValues = {
    firstName: partner.firstName || "",
    lastName: partner.lastName || "",
    phoneNumber: partner.phoneNumber ? formatPhoneNumber(partner.phoneNumber) : "",
    deliveryAddress: partner.deliveryAddress || "",
    photo: partner.photo || "",
    description: partner.description || "",
    socials: {
      facebook: partner.socials?.facebook || "",
      telegram: partner.socials?.telegram || "",
      linkedin: partner.socials?.linkedin || "",
      whatsapp: partner.socials?.whatsapp || "",
    },
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Профіль партнера</h1>
      {updateSuccess && (
        <div className={styles.success}>Профіль успішно оновлено!</div>
      )}
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.card}>
        {!isEditing ? (
          <PartnerProfileView partner={partner} onEdit={() => setIsEditing(true)} />
        ) : (
          <PartnerProfileForm
            initialValues={initialValues}
            onSubmit={handleUpdateProfile}
            onCancel={() => setIsEditing(false)}
          />
        )}
      </div>
    </div>
  );
}



// "use client";

// import { useEffect, useState } from "react";
// import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
// import * as Yup from "yup";
// import styles from "./page.module.scss";
// import { Partner, UpdatePartnerProfileData } from "@/types/partner";
// import { api } from "@/api/partnersApi";

// const validationSchema = Yup.object({
//   firstName: Yup.string()
//     .required("Ім'я обов'язкове")
//     .max(50, "Ім'я занадто довге"),
//   lastName: Yup.string()
//     .required("Прізвище обов'язкове")
//     .max(50, "Прізвище занадто довге"),
//   // Валідація буде перевіряти чистий номер без форматування
//   phoneNumber: Yup.string()
//     .test("isValidPhoneNumber", "Невірний формат телефону", (value) => {
//       if (!value) return true; // Дозволяємо null/порожній
//       const cleaned = value.replace(/\D/g, "");
//       return cleaned.length >= 10 && cleaned.length <= 15;
//     })
//     .nullable(),
//   deliveryAddress: Yup.string().max(200, "Адреса занадто довга").nullable(),
//   description: Yup.string().max(500, "Опис занадто довгий").nullable(),
// });

// // ✅ Оновлена функція форматування
// const formatPhoneNumber = (input: string): string => {
//   const cleaned = input.replace(/\D/g, "");

//   if (cleaned.length === 0) {
//     return "+380";
//   }

//   // Якщо номер вже починається з 380, працюємо з ним, інакше просто повертаємо
//   const digits = cleaned.startsWith("380") ? cleaned.slice(3) : cleaned;
//   let formatted = "+380";

//   if (digits.length >= 1) formatted += ` (${digits.slice(0, 2)}`;
//   if (digits.length >= 3) formatted += `) ${digits.slice(2, 5)}`;
//   if (digits.length >= 6) formatted += `-${digits.slice(5, 7)}`;
//   if (digits.length >= 8) formatted += `-${digits.slice(7, 9)}`;

//   return formatted;
// };

// export default function PartnerAdminPage() {
//   const [partner, setPartner] = useState<Partner | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);
//   const [updateSuccess, setUpdateSuccess] = useState(false);
//   const [avatarFile, setAvatarFile] = useState<File | null>(null);
//   const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

//   useEffect(() => {
//     loadPartnerProfile();
//   }, []);

//   const getUserIdFromStorage = (): string | null => {
//     const storedUserId = localStorage.getItem("userId");
//     if (storedUserId) return storedUserId;
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const payload = JSON.parse(atob(token.split(".")[1]));
//         return payload.id || payload.userId || payload.sub || null;
//       } catch (e) {
//         console.error("Помилка декодування токена:", e);
//       }
//     }
//     return sessionStorage.getItem("userId") || null;
//   };

//   const loadPartnerProfile = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const userId = getUserIdFromStorage();
//       if (!userId)
//         throw new Error(
//           "Не вдалося отримати ID користувача. Будь ласка, увійдіть знову."
//         );
//       const response = await api.getPartnerById(userId);
//       setPartner(response.data);
//     } catch (err: unknown) {
//       const e = err as { message?: string; response?: { status?: number } };
//       console.error("Помилка завантаження профілю:", e);
//       if (e.response?.status === 404) {
//         setError("Профіль партнера не знайдено. Можливо, неправильний ID.");
//       } else {
//         setError(e.message || "Помилка завантаження профілю");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (
//     values: UpdatePartnerProfileData,
//     { setSubmitting }: FormikHelpers<UpdatePartnerProfileData>
//   ) => {
//     try {
//       setError(null);
//       setUpdateSuccess(false);
//       if (!partner) throw new Error("Дані партнера відсутні");

//       const cleanPhoneNumber = values.phoneNumber
//         ? values.phoneNumber.replace(/\D/g, "")
//         : undefined;

//       const updateData: UpdatePartnerProfileData = {
//         ...values,
//         phoneNumber: cleanPhoneNumber,
//         socials: values.socials,
//       };

//       const response = await api.updatePartner(partner.id, updateData);
//       setPartner(response.data);
//       setIsEditing(false);
//       setUpdateSuccess(true);
//       setTimeout(() => setUpdateSuccess(false), 3000);
//     } catch (err) {
//       console.error("Помилка оновлення профілю:", err);
//       setError("Не вдалося оновити профіль");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;
//     setAvatarFile(file);
//     const reader = new FileReader();
//     reader.onload = (e) => setAvatarPreview(e.target?.result as string);
//     reader.readAsDataURL(file);
//   };

//   if (loading)
//     return <div className={styles.loading}>Завантаження профілю...</div>;
//   if (error && !partner) return <div className={styles.error}>{error}</div>;
//   if (!partner)
//     return <div className={styles.error}>Дані партнера відсутні</div>;

//   const initialValues: UpdatePartnerProfileData = {
//     firstName: partner.firstName || "",
//     lastName: partner.lastName || "",
//     phoneNumber: partner.phoneNumber
//       ? formatPhoneNumber(partner.phoneNumber)
//       : "",
//     deliveryAddress: partner.deliveryAddress || "",
//     photo: partner.photo || "",
//     description: partner.description || "",
//     socials: {
//       facebook: partner.socials?.facebook || "",
//       telegram: partner.socials?.telegram || "",
//       linkedin: partner.socials?.linkedin || "",
//       whatsapp: partner.socials?.whatsapp || "",
//     },
//   };

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Профіль партнера</h1>
//       {updateSuccess && (
//         <div className={styles.success}>Профіль успішно оновлено!</div>
//       )}
//       {error && <div className={styles.error}>{error}</div>}
//       <div className={styles.card}>
//         <div className={styles.avatarSection}>
//           <div className={styles.avatarContainer}>
//             {avatarPreview ? (
//               <img
//                 src={avatarPreview}
//                 alt="Новий аватар"
//                 className={styles.avatar}
//               />
//             ) : partner.photo ? (
//               <img
//                 src={partner.photo}
//                 alt="Аватар партнера"
//                 className={styles.avatar}
//               />
//             ) : (
//               <div className={styles.placeholderAvatar}>
//                 {partner.firstName?.charAt(0)}
//                 {partner.lastName?.charAt(0)}
//               </div>
//             )}
//           </div>
//           {isEditing && (
//             <div className={styles.avatarUpload}>
//               <input
//                 type="file"
//                 id="avatar"
//                 accept="image/*"
//                 onChange={handleAvatarChange}
//               />
//               {avatarFile && <span>{avatarFile.name}</span>}
//             </div>
//           )}
//         </div>
//         {!isEditing ? (
//           <>
//             <div className={styles.infoGrid}>
//               <div>
//                 <strong>ID:</strong> {partner.id}
//               </div>
//               <div>
//                 <strong>Email:</strong> {partner.email}
//               </div>
//               <div>
//                 <strong>Ім&apos;я:</strong> {partner.firstName}
//               </div>
//               <div>
//                 <strong>Прізвище:</strong> {partner.lastName}
//               </div>
//               {partner.phoneNumber && (
//                 <div>
//                   <strong>Телефон:</strong>{" "}
//                   {formatPhoneNumber(partner.phoneNumber)}
//                 </div>
//               )}
//               {partner.deliveryAddress && (
//                 <div>
//                   <strong>Адреса доставки:</strong> {partner.deliveryAddress}
//                 </div>
//               )}
//               {partner.description && (
//                 <div>
//                   <strong>Опис:</strong> {partner.description}
//                 </div>
//               )}
//               {partner.socials && (
//                 <div className={styles.socials}>
//                   <strong>Соцмережі:</strong>
//                   <ul>
//                     {partner.socials.facebook && (
//                       <li>
//                         <a
//                           href={partner.socials.facebook}
//                           target="_blank"
//                           rel="noreferrer"
//                         >
//                           Facebook
//                         </a>
//                       </li>
//                     )}
//                     {partner.socials.telegram && (
//                       <li>
//                         <a
//                           href={partner.socials.telegram}
//                           target="_blank"
//                           rel="noreferrer"
//                         >
//                           Telegram
//                         </a>
//                       </li>
//                     )}
//                     {partner.socials.linkedin && (
//                       <li>
//                         <a
//                           href={partner.socials.linkedin}
//                           target="_blank"
//                           rel="noreferrer"
//                         >
//                           LinkedIn
//                         </a>
//                       </li>
//                     )}
//                     {partner.socials.whatsapp && (
//                       <li>
//                         <a
//                           href={partner.socials.whatsapp}
//                           target="_blank"
//                           rel="noreferrer"
//                         >
//                           WhatsApp
//                         </a>
//                       </li>
//                     )}
//                   </ul>
//                 </div>
//               )}
//               {/* <div>
//                 <strong>Роль:</strong> {partner.role}
//               </div> */}
//               {partner.rating !== undefined && (
//                 <div>
//                   <strong>Рейтинг:</strong> {partner.rating}
//                 </div>
//               )}
//               {partner.isBlocked !== undefined && (
//                 <div>
//                   <strong>Статус:</strong>{" "}
//                   <span
//                     className={
//                       partner.isBlocked
//                         ? styles.statusBlocked
//                         : styles.statusActive
//                     }
//                   >
//                     {partner.isBlocked ? " Заблокований" : " Активний"}
//                   </span>
//                 </div>
//               )}
//             </div>

//             <button onClick={() => setIsEditing(true)}>
//               Редагувати профіль
//             </button>
//           </>
//         ) : (
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//             enableReinitialize
//           >
//             {({ isSubmitting, dirty, setFieldValue, values }) => (
//               <Form className={styles.form}>
//                 <div className={styles.formGroup}>
//                   <label htmlFor="firstName" className={styles.label}>
//                     Ім&apos;я
//                   </label>
//                   <Field
//                     name="firstName"
//                     placeholder="Ім'я"
//                     className={styles.input}
//                   />
//                   <ErrorMessage
//                     name="firstName"
//                     component="div"
//                     className={styles.errorText}
//                   />
//                 </div>
//                 <div className={styles.formGroup}>
//                   <label htmlFor="lastName" className={styles.label}>
//                     Прізвище
//                   </label>
//                   <Field
//                     name="lastName"
//                     placeholder="Прізвище"
//                     className={styles.input}
//                   />
//                   <ErrorMessage
//                     name="lastName"
//                     component="div"
//                     className={styles.errorText}
//                   />
//                 </div>
//                 <div className={styles.formGroup}>
//                   <label htmlFor="phoneNumber" className={styles.label}>
//                     Телефон
//                   </label>
//                   <Field
//                     type="tel"
//                     id="phoneNumber"
//                     name="phoneNumber"
//                     className={styles.input}
//                     placeholder="+380 (XX) XXX-XX-XX"
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                       const formatted = formatPhoneNumber(e.target.value);
//                       setFieldValue("phoneNumber", formatted);
//                     }}
//                     // ✅ Використовуємо formatted значення для поля
//                     value={values.phoneNumber || ""}
//                   />
//                   <ErrorMessage
//                     name="phoneNumber"
//                     component="div"
//                     className={styles.errorText}
//                   />
//                 </div>
//                 <div className={styles.formGroup}>
//                   <label htmlFor="deliveryAddress" className={styles.label}>
//                     Адреса доставки
//                   </label>
//                   <Field
//                     name="deliveryAddress"
//                     placeholder="Адреса доставки"
//                     as="textarea"
//                     className={styles.textarea}
//                   />
//                   <ErrorMessage
//                     name="deliveryAddress"
//                     component="div"
//                     className={styles.errorText}
//                   />
//                 </div>
//                 <div className={styles.formGroup}>
//                   <label htmlFor="photo" className={styles.label}>
//                     Посилання на фото
//                   </label>
//                   <Field
//                     name="photo"
//                     placeholder="Фото URL"
//                     className={styles.input}
//                   />
//                   <ErrorMessage
//                     name="photo"
//                     component="div"
//                     className={styles.errorText}
//                   />
//                 </div>
//                 <div className={styles.formGroup}>
//                   <label htmlFor="description" className={styles.label}>
//                     Опис про себе
//                   </label>
//                   <Field
//                     name="description"
//                     placeholder="Опис про себе"
//                     as="textarea"
//                     className={styles.textarea}
//                   />
//                   <ErrorMessage
//                     name="description"
//                     component="div"
//                     className={styles.errorText}
//                   />
//                 </div>
//                 <div className={styles.formGroup}>
//                   <label htmlFor="socials.facebook" className={styles.label}>
//                     Facebook
//                   </label>
//                   <Field
//                     name="socials.facebook"
//                     placeholder="Посилання на Facebook"
//                     className={styles.input}
//                   />
//                 </div>

//                 <div className={styles.formGroup}>
//                   <label htmlFor="socials.telegram" className={styles.label}>
//                     Telegram
//                   </label>
//                   <Field
//                     name="socials.telegram"
//                     placeholder="Посилання на Telegram"
//                     className={styles.input}
//                   />
//                 </div>

//                 <div className={styles.formGroup}>
//                   <label htmlFor="socials.linkedin" className={styles.label}>
//                     LinkedIn
//                   </label>
//                   <Field
//                     name="socials.linkedin"
//                     placeholder="Посилання на LinkedIn"
//                     className={styles.input}
//                   />
//                 </div>

//                 <div className={styles.formGroup}>
//                   <label htmlFor="socials.whatsapp" className={styles.label}>
//                     WhatsApp
//                   </label>
//                   <Field
//                     name="socials.whatsapp"
//                     placeholder="Посилання на WhatsApp"
//                     className={styles.input}
//                   />
//                 </div>

//                 <div className={styles.buttonGroup}>
//                   <button
//                     type="submit"
//                     className={`${styles.button} ${styles.saveButton}`}
//                     disabled={isSubmitting || !dirty}
//                   >
//                     Зберегти
//                   </button>
//                   <button
//                     type="button"
//                     className={`${styles.button} ${styles.cancelButton}`}
//                     onClick={() => {
//                       setIsEditing(false);
//                       setAvatarFile(null);
//                       setAvatarPreview(null);
//                     }}
//                   >
//                     Скасувати
//                   </button>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         )}
//       </div>
//     </div>
//   );
// }
