// src/components/PartnerDishForm/PartnerDishForm.tsx

"use client";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { 
    // PartnerDish, 
    CreatePartnerDishDto } from "@/types/partner";

interface PartnerDishFormProps {
  initialValues: Partial<CreatePartnerDishDto>;
  onSubmit: (values: CreatePartnerDishDto) => void;
}

const validationSchema = Yup.object({
  dish_id: Yup.number().required("Виберіть страву"),
  price: Yup.number().required("Вкажіть ціну").positive("Ціна повинна бути більше 0"),
  available_portions: Yup.number().required("Вкажіть кількість порцій").min(1, "Мінімум 1 порція"),
  discount: Yup.number().min(0, "Мінімум 0").optional(),
});

const PartnerDishForm: React.FC<PartnerDishFormProps> = ({ initialValues, onSubmit }) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => onSubmit(values as CreatePartnerDishDto)}
    >
      <Form className="flex flex-col gap-2">
        <label>Dish ID:</label>
        <Field type="number" name="dish_id" />
        <ErrorMessage name="dish_id" component="div" className="text-red-500" />

        <label>Price:</label>
        <Field type="number" name="price" />
        <ErrorMessage name="price" component="div" className="text-red-500" />

        <label>Available Portions:</label>
        <Field type="number" name="available_portions" />
        <ErrorMessage name="available_portions" component="div" className="text-red-500" />

        <label>Discount:</label>
        <Field type="number" name="discount" />
        <ErrorMessage name="discount" component="div" className="text-red-500" />

        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
          Зберегти
        </button>
      </Form>
    </Formik>
  );
};

export default PartnerDishForm;
