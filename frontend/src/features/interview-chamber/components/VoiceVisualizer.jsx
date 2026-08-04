import { motion } from "framer-motion";

/**
 * Ambient voice presence — replaces the boring mic-bar meter.
 * Reacts to the same state vocabulary as the Orb so the whole chamber
 * reads as one living surface.
 *
 * @param {'idle' | 'listening' | 'speaking'} state
 */
export function VoiceVisualizer({ state = "idle" }) {
  const config = {
    idle: {
      rings: 1,
      ringOpacity: 0.12,
      waveAmp: 3,
      duration: 3.2,
      color: "rgba(199,201,217,0.5)",
    },
    listening: {
      rings: 3,
      ringOpacity: 0.28,
      waveAmp: 14,
      duration: 0.9,
      color: "rgba(103,232,249,0.8)",
    },
    speaking: {
      rings: 2,
      ringOpacity: 0.24,
      waveAmp: 10,
      duration: 1.3,
      color: "rgba(167,139,250,0.8)",
    },
  }[state];

  const bars = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div
      className="relative flex items-center justify-center h-16 w-full select-none"
      aria-hidden="true"
    >
      {/* Ambient rings, only visible when active */}
      {Array.from({ length: config.rings }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full border"
          style={{ borderColor: config.color, width: 40, height: 40 }}
          animate={{
            scale: [1, 2.6 + i * 0.6],
            opacity: [config.ringOpacity, 0],
          }}
          transition={{
            duration: config.duration * 1.8,
            repeat: Infinity,
            delay: i * (config.duration / config.rings),
            ease: "easeOut",
          }}
        />
      ))}

      {/* Waveform bars */}
      <div className="relative flex items-center gap-[3px] h-full">
        {bars.map((i) => {
          const centerDistance = Math.abs(i - bars.length / 2);
          const baseHeight = 4 + Math.max(0, 6 - centerDistance * 0.6);
          return (
            <motion.span
              key={i}
              className="w-[2.5px] rounded-full"
              style={{ background: config.color, height: baseHeight }}
              animate={
                state === "idle"
                  ? { height: baseHeight, opacity: 0.4 }
                  : {
                      height: [
                        baseHeight,
                        baseHeight +
                          config.waveAmp * (0.4 + Math.random() * 0.6),
                        baseHeight,
                      ],
                      opacity: [0.5, 1, 0.5],
                    }
              }
              transition={{
                duration: config.duration * (0.6 + Math.random() * 0.5),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.03,
              }}
            />
          );
        })}
      </div>

      {/* Drifting particles when actively listening/speaking */}
      {state !== "idle" &&
        Array.from({ length: 5 }).map((_, i) => (
          <motion.span
            key={`p-${i}`}
            className="absolute rounded-full blur-[1px]"
            style={{
              width: 3,
              height: 3,
              background: config.color,
              left: `${20 + i * 15}%`,
            }}
            animate={{ y: [0, -18, 0], opacity: [0, 0.9, 0] }}
            transition={{
              duration: 1.6 + i * 0.2,
              repeat: Infinity,
              delay: i * 0.25,
              ease: "easeInOut",
            }}
          />
        ))}
    </div>
  );
}
