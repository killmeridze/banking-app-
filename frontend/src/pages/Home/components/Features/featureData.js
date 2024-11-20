import digitalImg from "../../../../assets/img/digital.jpg";
import growImg from "../../../../assets/img/grow.jpg";
import cardImg from "../../../../assets/img/card.jpg";

export const featureItems = [
  {
    image: digitalImg,
    icon: "monitor",
    title: "100% цифровой банк",
    description:
      "Мы предлагаем полностью цифровые банковские услуги, позволяющие вам управлять своими финансами удобно и эффективно.",
    isReverse: false,
  },
  {
    image: growImg,
    icon: "trending-up",
    title: "Смотрите, как растут ваши деньги",
    description:
      "Используйте наши инвестиционные продукты и смотрите, как ваш капитал растет благодаря выгодным условиям.",
    isReverse: true,
  },
  {
    image: cardImg,
    icon: "credit-card",
    title: "Бесплатная дебетовая карта включена",
    description:
      "Получите бесплатную дебетовую карту при открытии счета. Простое и удобное управление вашими средствами.",
    isReverse: false,
  },
];
