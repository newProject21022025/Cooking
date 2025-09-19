// src/app/[locale]/admin/ingredients/page.tsx
"use client"; // ✅ Додаємо "use client" для використання стану

import React, { useState } from 'react';
import CreateIngredientForm from '@/components/createIngredientForm/CreateIngredientForm';
import IngredientsList from '@/components/ingredients/IngredientsList';
import styles from './page.module.scss';
import { Ingredient } from '@/types/ingredients'; // ✅ Імпортуємо тип Ingredient


export default function Ingredients() {
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  // Функція для встановлення інгредієнта для редагування
  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
  };

  return (
    <div className={styles.container}>
      <CreateIngredientForm editingIngredient={editingIngredient} setEditingIngredient={setEditingIngredient} />
      <IngredientsList onEdit={handleEdit} />
    </div>
  );
}