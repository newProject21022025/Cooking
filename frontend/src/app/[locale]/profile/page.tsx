// src/app/[locale]/profile/page.tsx

"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import styles from "./page.module.scss";
import { User, UpdateUserProfileData } from "@/types/user";
import { getCurrentUserProfile, updateCurrentUserProfile } from "@/api/usersApi";

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("Ім&apos;я обов&apos;язкове")
    .max(50, "Ім&apos;я занадто довге"),
  lastName: Yup.string()
    .required("Прізвище обов&apos;язкове")
    .max(50, "Прізвище занадто довге"),
  phoneNumber: Yup.string()
    .matches(/^\+?[0-9]{10,15}$/, "Невірний формат телефону")
    .nullable(),
  deliveryAddress: Yup.string().max(200, "Адреса занадто довга").nullable(),
});

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getCurrentUserProfile();
      setUser(userData);
    } catch (err: unknown) {
      const e = err as { message?: string; response?: { status?: number } };
      console.error("Помилка завантаження профілю:", e);
      setError(e.message || "Помилка завантаження профілю");

      if (e.response?.status === 401) {
        localStorage.removeItem("token");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
    values: UpdateUserProfileData,
    { setSubmitting, setErrors }: FormikHelpers<UpdateUserProfileData>
  ) => {
    try {
      setError(null);
      setUpdateSuccess(false);
      if (!user) throw new Error("Дані користувача відсутні");

      const updatedUser = await updateCurrentUserProfile(values);
      setUser(updatedUser);
      setIsEditing(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err: unknown) {
      const e = err as { message?: string; response?: { data?: { errors?: Record<string, string[]> } } };
      console.error("Помилка оновлення профілю:", e);

      if (e.response?.data?.errors) {
        const backendErrors: Record<string, string[]> = e.response.data.errors;
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

  if (loading) return <div className={styles.loading}>Завантаження профілю...</div>;
  if (error && !user) return <div className={styles.error}>{error}</div>;
  if (!user) return <div className={styles.error}>Дані користувача відсутні</div>;

  const initialValues: UpdateUserProfileData = {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phoneNumber: user.phoneNumber || "",
    deliveryAddress: user.deliveryAddress || "",
    photo: user.photo || "",
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Профіль користувача</h1>

      {updateSuccess && <div className={styles.success}>Профіль успішно оновлено!</div>}
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.card}>
        <div className={styles.avatarContainer}>
          {user.photo ? (
            <img src={user.photo} alt="Аватар користувача" className={styles.avatar} />
          ) : (
            <div className={styles.placeholderAvatar}>Немає фото</div>
          )}
        </div>

        {!isEditing ? (
          <>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Ім&apos;я:</strong> {user.firstName}</p>
            <p><strong>Прізвище:</strong> {user.lastName}</p>
            {user.phoneNumber && <p><strong>Телефон:</strong> {user.phoneNumber}</p>}
            {user.deliveryAddress && <p><strong>Адреса доставки:</strong> {user.deliveryAddress}</p>}
            <p><strong>Роль:</strong> {user.role}</p>
            {user.averageRating !== null && <p><strong>Середній рейтинг:</strong> {user.averageRating}</p>}

            <button type="button" className={styles.editButton} onClick={() => setIsEditing(true)}>
              Редагувати профіль
            </button>
          </>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, dirty, values, handleChange }) => (
              <Form className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">Ім&apos;я</label>
                  <Field type="text" id="firstName" name="firstName" className={styles.input} />
                  <ErrorMessage name="firstName" component="div" className={styles.errorText} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="lastName">Прізвище</label>
                  <Field type="text" id="lastName" name="lastName" className={styles.input} />
                  <ErrorMessage name="lastName" component="div" className={styles.errorText} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phoneNumber">Телефон</label>
                  <Field type="text" id="phoneNumber" name="phoneNumber" className={styles.input} placeholder="+380XXXXXXXXX" />
                  <ErrorMessage name="phoneNumber" component="div" className={styles.errorText} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="deliveryAddress">Адреса доставки</label>
                  <Field as="textarea" id="deliveryAddress" name="deliveryAddress" className={styles.textarea} rows={3} />
                  <ErrorMessage name="deliveryAddress" component="div" className={styles.errorText} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="photo">Посилання на фото</label>
                  <input
                    type="text"
                    id="photo"
                    name="photo"
                    value={values.photo || ""}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Вставте URL фото"
                  />
                </div>

                <div className={styles.buttonGroup}>
                  <button type="submit" className={styles.saveButton} disabled={isSubmitting || !dirty}>
                    {isSubmitting ? "Збереження..." : "Зберегти"}
                  </button>

                  <button type="button" className={styles.cancelButton} onClick={() => setIsEditing(false)} disabled={isSubmitting}>
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
// import { User, UpdateUserProfileData } from "@/types/user";
// import {
//   getCurrentUserProfile,
//   updateCurrentUserProfile,
//   uploadUserAvatar,
// } from "@/api/usersApi";

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

// export default function ProfilePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);
//   const [updateSuccess, setUpdateSuccess] = useState(false);
//   const [avatarFile, setAvatarFile] = useState<File | null>(null);

//   useEffect(() => {
//     loadUserProfile();
//   }, []);

//   const loadUserProfile = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const userData = await getCurrentUserProfile();
//       setUser(userData);
//     } catch (err: any) {
//       console.error("Помилка завантаження профілю:", err);
//       setError(err.message || "Помилка завантаження профілю");

//       if (err.response?.status === 401) {
//         localStorage.removeItem("token");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // В функції handleSubmit додаємо завантаження фото
//   const handleSubmit = async (
//     values: UpdateUserProfileData,
//     { setSubmitting, setErrors }: any
//   ) => {
//     try {
//       setError(null);
//       setUpdateSuccess(false);

//       // Якщо в Formik є поле photo, воно автоматично піде в values
//       const updatedUser = await updateCurrentUserProfile(values);

//       setUser(updatedUser);
//       setIsEditing(false);
//       setUpdateSuccess(true);

//       setTimeout(() => setUpdateSuccess(false), 3000);
//     } catch (err: any) {
//       console.error("Помилка оновлення профілю:", err);
//       if (err.response?.data?.errors) {
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

//   if (loading) {
//     return <div className={styles.loading}>Завантаження профілю...</div>;
//   }

//   if (error && !user) {
//     return <div className={styles.error}>{error}</div>;
//   }

//   if (!user) {
//     return <div className={styles.error}>Дані користувача відсутні</div>;
//   }

//   const initialValues: UpdateUserProfileData = {
//     firstName: user.firstName || "",
//     lastName: user.lastName || "",
//     phoneNumber: user.phoneNumber || "",
//     deliveryAddress: user.deliveryAddress || "",
//   };

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Профіль користувача</h1>
  
//       {updateSuccess && (
//         <div className={styles.success}>Профіль успішно оновлено!</div>
//       )}
  
//       {error && <div className={styles.error}>{error}</div>}
  
//       <div className={styles.card}>
//         <div className={styles.avatarContainer}>
//           {user.photo ? (
//             <img
//               src={user.photo}
//               alt="Аватар користувача"
//               className={styles.avatar}
//             />
//           ) : (
//             <div className={styles.placeholderAvatar}>Немає фото</div>
//           )}
//         </div>
  
//         {!isEditing ? (
//           // Режим перегляду
//           <>
//             <p><strong>ID:</strong> {user.id}</p>
//             <p><strong>Email:</strong> {user.email}</p>
//             <p><strong>Ім'я:</strong> {user.firstName}</p>
//             <p><strong>Прізвище:</strong> {user.lastName}</p>
//             {user.phoneNumber && <p><strong>Телефон:</strong> {user.phoneNumber}</p>}
//             {user.deliveryAddress && <p><strong>Адреса доставки:</strong> {user.deliveryAddress}</p>}
//             <p><strong>Роль:</strong> {user.role}</p>
//             {user.averageRating !== null && <p><strong>Середній рейтинг:</strong> {user.averageRating}</p>}
  
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
//                 {/* Поля */}
//                 <div className={styles.formGroup}>
//                   <label htmlFor="firstName">Ім'я</label>
//                   <Field type="text" id="firstName" name="firstName" className={styles.input} />
//                   <ErrorMessage name="firstName" component="div" className={styles.errorText} />
//                 </div>
  
//                 <div className={styles.formGroup}>
//                   <label htmlFor="lastName">Прізвище</label>
//                   <Field type="text" id="lastName" name="lastName" className={styles.input} />
//                   <ErrorMessage name="lastName" component="div" className={styles.errorText} />
//                 </div>
  
//                 <div className={styles.formGroup}>
//                   <label htmlFor="phoneNumber">Телефон</label>
//                   <Field type="text" id="phoneNumber" name="phoneNumber" className={styles.input} placeholder="+380XXXXXXXXX" />
//                   <ErrorMessage name="phoneNumber" component="div" className={styles.errorText} />
//                 </div>
  
//                 <div className={styles.formGroup}>
//                   <label htmlFor="deliveryAddress">Адреса доставки</label>
//                   <Field as="textarea" id="deliveryAddress" name="deliveryAddress" className={styles.textarea} rows={3} />
//                   <ErrorMessage name="deliveryAddress" component="div" className={styles.errorText} />
//                 </div>
  
//                 {/* Поле для фото через URL */}
//                 <div className={styles.formGroup}>
//                   <label htmlFor="photo">Посилання на фото</label>
//                   <input
//                     type="text"
//                     id="photo"
//                     name="photo"
//                     value={values.photo || ""}
//                     onChange={handleChange}
//                     className={styles.input}
//                     placeholder="Вставте URL фото"
//                   />
//                 </div>
  
//                 <div className={styles.buttonGroup}>
//                   <button type="submit" className={styles.saveButton} disabled={isSubmitting || !dirty}>
//                     {isSubmitting ? "Збереження..." : "Зберегти"}
//                   </button>
  
//                   <button type="button" className={styles.cancelButton} onClick={() => setIsEditing(false)} disabled={isSubmitting}>
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
