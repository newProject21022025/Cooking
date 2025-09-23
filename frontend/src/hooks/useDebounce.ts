// src/hooks/useDebounce.ts

import { useState, useEffect } from "react";

/**
 * Хук для затримки оновлення значення.
 * @param value Значення, яке потрібно затримати.
 * @param delay Затримка в мілісекундах.
 * @returns Затримане значення.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Встановлюємо таймер, який оновлює debouncedValue після затримки
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Очищаємо таймер, якщо value змінилося (або компонент розмонтувався)
    // Це запобігає виконанню застарілих таймерів
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}