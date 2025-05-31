import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: "en",
    debug: true,
    resources: {
      en: {
        translation: {
          welcome: "Welcome to the Chess Game",
          play: "Play",
          settings: "Settings",
          about: "About",
          newGame: "New Game",
          opponent: "Opponent",
          player: "Player",
          vs: "vs",
          move: "Move",
          gameOver: "Game Over",
        },
      },
      mn: {
        translation: {
          welcome: "Шатарын тоглоомд тавтай морил",
          play: "Тоглох",
          settings: "Тохиргоо",
          about: "Тухай",
          newGame: "Шинэ тоглоом",
          opponent: "Өрсөлдөгч",
          player: "Тоглогч",
          vs: "vs",
          move: "Алхам",
          gameOver: "Тоглоом дууссан",
        },
      },
    },
  });

export default i18n;
