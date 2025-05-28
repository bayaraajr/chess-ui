import "./App.css";
import { useState } from "react";
import { Chess, type Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import axios from "axios";
import { Button } from "./components/ui/button";

function App() {
  const [game, setGame] = useState(new Chess());

  async function onDrop(sourceSquare: Square, targetSquare: Square) {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move === null) return false;
    setGame(new Chess(game.fen()));

    const response = await axios.post("http://localhost:5000/predict", {
      fen: game.fen(),
    });

    const aiMove = response.data.move;
    game.move(aiMove);
    setGame(new Chess(game.fen()));
    return true;
  }

  const handleNewGame = () => {
    setGame(new Chess());
  };

  return (
    <div style={{ height: 400, width: 400 }}>
      <Chessboard position={game.fen()} onPieceDrop={onDrop} />
      <Button onClick={handleNewGame} className="mt-4">
        New game
      </Button>
    </div>
  );
}

export default App;
