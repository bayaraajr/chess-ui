// src/components/LanguageToggle.tsx
import { useTranslation } from "react-i18next";
import { Button } from "./button";

export function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "mn" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("i18nextLng", newLang); // optional, i18next handles this automatically in most setups
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="secondary"
      aria-label="Toggle language"
    >
      <img
        src={i18n.language === "en" ? "/mn.png" : "/us.png"}
        alt="Language Icon"
        className="w-4 h-4 inline-block"
      />
      {i18n.language === "en" ? "Монгол" : "English"}
    </Button>
  );
}
