// src/app/[locale]/login/page.tsx

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import { useAppSelector } from "@/redux/hooks";
import LoginForm from "@/components/loginForm/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user) return;

    switch (user.role) {
      case "admin":
        router.push("/admin");
        break;
      case "partner":
        router.push("/partners");
        break;
      default:
        router.push("/profile");
        break;
    }
  }, [user, router]);

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        {/* <h1 className={styles.title}>Увійти</h1> */}
        {/* <p className={styles.description}>Будь ласка, введіть дані для входу.</p> */}
        <LoginForm />
      </main>
    </div>
  );
}


// "use client";

// import React, { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import styles from "./page.module.scss";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { login } from "@/redux/slices/authSlice";

// const LoginSchema = Yup.object().shape({
//   email: Yup.string().email("Некоректний email").required("Email обов'язковий"),
//   password: Yup.string().min(5, "Мінімум 5 символів").required("Пароль обов'язковий"),
// });

// export default function LoginPage() {
//   const dispatch = useAppDispatch();
//   const router = useRouter();

//   // 🔹 отримуємо токен з authSlice і дані користувача з userSlice
//   const { token, loading: authLoading, error: authError } = useAppSelector(
//     (state) => state.auth
//   );
//   const { data: user } = useAppSelector((state) => state.user);

//   useEffect(() => {
//     if (!user) return;

//     switch (user.role) {
//       case "admin":
//         router.push("/admin");
//         break;
//       case "partner":
//         router.push("/partners");
//         break;
//       default:
//         router.push("/profile");
//         break;
//     }
//   }, [user, router]);

//   return (
//     <div className={styles.container}>
//       <main className={styles.mainContent}>
//         <h1 className={styles.title}>Увійти</h1>
//         <p className={styles.description}>Будь ласка, введіть дані для входу.</p>

//         <Formik
//           initialValues={{ email: "", password: "" }}
//           validationSchema={LoginSchema}
//           onSubmit={(values) => dispatch(login(values))}
//         >
//           {({ isSubmitting }) => (
//             <Form className={styles.form}>
//               <div className={styles.formGroup}>
//                 <Field type="email" name="email" placeholder="Email" className={styles.input} />
//                 <ErrorMessage name="email" component="div" className={styles.error} />
//               </div>

//               <div className={styles.formGroup}>
//                 <Field type="password" name="password" placeholder="Пароль" className={styles.input} />
//                 <ErrorMessage name="password" component="div" className={styles.error} />
//               </div>

//               <button type="submit" className={styles.button} disabled={isSubmitting || authLoading}>
//                 {authLoading ? "Завантаження..." : "Увійти"}
//               </button>

//               {authError && <p className={styles.error}>{authError}</p>}
//             </Form>
//           )}
//         </Formik>
//       </main>
//     </div>
//   );
// }
