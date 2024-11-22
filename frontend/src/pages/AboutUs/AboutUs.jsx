import React, { useEffect } from "react";
import { animated } from "@react-spring/web";
import { usePageTitle } from "../../hooks/usePageTitle";
import { Navigation } from "./components/Navigation/Navigation";
import { Hero } from "./components/Hero/Hero";
import { Mission } from "./components/Mission/Mission";
import { Team } from "./components/Team/Team";
import { Values } from "./components/Values/Values";
import { Footer } from "./components/Footer/Footer";
import { useAboutAnimations } from "./hooks/useAboutAnimations";
import styles from "./AboutUs.module.css";

export const AboutUs = () => {
  usePageTitle("О нас");
  const { heroSpring, missionSpring, valuesSpring, teamSpring } =
    useAboutAnimations();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className={styles.about}>
      <Navigation />
      <animated.div style={heroSpring}>
        <Hero />
      </animated.div>

      <animated.section style={missionSpring}>
        <Mission />
      </animated.section>

      <animated.section style={valuesSpring}>
        <Values />
      </animated.section>

      <animated.section style={teamSpring}>
        <Team />
      </animated.section>
      <Footer />
    </div>
  );
};
