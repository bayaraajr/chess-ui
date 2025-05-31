import { useContext } from "react";
import {
  ChessSettingsContext,
  type ChessSettingsContextProps,
} from "../context/ChessSettingsContext";

export const useChessSettings = (): ChessSettingsContextProps => {
  const context = useContext(ChessSettingsContext);
  if (!context) {
    throw new Error(
      "useChessSettings must be used within a ChessSettingsProvider"
    );
  }
  return context;
};
