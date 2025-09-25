import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

const initialBoard = Array(9).fill(null);

function App() {
  const [board, setBoard] = useState(initialBoard);
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, Draws: 0 });
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const winnerInfo = calculateWinner(board);
  const winner = winnerInfo?.winner;
  const winningLine = winnerInfo?.line || [];

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  // Auto reset when winner or draw
  useEffect(() => {
    if (winner || board.every(Boolean)) {
      if (winner) {
        setScores((prev) => ({ ...prev, [winner]: prev[winner] + 1 }));
      } else {
        setScores((prev) => ({ ...prev, Draws: prev.Draws + 1 }));
      }

      const timer = setTimeout(() => {
        setBoard(initialBoard);
        setIsXNext(true);
      }, 2200); // more time for animations

      return () => clearTimeout(timer);
    }
  }, [winner]);

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 relative overflow-hidden">
      {/* Confetti when someone wins */}
      {winner && (
        <Confetti width={windowSize.width} height={windowSize.height} />
      )}

      {/* Animated title */}
      <motion.h1
        className="text-5xl font-extrabold text-white mb-8 drop-shadow-lg tracking-wider"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
      >
        🎮 Tic Tac Toe
      </motion.h1>

      {/* Scoreboard */}
      <motion.div
        className="flex gap-8 text-white text-lg md:text-xl font-semibold mb-10 px-6 py-3 bg-white/10 rounded-2xl shadow-lg backdrop-blur-md"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div>❌ X: {scores.X}</div>
        <div>⭕ O: {scores.O}</div>
        <div>🤝 Draws: {scores.Draws}</div>
      </motion.div>

      {/* Game Board */}
      <motion.div
        className="grid grid-cols-3 gap-5 p-6 rounded-3xl bg-white/20 shadow-xl backdrop-blur-lg"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {board.map((value, index) => {
          const isWinningCell = winningLine.includes(index);
          return (
            <motion.div
              key={index}
              className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl shadow-lg flex items-center justify-center text-4xl md:text-6xl font-bold cursor-pointer transition-all ${
                isWinningCell
                  ? "bg-yellow-400 text-white"
                  : "bg-white/90 text-gray-800 hover:bg-pink-100"
              }`}
              onClick={() => handleClick(index)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              animate={
                isWinningCell
                  ? {
                      boxShadow: [
                        "0 0 15px #FBBF24",
                        "0 0 25px #F59E0B",
                        "0 0 15px #FBBF24",
                      ],
                    }
                  : {}
              }
              transition={
                isWinningCell
                  ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
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
                  }}
                >
                  {value}
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Game Info */}
      <motion.div
        className="mt-8 text-white text-xl md:text-2xl font-bold drop-shadow-md bg-black/20 px-6 py-3 rounded-full backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {winner
          ? `🎉 Winner: ${winner}!`
          : board.every(Boolean)
          ? "🤝 It's a Draw!"
          : `👉 Next Player: ${isXNext ? "X" : "O"}`}
      </motion.div>
    </div>
  );
}

// Winner check function with line info
function calculateWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
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
