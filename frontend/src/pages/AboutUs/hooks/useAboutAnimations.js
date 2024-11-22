import { useSpring, config } from "@react-spring/web";

export const useAboutAnimations = () => {
  const heroSpring = useSpring({
    from: { opacity: 0, transform: "translateY(-30px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.gentle,
  });

  const missionSpring = useSpring({
    from: { opacity: 0, transform: "translateX(-50px)" },
    to: { opacity: 1, transform: "translateX(0)" },
    delay: 200,
    config: config.gentle,
  });

  const valuesSpring = useSpring({
    from: { opacity: 0, transform: "translateY(30px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    delay: 400,
    config: config.gentle,
  });

  const teamSpring = useSpring({
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
    delay: 600,
    config: config.gentle,
  });

  return {
    heroSpring,
    missionSpring,
    valuesSpring,
    teamSpring,
  };
};
