// src/app/[locale]/dishes/[id]/page.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { fetchDishByIdApi } from "@/api/dishesApi";
import { Dish, Ingredient } from "@/types/dish";
import styles from "./page.module.scss";
import Link from "next/link";
import { useLocale } from "next-intl";
import PartnersList from "@/components/partners/PartnersList";
import { Ingredient as FullIngredient } from "@/types/ingredients";
import { fetchIngredientByName } from "@/api/ingredientsApi";
import IngredientModal from "@/components/IngredientModal/IngredientModal";
import { useDispatch } from "react-redux";
import { openModal, closeModal } from "@/redux/slices/modalSlice";
import CommentForm from "@/components/commentForm/CommentForm"; // ✅ Імпортуємо компонент форми
import { deleteComment } from "@/api/commentsApi"; // ✅ Імпортуємо функцію видалення
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store"; // ✅ Імпортуємо тип RootState
import { User } from "@/types/user";

export default function DishDetailPage() {
  const params = useParams();
  const dishId = params.id as string; // Отримуємо ID страви з параметрів URL
  const dispatch = useDispatch();
  const locale = useLocale();

  // ✅ Явно вказуємо тип RootState для state
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.user.data as User | null);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  

  const [dish, setDish] = useState<Dish | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [calculatedServings, setCalculatedServings] = useState<number>(1); // Стан для кількості порцій
  const [calculatedIngredients, setCalculatedIngredients] = useState<{
    important: Ingredient[];
    optional: Ingredient[];
  } | null>(null); // Стан для перерахованих інгредієнтів
  const [selectedIngredient, setSelectedIngredient] =
    useState<FullIngredient | null>(null);

  // ✅ Обробник натискання на кнопку інгредієнта
  const handleIngredientClick = async (ingredientName: string) => {
    try {
      const fullIngredient = await fetchIngredientByName(ingredientName);
      if (fullIngredient) {
        setSelectedIngredient(fullIngredient);
        dispatch(openModal()); // ✅ Відправляємо дію для відкриття модального вікна
      }
    } catch (err) {
      console.error("Failed to fetch full ingredient details:", err);
    }
  };

  // ✅ Обробник для закриття модального вікна
  const handleCloseModal = () => {
    setSelectedIngredient(null);
    dispatch(closeModal()); // ✅ Відправляємо дію для закриття модального вікна
  };

  // // ✅ Функція для підготовки даних для IngredientCircle
  // const getCircleProps = (ingredient: FullIngredient) => {
  //   return {
  //     name: locale === "uk" ? ingredient.name_uk : ingredient.name_en,
  //     image: ingredient.image,
  //     benefits: ingredient.benefits.map((b: Benefit) => ({
  //       text: locale === "uk" ? b.text_uk : b.text_en,
  //     })),
  //   };
  // };

  // ✅ Wrap the function in useCallback to prevent unnecessary re-creations
  const fetchDishDetails = useCallback(async () => {
    if (!dishId) {
      setLoading(false);
      setError("Ідентифікатор страви відсутній.");
      return;
    }
    try {
      setLoading(true);
      const fetchedDish = await fetchDishByIdApi(Number(dishId));
      setDish(fetchedDish);
      setCalculatedServings(fetchedDish.standard_servings || 1);
    } catch (err) {
      console.error("Помилка при завантаженні деталей страви:", err);
      setError(
        "Не вдалося завантажити деталі страви. Будь ласка, спробуйте пізніше."
      );
    } finally {
      setLoading(false);
    }
  }, [dishId]); // Dependency array to prevent infinite loops

  useEffect(() => {
    fetchDishDetails();
  }, [fetchDishDetails]); // Now we depend on the memoized function

  // ✅ Обробник для видалення коментаря
  // const handleDeleteComment = async (commentId: number) => {
  //   // ✅ Перевірка на авторизацію та блокування
  //   if (!token || user?.isBlocked) {
  //     console.error("Користувач не авторизований або заблокований.");
  //     return;
  //   }
  //   try {
  //     await deleteComment(commentId);
  //     fetchDishDetails();
  //   } catch (err) {
  //     console.error("Помилка при видаленні коментаря:", err);
  //   }
  // };

  useEffect(() => {
    const getDishDetails = async () => {
      if (!dishId) {
        setLoading(false);
        setError("Ідентифікатор страви відсутній.");
        return;
      }
      try {
        setLoading(true);
        const fetchedDish = await fetchDishByIdApi(Number(dishId));
        setDish(fetchedDish);
        setCalculatedServings(fetchedDish.standard_servings || 1); // Ініціалізуємо порції зі стандартних або 1
      } catch (err) {
        console.error("Помилка при завантаженні деталей страви:", err);
        setError(
          "Не вдалося завантажити деталі страви. Будь ласка, спробуйте пізніше."
        );
      } finally {
        setLoading(false);
      }
    };

    getDishDetails();
  }, [dishId]);

  // Ефект для перерахунку інгредієнтів при зміні порцій або страви
  useEffect(() => {
    if (dish && calculatedServings > 0) {
      const standardServings = dish.standard_servings || 1;
      const scalingFactor = calculatedServings / standardServings;

      const scaledImportant = dish.important_ingredients.map((ing) => ({
        ...ing,
        quantity: ing.quantity
          ? parseFloat((ing.quantity * scalingFactor).toFixed(2))
          : ing.quantity, // Обмеження до 2 знаків після коми
      }));

      const scaledOptional = dish.optional_ingredients.map((ing) => ({
        ...ing,
        quantity: ing.quantity
          ? parseFloat((ing.quantity * scalingFactor).toFixed(2))
          : ing.quantity, // Обмеження до 2 знаків після коми
      }));

      setCalculatedIngredients({
        important: scaledImportant,
        optional: scaledOptional,
      });
    } else {
      setCalculatedIngredients(null); // Скидаємо, якщо порції невалідні або страва відсутня
    }
  }, [dish, calculatedServings]);

  // Функції для збільшення/зменшення порцій
  const handleIncrement = () => {
    setCalculatedServings((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setCalculatedServings((prev) => Math.max(1, prev - 1)); // Не дозволяємо опускатися нижче 1
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingMessage}>
          Завантаження деталей страви...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.errorMessage}>{error}</div>
        <Link href="/" className={styles.backButton}>
          Повернутися на головну
        </Link>
      </div>
    );
  }

  if (!dish) {
    return (
      <div className={styles.page}>
        <div className={styles.errorMessage}>Страва не знайдена.</div>
        <Link href="/" className={styles.backButton}>
          Повернутися на головну
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div
        className={
          selectedIngredient ? styles.hiddenSection : styles.modalSection
        }
      >
        <PartnersList />
      </div>
      <main className={styles.main}>
        <div
          className={
            selectedIngredient ? styles.hiddenSection : styles.modalSection
          }
        >
          <Link href="/" className={styles.backButton}>
            ← Назад до списку страв
          </Link>

          <h1 className={styles.title}>
            {locale === "uk" ? dish.name_ua : dish.name_en}
          </h1>

          <img
            src={dish.photo}
            alt={locale === "uk" ? dish.name_ua : dish.name_en}
            className={styles.dishImage}
          />

          <div className={styles.section}>
            <h3>{locale === "uk" ? "Опис" : "Description"}</h3>
            <p className={styles.description}>
              {locale === "uk" ? dish.description_ua : dish.description_en}
            </p>
          </div>

          {/* Калькулятор порцій */}
          <div className={styles.portionCalculator}>
            <h3>
              {locale === "uk" ? "Кількість порцій" : "Number of Servings"}
            </h3>
            <div className={styles.portionInputGroup}>
              <button
                type="button"
                onClick={handleDecrement}
                className={styles.portionButton}
                disabled={calculatedServings <= 1} // Деактивація кнопки, якщо порція = 1
              >
                −
              </button>
              <input
                type="number"
                min="1"
                value={calculatedServings}
                onChange={(e) => setCalculatedServings(Number(e.target.value))}
                className={styles.portionInput}
              />
              <button
                type="button"
                onClick={handleIncrement}
                className={styles.portionButton}
              >
                +
              </button>
              <span className={styles.standardServingsText}>
                ({locale === "uk" ? "за замовчуванням" : "default"}:{" "}
                {dish.standard_servings})
              </span>
            </div>
          </div>

          <div className={styles.ingredientsSection}>
            {calculatedIngredients && (
              <>
                <div className={styles.ingredientsList}>
                  <h3>
                    {locale === "uk"
                      ? "Основні інгредієнти"
                      : "Important Ingredients"}
                  </h3>
                  <ul>
                    {calculatedIngredients.important.map(
                      (ing: Ingredient, index: number) => (
                        <li key={index}>
                          {locale === "uk" ? ing.name_ua : ing.name_en}
                          {ing.quantity !== undefined
                            ? `: ${ing.quantity} ${ing.unit}`
                            : ing.unit
                            ? ` (${ing.unit})`
                            : ""}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {calculatedIngredients.optional.length > 0 && (
                  <div className={styles.ingredientsList}>
                    <h3>
                      {locale === "uk"
                        ? "Необов'язкові інгредієнти"
                        : "Optional Ingredients"}
                    </h3>
                    <ul>
                      {calculatedIngredients.optional.map(
                        (ing: Ingredient, index: number) => (
                          <li key={index}>
                            {locale === "uk" ? ing.name_ua : ing.name_en}
                            {ing.quantity !== undefined
                              ? `: ${ing.quantity} ${ing.unit}`
                              : ing.unit
                              ? ` (${ing.unit})`
                              : ""}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {/* ------------------------------------------------------------------------------------------------------- */}

        <div className={styles.ingredientsBtnSection}>
          <h3 className={styles.ingredientsBtnTitle}>
            {locale === "uk"
              ? "Ключові інгредієнти страви:"
              : "Key ingredients of the dish:"}
          </h3>
          <div className={styles.ingredientsBtnContainer}>
            {calculatedIngredients &&
              calculatedIngredients.important.map(
                (ing: Ingredient, index: number) => (
                  <button
                    key={index}
                    className={styles.ingredientsBtn}
                    // ✅ Викликаємо обробник, передаючи name_en
                    onClick={() => handleIngredientClick(ing.name_en)}
                  >
                    {locale === "uk" ? ing.name_ua : ing.name_en}
                  </button>
                )
              )}
          </div>
        </div>

        {selectedIngredient && (
          <IngredientModal
            ingredient={selectedIngredient}
            onClose={handleCloseModal}
          />
        )}
        <div
          className={
            selectedIngredient ? styles.hiddenSection : styles.modalSection
          }
        >
          <div className={styles.section}>
            <h3>{locale === "uk" ? "Рецепт" : "Recipe"}</h3>
            <p className={styles.recipeText}>
              {locale === "uk" ? dish.recipe_ua : dish.recipe_en}
            </p>
          </div>
          {/* ✅ Новий розділ для коментарів */}
          <div className={styles.commentsSection}>
        <h3>{locale === "uk" ? "Коментарі" : "Comments"}</h3>
        {dish.comments && dish.comments.length > 0 ? (
          <ul className={styles.commentsList}>
            {dish.comments.map((comment: any) => (
              <li key={comment.id} className={styles.commentItem}>
                <p className={styles.commentText}>{comment.comment_text}</p>
                <p className={styles.commentMeta}>
                  <span className={styles.commentAuthor}>
                    <span className={styles.authorName}>
                      {comment.user?.firstName || "Анонімний"}{" "}
                      {comment.user?.lastName || ""}
                    </span>
                    <span className={styles.authorEmail}>
                      ({comment.user?.email || ""})
                    </span>
                  </span>
                  <span className={styles.commentDate}>
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                  {/* ✅ Перевірка для відображення кнопки видалення
                  {user && comment.user_id === user.id && !user.isBlocked && (
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Видалити
                    </button>
                  )} */}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            {locale === "uk"
              ? "Коментарів поки що немає. Будьте першим!"
              : "No comments yet. Be the first to comment!"}
          </p>
        )}
        {/* ✅ Умовне відображення форми коментаря */}
        {isAuthenticated && !user?.isBlocked && (
          <CommentForm
            dishId={Number(dishId)}
            onCommentAdded={fetchDishDetails}
          />
        )}
      </div>
        </div>
      </main>
      {selectedIngredient && (
        <IngredientModal
          ingredient={selectedIngredient}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
