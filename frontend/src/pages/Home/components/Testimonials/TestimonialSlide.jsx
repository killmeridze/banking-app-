import { animated } from "@react-spring/web";
import { useSlideAnimation } from "../../hooks/useAnimations";

export const TestimonialSlide = ({ testimonial, offset }) => {
  const animation = useSlideAnimation(offset);

  return (
    <animated.div style={animation} className="slide">
      <div className="testimonial">
        <h5 className="testimonial__header">{testimonial.header}</h5>
        <blockquote className="testimonial__text">
          {testimonial.text}
        </blockquote>
        <address className="testimonial__author">
          <img
            src={testimonial.author.photo}
            alt=""
            className="testimonial__photo"
          />
          <h6 className="testimonial__name">{testimonial.author.name}</h6>
          <p className="testimonial__location">{testimonial.author.location}</p>
        </address>
      </div>
    </animated.div>
  );
};
