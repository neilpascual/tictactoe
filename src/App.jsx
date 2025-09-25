import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [shake, setShake] = useState(false);

  const winnerInfo = calculateWinner(board);
  const winner = winnerInfo?.winner;
  const winningLine = winnerInfo?.line || [];
  const isDraw = board.every(Boolean) && !winner;

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  // Auto reset
  useEffect(() => {
    if (winner || isDraw) {
      if (winner) {
        setScores((prev) => ({ ...prev, [winner]: prev[winner] + 1 }));
      } else {
        setScores((prev) => ({ ...prev, Draws: prev.Draws + 1 }));
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }

      const timer = setTimeout(() => {
        setBoard(initialBoard);
        setIsXNext(true);
      }, 2200);

      return () => clearTimeout(timer);
    }
  }, [winner, isDraw]);

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {winner && <Confetti width={windowSize.width} height={windowSize.height} />}

      {/* Floating neon title */}
      <motion.h1
        className="text-6xl font-extrabold text-cyan-300 mb-10 drop-shadow-[0_0_20px_#22d3ee]"
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        3D Tic Tac Toe
      </motion.h1>

      {/* Scoreboard */}
      <motion.div
        key={scores.X + scores.O + scores.Draws}
        className="flex gap-8 text-cyan-100 text-lg md:text-xl font-semibold mb-10 px-6 py-3 bg-black/40 rounded-2xl shadow-[0_0_25px_#0ff,inset_0_0_15px_#0ff] border border-cyan-400/50"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: [1, 1.1, 1], opacity: 1 }}
      >
        <div>❌ X: {scores.X}</div>
        <div>⭕ O: {scores.O}</div>
        <div>🤝 Draws: {scores.Draws}</div>
      </motion.div>

      {/* 3D Game Board */}
      <motion.div
        className="grid grid-cols-3 gap-6 p-6 rounded-3xl bg-black/60 shadow-[0_0_60px_#0ff] border border-cyan-300/30"
        style={{ perspective: "1000px" }}
        animate={{
          rotateX: shake ? [0, 5, -5, 0] : 10,
          rotateY: shake ? [0, -5, 5, 0] : -10,
        }}
        transition={{ duration: shake ? 0.6 : 1.2, ease: "easeInOut" }}
      >
        {board.map((value, index) => {
          const isWinningCell = winningLine.includes(index);
          return (
            <motion.div
              key={index}
              className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl shadow-lg flex items-center justify-center text-4xl md:text-6xl font-bold cursor-pointer transition-all ${
                isWinningCell
                  ? "bg-yellow-400 text-white"
                  : "bg-gray-900/70 text-cyan-200 hover:bg-cyan-800/50 border border-cyan-400/20"
              }`}
              onClick={() => handleClick(index)}
              whileHover={{ scale: 1.1, z: 30, rotateX: 5, rotateY: -5 }}
              whileTap={{ scale: 0.95 }}
              animate={
                isWinningCell
                  ? {
                      z: [0, 40, 0],
                      boxShadow: [
                        "0px 0px 20px #FBBF24",
                        "0px 0px 40px #F59E0B",
                        "0px 0px 20px #FBBF24",
                      ],
                    }
                  : {}
              }
              transition={
                isWinningCell
                  ? { repeat: Infinity, duration: 1.5 }
                  : { type: "spring", stiffness: 150 }
              }
              style={{ transformStyle: "preserve-3d" }}
            >
              <AnimatePresence>
                {value && (
                  <motion.span
                    key={value + index}
                    initial={{ scale: 0, opacity: 0, rotateX: -90 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      rotateX: 0,
                      textShadow:
                        "0 0 20px #67e8f9, 0 0 40px #22d3ee, 0 0 60px #06b6d4",
                      color: value === "X" ? "#f87171" : "#38bdf8",
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 25,
                    }}
                  >
                    {value}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Game Info */}
      <motion.div
        className="mt-10 text-cyan-200 text-2xl font-bold drop-shadow-[0_0_15px_#0ff] bg-black/50 px-6 py-3 rounded-full border border-cyan-400/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {winner
          ? `🎉 Winner: ${winner}!`
          : isDraw
          ? "🤝 It's a Draw!"
          : `👉 Next Player: ${isXNext ? "X" : "O"}`}
      </motion.div>
    </div>
  );
}

function calculateWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
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
