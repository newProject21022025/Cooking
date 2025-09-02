// src/components/orderForm/OrderForm.tsx

"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createOrder } from "@/redux/slices/ordersSlice";
import { clearBasket } from "@/redux/slices/basketSlice";
import { useRouter } from "next/navigation";
import styles from "./OrderForm.module.scss";

const OrderSchema = Yup.object().shape({
  firstName: Yup.string().required("Введіть ім'я"),
  lastName: Yup.string().required("Введіть прізвище"),
  email: Yup.string().email("Невірний email").required("Введіть email"),
  phone: Yup.string().required("Введіть телефон"),
  address: Yup.string().required("Введіть адресу доставки"),
});

export default function OrderForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const items = useSelector((state: RootState) => state.basket.items);

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    if (items.length === 0) {
      alert("Кошик порожній");
      return;
    }
  
    const orderItems = items.map((i) => ({
      partnerDishId: i.partnerDish.id,
      dishId: i.dish.id.toString(), // перетворюємо на string
      name: i.dish.name_ua,
      photo: i.dish.photo,
      price: i.partnerDish.price,
      discount: i.partnerDish.discount,
      quantity: i.quantity,
    }));
  
    try {
      const response = await dispatch(
        createOrder({
          partnerId: items[0].partnerDish.partner_id, // виправлено на partner_id
          ...values,
          items: orderItems,
        })
      ).unwrap();
  
      alert(`Замовлення створено! Номер: ${response.orderNumber}`);
      dispatch(clearBasket());
      router.push("/"); 
    } catch (error: any) {
      alert("Помилка при створенні замовлення: " + error.message);
    }
  };
  

  return (
    <div className={styles.orderForm}>
      <h2>Оформлення замовлення</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={OrderSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={styles.form}>
            <div className={styles.field}>
              <label>Ім'я</label>
              <Field type="text" name="firstName" />
              <ErrorMessage name="firstName" component="div" className={styles.error} />
            </div>

            <div className={styles.field}>
              <label>Прізвище</label>
              <Field type="text" name="lastName" />
              <ErrorMessage name="lastName" component="div" className={styles.error} />
            </div>

            <div className={styles.field}>
              <label>Email</label>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" className={styles.error} />
            </div>

            <div className={styles.field}>
              <label>Телефон</label>
              <Field type="text" name="phone" />
              <ErrorMessage name="phone" component="div" className={styles.error} />
            </div>

            <div className={styles.field}>
              <label>Адреса</label>
              <Field type="text" name="address" />
              <ErrorMessage name="address" component="div" className={styles.error} />
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
