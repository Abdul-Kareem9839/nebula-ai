import { motion } from 'framer-motion';

/**
 * The AI mentor's visual presence — a living companion, not a spinner.
 * Layered depth: outer ambient bloom -> mid glass shell -> core light ->
 * orbiting particles. `state` drives breathing/pulse tempo and intensity.
 *
 * @param {'idle' | 'listening' | 'thinking' | 'speaking' | 'analyzing' | 'celebrating'} state
 * @param {string} [accentColor] Optional rgb triplet, e.g. '167,139,250'. Falls back to the default purple/cyan look when omitted.
 */
export function Orb({ state = 'idle', accentColor }) {
  const accent = accentColor || '167,139,250';
  const config = {
    idle: { scale: [1, 1.035, 1], duration: 5, glow: 0.32, particleSpeed: 24 },
    listening: { scale: [1, 1.06, 1], duration: 1.6, glow: 0.5, particleSpeed: 10 },
    thinking: { scale: [1, 1.02, 1], duration: 1.1, glow: 0.42, particleSpeed: 6 },
    analyzing: { scale: [1, 1.03, 1], duration: 1.4, glow: 0.46, particleSpeed: 8 },
    speaking: { scale: [1, 1.1, 1], duration: 0.6, glow: 0.65, particleSpeed: 14 },
    celebrating: { scale: [1, 1.25, 1], duration: 0.7, glow: 0.85, particleSpeed: 5 },
  }[state];

  return (
    <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
      {/* Ambient bloom — soft, wide, barely-there */}
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: 280,
          height: 280,
          background: `radial-gradient(circle, rgba(${accent},0.35) 0%, rgba(103,232,249,0.12) 55%, transparent 75%)`,
        }}
        animate={{ opacity: [config.glow, config.glow + 0.15, config.glow] }}
        transition={{ duration: config.duration * 1.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Orbiting particles — depth via varied radius/opacity */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: config.particleSpeed, repeat: Infinity, ease: 'linear' }}
      >
        {[0, 90, 180, 270].map((angle, i) => (
          <span
            key={angle}
            className="absolute rounded-full bg-nebula-cyan"
            style={{
              width: i % 2 === 0 ? 3 : 2,
              height: i % 2 === 0 ? 3 : 2,
              top: '50%',
              left: '50%',
              opacity: 0.5 + (i % 2) * 0.3,
              boxShadow: '0 0 8px rgba(103,232,249,0.7)',
              transform: `rotate(${angle}deg) translate(${120 + (i % 2) * 20}px) rotate(-${angle}deg)`,
            }}
          />
        ))}
      </motion.div>
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: -360 }}
        transition={{ duration: config.particleSpeed * 1.8, repeat: Infinity, ease: 'linear' }}
      >
        {[45, 225].map((angle) => (
          <span
            key={angle}
            className="absolute w-1 h-1 rounded-full bg-nebula-glow"
            style={{
              top: '50%',
              left: '50%',
              opacity: 0.4,
              boxShadow: '0 0 6px rgba(167,139,250,0.6)',
              transform: `rotate(${angle}deg) translate(105px) rotate(-${angle}deg)`,
            }}
          />
        ))}
      </motion.div>

      {/* Outer glass shell — thin ring, adds dimensionality */}
      <div
        className="absolute rounded-full border border-white/10"
        style={{ width: 210, height: 210 }}
      />

      {/* Core — breathing light with inner highlight for depth */}
      <motion.div
        className="relative rounded-full"
        style={{
          width: 180,
          height: 180,
          background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.5), rgba(${accent},0.9) 30%, rgba(${accent},0.95) 60%, rgba(88,58,168,0.9) 100%)`,
          boxShadow: `0 0 60px rgba(${accent},${config.glow}), 0 0 120px rgba(103,232,249,0.15), inset 0 0 40px rgba(255,255,255,0.15)`,
        }}
        animate={{ scale: config.scale }}
        transition={{ duration: config.duration, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
