// types/ChessSettings.ts
export type Difficulty = "easy" | "medium" | "hard";
export type PlayerColor = "white" | "black";
export type TimeControl = "3min" | "10min" | "no-time";

export interface ChessSettings {
  difficulty: Difficulty;
  playerColor: PlayerColor;
  timeControl: TimeControl;
}
