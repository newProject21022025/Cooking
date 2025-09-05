// src/app/partners/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import styles from "./page.module.scss";
import { Partner, UpdatePartnerProfileData } from "@/types/partner";
import { api } from "@/api/partnersApi";

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("Ім&apos;я обов'язкове")
    .max(50, "Ім&apos;я занадто довге"),
  lastName: Yup.string()
    .required("Прізвище обов'язкове")
    .max(50, "Прізвище занадто довге"),
  phoneNumber: Yup.string()
    .matches(/^\+?[0-9]{10,15}$/, "Невірний формат телефону")
    .nullable(),
  deliveryAddress: Yup.string().max(200, "Адреса занадто довга").nullable(),
});

export default function PartnerAdminPage() {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    loadPartnerProfile();
  }, []);

  const getUserIdFromStorage = (): string | null => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) return storedUserId;

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.id || payload.userId || payload.sub || null;
      } catch (e) {
        console.error("Помилка декодування токена:", e);
      }
    }

    return sessionStorage.getItem("userId") || null;
  };

  const loadPartnerProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = getUserIdFromStorage();
      if (!userId) throw new Error("Не вдалося отримати ID користувача. Будь ласка, увійдіть знову.");

      const response = await api.getPartnerById(userId);
      setPartner(response.data);
    } catch (err: unknown) {
      const e = err as { message?: string; response?: { status?: number } };
      console.error("Помилка завантаження профілю:", e);
      if (e.response?.status === 404) {
        setError("Профіль партнера не знайдено. Можливо, неправильний ID.");
      } else {
        setError(e.message || "Помилка завантаження профілю");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
    values: UpdatePartnerProfileData,
    { setSubmitting, setErrors }: FormikHelpers<UpdatePartnerProfileData>
  ) => {
    try {
      setError(null);
      setUpdateSuccess(false);

      if (!partner) throw new Error("Дані партнера відсутні");

      const response = await api.updatePartner(partner.id, values);
      setPartner(response.data);
      setIsEditing(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err: unknown) {
      const e = err as { message?: string; response?: { data?: { errors?: Record<string, string[]> }; status?: number } };
      console.error("Помилка оновлення профілю:", e);

      if (e.response?.status === 404) {
        setError("Профіль партнера не знайдено. Можливо, неправильний ID.");
      } else if (e.response?.data?.errors) {
        const backendErrors = e.response.data.errors;
        const formikErrors: Record<string, string> = {};
        Object.keys(backendErrors).forEach((key) => {
          formikErrors[key] = backendErrors[key].join(", ");
        });
        setErrors(formikErrors);
      } else {
        setError(e.message || "Помилка оновлення профілю");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  if (loading) return <div className={styles.loading}>Завантаження профілю...</div>;
  if (error && !partner) return <div className={styles.error}>{error}</div>;
  if (!partner) return <div className={styles.error}>Дані партнера відсутні</div>;

  const initialValues: UpdatePartnerProfileData = {
    firstName: partner.firstName || "",
    lastName: partner.lastName || "",
    phoneNumber: partner.phoneNumber || "",
    deliveryAddress: partner.deliveryAddress || "",
    photo: partner.photo || "",
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Профіль партнера</h1>

      {updateSuccess && <div className={styles.success}>Профіль успішно оновлено!</div>}
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.card}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarContainer}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="Новий аватар" className={styles.avatar} />
            ) : partner.photo ? (
              <img src={partner.photo} alt="Аватар партнера" className={styles.avatar} />
            ) : (
              <div className={styles.placeholderAvatar}>
                {partner.firstName?.charAt(0)}
                {partner.lastName?.charAt(0)}
              </div>
            )}
          </div>

          {isEditing && (
            <div className={styles.avatarUpload}>
              <input type="file" id="avatar" accept="image/*" onChange={handleAvatarChange} />
              {avatarFile && <span>{avatarFile.name}</span>}
            </div>
          )}
        </div>

        {!isEditing ? (
          <>
            <div className={styles.infoGrid}>
              <div><strong>ID:</strong> {partner.id}</div>
              <div><strong>Email:</strong> {partner.email}</div>
              <div><strong>Ім'я:</strong> {partner.firstName}</div>
              <div><strong>Прізвище:</strong> {partner.lastName}</div>
              {partner.phoneNumber && <div><strong>Телефон:</strong> {partner.phoneNumber}</div>}
              {partner.deliveryAddress && <div><strong>Адреса доставки:</strong> {partner.deliveryAddress}</div>}
              <div><strong>Роль:</strong> {partner.role}</div>
              {partner.rating !== undefined && <div><strong>Рейтинг:</strong> {partner.rating}</div>}
              {partner.isBlocked !== undefined && (
                <div>
                  <strong>Статус:</strong>{" "}
                  <span className={partner.isBlocked ? styles.statusBlocked : styles.statusActive}>
                    {partner.isBlocked ? " Заблокований" : " Активний"}
                  </span>
                </div>
              )}
            </div>
            <button onClick={() => setIsEditing(true)}>Редагувати профіль</button>
          </>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, dirty }) => (
              <Form>
                <Field name="firstName" placeholder="Ім'я" />
                <ErrorMessage name="firstName" component="div" />
                <Field name="lastName" placeholder="Прізвище" />
                <ErrorMessage name="lastName" component="div" />
                <Field name="phoneNumber" placeholder="Телефон" />
                <ErrorMessage name="phoneNumber" component="div" />
                <Field name="deliveryAddress" placeholder="Адреса доставки" as="textarea" />
                <ErrorMessage name="deliveryAddress" component="div" />
                <Field name="photo" placeholder="Фото URL" />
                <div>
                  <button type="submit" disabled={isSubmitting || !dirty}>
                    Зберегти
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setAvatarFile(null);
                      setAvatarPreview(null);
                    }}
                  >
                    Скасувати
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
}


