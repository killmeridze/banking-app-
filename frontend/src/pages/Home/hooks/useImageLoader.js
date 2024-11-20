import { useEffect } from "react";

export const useImageLoader = () => {
  useEffect(() => {
    const imgTargets = document.querySelectorAll("img[data-src]");

    const loadImg = (entries, observer) => {
      const [entry] = entries;
      if (!entry.isIntersecting) return;
      entry.target.src = entry.target.dataset.src;
      entry.target.addEventListener("load", () => {
        entry.target.classList.remove("lazy-img");
      });
      observer.unobserve(entry.target);
    };

    const imgObserver = new IntersectionObserver(loadImg, {
      root: null,
      threshold: 0,
      rootMargin: "50px",
    });

    imgTargets.forEach((img) => imgObserver.observe(img));
    return () => imgTargets.forEach((img) => imgObserver.unobserve(img));
  }, []);
};
