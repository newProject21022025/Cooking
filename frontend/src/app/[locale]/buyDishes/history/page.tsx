// src/app/[locale]/buyDishes/history/page.tsx
"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import PartnerHistory from "./PartnerHistory";

export default function HistoryPage() {
  const partnerId = useSelector((state: RootState) => state.partners.selectedPartnerId);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  if (!partnerId) return <p>Виберіть партнера, щоб переглянути історію.</p>;
  if (!userId) return <p>Завантаження користувача...</p>;

  return <PartnerHistory partnerId={partnerId} userId={userId.toString()} />;
}
