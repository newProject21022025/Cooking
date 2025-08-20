// src/app/partners/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchPartnerMenu,
  addPartnerDish,
  updatePartnerDish,
  deletePartnerDish,
} from "@/redux/slices/partnersSlice";
import PartnerDishForm from "@/components/partnerDishForm/PartnerDishForm";
import PartnerProfileForm from "@/components/partnerProfileForm/PartnerProfileForm";

const PartnerAdminPage = () => {
  const dispatch = useAppDispatch();
  const partnerId = "YOUR_PARTNER_ID"; // Вставити ID поточного партнера
  const { partnerDishes } = useAppSelector((state) => state.partners);

  const [editingDish, setEditingDish] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchPartnerMenu(partnerId));
  }, [dispatch, partnerId]);

  const handleAddOrUpdateDish = (dishData: any) => {
    if (editingDish) {
      dispatch(updatePartnerDish({ id: editingDish.id, data: dishData }));
      setEditingDish(null);
    } else {
      dispatch(addPartnerDish({ ...dishData, partner_id: partnerId }));
    }
  };

  const handleEditDish = (dish: any) => {
    setEditingDish(dish);
  };

  const handleDeleteDish = (id: string) => {
    dispatch(deletePartnerDish(id));
  };

  const handleUpdateProfile = (data: any) => {
    console.log("Update profile data:", data);
    // Тут можна додати dispatch для редагування профілю через partnersSlice
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Partner Admin</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Ваші дані</h2>
        <PartnerProfileForm initialValues={{ firstName: "", lastName: "" }} onSubmit={handleUpdateProfile} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Меню</h2>
        <PartnerDishForm
          initialValues={editingDish || { dish_id: 0, price: 0, available_portions: 1 }}
          onSubmit={handleAddOrUpdateDish}
        />

        <div className="mt-4">
          {partnerDishes.map((dish) => (
            <div key={dish.id} className="flex justify-between items-center border p-2 mb-2">
              <div>
                <strong>Dish ID:</strong> {dish.dish_id}, <strong>Price:</strong> {dish.price}, <strong>Portions:</strong> {dish.available_portions}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEditDish(dish)} className="bg-yellow-500 px-2 py-1 rounded text-white">
                  Edit
                </button>
                <button onClick={() => handleDeleteDish(dish.id)} className="bg-red-500 px-2 py-1 rounded text-white">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PartnerAdminPage;

