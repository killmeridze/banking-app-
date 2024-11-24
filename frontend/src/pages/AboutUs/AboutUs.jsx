import React, { useEffect, useRef } from "react";
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

  const missionRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  const footerRef = useRef(null);

  const {
    heroSpring,
    missionSpring,
    valuesSpring,
    teamSpring,
    footerSpring,
    setMissionVisible,
    setValuesVisible,
    setTeamVisible,
    setFooterVisible,
  } = useAboutAnimations();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === missionRef.current)
            setMissionVisible(entry.isIntersecting);
          if (entry.target === valuesRef.current)
            setValuesVisible(entry.isIntersecting);
          if (entry.target === teamRef.current)
            setTeamVisible(entry.isIntersecting);
          if (entry.target === footerRef.current)
            setFooterVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.15 }
    );

    [missionRef, valuesRef, teamRef, footerRef].forEach(
      (ref) => ref.current && observer.observe(ref.current)
    );

    return () => observer.disconnect();
  }, [setMissionVisible, setValuesVisible, setTeamVisible, setFooterVisible]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className={styles.about}>
      <Navigation />
      <animated.div style={heroSpring}>
        <Hero />
      </animated.div>

      <animated.section
        ref={missionRef}
        style={missionSpring}
        className={`${styles.section} ${styles.mission}`}
      >
        <Mission />
      </animated.section>

      <animated.section
        ref={valuesRef}
        style={valuesSpring}
        className={`${styles.section} ${styles.values}`}
      >
        <Values />
      </animated.section>

      <animated.section
        ref={teamRef}
        style={teamSpring}
        className={`${styles.section} ${styles.team}`}
      >
        <Team />
      </animated.section>

      <animated.footer ref={footerRef} style={footerSpring}>
        <Footer />
      </animated.footer>
    </div>
  );
};
