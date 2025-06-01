import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChessSettings } from "@/hooks/use-chess-settings";
import type {
  Difficulty,
  PlayerColor,
  TimeControl,
} from "@/types/ChessSettings";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Start() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { updateSettings, settings } = useChessSettings();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <img src="/bq.png" alt={t("logoAlt")} className="w-32 h-32 mb-6" />
      <h1 className="text-4xl w-100 text-center font-bold">{t("welcomeMessage")}</h1>
      <p className="text-sm mb-4">{t("description")}</p>
      <div>
        <Tabs
          value={settings.difficulty}
          onValueChange={(value) =>
            updateSettings({ difficulty: value as Difficulty })
          }
        >
          <TabsList>
            <TabsTrigger value="easy">{t("difficulty.easy")}</TabsTrigger>
            <TabsTrigger value="medium">{t("difficulty.medium")}</TabsTrigger>
            <TabsTrigger value="hard">{t("difficulty.hard")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div>
        <Tabs
          value={settings.timeControl}
          onValueChange={(value) =>
            updateSettings({ timeControl: value as TimeControl })
          }
        >
          <TabsList>
            <TabsTrigger value="3min">{t("3min")}</TabsTrigger>
            <TabsTrigger value="10min">{t("10min")}</TabsTrigger>
            <TabsTrigger value="no-time">{t("noTime")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div>
        <Tabs
          value={settings.playerColor}
          onValueChange={(value) =>
            updateSettings({ playerColor: value as PlayerColor })
          }
        >
          <TabsList>
            <TabsTrigger value="white">
              <img
                src="/wk.png"
                alt={t("playerColor.whiteAlt")}
                className="w-4 h-4 inline-block"
              />
            </TabsTrigger>
            <TabsTrigger value="black">
              <img
                src="/bk.png"
                alt={t("playerColor.blackAlt")}
                className="w-4 h-4 inline-block"
              />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex items-center space-x-2">
        <Button onClick={() => navigate("/play")}>{t("play")}</Button>
      </div>
      <p className="text-xs mt-8">
        {t("createdBy")}{" "}
        <a target="_blank" href="https://instagram.com/bayarjargal.j">
          @bayarjargal.jr
        </a>
      </p>
    </div>
  );
}
