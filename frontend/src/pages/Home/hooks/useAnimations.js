import { useSpring, config } from "@react-spring/web";

export const useRevealAnimation = (isVisible) => {
  return useSpring({
    from: { opacity: 0, transform: "translateY(100px)" },
    to: {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0)" : "translateY(100px)",
    },
    config: { mass: 1, tension: 280, friction: 60 },
  });
};

export const useTabAnimation = (isActive) => {
  return useSpring({
    transform: isActive ? "translateY(-66%)" : "translateY(-50%)",
    config: { tension: 300, friction: 20 },
  });
};

export const useSlideAnimation = (offset) => {
  return useSpring({
    transform: `translateX(${offset}%)`,
    config: { mass: 1, tension: 280, friction: 60 },
  });
};

export const useStickyAnimation = (isSticky) => {
  return useSpring({
    backgroundColor: isSticky ? "rgba(255, 255, 255, 0.95)" : "transparent",
    config: { duration: 200 },
  });
};

export const useContentAnimation = (isActive) => {
  return useSpring({
    from: {
      opacity: 0,
      transform: "translateY(20px)",
      gridTemplateColumns: "7rem 1fr",
      columnGap: "3rem",
      rowGap: "0.5rem",
    },
    to: {
      opacity: isActive ? 1 : 0,
      transform: isActive ? "translateY(0px)" : "translateY(20px)",
      display: isActive ? "grid" : "none",
      gridTemplateColumns: "7rem 1fr",
      columnGap: "3rem",
      rowGap: "0.5rem",
    },
    config: { tension: 300, friction: 20 },
  });
};

export const useIconAnimation = () => {
  return useSpring({
    from: { rotate: 0 },
    to: async (next) => {
      while (true) {
        await next({ rotate: 5 });
        await next({ rotate: -5 });
        await next({ rotate: 0 });
      }
    },
    config: { duration: 3000 },
    loop: true,
  });
};

export const useWaveAnimation = () => {
  return useSpring({
    from: { y: 0 },
    to: async (next) => {
      while (true) {
        await next({ y: -3 });
        await next({ y: 3 });
        await next({ y: 0 });
      }
    },
    config: { tension: 300, friction: 10 },
    loop: true,
  });
};

export const useCardRotation = () => {
  return useSpring({
    from: {
      transform: "perspective(1000px) rotateX(0deg)",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    to: {
      transform: "perspective(1000px) rotateX(3deg)",
      boxShadow: "0 8px 12px rgba(0, 0, 0, 0.2)",
    },
    config: { tension: 200, friction: 20 },
  });
};

export const useHomeAnimations = () => {
  const headerSpring = useSpring({
    from: { opacity: 0, transform: "translateY(-30px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.gentle,
  });

  const featuresSpring = useSpring({
    from: { opacity: 0, transform: "translateX(-50px)" },
    to: { opacity: 1, transform: "translateX(0)" },
    delay: 200,
    config: config.gentle,
  });

  const operationsSpring = useSpring({
    from: { opacity: 0, transform: "translateY(30px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    delay: 400,
    config: config.gentle,
  });

  const testimonialsSpring = useSpring({
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
    delay: 600,
    config: config.gentle,
  });

  const [logoSpring, setLogoSpring] = useSpring(() => ({
    scale: 1,
    config: config.wobbly,
  }));

  return {
    headerSpring,
    featuresSpring,
    operationsSpring,
    testimonialsSpring,
    logoSpring,
    setLogoSpring,
  };
};
