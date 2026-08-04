import React from "react";
import { motion } from "framer-motion";

export function GalaxyBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Nebula Gradients */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-900/20 blur-[140px] -top-20 -left-20" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-cyan-900/20 blur-[140px] bottom-0 right-0" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-pink-900/15 blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Twinkling Particle Field */}
      <div className="absolute inset-0">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              width: (i % 3) + 1,
              height: (i % 3) + 1,
              opacity: 0.2 + (i % 5) * 0.15,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.4, 1] }}
            transition={{
              duration: 2 + (i % 4),
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>

      {/* Shooting Stars */}
      <motion.div
        className="absolute w-24 h-[1px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent top-12 left-1/4"
        animate={{ x: [0, 600], y: [0, 300], opacity: [0, 1, 0] }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          repeatDelay: 7,
          ease: "easeOut",
        }}
      />
      <motion.div
        className="absolute w-32 h-[1px] bg-gradient-to-r from-transparent via-purple-300 to-transparent top-1/3 right-1/4"
        animate={{ x: [0, -700], y: [0, 400], opacity: [0, 1, 0] }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          repeatDelay: 11,
          ease: "easeOut",
          delay: 3,
        }}
      />
    </div>
  );
}
