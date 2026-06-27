import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function PageTransition({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Show a sleek green top loading progress bar on route change
    setLoading(true);
    setProgress(20);

    const timers = [
      setTimeout(() => setProgress(50), 100),
      setTimeout(() => setProgress(80), 220),
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setLoading(false);
        }, 120);
      }, 350)
    ];

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [location.pathname]);

  return (
    <>
      {/* Sleek top glowing progress bar */}
      {loading && (
        <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
          <div
            className="h-[3px] bg-gradient-to-r from-[#5cb800] via-[#86ff22] to-[#cfff65] shadow-[0_0_10px_#86ff22,0_0_20px_#86ff22] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Smooth slide/fade transition wrapper */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
