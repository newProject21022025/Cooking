// src/components/partnerDishesList/PartnerDishesList.tsx

"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchPartnerMenu } from "@/redux/slices/partnersSlice";
import { fetchAllDishesApi } from "@/api/dishesApi";
import { addToBasket } from "@/redux/slices/basketSlice";
import { PartnerDish } from "@/types/partner";
import { Dish, Ingredient } from "@/types/dish";
import styles from "./PartnerDishesList.module.scss";
import { useSearchParams } from "next/navigation";
import Icon_Time from "@/svg/Icon_Time/Icon_Time";

// 🛑 ДОДАНО: useLocale та useTranslations
import { useLocale, useTranslations } from "next-intl";

// Interface for the combined dish object displayed in the list
interface DisplayedDish {
 partnerDish: PartnerDish;
 dish: Dish;
 finalPrice: number;
}

interface PartnerDishesListProps {
 partnerId: string;
}

export default function PartnerDishesList({
 partnerId,
}: PartnerDishesListProps) {
 const dispatch = useDispatch<AppDispatch>();
 // 🛑 Ініціалізація хуків локалізації
 const locale = useLocale();
 const t = useTranslations("PartnerDishes"); 

 // State initialization
 const [allDishes, setAllDishes] = useState<Dish[]>([]);
 const [searchQuery, setSearchQuery] = useState("");
 const [searchResults, setSearchResults] = useState<DisplayedDish[]>([]);
 const [loadingSearch, setLoadingSearch] = useState(false);
 const [hasSearched, setHasSearched] = useState(false);
 const [showIngredients, setShowIngredients] = useState<
  Record<string, boolean>
 >({});

 const { partnerDishes, loading: loadingPartnerDishes } = useSelector(
  (state: RootState) => state.partners
 );
 const { partners, selectedPartnerId } = useSelector(
  (state: RootState) => state.partners
 );
 const searchParams = useSearchParams();
 const urlPartnerId = searchParams.get("partnerId");
 const currentPartnerId = urlPartnerId || selectedPartnerId;
 const selectedPartner = partners.find((p) => p.id === currentPartnerId);
 const partnerName = selectedPartner
  ? `${selectedPartner.firstName} ${selectedPartner.lastName}`
  : "";
 const titleText = partnerName ? `${partnerName}` : " ";
 const basketItems = useSelector((state: RootState) => state.basket.items);

 // Load all dishes
 useEffect(() => {
  fetchAllDishesApi()
   .then((data: Dish[]) => setAllDishes(data))
   .catch((err) => console.error("Failed to fetch all dishes:", err));
 }, []);

 // Load partner's menu
 useEffect(() => {
  if (partnerId) {
   dispatch(fetchPartnerMenu(partnerId));
  }
 }, [partnerId, dispatch]);

 const handleSearch = () => {
  setLoadingSearch(true);
  setHasSearched(true);

  if (!searchQuery) {
   setSearchResults([]);
   setHasSearched(false);
   setLoadingSearch(false);
   return;
  }

  // Search results should always be filtered by partnerId
  const results: DisplayedDish[] = partnerDishes
   .filter((pd) => pd.partner_id === partnerId)
   .map((pd) => {
    const dish = allDishes.find((d) => d.id === pd.dish_id);
    if (!dish) return null;

    // Filter by search query (using locale-specific name)
    const dishName = locale === "uk" ? dish.name_ua : dish.name_en;

    if (
     dishName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
     const finalPrice = pd.discount
      ? pd.price - pd.price * (pd.discount / 100)
      : pd.price;
     return { partnerDish: pd, dish, finalPrice } as DisplayedDish;
    }
    return null;
   })
   .filter(Boolean) as DisplayedDish[];

  setSearchResults(results);
  setLoadingSearch(false);
 };

 const handleIngredientsToggle = (dishId: number) => {
  setShowIngredients((prev) => ({
   ...prev,
   [dishId]: !prev[dishId],
  }));
 };

 if (loadingPartnerDishes || loadingSearch) {
  return <p>{t("loadingMenu")}</p>;
 }

 // Separate logic for correct typing and display
 let displayedPartnerDishes: DisplayedDish[] = [];

 if (hasSearched && searchQuery) {
  // Use processed search results
  displayedPartnerDishes = searchResults;
 } else {
  // Process the whole menu
  displayedPartnerDishes = partnerDishes
   .filter((pd) => pd.partner_id === partnerId)
   .map((pd) => {
    const dish = allDishes.find((d) => d.id === pd.dish_id);
    if (!dish) return null;
    const finalPrice = pd.discount
     ? pd.price - pd.price * (pd.discount / 100)
     : pd.price;
    return { partnerDish: pd, dish, finalPrice } as DisplayedDish;
   })
   .filter(Boolean) as DisplayedDish[];
 }

 if (!displayedPartnerDishes.length) {
  return <p>{t("emptyMenu")}</p>; 
 }

 return (
  <div className={styles.container}>
   <h2 className={styles.title}>
    {t("menuTitle")}
    <span className={styles.titleName}>{titleText}</span>
   </h2>
   <div className={styles.searchContainer}>
    <input
     type="text"
     placeholder={t("searchPlaceholder")} 
     value={searchQuery}
     onChange={(e) => setSearchQuery(e.target.value)}
     className={styles.searchBar}
    />
    <button onClick={handleSearch} className={styles.searchButton}>
     {t("searchButton")} 
    </button>
   </div>

   <div className={styles.cards}>
    {displayedPartnerDishes.map(({ partnerDish, dish, finalPrice }) => {
     
     const isAdded = basketItems.some(
      (item) => item.partnerDish.id === partnerDish.id
     );

          // Вибір назви та опису залежно від локалі
          const dishName = locale === 'uk' ? dish.name_ua : dish.name_en;
          const dishDescription = locale === 'uk' ? dish.description_ua : dish.description_en;

     return (
      <div key={partnerDish.id} className={styles.card}>
       <img
        src={dish.photo}
        alt={dishName}
        className={styles.image}
       />
       <div className={styles.cardInfo}>
        <div className={styles.cardTitle}>
         <h3 className={styles.cardName}>{dishName}</h3>
         <div className={styles.cardPrice}>
          <p className={styles.cardFinalPrice}>
           {finalPrice.toFixed(2)}₴
          </p>
          {/** Display discount **/}
          {(partnerDish.discount ?? 0) > 0 && (
           <p className={styles.cardGeneralPrice}>
            {partnerDish.price}₴
           </p>
          )}
          <p className={styles.cardDiscountPrice}>
           {(partnerDish.discount ?? 0) > 0 &&
            `-${partnerDish.discount}%`}
          </p>
         </div>
        </div>
        <p className={styles.cardDescription}>{dishDescription}</p>
        <p className={styles.freeDelivery}>
         <span className={styles.iconTime}>
          <Icon_Time />
         </span>
         {t("freeDelivery")} 
        </p>

        <div className={styles.buttonsContainer}>
         <button
          onClick={() => handleIngredientsToggle(dish.id)}
          className={styles.ingredientsButton}
         >
          {showIngredients[dish.id]
           ? t("hideIngredients") 
           : t("ingredientsButton")} 
         </button>
         <button
          className={`${styles.ingredientsButton} ${
           styles.cookButton
          } ${isAdded ? styles.addedButton : ""}`}
          onClick={() =>
           !isAdded &&
           dispatch(addToBasket({ partnerDish, dish, quantity: 1 }))
          }
          disabled={isAdded}
         >
          {isAdded ? t("addedToBasket") : t("orderButton")} 
         </button>

         {showIngredients[dish.id] && (
          <div className={styles.ingredientsList}>
           <h4>{t("mainIngredientsTitle")}:</h4> 
           <ul>
            {dish.important_ingredients.map(
             (ingredient: Ingredient, index) => (
              // Використовуємо локаль для назви інгредієнта
              <li key={index}>
                                {locale === 'uk' ? ingredient.name_ua : ingredient.name_en}
                            </li>
             )
            )}
           </ul>
          </div>
         )}
        </div>
       </div>
      </div>
     );
    })}
   </div>
  </div>
 );
}