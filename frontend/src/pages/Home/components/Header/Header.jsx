import { Navigation } from "./Navigation";
import heroImg from "../../../../assets/img/hero.png";

export const Header = ({
  headerRef,
  navRef,
  handleNavHover,
  handleLearnMore,
}) => {
  return (
    <header className="header" ref={headerRef}>
      <Navigation navRef={navRef} handleNavHover={handleNavHover} />

      <div className="header__title">
        <section className="header-content">
          <h1>
            Когда <span className="highlight">банкинг</span> встречается с{" "}
            <span className="highlight">минималистом</span>
          </h1>
          <h4>Более простой банковский опыт для более простой жизни.</h4>
          <button
            className="btn--text btn--scroll-to"
            onClick={handleLearnMore}
          >
            Узнать больше ↓
          </button>
        </section>

        <img
          src={heroImg}
          className="header__img"
          alt="Минималистичные банковские предметы"
        />
      </div>
    </header>
  );
};
