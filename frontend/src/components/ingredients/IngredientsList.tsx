// src/components/ingredients/IngredientsList.tsx
"use client";

import React, { useEffect, useState } from "react";
import { fetchIngredients, deleteIngredient } from "@/api/ingredientsApi";
import { Ingredient } from "@/types/ingredients";
import styles from "./IngredientsList.module.scss";

// ✅ Додаємо пропс onEdit
interface IngredientsListProps {
  onEdit: (ingredient: Ingredient) => void;
}

// ✅ Приймаємо onEdit як пропс
export default function IngredientsList({ onEdit }: IngredientsListProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIngredients = async () => {
      try {
        const data = await fetchIngredients();
        setIngredients(data);
      } catch (err) {
        setError("Не вдалося завантажити інгредієнти");
      } finally {
        setLoading(false);
      }
    };
    loadIngredients();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити інгредієнт?")) return;
    try {
      await deleteIngredient(id);
      setIngredients((prev) => prev.filter((i) => i.id !== id));
    } catch {
      alert("Помилка при видаленні інгредієнта");
    }
  };

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (ingredients.length === 0) return <p>Інгредієнтів ще немає</p>;

  return (
    <div className={styles.container}>
      <h2>Список інгредієнтів</h2>
      <ul className={styles.list}>
        {ingredients.map((ingredient) => (
          <li key={ingredient.id} className={styles.item}>
            <div className={styles.info}>
              <strong>{ingredient.name_uk}</strong> ({ingredient.name_en})
              {ingredient.benefits.length > 0 && (
                <ul className={styles.benefits}>
                  {ingredient.benefits.map((b, idx) => (
                    <li key={idx}>{b.text_uk} ({b.text_en})</li>
                  ))}
                </ul>
              )}
            </div>
            {ingredient.image && (
              <img
                src={ingredient.image}
                alt={ingredient.name_uk}
                className={styles.image}
              />
            )}
            <div className={styles.buttons}>
              <button
                onClick={() => onEdit(ingredient)} // ✅ Додаємо кнопку редагування
                className={styles.editBtn}
              >
                Редагувати
              </button>
              <button
                onClick={() => handleDelete(ingredient.id)}
                className={styles.deleteBtn}
              >
                Видалити
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}