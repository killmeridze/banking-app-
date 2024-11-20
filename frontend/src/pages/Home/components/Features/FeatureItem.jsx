import { animated } from "@react-spring/web";
import { useIconAnimation } from "../../hooks/useAnimations";
import icons from "../../../../assets/img/icons.svg";

export const FeatureItem = ({
  image,
  icon,
  title,
  description,
  isReverse = false,
}) => {
  const iconAnimation = useIconAnimation();

  return (
    <section className={`feature-${isReverse ? "two" : "one"}`}>
      {!isReverse && <img src={image} alt={title} className="features__img" />}

      <div className="features__feature">
        <animated.div style={iconAnimation} className="features__icon">
          <svg>
            <use xlinkHref={`${icons}#icon-${icon}`}></use>
          </svg>
        </animated.div>
        <h5 className="features__header">{title}</h5>
        <p>{description}</p>
      </div>

      {isReverse && <img src={image} alt={title} className="features__img" />}
    </section>
  );
};
