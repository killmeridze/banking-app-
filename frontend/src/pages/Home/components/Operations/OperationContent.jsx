import { animated } from "@react-spring/web";
import {
  useContentAnimation,
  useCardRotation,
} from "../../hooks/useAnimations";
import icons from "../../../../assets/img/icons.svg";

export const OperationContent = ({ content, isActive, tabNumber }) => {
  const contentAnimation = useContentAnimation(isActive);
  const cardAnimation = useCardRotation();

  return (
    <animated.div
      style={{
        ...contentAnimation,
        ...cardAnimation,
      }}
      className={`operations__content operations__content--${tabNumber}`}
    >
      <div className={`operations__icon operations__icon--${tabNumber}`}>
        <svg>
          <use xlinkHref={`${icons}#icon-${content.icon}`}></use>
        </svg>
      </div>
      <h5 className="operations__header">{content.title}</h5>
      <p id="operations__body">{content.description}</p>
    </animated.div>
  );
};
