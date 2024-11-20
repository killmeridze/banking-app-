import { useSpring, config } from "@react-spring/web";

export const useLoginAnimations = () => {
  const containerSpring = useSpring({
    from: { opacity: 0, transform: "translateY(30px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.gentle,
  });

  const [logoSpring, setLogoSpring] = useSpring(() => ({
    scale: 1,
    config: config.wobbly,
  }));

  const formSpring = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    delay: 200,
    config: config.gentle,
  });

  const titleSpring = useSpring({
    from: { opacity: 0, x: -20 },
    to: { opacity: 1, x: 0 },
    delay: 100,
    config: config.gentle,
  });

  return {
    containerSpring,
    logoSpring,
    setLogoSpring,
    formSpring,
    titleSpring,
  };
};
