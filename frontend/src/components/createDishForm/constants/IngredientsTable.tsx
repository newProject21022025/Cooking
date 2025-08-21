// src/components/createDishForm/constants/IngredientsTable.tsx

"use client";

import React from "react";
import { FieldArray, Field, useFormikContext } from "formik";
import styles from "./IngredientsTable.module.scss";

interface Ingredient {
  category: string;
  name_ua: string;
  name_en: string;
  quantity: number;
  unit: string;
}

const units = ["г", "мл", "шт", "ст.л.", "ч.л.", "пучок", "гілочка", "листок"];

const ingredientsByCategory: Record<string, { name_ua: string; name_en: string }[]> = {
  "Мʼясо": [
    { name_ua: "Курятина", name_en: "Chicken" },
    { name_ua: "Говядина", name_en: "Beef" },
    { name_ua: "Свинина", name_en: "Pork" },
    { name_ua: "Індичка", name_en: "Turkey" },
    { name_ua: "Телятина", name_en: "Veal" },
    { name_ua: "Фарш (свинина/яловичина)", name_en: "Ground meat (pork/beef)" },
    { name_ua: "Кролик", name_en: "Rabbit" },
  ],
  "Риба": [
    { name_ua: "Скумбрія", name_en: "Mackerel" },
    { name_ua: "Лосось", name_en: "Salmon" },
    { name_ua: "Тунець", name_en: "Tuna" },
    { name_ua: "Щука", name_en: "Pike" },
    { name_ua: "Оселедець", name_en: "Herring" },
    { name_ua: "Дорадо", name_en: "Dorado" },
    { name_ua: "Форель", name_en: "Trout" },
    { name_ua: "Креветки", name_en: "Shrimp" },
    { name_ua: "Кальмари", name_en: "Squid" },
  ],
  "Крупи": [
    { name_ua: "Рис", name_en: "Rice" },
    { name_ua: "Гречка", name_en: "Buckwheat" },
    { name_ua: "Булгур", name_en: "Bulgur" },
    { name_ua: "Пшоно", name_en: "Millet" },
    { name_ua: "Кускус", name_en: "Couscous" },
    { name_ua: "Вівсянка", name_en: "Oatmeal" },
    { name_ua: "Кіноа", name_en: "Quinoa" },
  ],
  "Овочі": [
    { name_ua: "Картопля", name_en: "Potato" },
    { name_ua: "Морква", name_en: "Carrot" },
    { name_ua: "Помідор", name_en: "Tomato" },
    { name_ua: "Огірок", name_en: "Cucumber" },
    { name_ua: "Цибуля", name_en: "Onion" },
    { name_ua: "Часник", name_en: "Garlic" },
    { name_ua: "Капуста", name_en: "Cabbage" },
    { name_ua: "Броколі", name_en: "Broccoli" },
    { name_ua: "Солодкий перець", name_en: "Bell pepper" },
    { name_ua: "Кабачок", name_en: "Zucchini" },
    { name_ua: "Гриби", name_en: "Mushrooms" },
  ],
  "Фрукти": [
    { name_ua: "Яблуко", name_en: "Apple" },
    { name_ua: "Банан", name_en: "Banana" },
    { name_ua: "Апельсин", name_en: "Orange" },
    { name_ua: "Лимон", name_en: "Lemon" },
    { name_ua: "Виноград", name_en: "Grapes" },
    { name_ua: "Мандарин", name_en: "Tangerine" },
    { name_ua: "Авокадо", name_en: "Avocado" },
    { name_ua: "Ківі", name_en: "Kiwi" },
  ],
  "Молочні продукти": [
    { name_ua: "Молоко", name_en: "Milk" },
    { name_ua: "Сир", name_en: "Cheese" },
    { name_ua: "Сметана", name_en: "Sour cream" },
    { name_ua: "Йогурт", name_en: "Yogurt" },
    { name_ua: "Кефір", name_en: "Kefir" },
    { name_ua: "Вершкове масло", name_en: "Butter" },
    { name_ua: "Твердий сир", name_en: "Hard cheese" },
    { name_ua: "Моцарелла", name_en: "Mozzarella" },
  ],
  "Зелень": [
    { name_ua: "Петрушка", name_en: "Parsley" },
    { name_ua: "Кріп", name_en: "Dill" },
    { name_ua: "Кінза", name_en: "Cilantro" },
    { name_ua: "Базилік", name_en: "Basil" },
    { name_ua: "Шпинат", name_en: "Spinach" },
    { name_ua: "Зелена цибуля", name_en: "Green onion" },
    { name_ua: "Салат", name_en: "Lettuce" },
  ],
  "Спеції": [
    { name_ua: "Сіль", name_en: "Salt" },
    { name_ua: "Перець", name_en: "Pepper" },
    { name_ua: "Паприка", name_en: "Paprika" },
    { name_ua: "Куркума", name_en: "Turmeric" },
    { name_ua: "Кориця", name_en: "Cinnamon" },
    { name_ua: "Гвоздика", name_en: "Clove" },
    { name_ua: "Лавровий лист", name_en: "Bay leaf" },
    { name_ua: "Сушений часник", name_en: "Dried garlic" },
  ],
  "Інше": [
    { name_ua: "Яйце", name_en: "Egg" },
    { name_ua: "Вода", name_en: "Water" },
    { name_ua: "Олія", name_en: "Oil" },
    { name_ua: "Цукор", name_en: "Sugar" },
    { name_ua: "Оцет", name_en: "Vinegar" },
    { name_ua: "Лимонний сік", name_en: "Lemon juice" },
    { name_ua: "Сода", name_en: "Baking soda" },
    { name_ua: "Соєвий соус", name_en: "Soy sauce" },
    { name_ua: "Майонез", name_en: "Mayonnaise" },
    { name_ua: "Томатна паста", name_en: "Tomato paste" },
  ],
};

