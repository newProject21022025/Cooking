// src/components/ingredientCircle/IngredientCircle.tsx
import styles from "./IngredientCircle.module.scss";

interface Benefit {
  text: string;
}

interface IngredientCircleProps {
  image: string;
  name: string;
  benefits: Benefit[];
  onClose: () => void; // 🔥 Додаємо пропс onClose
}

const IngredientCircle: React.FC<IngredientCircleProps> = ({
  image,
  name,
  benefits,
  onClose, // 🔥 Приймаємо пропс onClose
}) => {
  return (
    <div className={styles.circleCard}>
      {/* 🔥 Додаємо кнопку закриття */}
      <button className={styles.closeButton} onClick={onClose}>
        &times;
      </button>
      
      <h2 className={styles.title}>{name}</h2>
      <div className={styles.centerImage}>
        <img src={image} alt={name} />
      </div>

      {benefits.map((b, i) => {
        const angle = (360 / benefits.length) * i;
        const radius = 200;
        return (
          <div
            key={i}
            className={styles.benefit}
            style={{
              transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`,
            }}
          >
            <span>{b.text}</span>
          </div>
        );
      })}
    </div>
  );
};

export default IngredientCircle;