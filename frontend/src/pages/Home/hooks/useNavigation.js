import { useEffect } from "react";

export const useNavigation = (navRef, headerRef) => {
  const handleNavHover = (e, opacity) => {
    if (e.target.classList.contains("nav__link")) {
      const siblings = e.target.closest(".nav").querySelectorAll(".nav__link");
      const logo = e.target.closest(".nav").querySelector("img");
      siblings.forEach((el) => {
        if (el !== e.target) el.style.opacity = opacity;
      });
      if (logo) logo.style.opacity = opacity;
    }
  };

  useEffect(() => {
    const nav = navRef.current;
    const header = headerRef.current;
    const navHeight = nav?.getBoundingClientRect().height;

    const stickyNav = (entries) => {
      const [entry] = entries;
      nav.style.transition = "all 0.3s";
      if (!entry.isIntersecting) {
        nav.classList.add("sticky");
      } else {
        nav.classList.remove("sticky");
      }
    };

    const headerObserver = new IntersectionObserver(stickyNav, {
      root: null,
      threshold: 0,
      rootMargin: `-${navHeight}px`,
    });

    if (header) headerObserver.observe(header);
    return () => header && headerObserver.unobserve(header);
  }, [navRef, headerRef]);

  return { handleNavHover };
};
