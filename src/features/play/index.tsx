import { useEffect, useState, useRef, useCallback } from "react";
import { Chess, type Color, type Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useChessSettings } from "@/hooks/use-chess-settings";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  Difficulty,
  PlayerColor,
  TimeControl,
} from "@/types/ChessSettings";
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

function Play() {
  const { t } = useTranslation();
  const { settings, updateSettings } = useChessSettings();
  const [game, setGame] = useState(() => new Chess());
  const [moves, setMoves] = useState<string[]>([]);
  const [fens, setFens] = useState<string[]>([new Chess().fen()]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(0);
  const [localSettings, setLocalSettings] = useState(settings);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [whiteTime, setWhiteTime] = useState<number>(getInitialTime);
  const [blackTime, setBlackTime] = useState<number>(getInitialTime);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const boardContainerRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState(400);

  const isTimeEnabled = settings.timeControl !== "no-time";

  function getInitialTime() {
    switch (localSettings.timeControl) {
      case "3min":
        return 180;
      case "10min":
        return 600;
      default:
        return Infinity;
    }
  }

  const formatTime = (seconds: number) => {
    if (seconds === Infinity) return "∞";
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (boardContainerRef.current) {
        const size = boardContainerRef.current.offsetWidth;
        setBoardSize(Math.max(size, 250));
      }
    });

    if (boardContainerRef.current) {
      observer.observe(boardContainerRef.current);
      setBoardSize(boardContainerRef.current.offsetWidth);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isTimeEnabled) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setWhiteTime((prev) =>
        game.turn() === "w" ? Math.max(prev - 1, 0) : prev
      );
      setBlackTime((prev) =>
        game.turn() === "b" ? Math.max(prev - 1, 0) : prev
      );
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [game, isTimeEnabled]);

  useEffect(() => {
    if (!isTimeEnabled) return;

    if (whiteTime === 0 || blackTime === 0) {
      alert(
        `${whiteTime === 0 ? t("white") : t("black")} ${t("ranOutOfTime")}`
      );
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [whiteTime, blackTime, isTimeEnabled, t]);

  const onDrop = useCallback(
    (sourceSquare: Square, targetSquare: Square) => {
      if (isTimeEnabled && (whiteTime === 0 || blackTime === 0)) return false;

      const tempGame = new Chess(game.fen());
      const move = tempGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (tempGame.isGameOver()) {
        if (tempGame.isCheckmate()) {
          toast.success(t("checkmate"), {
            description:
              tempGame.turn() === (settings.playerColor as Color)
                ? t("youLose")
                : t("youWin"),
          });
        } else {
          toast.warning(t("draw"), {
            description: t("gameDrawn"),
          });
        }
      }

      if (!move) return false;

      const newFen = tempGame.fen();
      setMoves((prev) => [...prev, `${sourceSquare}${targetSquare}`]);
      setFens((prev) => [...prev, newFen]);
      setCurrentMoveIndex((prev) => prev + 1);
      setGame(new Chess(newFen));

      axios
        .post("http://localhost:5000/predict", {
          fen: newFen,
          difficulty: settings.difficulty,
        })
        .then((response) => {
          const aiMove = response.data.move;
          tempGame.move(aiMove);
          const updatedFen = tempGame.fen();
          setMoves((prev) => [...prev, aiMove]);
          setFens((prev) => [...prev, updatedFen]);
          setCurrentMoveIndex((prev) => prev + 1);
          setGame(new Chess(updatedFen));
        });

      return true;
    },
    [
      isTimeEnabled,
      whiteTime,
      blackTime,
      game,
      settings.difficulty,
      settings.playerColor,
      t,
    ]
  );

  const handleNewGame = () => {
    updateSettings(localSettings);
    const newGame = new Chess();
    setGame(newGame);
    setMoves([]);
    setFens([newGame.fen()]);
    setCurrentMoveIndex(0);
    setWhiteTime(getInitialTime());
    setBlackTime(getInitialTime());
    setDialogOpen(false);

    if (localSettings.playerColor === "black") {
      axios
        .post("http://localhost:5000/predict", {
          fen: newGame.fen(),
          difficulty: localSettings.difficulty,
        })
        .then((response) => {
          const aiMove = response.data.move;
          newGame.move(aiMove);
          const updatedFen = newGame.fen();
          setMoves([aiMove]);
          setFens([newGame.fen(), updatedFen]);
          setGame(new Chess(updatedFen));
          setCurrentMoveIndex(1);
        });
    }
  };

  const handleMoveClick = (index: number) => {
    if (index + 1 < fens.length) {
      setGame(new Chess(fens[index + 1]));
      setCurrentMoveIndex(index + 1);
    }
  };

  const renderPlayer = (label: string) => {
    const isPlayerWhite = settings.playerColor === "white";
    const time =
      label === t("you")
        ? isPlayerWhite
          ? whiteTime
          : blackTime
        : isPlayerWhite
        ? blackTime
        : whiteTime;
    const avatarSrc =
      label === t("you")
        ? isPlayerWhite
          ? "/wk.png"
          : "/bk.png"
        : isPlayerWhite
        ? "/bk.png"
        : "/wk.png";

    return (
      <div className="flex items-center gap-2 mb-2">
        <Avatar>
          <AvatarImage src={avatarSrc} />
        </Avatar>
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{formatTime(time)}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-6 p-4 max-w-7xl mx-auto">
      <div className="col-span-full md:col-span-4 flex justify-center items-center w-full">
        <div
          ref={boardContainerRef}
          className="w-full max-w-[600px] aspect-square"
        >
          <Chessboard
            position={game.fen()}
            onPieceDrop={onDrop}
            boardOrientation={settings.playerColor}
            boardWidth={boardSize}
          />
        </div>
      </div>

      <div className="md:col-span-1 space-y-4">
        <div className="col-span-full md:col-span-1 order-last md:order-none">
          <p className="text-sm font-semibold mb-2">{t("moves")}</p>
          <ScrollArea className="h-[200px] w-[350px]">
            {moves.map((move, idx) => (
              <Badge
                onClick={() => handleMoveClick(idx)}
                variant="secondary"
                className={
                  currentMoveIndex === idx + 1
                    ? "bg-blue-500 text-white dark:bg-blue-600 cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700"
                    : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
                }
              >
                {move}
              </Badge>
            ))}
          </ScrollArea>
        </div>

        <div className="flex justify-evenly items-center gap-4 mb-4">
          {renderPlayer(t("opponent"))}
          <div className="text-center font-bold">{t("vs")}</div>
          {renderPlayer(t("you"))}
        </div>

        <div className="border-t pt-3">
          <p className="text-sm font-semibold mb-1">{t("settings")}</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>
              🎯 {t("difficulty")}: {settings.difficulty}
            </li>
            <li>
              🎨 {t("color")}: {settings.playerColor}
            </li>
            <li>
              ⏱️ {t("time")}: {settings.timeControl}
            </li>
          </ul>
        </div>

        <Button onClick={() => setDialogOpen(true)}>{t("newGame")}</Button>

        <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("newGame")}</DialogTitle>
              <DialogDescription>
                <div className="flex flex-col items-center justify-center gap-4">
                  <img
                    src="/bq.png"
                    alt={t("chessAILogo")}
                    className="w-32 h-32 mb-6"
                  />
                  <h1 className="text-4xl font-bold mb-4">{t("chessAI")}</h1>

                  {/* Difficulty */}
                  <Tabs
                    value={localSettings.difficulty}
                    onValueChange={(value) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        difficulty: value as Difficulty,
                      }))
                    }
                  >
                    <TabsList>
                      <TabsTrigger value="easy">{t("easy")}</TabsTrigger>
                      <TabsTrigger value="medium">{t("medium")}</TabsTrigger>
                      <TabsTrigger value="hard">{t("hard")}</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {/* Time */}
                  <Tabs
                    value={localSettings.timeControl}
                    onValueChange={(value) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        timeControl: value as TimeControl,
                      }))
                    }
                  >
                    <TabsList>
                      <TabsTrigger value="3min">
                        {t("threeMinutes")}
                      </TabsTrigger>
                      <TabsTrigger value="10min">{t("tenMinutes")}</TabsTrigger>
                      <TabsTrigger value="no-time">{t("noTime")}</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {/* Color */}
                  <Tabs
                    value={localSettings.playerColor}
                    onValueChange={(value) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        playerColor: value as PlayerColor,
                      }))
                    }
                  >
                    <TabsList>
                      <TabsTrigger value="white">
                        <img src="/wk.png" className="w-4 h-4 inline-block" />
                      </TabsTrigger>
                      <TabsTrigger value="black">
                        <img src="/bk.png" className="w-4 h-4 inline-block" />
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="flex items-center space-x-2">
                    <Button onClick={handleNewGame}>{t("start")}</Button>
                  </div>
                  <p className="text-xs mt-8">
                    {t("createdBy")} @bayarjargal.jr
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Separator />
      </div>
    </div>
  );
}

export default Play;
