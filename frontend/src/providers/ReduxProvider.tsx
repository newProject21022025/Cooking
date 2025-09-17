// src/providers/ReduxProvider.tsx
"use client";

import { Provider, useSelector } from "react-redux";
import { store, RootState } from "@/redux/store";
import UserLoader from "@/components/UserLoader";
import React, { useEffect, ReactNode } from "react";

interface ReduxProviderProps {
  children: ReactNode;
}

// Компонент, що керує скролінгом
const ScrollLocker = ({ children }: { children: ReactNode }) => {
  const isModalOpen = useSelector((state: RootState) => state.modal.isModalOpen);

  useEffect(() => {
    // Зберігаємо початкове значення overflow
    const originalStyle = window.getComputedStyle(document.documentElement).overflow;
    const bodyOriginalStyle = window.getComputedStyle(document.body).overflow;
    
    // Блокуємо скрол для html та body
    if (isModalOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = originalStyle;
      document.body.style.overflow = bodyOriginalStyle;
    }

    // Очисна функція, яка повертає початкові стилі
    return () => {
      document.documentElement.style.overflow = originalStyle;
      document.body.style.overflow = bodyOriginalStyle;
    };
  }, [isModalOpen]);

  return <>{children}</>;
};

export function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <UserLoader>
        <ScrollLocker>{children}</ScrollLocker>
      </UserLoader>
    </Provider>
  );
}

// // src/providers/ReduxProvider.tsx
// "use client"; // This component is explicitly a Client Component

// import { Provider } from "react-redux";
// import { store } from "@/redux/store"; // Your Redux store
// import UserLoader from "@/components/UserLoader"; // Your UserLoader component
// import React from "react"; // Explicitly import React

// interface ReduxProviderProps {
//   children: React.ReactNode;
// }

// export function ReduxProvider({ children }: ReduxProviderProps) {
//   return (
//     <Provider store={store}>
//       <UserLoader>
//         {children}
//       </UserLoader>
//     </Provider>
//   );
// }
