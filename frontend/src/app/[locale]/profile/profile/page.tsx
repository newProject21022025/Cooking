// src/app/[locale]/profile/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { FormikHelpers } from "formik";
// import styles from "../layout.module.scss";
import styles from "./page.module.scss";
import { User, UpdateUserProfileData } from "@/types/user";
import {
  getCurrentUserProfile,
  updateCurrentUserProfile,
} from "@/api/usersApi";
// import ProfileView from "@/components/profileForm/ProfileView";
import ProfileForm from "@/components/profileForm/ProfileForm";
import PasswordForm from "@/components/profileForm/PasswordForm";
import { AxiosError } from "axios";
// ➡️ NEXT-INTL IMPORTS
import { useTranslations } from "next-intl"; 


export default function ProfileSettingsPage() {
  const t = useTranslations("ProfileSettingsPage"); // ⬅️ Використовуємо простір імен ProfileSettingsPage

  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // ➡️ Переклад повідомлення в консолі
      console.error(t("Errors.loadConsole"), e); 
      // ➡️ Переклад повідомлення про помилку
      setError(e.message || t("Errors.loadDefault")); 
      if (e.response?.status === 401) {
        localStorage.removeItem("token");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (
    values: UpdateUserProfileData,
    { setErrors }: FormikHelpers<UpdateUserProfileData>
  ) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setUpdateSuccess(false);

      if (!user) throw new Error(t("Errors.dataMissing")); // ➡️ Переклад
      
      const updatedUser = await updateCurrentUserProfile(values);
      setUser(updatedUser);
      setIsEditing(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err: unknown) {
      const e = err as {
        message?: string;
        response?: { data?: { errors?: Record<string, string[]> } };
      };

      if (e.response?.data?.errors) {
        const backendErrors: Record<string, string[]> = e.response.data.errors;
        const formikErrors: Record<string, string> = {};
        Object.keys(backendErrors).forEach((key) => {
          formikErrors[key] = backendErrors[key].join(", ");
        });
        setErrors(formikErrors);
      } else {
        // ➡️ Переклад повідомлення про помилку
        setError(e.message || t("Errors.updateDefault")); 
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async (
    values: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
    helpers: FormikHelpers<{
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }>
  ) => {
    try {
      setIsSubmitting(true);
      setPasswordError(null);

      if (!user) throw new Error(t("Errors.dataMissing")); // ➡️ Переклад

      await updateCurrentUserProfile({ password: values.newPassword });
      setPasswordSuccess(true);
      helpers.resetForm();
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        setPasswordError(
          // ➡️ Переклад повідомлення про помилку
          err.response.data.message || t("Errors.passwordChangeDefault") 
        );
      } else {
        // ➡️ Переклад повідомлення про помилку
        setPasswordError(t("Errors.unknownError")); 
      }
    } finally {
      setIsSubmitting(false);
      helpers.setSubmitting(false);
    }
  };

  // ➡️ Переклад повідомлень на екрані
  if (loading) {
    return <div className={styles.loading}>{t("Messages.loading")}</div>;
  }

  if (error && !user) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!user) {
    return <div className={styles.error}>{t("Errors.dataMissing")}</div>;
  }

  return (
    <div>
      {/* ➡️ Переклад заголовка */}
      <h2 className={styles.profileTitle}>{t("Title")}</h2> 

      {/* ➡️ Переклад повідомлення про успіх */}
      {updateSuccess && (
        <div className={styles.success}>{t("Messages.updateSuccess")}</div>
      )}
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.card}>
        <ProfileForm
          user={user}
          onSubmit={handleProfileSubmit}
          onCancel={() => setIsEditing(false)}
          isSubmitting={isSubmitting}
        />

        <PasswordForm
          onSubmit={handlePasswordChange}
          isSubmitting={isSubmitting}
          success={passwordSuccess}
          error={passwordError}
        />
      </div>

    </div>
  );
}