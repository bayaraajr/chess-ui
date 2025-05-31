import { Toaster } from "sonner";
import Play from "./features/play";
import Start from "./features/start";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChessSettingsProvider } from "./context/ChessSettingsContext";
import { ThemeToggle } from "./components/ui/theme-toggle";
import { LanguageToggle } from "./components/ui/lang-toggle";
import { I18nextProvider } from "react-i18next";
import i18n from "./lib/i18n";

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ChessSettingsProvider>
        <div className="px-4 py-1 flex justify-between gap-4 border-b">
          <a href="/" className="flex items-center gap-2">
            <img src="/bk.png" alt="Chess AI Logo" className="w-12 h-12" />
            <p>Chess AI</p>
          </a>
          <div className="flex items-center gap-2 justify-end">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/play" element={<Play />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </ChessSettingsProvider>
    </I18nextProvider>
  );
}
