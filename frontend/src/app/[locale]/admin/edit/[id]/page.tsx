// src/app/admin/edit/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchDishByIdApi, updateDishApi } from "@/api/dishesApi";
import { Dish, IngredientForm, Ingredient } from "@/types/dish";
import CreateDishForm from "@/components/createDishForm/CreateDishForm";


export default function EditDishPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  const [dish, setDish] = useState<Dish | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDish = async () => {
      try {
        const data = await fetchDishByIdApi(id);
        setDish(data);
      } catch (err) {
        console.error("❌ Помилка завантаження страви", err);
      } finally {
        setLoading(false);
      }
    };

    loadDish();
  }, [id]);

  if (loading) return <p>⏳ Завантаження...</p>;
  if (!dish) return <p>⚠️ Страву не знайдено</p>;

  return (
    <div>
      <h2>Редагування страви</h2>
      <CreateDishForm
        initialData={dish}
        onSubmit={async (values) => {
          try {
            const dataToSend = {
              ...values,
              standard_servings: dish.standard_servings,
              important_ingredients: values.important_ingredients.map(
                ({ category, ...rest }: IngredientForm): Ingredient => rest
              ),
              optional_ingredients: values.optional_ingredients.map(
                ({ category, ...rest }: IngredientForm): Ingredient => rest
              ),
            };

            await updateDishApi(dish.id, dataToSend);
            alert("✅ Страва оновлена!");
            router.push("/admin/edit");
          } catch (err) {
            console.error(err);
            alert("❌ Помилка при оновленні");
          }
        }}
      />
    </div>
  );
}
