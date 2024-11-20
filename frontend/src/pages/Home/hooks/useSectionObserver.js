import { useEffect } from "react";

export const useSectionObserver = () => {
  useEffect(() => {
    const allSections = document.querySelectorAll(".section");

    const revealSection = (entries, observer) => {
      const [entry] = entries;
      if (!entry.isIntersecting) return;
      entry.target.classList.remove("section--hidden");
      observer.unobserve(entry.target);
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
      root: null,
      threshold: 0.15,
    });

    allSections.forEach((section) => {
      sectionObserver.observe(section);
      section.classList.add("section--hidden");
    });

    return () => {
      allSections.forEach((section) => sectionObserver.unobserve(section));
    };
  }, []);
};
