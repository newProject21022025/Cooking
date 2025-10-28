// src/components/ProfileView/ProfileView.tsx
import styles from "./ProfileForm.module.scss";
import { User } from "@/types/user";

interface ProfileViewProps {
  user: User;
  onEdit: () => void;
}

export default function ProfileView({ user, onEdit }: ProfileViewProps) {
  return (
    <>
      <div className={styles.avatarContainer}>
        {user.photo ? (
          <img
            src={user.photo}
            alt="Аватар користувача"
            className={styles.avatar}
          />
        ) : (
          <div className={styles.placeholderAvatar}>Немає фото</div>
        )}
      </div>

      <p>
        <strong>ID:</strong> {user.id}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Ім'я:</strong> {user.firstName}
      </p>
      <p>
        <strong>Прізвище:</strong> {user.lastName}
      </p>
      {user.phoneNumber && (
        <p>
          <strong>Телефон:</strong> {user.phoneNumber}
        </p>
      )}
      {user.deliveryAddress && (
        <p>
          <strong>Адреса доставки:</strong> {user.deliveryAddress}
        </p>
      )}
      <p>
        <strong>Роль:</strong> {user.role}
      </p>
      {user.averageRating !== null && (
        <p>
          <strong>Середній рейтинг:</strong> {user.averageRating}
        </p>
      )}

      <button
        type="button"
        className={styles.editButton}
        onClick={onEdit}
      >
        Редагувати профіль
      </button>
    </>
  );
}