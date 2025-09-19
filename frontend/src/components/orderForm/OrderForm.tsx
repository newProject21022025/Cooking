// src/components/orderForm/OrderForm.tsx

"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import * as Yup from "yup";
import { createOrder } from "@/redux/slices/ordersSlice";
import { clearBasket } from "@/redux/slices/basketSlice";
import { useRouter } from "next/navigation";
import styles from "./OrderForm.module.scss";
import { formatPhoneNumber } from "../partners/formatters";

const phoneRegExp = /^\+380\s\(\d{2}\)\s\d{3}-\d{2}-\d{2}$/;

const OrderSchema = Yup.object().shape({
  firstName: Yup.string().required("Введіть ім'я"),
  lastName: Yup.string().required("Введіть прізвище"),
  email: Yup.string().email("Невірний email").required("Введіть email"),
  phone: Yup.string()
    .matches(
      phoneRegExp,
      "Невірний формат телефону. Приклад: +380 (67) 123-45-67"
    )
    .required("Введіть телефон"),
  address: Yup.string().required("Введіть адресу доставки"),
});

interface OrderFormProps {
  user?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    deliveryAddress?: string;
  } | null;
}

export default function OrderForm({ user }: OrderFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const items = useSelector((state: RootState) => state.basket.items);

  // ⚡ беремо userId з Redux
  const userId = user?.id; // string | undefined

  const initialValues = {
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: user?.phoneNumber ?? "",
    address: user?.deliveryAddress ?? "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    if (items.length === 0) {
      alert("Кошик порожній");
      return;
    }

    const orderItems = items.map((i) => ({
      partnerDishId: i.partnerDish.id,
      dishId: i.dish.id.toString(),
      name: i.dish.name_ua,
      photo: i.dish.photo,
      price: i.partnerDish.price,
      discount: i.partnerDish.discount,
      quantity: i.quantity,
    }));

    try {
      const response = await dispatch(
        createOrder({
          partnerId: items[0].partnerDish.partner_id,
          userId, // ⚡ додаємо userId сюди
          ...values,
          items: orderItems,
        })
      ).unwrap();

      alert(`Замовлення створено! Номер: ${response.orderNumber}`);
      dispatch(clearBasket());
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("Помилка при створенні замовлення: " + error.message);
      } else {
        alert("Помилка при створенні замовлення");
      }
    }
  };

  return (
    <div className={styles.orderForm}>
      <h2>Оформлення замовлення</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={OrderSchema}
        onSubmit={handleSubmit}
        enableReinitialize // ⚡ для підвантаження user після асинхронного завантаження
      >
        {({ isSubmitting }) => (
          <Form className={styles.form}>
            <div className={styles.field}>
              <label>Ім&apos;я</label>
              <Field type="text" name="firstName" />
              <ErrorMessage
                name="firstName"
                component="div"
                className={styles.error}
              />
            </div>

            <div className={styles.field}>
              <label>Прізвище</label>
              <Field type="text" name="lastName" />
              <ErrorMessage
                name="lastName"
                component="div"
                className={styles.error}
              />
            </div>

            <div className={styles.field}>
              <label>Email</label>
              <Field type="email" name="email" />
              <ErrorMessage
                name="email"
                component="div"
                className={styles.error}
              />
            </div>

            <div className={styles.field}>
              <label>Телефон</label>
              <Field name="phone">
                {({ field, form }: FieldProps<string>) => (
                  <input
                    {...field}
                    type="text"
                    value={field.value} // 🔥 тепер обов'язково показує значення
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value);
                      form.setFieldValue(field.name, formatted);
                    }}
                  />
                )}
              </Field>
              <ErrorMessage
                name="phone"
                component="div"
                className={styles.error}
              />
            </div>

            <div className={styles.field}>
              <label>Адреса</label>
              <Field type="text" name="address" />
              <ErrorMessage
                name="address"
                component="div"
                className={styles.error}
              />
            </div>

            <button type="submit" disabled={isSubmitting}>
              Оформити замовлення
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
