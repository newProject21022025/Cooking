// src/app/[locale]/admin/ingredients/page.tsx
"use client";

import React, { useState } from 'react';
import CreateIngredientForm from '@/components/createIngredientForm/CreateIngredientForm';
import IngredientsList from '@/components/ingredients/IngredientsList';
import styles from './page.module.scss';
import { Ingredient } from '@/types/ingredients';

export default function Ingredients() {
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setIsFormVisible(true);
  };

  // Визначення CSS-класів
  const formClasses = `${styles.formContainer} ${isFormVisible ? styles.visible : ''}`;

  return (
    <div className={styles.container}>
      <button 
        className={styles.toggleButton} 
        onClick={() => setIsFormVisible(!isFormVisible)}
      >
        {isFormVisible ? 'Приховати форму' : 'Додати новий інгредієнт'}
      </button>

      {/* ✅ Обгортаємо компонент форми і застосовуємо класи. 
        Це дозволить контролювати анімацію.
      */}
      <div className={formClasses}>
        <CreateIngredientForm editingIngredient={editingIngredient} setEditingIngredient={setEditingIngredient} />
      </div>
      
      <IngredientsList onEdit={handleEdit} />
    </div>
  );
}