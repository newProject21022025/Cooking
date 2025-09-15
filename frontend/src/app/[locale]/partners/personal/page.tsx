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
    id: partner.id,
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


