// src/components/createDishForm/constants/IngredientsTable.tsx

"use client";

import React from "react";
import { FieldArray, Field, useFormikContext } from "formik";
import styles from "./IngredientsTable.module.scss";

import {
  units,
  ingredientsByCategory,
  mainCategories,
  optionalCategories,
} from "./ingredientsData";

interface Ingredient {
  category: string;
  name_ua: string;
  name_en: string;
  quantity: number;
  unit: string;
}

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
