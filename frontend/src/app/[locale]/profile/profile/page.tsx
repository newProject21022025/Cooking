// src/app/[locale]/profile/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { FormikHelpers } from "formik";
import styles from "../layout.module.scss";
import { User, UpdateUserProfileData } from "@/types/user";
import {
  getCurrentUserProfile,
  updateCurrentUserProfile,
} from "@/api/usersApi";
import ProfileView from "@/components/profileForm/ProfileView";
import ProfileForm from "@/components/profileForm/ProfileForm";
import PasswordForm from "@/components/profileForm/PasswordForm";
import { AxiosError } from "axios";

export default function ProfileSettingsPage() {
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
      console.error("Помилка завантаження профілю:", e);
      setError(e.message || "Помилка завантаження профілю");
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
      
      if (!user) throw new Error("Дані користувача відсутні");

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
        setError(e.message || "Помилка оновлення профілю");
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
      
      if (!user) throw new Error("Дані користувача відсутні");

      await updateCurrentUserProfile({ password: values.newPassword });
      setPasswordSuccess(true);
      helpers.resetForm();
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        setPasswordError(
          err.response.data.message || "Сталася помилка при зміні пароля"
        );
      } else {
        setPasswordError("Сталася невідома помилка");
      }
    } finally {
      setIsSubmitting(false);
      helpers.setSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Завантаження профілю...</div>;
  }

  if (error && !user) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!user) {
    return <div className={styles.error}>Дані користувача відсутні</div>;
  }

  return (
    <div>
      <h2>Налаштування профілю</h2>
      
      {updateSuccess && (
        <div className={styles.success}>Профіль успішно оновлено!</div>
      )}
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.card}>
        {!isEditing ? (
          <ProfileView 
            user={user} 
            onEdit={() => setIsEditing(true)} 
          />
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}