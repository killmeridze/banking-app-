import { FeatureItem } from "./FeatureItem";
import { featureItems } from "./featureData";
import { SectionTitle } from "../SectionTitle";

export const Features = ({ sectionRef }) => {
  return (
    <section className="section section-1" id="section--1" ref={sectionRef}>
      <SectionTitle
        description="Функционал"
        header="Всё, что вам нужно в современном банке, и даже больше."
      />

      <div className="features">
        {featureItems.map((item, index) => (
          <FeatureItem key={index} {...item} />
        ))}
      </div>
    </section>
  );
};
