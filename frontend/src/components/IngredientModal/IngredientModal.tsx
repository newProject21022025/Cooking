// src/components/IngredientModal/IngredientModal.tsx
import React from "react";
import IngredientCircle from "../ingredientCircle/IngredientCircle";
import styles from "./IngredientModal.module.scss";
import { Ingredient as FullIngredient } from "@/types/ingredients";
import { useLocale } from "next-intl";

interface IngredientModalProps {
  ingredient: FullIngredient | null;
  onClose: () => void;
}

const IngredientModal: React.FC<IngredientModalProps> = ({ ingredient, onClose }) => {
  const locale = useLocale();

  if (!ingredient) {
    return null;
  }
  
  // 🔥 ФУНКЦІЯ ДЛЯ ОЧИЩЕННЯ РЯДКА ВІД **
  const cleanText = (text: string) => text.replace(/\*\*/g, "");

  const getCircleProps = (ing: FullIngredient) => {
    
    // 1. ОЧИЩЕННЯ НАЗВИ
    const rawName = locale === "uk" ? ing.name_uk : ing.name_en;

    return {
      name: cleanText(rawName), // Використовуємо очищену назву
      image: ing.image,
      
      // 2. ОЧИЩЕННЯ ТЕКСТІВ ПЕРЕВАГ
      benefits: ing.benefits.map((b) => {
        const rawBenefitText = locale === "uk" ? b.text_uk : b.text_en;
        return {
            // 🔥 ОЧИЩУЄМО КОЖЕН ТЕКСТ ПЕРЕВАГИ
            text: cleanText(rawBenefitText), 
        };
      }),
    };
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <IngredientCircle
          {...getCircleProps(ingredient)}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default IngredientModal;