import { Link } from "react-router-dom";
import { animated } from "@react-spring/web";
import { useWaveAnimation } from "../../hooks/useAnimations";

export const SignUp = () => {
  const waveAnimation = useWaveAnimation();

  return (
    <section className="section section--sign-up">
      <div className="section__title">
        <h3 className="section__header">
          Лучший день, чтобы присоединиться к Банкисту был год назад. Следующий
          лучший день - сегодня!
        </h3>
      </div>
      <animated.div style={waveAnimation}>
        <Link
          to="/register"
          className="btn btn--show-modal"
          id="open-account-btn"
        >
          Откройте свой счет сегодня!
        </Link>
      </animated.div>
    </section>
  );
};
