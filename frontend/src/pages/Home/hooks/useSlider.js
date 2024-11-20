import { useState, useCallback, useEffect } from "react";

export const useSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const createDots = () => {
    const slides = document.querySelectorAll(".slide");
    const dotContainer = document.querySelector(".dots");
    dotContainer.innerHTML = "";
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = (slide) => {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      ?.classList.add("dots__dot--active");
  };

  const nextSlide = useCallback(() => {
    const slides = document.querySelectorAll(".slide");
    setCurrentSlide((curr) => {
      const newSlide = curr === slides.length - 1 ? 0 : curr + 1;
      activateDot(newSlide);
      return newSlide;
    });
  }, []);

  const prevSlide = useCallback(() => {
    const slides = document.querySelectorAll(".slide");
    setCurrentSlide((curr) => {
      const newSlide = curr === 0 ? slides.length - 1 : curr - 1;
      activateDot(newSlide);
      return newSlide;
    });
  }, []);

  useEffect(() => {
    const slides = document.querySelectorAll(".slide");
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
    });
  }, [currentSlide]);

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [nextSlide, prevSlide]);

  useEffect(() => {
    createDots();
    activateDot(0);
  }, []);

  const handleDotClick = (e) => {
    if (e.target.classList.contains("dots__dot")) {
      const slide = parseInt(e.target.dataset.slide);
      setCurrentSlide(slide);
      activateDot(slide);
    }
  };

  return { currentSlide, nextSlide, prevSlide, handleDotClick };
};