// Оновлені категорії
const mainCategories = ["Мʼясо", "Риба", "Крупи", "Овочі", "Фрукти", "Молочні продукти", "Зелень"];
const optionalCategories = ["Спеції", "Інше"];

interface Props {
  name: string;
  label: string;
  type: "main" | "optional";
}

export default function IngredientsTable({ name, label, type }: Props) {
  const { values, setFieldValue } = useFormikContext<any>();
  const categories = type === "main" ? mainCategories : optionalCategories;

  return (
    <div className={styles.wrapper}>
      <h3>{label}</h3>
      <FieldArray
        name={name}
        render={({ push, remove }) => {
          const ingredients: Ingredient[] = values[name] || [];

          return (
            <div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Категорія</th>
                    <th>Назва (UA)</th>
                    <th>Name (EN)</th>
                    <th>Кількість</th>
                    <th>Одиниця</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {ingredients.map((ing, i) => (
                    <tr key={i}>
                      <td>
                        <Field
                          as="select"
                          name={`${name}.${i}.category`}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            const category = e.target.value;
                            setFieldValue(`${name}.${i}.category`, category);
                            setFieldValue(`${name}.${i}.name_ua`, "");
                            setFieldValue(`${name}.${i}.name_en`, "");
                          }}
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </Field>
                      </td>
                      <td>
                        <Field
                          as="select"
                          name={`${name}.${i}.name_ua`}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            const selected = ingredientsByCategory[ing.category]?.find(
                              (item) => item.name_ua === e.target.value
                            );
                            if (selected) {
                              setFieldValue(`${name}.${i}.name_ua`, selected.name_ua);
                              setFieldValue(`${name}.${i}.name_en`, selected.name_en);
                            }
                          }}
                        >
                          <option value="">Виберіть інгредієнт</option>
                          {ingredientsByCategory[ing.category]?.map((item) => (
                            <option key={item.name_ua} value={item.name_ua}>
                              {item.name_ua}
                            </option>
                          ))}
                        </Field>
                      </td>
                      <td>
                        <Field name={`${name}.${i}.name_en`} disabled />
                      </td>
                      <td>
                        <Field type="number" name={`${name}.${i}.quantity`} placeholder="К-сть" />
                      </td>
                      <td>
                        <Field as="select" name={`${name}.${i}.unit`}>
                          {units.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </Field>
                      </td>
                      <td>
                        <button type="button" onClick={() => remove(i)}>
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                type="button"
                onClick={() =>
                  push({
                    category: categories[0],
                    name_ua: "",
                    name_en: "",
                    quantity: 0,
                    unit: "г",
                  })
                }
              >
                + Додати інгредієнт
              </button>
            </div>
          );
        }}
      />
    </div>
  );
}