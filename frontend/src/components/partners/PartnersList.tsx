// src/components/partners/PartnersList.tsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchPartners, setSelectedPartner } from "@/redux/slices/partnersSlice";
import { useRouter, usePathname } from "next/navigation";


const PartnersList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname(); // поточний шлях
  const locale = pathname.split("/")[1]; // витягуємо locale з URL

  const { partners, loading, error } = useSelector(
    (state: RootState) => state.partners
  );

  useEffect(() => {
    dispatch(fetchPartners());
  }, [dispatch]);

  if (loading) return <p>Завантаження партнерів...</p>;
  if (error) return <p>Помилка: {error}</p>;

  const handlePartnerClick = (partnerId: string) => {
    dispatch(setSelectedPartner(partnerId)); // зберігаємо у Redux
    router.push(`/${locale}/buyDishes/dishes?partnerId=${partnerId}`);
  };
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Наші партнери</h2>
      <ul className="space-y-2">
        {partners.map((partner) => (
          <li
            key={partner.id}
            className="border p-2 rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => handlePartnerClick(partner.id)}
          >
            {partner.firstName} {partner.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PartnersList;
