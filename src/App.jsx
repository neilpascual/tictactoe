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
  const [shake, setShake] = useState(false);
  const [neonWave, setNeonWave] = useState(false);
  const [particles, setParticles] = useState([]);

  const winnerInfo = calculateWinner(board);
  const winner = winnerInfo?.winner;
  const winningLine = winnerInfo?.line || [];
  const isDraw = board.every(Boolean) && !winner;

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    const value = isXNext ? "X" : "O";
    newBoard[index] = value;
    setBoard(newBoard);
    setIsXNext(!isXNext);

    // Particle burst effect when placing X or O
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + "-" + i,
      index,
      color: value === "X" ? "#f87171" : "#38bdf8",
    }));
    setParticles((prev) => [...prev, ...newParticles]);

    // Remove particles after animation
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.find((np) => np.id === p.id))
      );
    }, 1000);
  };

  useEffect(() => {
    if (winner || isDraw) {
      if (winner) {
        setScores((prev) => ({ ...prev, [winner]: prev[winner] + 1 }));
      } else {
        setScores((prev) => ({ ...prev, Draws: prev.Draws + 1 }));
        setShake(true);
        setNeonWave(true);
        setTimeout(() => {
          setShake(false);
          setNeonWave(false);
        }, 1000);
      }

      const timer = setTimeout(() => {
        setBoard(initialBoard);
        setIsXNext(true);
      }, 2500);

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">
      {winner && <Confetti width={windowSize.width} height={windowSize.height} />}

      {/* Floating neon title */}
      <motion.h1
        className="text-6xl font-extrabold text-cyan-300 mb-10 drop-shadow-[0_0_20px_#22d3ee]"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        Floating Tic Tac Toe
      </motion.h1>

      {/* Scoreboard */}
      <motion.div
        key={scores.X + scores.O + scores.Draws}
        className="flex gap-8 text-cyan-100 text-lg md:text-xl font-semibold mb-10 px-6 py-3 bg-black/40 rounded-2xl shadow-[0_0_25px_#0ff,inset_0_0_15px_#0ff] border border-cyan-400/50"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [1, 1.05, 1], opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div>❌ X: {scores.X}</div>
        <div>⭕ O: {scores.O}</div>
        <div>🤝 Draws: {scores.Draws}</div>
      </motion.div>

      {/* Floating Game Board (always visible) */}
      <motion.div
        className="relative"
        animate={{ y: [0, -12, 0] }} // floating effect
        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
      >
        {/* Neon ripple waves */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full bg-cyan-400/20 blur-3xl"
            style={{ zIndex: -1 }}
            initial={{ scale: 0.8, opacity: 0.6 }}
            animate={{ scale: 2 + i * 0.5, opacity: 0 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 1,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Neon base glow */}
        <motion.div
          className="absolute -inset-6 bg-cyan-500/20 rounded-[40px] blur-3xl"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Actual board */}
        <div className="grid grid-cols-3 gap-6 p-6 rounded-3xl bg-black/70 shadow-[0_0_60px_#0ff] border border-cyan-300/30 relative z-10">
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
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* X/O marks */}
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
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 25,
                    }}
                  >
                    {value}
                  </motion.span>
                )}

                {/* Particle burst */}
                {particles
                  .filter((p) => p.index === index)
                  .map((p) => (
                    <motion.div
                      key={p.id}
                      className="absolute w-2 h-2 rounded-full"
                      style={{ backgroundColor: p.color }}
                      initial={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                      animate={{
                        x: (Math.random() - 0.5) * 60,
                        y: (Math.random() - 0.5) * 60,
                        scale: 0,
                        opacity: 0,
                      }}
                      transition={{ duration: 1 }}
                    />
                  ))}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Game status */}
      <motion.div
        className="mt-10 text-cyan-200 text-2xl font-bold drop-shadow-[0_0_15px_#0ff] bg-black/50 px-6 py-3 rounded-full border border-cyan-400/30"
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
