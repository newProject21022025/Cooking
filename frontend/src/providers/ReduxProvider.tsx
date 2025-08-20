// src/providers/ReduxProvider.tsx
"use client"; // This component is explicitly a Client Component

import { Provider } from "react-redux";
import { store } from "@/redux/store"; // Your Redux store
import UserLoader from "@/components/UserLoader"; // Your UserLoader component
import React from "react"; // Explicitly import React

interface ReduxProviderProps {
  children: React.ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <UserLoader>
        {children}
      </UserLoader>
    </Provider>
  );
}
