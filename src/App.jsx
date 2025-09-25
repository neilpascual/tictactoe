import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const initialBoard = Array(9).fill(null);

function App() {
  const [board, setBoard] = useState(initialBoard);
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, Draws: 0 });

  const winnerInfo = calculateWinner(board);
  const winner = winnerInfo?.winner;
  const winningLine = winnerInfo?.line || [];

  const handleClick = (index) => {
    if (board[index] || winner) return; // prevent extra moves
    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  // Auto reset when winner or draw
  useEffect(() => {
    if (winner || board.every(Boolean)) {
      // Update scores
      if (winner) {
        setScores((prev) => ({ ...prev, [winner]: prev[winner] + 1 }));
      } else {
        setScores((prev) => ({ ...prev, Draws: prev.Draws + 1 }));
      }

      // Reset after delay (so animations show)
      const timer = setTimeout(() => {
        setBoard(initialBoard);
        setIsXNext(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [winner]); // only trigger on winner change

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
      <h1 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
        Tic-Tac-Toe
      </h1>

      {/* Scoreboard */}
      <div className="flex gap-6 text-white text-lg md:text-xl font-semibold mb-8 drop-shadow-md">
        <div>❌ X: {scores.X}</div>
        <div>⭕ O: {scores.O}</div>
        <div>🤝 Draws: {scores.Draws}</div>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-4">
        {board.map((value, index) => {
          const isWinningCell = winningLine.includes(index);
          return (
            <motion.div
              key={index}
              className={`w-24 h-24 md:w-32 md:h-32 rounded-lg shadow-lg flex items-center justify-center text-3xl md:text-5xl font-bold cursor-pointer transition-colors ${
                isWinningCell
                  ? "bg-yellow-300 text-white"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
              onClick={() => handleClick(index)}
              animate={
                isWinningCell
                  ? {
                      boxShadow: [
                        "0 0 10px #FBBF24",
                        "0 0 20px #F59E0B",
                        "0 0 10px #FBBF24",
                      ],
                    }
                  : {}
              }
              transition={
                isWinningCell
                  ? { repeat: Infinity, duration: 1.2, ease: "easeInOut" }
                  : {}
              }
            >
              {value && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    color: isWinningCell ? "#ffffff" : "#111827",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 20,
                    duration: 0.5,
                  }}
                >
                  {value}
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Game Info */}
      <div className="mt-6 text-white text-xl md:text-2xl font-semibold drop-shadow-md">
        {winner
          ? `🎉 Winner: ${winner} (auto reset...)`
          : board.every(Boolean)
          ? "It's a Draw! (auto reset...)"
          : `Next Player: ${isXNext ? "X" : "O"}`}
      </div>
    </div>
  );
}

// Winner check function with line info
function calculateWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6],             // diagonals
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return null;
}

export default App;
