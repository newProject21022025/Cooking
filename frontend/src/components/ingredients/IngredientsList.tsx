// src/components/ingredients/IngredientsList.tsx

"use client";

import React, { useEffect, useState, useMemo } from "react";
import { fetchIngredients, deleteIngredient } from "@/api/ingredientsApi";
import { Ingredient } from "@/types/ingredients";
import styles from "./IngredientsList.module.scss";

interface IngredientsListProps {
  onEdit: (ingredient: Ingredient) => void;
}

export default function IngredientsList({ onEdit }: IngredientsListProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // ✅ Додаємо стан для пошукового запиту
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadIngredients = async () => {
      try {
        const data = await fetchIngredients();
        const sortedData = data.sort((a, b) => a.name_uk.localeCompare(b.name_uk, 'uk', { sensitivity: 'base' }));
        setIngredients(sortedData);
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

  // ✅ Використовуємо useMemo для ефективної фільтрації
  const filteredIngredients = useMemo(() => {
    if (!searchTerm) {
      return ingredients;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return ingredients.filter(ingredient => 
      ingredient.name_uk.toLowerCase().includes(lowercasedSearchTerm) ||
      ingredient.name_en.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [ingredients, searchTerm]);

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Список інгредієнтів</h2>
      
      {/* ✅ Поле для пошуку */}
      <input
        type="text"
        placeholder="Пошук за назвою..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchBar}
      />
      
      {filteredIngredients.length === 0 && (
        <p className={styles.noResults}>Не знайдено інгредієнтів, що відповідають вашому запиту.</p>
      )}

      <ul className={styles.list}>
        {/* Рендеримо відфільтрований список */}
        {filteredIngredients.map((ingredient) => (
          <li key={ingredient.id} className={styles.item}>
            <div className={styles.info}>
              <strong>{ingredient.name_uk}</strong> ({ingredient.name_en})
              {ingredient.benefits.length > 0 && (
                <ul className={styles.benefits}>
                  {ingredient.benefits.map((b, idx) => (
                    <li className={styles.benefitsLi} key={idx}>{b.text_uk} ({b.text_en})</li>
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
                onClick={() => onEdit(ingredient)}
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