import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { ChessSettings } from "../types/ChessSettings";

export interface ChessSettingsContextProps {
  settings: ChessSettings;
  updateSettings: (updates: Partial<ChessSettings>) => void;
}

const LOCAL_STORAGE_KEY = "chessSettings";

const defaultSettings: ChessSettings = {
  difficulty: "medium",
  playerColor: "white",
  timeControl: "10min",
};

export const ChessSettingsContext = createContext<
  ChessSettingsContextProps | undefined
>(undefined);

export const ChessSettingsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [settings, setSettings] = useState<ChessSettings>(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultSettings;
  });

  // Persist to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (updates: Partial<ChessSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  return (
    <ChessSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </ChessSettingsContext.Provider>
  );
};