// "use client";
// import { useEffect, useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import styles from "./page.module.scss";
// import { Partner, UpdatePartnerProfileData } from "@/types/partner";
// import { api } from "@/api/partnersApi";

// // Схема валідації для Formik
// const validationSchema = Yup.object({
//   firstName: Yup.string()
//     .required("Ім'я обов'язкове")
//     .max(50, "Ім'я занадто довге"),
//   lastName: Yup.string()
//     .required("Прізвище обов'язкове")
//     .max(50, "Прізвище занадто довге"),
//   phoneNumber: Yup.string()
//     .matches(/^\+?[0-9]{10,15}$/, "Невірний формат телефону")
//     .nullable(),
//   deliveryAddress: Yup.string().max(200, "Адреса занадто довга").nullable(),
// });

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

//   // Функція для отримання ID користувача з різних джерел
//   const getUserIdFromStorage = (): string | null => {
//     // Спосіб 1: Безпосередньо з localStorage (якщо зберігаєте при логіні)
//     const storedUserId = localStorage.getItem('userId');
//     if (storedUserId) return storedUserId;

//     // Спосіб 2: З токена (якщо ID є в токені)
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         return payload.id || payload.userId || payload.sub || null;
//       } catch (e) {
//         console.error("Помилка декодування токена:", e);
//       }
//     }

//     // Спосіб 3: З sessionStorage
//     const sessionUserId = sessionStorage.getItem('userId');
//     if (sessionUserId) return sessionUserId;

//     return null;
//   };

//   const loadPartnerProfile = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Отримуємо ID користувача
//       const userId = getUserIdFromStorage();
      
//       if (!userId) {
//         throw new Error("Не вдалося отримати ID користувача. Будь ласка, увійдіть знову.");
//       }

//       console.log("Отримуємо профіль партнера з ID:", userId);

//       // Використовуємо API для отримання партнера
//       const response = await api.getPartnerById(userId);
//       setPartner(response.data);

//     } catch (err: any) {
//       console.error("Помилка завантаження профілю:", err);
      
