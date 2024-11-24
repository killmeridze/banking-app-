import { useState } from "react";
import { useSpring } from "@react-spring/web";
import { config } from "@react-spring/web";

export const useAboutAnimations = () => {
  const [missionVisible, setMissionVisible] = useState(false);
  const [valuesVisible, setValuesVisible] = useState(false);
  const [teamVisible, setTeamVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  const heroSpring = useSpring({
    from: { opacity: 0, transform: "translateY(-30px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.gentle,
  });

  const missionSpring = useSpring({
    opacity: missionVisible ? 1 : 0,
    transform: missionVisible ? "translateY(0)" : "translateY(8rem)",
    config: { mass: 1, tension: 80, friction: 26 },
  });

  const valuesSpring = useSpring({
    opacity: valuesVisible ? 1 : 0,
    transform: valuesVisible ? "translateY(0)" : "translateY(8rem)",
    config: { mass: 1, tension: 80, friction: 26 },
  });

  const teamSpring = useSpring({
    opacity: teamVisible ? 1 : 0,
    transform: teamVisible ? "translateY(0)" : "translateY(8rem)",
    config: { mass: 1, tension: 80, friction: 26 },
  });

  const footerSpring = useSpring({
    opacity: footerVisible ? 1 : 0,
    transform: footerVisible ? "translateY(0)" : "translateY(8rem)",
    config: { mass: 1, tension: 80, friction: 26 },
  });

  return {
    heroSpring,
    missionSpring,
    valuesSpring,
    teamSpring,
    footerSpring,
    setMissionVisible,
    setValuesVisible,
    setTeamVisible,
    setFooterVisible,
  };
};
