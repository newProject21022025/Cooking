// src/components/ingredientCircle/IngredientCircle.tsx
import styles from "./IngredientCircle.module.scss";

interface Benefit {
  text: string;
}

interface IngredientCircleProps {
  image: string;
  name: string;
  benefits: Benefit[];
}

const IngredientCircle: React.FC<IngredientCircleProps> = ({
  image,
  name,
  benefits,
}) => {
  return (
    <div className={styles.circleCard}>
      <h2 className={styles.title}>{name}</h2>
      <div className={styles.centerImage}>
        <img src={image} alt={name} />
      </div>

      {benefits.map((b, i) => {
        const angle = (360 / benefits.length) * i;
        const radius = 200; // ✅ тут регулюєш відстань від центру
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