//       if (err.response?.status === 404) {
//         setError("Профіль партнера не знайдено. Можливо, неправильний ID.");
//       } else if (err.response?.status === 401) {
//         setError("Необхідно увійти в систему");
//         localStorage.removeItem("token");
//         localStorage.removeItem("userId");
//       } else {
//         setError(err.message || "Помилка завантаження профілю");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (
//     values: UpdatePartnerProfileData,
//     { setSubmitting, setErrors }: any
//   ) => {
//     try {
//       setError(null);
//       setUpdateSuccess(false);

//       if (!partner) {
//         throw new Error("Дані партнера відсутні");
//       }

//       console.log("Оновлюємо партнера з ID:", partner.id, "дані:", values);

//       // Оновлюємо профіль партнера
//       const response = await api.updatePartner(partner.id, values);
//       setPartner(response.data);
      
//       setIsEditing(false);
//       setUpdateSuccess(true);
//       setTimeout(() => setUpdateSuccess(false), 3000);
//     } catch (err: any) {
//       console.error("Помилка оновлення профілю:", err);
//       if (err.response?.status === 404) {
//         setError("Профіль партнера не знайдено. Можливо, неправильний ID.");
//       } else if (err.response?.data?.errors) {
//         const backendErrors = err.response.data.errors;
//         const formikErrors: any = {};
//         Object.keys(backendErrors).forEach((key) => {
//           formikErrors[key] = backendErrors[key].join(", ");
//         });
//         setErrors(formikErrors);
//       } else {
//         setError(err.message || "Помилка оновлення профілю");
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files[0]) {
//       const file = event.target.files[0];
//       setAvatarFile(file);
      
//       // Створюємо попередній перегляд для нового аватара
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setAvatarPreview(e.target?.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   if (loading) {
//     return <div className={styles.loading}>Завантаження профілю...</div>;
//   }

//   if (error && !partner) {
//     return (
//       <div className={styles.container}>
//         <div className={styles.error}>{error}</div>
//         <div className={styles.testSection}>
//           <h3>Увага: Не вдалося завантажити профіль</h3>
//           <p>Можливі причини:</p>
//           <ul>
//             <li>Ви не увійшли в систему</li>
//             <li>Ваш обліковий запис не має прав партнера</li>
//             <li>Профіль партнера не існує</li>
//           </ul>
//           <button 
//             onClick={() => window.location.reload()}
//             className={styles.testButton}
//           >
//             Спробувати знову
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!partner) {
//     return <div className={styles.error}>Дані партнера відсутні</div>;
//   }

//   const initialValues: UpdatePartnerProfileData = {
//     firstName: partner.firstName || "",
//     lastName: partner.lastName || "",
//     phoneNumber: partner.phoneNumber || "",
//     deliveryAddress: partner.deliveryAddress || "",
//     photo: partner.photo || "",
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
//                 {partner.firstName?.charAt(0)}{partner.lastName?.charAt(0)}
//               </div>
//             )}
//           </div>
          
//           {isEditing && (
//             <div className={styles.avatarUpload}>
//               <input
//                 type="file"
//                 id="avatar"
//                 name="avatar"
//                 accept="image/*"
//                 onChange={handleAvatarChange}
//                 className={styles.avatarInput}
//               />
//               <label htmlFor="avatar" className={styles.avatarLabel}>
//                 Змінити аватар
//               </label>
//               {avatarFile && (
//                 <span className={styles.avatarFileName}>
//                   {avatarFile.name}
//                 </span>
//               )}
//             </div>
//           )}
//         </div>
  
//         {!isEditing ? (
//           // Режим перегляду
//           <>
//             <div className={styles.infoGrid}>
//               <div className={styles.infoItem}>
//                 <strong>ID:</strong> {partner.id}
//               </div>
//               <div className={styles.infoItem}>
//                 <strong>Email:</strong> {partner.email}
//               </div>
//               <div className={styles.infoItem}>
//                 <strong>Ім'я:</strong> {partner.firstName}
//               </div>
//               <div className={styles.infoItem}>
//                 <strong>Прізвище:</strong> {partner.lastName}
//               </div>
//               {partner.phoneNumber && (
//                 <div className={styles.infoItem}>
//                   <strong>Телефон:</strong> {partner.phoneNumber}
//                 </div>
//               )}
//               {partner.deliveryAddress && (
//                 <div className={styles.infoItem}>
//                   <strong>Адреса доставки:</strong> {partner.deliveryAddress}
//                 </div>
//               )}
//               <div className={styles.infoItem}>
//                 <strong>Роль:</strong> {partner.role}
//               </div>
//               {partner.rating !== undefined && (
//                 <div className={styles.infoItem}>
//                   <strong>Рейтинг:</strong> {partner.rating}
//                 </div>
//               )}
//               {partner.isBlocked !== undefined && (
//                 <div className={styles.infoItem}>
//                   <strong>Статус:</strong> 
//                   <span className={partner.isBlocked ? styles.statusBlocked : styles.statusActive}>
//                     {partner.isBlocked ? " Заблокований" : " Активний"}
//                   </span>
//                 </div>
//               )}
//             </div>
  
//             <button
//               type="button"
//               className={styles.editButton}
//               onClick={() => setIsEditing(true)}
//             >
//               Редагувати профіль
//             </button>
//           </>
//         ) : (
//           // Режим редагування з Formik
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//             enableReinitialize
//           >
//             {({ isSubmitting, dirty, values, handleChange }) => (
//               <Form className={styles.form}>
//                 <div className={styles.formRow}>
//                   <div className={styles.formGroup}>
//                     <label htmlFor="firstName">Ім'я *</label>
//                     <Field 
//                       type="text" 
//                       id="firstName" 
//                       name="firstName" 
//                       className={styles.input} 
//                     />
//                     <ErrorMessage name="firstName" component="div" className={styles.errorText} />
//                   </div>
  
//                   <div className={styles.formGroup}>
//                     <label htmlFor="lastName">Прізвище *</label>
//                     <Field 
//                       type="text" 
//                       id="lastName" 
//                       name="lastName" 
//                       className={styles.input} 
//                     />
//                     <ErrorMessage name="lastName" component="div" className={styles.errorText} />
//                   </div>
//                 </div>
  
//                 <div className={styles.formGroup}>
//                   <label htmlFor="phoneNumber">Телефон</label>
//                   <Field 
//                     type="text" 
//                     id="phoneNumber" 
//                     name="phoneNumber" 
//                     className={styles.input} 
//                     placeholder="+380501234567" 
//                   />
//                   <ErrorMessage name="phoneNumber" component="div" className={styles.errorText} />
//                 </div>
  
//                 <div className={styles.formGroup}>
//                   <label htmlFor="deliveryAddress">Адреса доставки</label>
//                   <Field 
//                     as="textarea" 
//                     id="deliveryAddress" 
//                     name="deliveryAddress" 
//                     className={styles.textarea} 
//                     rows={3} 
//                   />
//                   <ErrorMessage name="deliveryAddress" component="div" className={styles.errorText} />
//                 </div>
  
//                 <div className={styles.formGroup}>
//                   <label htmlFor="photo">Посилання на фото (якщо не завантажуєте файл)</label>
//                   <Field
//                     type="text"
//                     id="photo"
//                     name="photo"
//                     className={styles.input}
//                     placeholder="https://example.com/photo.jpg"
//                   />
//                 </div>
  
//                 <div className={styles.buttonGroup}>
//                   <button 
//                     type="submit" 
//                     className={styles.saveButton} 
//                     disabled={isSubmitting || !dirty}
//                   >
//                     {isSubmitting ? "Збереження..." : "Зберегти зміни"}
//                   </button>
  
//                   <button 
//                     type="button" 
//                     className={styles.cancelButton} 
//                     onClick={() => {
//                       setIsEditing(false);
//                       setAvatarFile(null);
//                       setAvatarPreview(null);
//                     }} 
//                     disabled={isSubmitting}
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