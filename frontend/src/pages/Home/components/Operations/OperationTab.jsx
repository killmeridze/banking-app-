import { animated } from "@react-spring/web";
import { useTabAnimation } from "../../hooks/useAnimations";

export const OperationTab = ({ tab, isActive, onClick, tabNumber }) => {
  const animation = useTabAnimation(isActive);

  return (
    <animated.button
      style={animation}
      className={`btn operations__tab operations__tab--${tabNumber}`}
      onClick={onClick}
      data-tab={tabNumber}
    >
      <span>{tab.number}</span>
      {tab.label}
    </animated.button>
  );
};
