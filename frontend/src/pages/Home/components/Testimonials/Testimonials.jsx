import { testimonialsData } from "./testimonialsData";
import { TestimonialSlide } from "./TestimonialSlide";
import { SectionTitle } from "../SectionTitle";

export const Testimonials = ({ nextSlide, prevSlide, handleDotClick }) => {
  return (
    <section className="section" id="section--3">
      <SectionTitle
        description="Все еще не уверены?"
        header="Миллионы пользователей Банкиста уже упростили свою жизнь."
      />

      <div className="slider">
        {testimonialsData.map((testimonial) => (
          <TestimonialSlide key={testimonial.id} testimonial={testimonial} />
        ))}

        <button onClick={prevSlide} className="slider__btn slider__btn--left">
          &larr;
        </button>
        <button onClick={nextSlide} className="slider__btn slider__btn--right">
          &rarr;
        </button>
        <div className="dots" onClick={handleDotClick}></div>
      </div>
    </section>
  );
};
