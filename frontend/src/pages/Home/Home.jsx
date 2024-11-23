import React, { useEffect, useRef } from "react";
import { animated } from "@react-spring/web";
import { useHomeAnimations } from "./hooks/useAnimations";

// Hook imports
import { useNavigation } from "./hooks/useNavigation";
import { useSlider } from "./hooks/useSlider";
import { useSectionObserver } from "./hooks/useSectionObserver";
import { useImageLoader } from "./hooks/useImageLoader";
import { usePageTitle } from "../../hooks/usePageTitle";

// Component imports
import { Header } from "./components/Header/Header";
import { Features } from "./components/Features/Features";
import { Operations } from "./components/Operations/Operations";
import { Testimonials } from "./components/Testimonials/Testimonials";
import { Footer } from "./components/Footer/Footer";
import { SignUp } from "./components/SignUp/SignUp";

export const Home = () => {
  const navRef = useRef(null);
  const headerRef = useRef(null);
  const section1Ref = useRef(null);

  const { handleNavHover } = useNavigation(navRef, headerRef);
  const { nextSlide, prevSlide, handleDotClick } = useSlider();

  useSectionObserver();
  usePageTitle("Ваш Цифровой Банк");
  useImageLoader();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleLearnMore = () => {
    section1Ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const {
    headerSpring,
    featuresSpring,
    operationsSpring,
    testimonialsSpring,
    logoSpring,
    setLogoSpring,
  } = useHomeAnimations();

  return (
    <>
      <animated.div style={headerSpring}>
        <Header
          headerRef={headerRef}
          navRef={navRef}
          handleNavHover={handleNavHover}
          handleLearnMore={handleLearnMore}
          logoSpring={logoSpring}
          setLogoSpring={setLogoSpring}
        />
      </animated.div>

      <animated.section style={featuresSpring}>
        <Features sectionRef={section1Ref} />
      </animated.section>

      <animated.section style={operationsSpring}>
        <Operations />
      </animated.section>

      <animated.section style={testimonialsSpring}>
        <Testimonials
          nextSlide={nextSlide}
          prevSlide={prevSlide}
          handleDotClick={handleDotClick}
        />
      </animated.section>

      <SignUp />

      <Footer />

      <div className="overlay hidden"></div>
    </>
  );
};
