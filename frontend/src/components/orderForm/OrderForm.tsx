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

// 🛑 ІМПОРТ ЛОКАЛІЗАЦІЇ
import { useTranslations } from "next-intl";

// 🛑 Оновлення регулярного виразу (універсальний формат +380)
const phoneRegExp = /^\+380\s\(\d{2}\)\s\d{3}-\d{2}-\d{2}$/;

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
 const t = useTranslations("OrderForm"); 

 const items = useSelector((state: RootState) => state.basket.items);

 const userId = user?.id; // string | undefined

 const initialValues = {
  firstName: user?.firstName ?? "",
  lastName: user?.lastName ?? "",
  email: user?.email ?? "",
  phone: user?.phoneNumber ?? "",
  address: user?.deliveryAddress ?? "",
 };


 const OrderSchema = Yup.object().shape({
  firstName: Yup.string().required(t("validation.firstNameRequired")),
  lastName: Yup.string().required(t("validation.lastNameRequired")),
  email: Yup.string()
   .email(t("validation.emailInvalid"))
   .required(t("validation.emailRequired")),
  phone: Yup.string()
   .matches(phoneRegExp, t("validation.phoneInvalid"))
   .required(t("validation.phoneRequired")),
  address: Yup.string().required(t("validation.addressRequired")),
 });


 const handleSubmit = async (values: typeof initialValues) => {
  if (items.length === 0) {
   alert(t("alert.emptyBasket")); 
  }

    
  const orderItems = items.map((i) => ({
   partnerDishId: i.partnerDish.id,
   dishId: i.dish.id.toString(),
   name: i.dish.name_en, 
   photo: i.dish.photo,
   price: i.partnerDish.price,
   discount: i.partnerDish.discount,
   quantity: i.quantity,
  }));

  try {
   const response = await dispatch(
    createOrder({
     partnerId: items[0].partnerDish.partner_id,
     userId,
     ...values,
     items: orderItems,
    })
   ).unwrap();

   
   alert(t("alert.orderSuccess", { orderNumber: response.orderNumber })); 
   dispatch(clearBasket());
   router.push("/");
  } catch (error: unknown) {
   if (error instanceof Error) {
    alert(`${t("alert.orderError")}: ${error.message}`);
   } else {
    alert(t("alert.orderErrorGeneric")); 
   }
  }
 };

 return (
  <div className={styles.orderForm}>
   <h2>{t("title")}</h2> 
   <Formik
    initialValues={initialValues}
    validationSchema={OrderSchema}
    onSubmit={handleSubmit}
    enableReinitialize
   >
    {({ isSubmitting }) => (
     <Form className={styles.form}>
      <div className={styles.field}>
       <label>{t("fields.firstName")}</label> 
       <Field type="text" name="firstName" />
       <ErrorMessage
        name="firstName"
        component="div"
        className={styles.error}
       />
      </div>

      <div className={styles.field}>
       <label>{t("fields.lastName")}</label>
       <Field type="text" name="lastName" />
       <ErrorMessage
        name="lastName"
        component="div"
        className={styles.error}
       />
      </div>

      <div className={styles.field}>
       <label>{t("fields.email")}</label> 
       <Field type="email" name="email" />
       <ErrorMessage
        name="email"
        component="div"
        className={styles.error}
       />
      </div>

      <div className={styles.field}>
       <label>{t("fields.phone")}</label> 
       <Field name="phone">
        {({ field, form }: FieldProps<string>) => (
         <input
          {...field}
          type="text"
          value={field.value} 
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
       <label>{t("fields.address")}</label>
       <Field type="text" name="address" />
       <ErrorMessage
        name="address"
        component="div"
        className={styles.error}
       />
      </div>

      <button type="submit" disabled={isSubmitting}>
       {t("submitButton")} 
      </button>
     </Form>
    )}
   </Formik>
  </div>
 );
}