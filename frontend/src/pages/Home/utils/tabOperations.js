export const handleTabClick = (e, tabNumber) => {
  const clicked = e.target.closest(".operations__tab");
  if (!clicked) return;

  document
    .querySelectorAll(".operations__tab")
    .forEach((tab) => tab.classList.remove("operations__tab--active"));
  document
    .querySelectorAll(".operations__content")
    .forEach((content) =>
      content.classList.remove("operations__content--active")
    );

  clicked.classList.add("operations__tab--active");
  document
    .querySelector(`.operations__content--${tabNumber}`)
    ?.classList.add("operations__content--active");
};
