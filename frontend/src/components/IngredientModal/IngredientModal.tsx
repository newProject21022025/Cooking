// src/components/IngredientModal/IngredientModal.tsx
import React from "react";
import IngredientCircle from "../ingredientCircle/IngredientCircle";
import styles from "./IngredientModal.module.scss";

// Імпортуємо інтерфейс FullIngredient, щоб типізувати дані
import { Ingredient as FullIngredient } from "@/types/ingredients";
import { useLocale } from "next-intl";

interface IngredientModalProps {
  ingredient: FullIngredient | null;
  onClose: () => void;
}

const IngredientModal: React.FC<IngredientModalProps> = ({ ingredient, onClose }) => {
  const locale = useLocale();

  if (!ingredient) {
    return null; // Не рендеримо нічого, якщо інгредієнт не передано
  }

  // Функція для підготовки даних для IngredientCircle
  const getCircleProps = (ing: FullIngredient) => ({
    name: locale === "uk" ? ing.name_uk : ing.name_en,
    image: ing.image,
    benefits: ing.benefits.map((b) => ({
      text: locale === "uk" ? b.text_uk : b.text_en,
    })),
  });

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <IngredientCircle {...getCircleProps(ingredient)} />
      </div>
    </div>
  );
};

export default IngredientModal;