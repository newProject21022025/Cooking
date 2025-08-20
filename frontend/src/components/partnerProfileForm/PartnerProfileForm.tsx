"use client";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Partner } from "@/types/partner";

interface PartnerProfileFormProps {
  initialValues: Partial<Partner>;
  onSubmit: (values: Partial<Partner>) => void;
}

const validationSchema = Yup.object({
  firstName: Yup.string().required("Вкажіть ім’я"),
  lastName: Yup.string().required("Вкажіть прізвище"),
  phoneNumber: Yup.string().optional(),
  deliveryAddress: Yup.string().optional(),
});

const PartnerProfileForm: React.FC<PartnerProfileFormProps> = ({ initialValues, onSubmit }) => {
  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      <Form className="flex flex-col gap-2">
        <label>First Name:</label>
        <Field name="firstName" />
        <ErrorMessage name="firstName" component="div" className="text-red-500" />

        <label>Last Name:</label>
        <Field name="lastName" />
        <ErrorMessage name="lastName" component="div" className="text-red-500" />

        <label>Phone Number:</label>
        <Field name="phoneNumber" />
        <ErrorMessage name="phoneNumber" component="div" className="text-red-500" />

        <label>Delivery Address:</label>
        <Field name="deliveryAddress" />
        <ErrorMessage name="deliveryAddress" component="div" className="text-red-500" />

        <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded">
          Зберегти дані
        </button>
      </Form>
    </Formik>
  );
};

export default PartnerProfileForm;
