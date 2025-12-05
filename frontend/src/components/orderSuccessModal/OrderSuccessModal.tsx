// src/components/OrderSuccessModal/OrderSuccessModal.tsx
import React from "react";
import styles from "./OrderSuccessModal.module.scss";
import { useLocale } from "next-intl";

interface OrderSuccessModalProps {
  // Функція для закриття модального вікна
  onClose: () => void;
  // Стан, який контролює відображення модального вікна
  isVisible: boolean; 
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ 
  onClose, 
  isVisible 
}) => {
  const locale = useLocale();

  // Якщо isVisible false, компонент не рендериться
  if (!isVisible) {
    return null;
  }

  // Тексти, залежні від локалі. Можна винести в окремий файл/хук, 
  // або використовувати getMessage для динамічного виведення.
  const getMessage = () => {
    if (locale === "uk") {
      return {
        title: "Дякуємо Вам за замовлення!",
        message: "Наш менеджер зв'яжеться з вами найближчим часом",
      };
    } else { // 'en'
      return {
        title: "Thank you for your order!",
        message: "Our manager will contact you shortly",
      };
    }
  };

  const { title, message } = getMessage();

  return (
    // Оверлей, що закриває модальне вікно при кліку поза його межами
    <div className={styles.modalOverlay} onClick={onClose}>
      {/* Контент модального вікна */}
      <div 
        className={styles.modalContent} 
        onClick={(e) => e.stopPropagation()} // Зупиняємо спливання, щоб не закрити модалку
      >
        {/* Кнопка закриття */}
        <button 
          className={styles.modalCloseBtn} 
          aria-label={locale === "uk" ? "Закрити" : "Close"}
          onClick={onClose}
        >
          {/* Іконка 'X' */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        {/* Іконка успіху (Галочка) */}
        <div className={styles.successIconCircle}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        {/* Текстовий контент */}
        <h2 className={styles.modalTitle}>{title}</h2>
        <p className={styles.modalMessage}>{message}</p>

      </div>
    </div>
  );
};

export default OrderSuccessModal;