import { useEffect, useMemo, useRef } from "react";

const STAR_COUNT_NEAR = 70;
const STAR_COUNT_FAR = 90;
const PARTICLE_COUNT = 5;

/**
 * FIXED, FULL-VIEWPORT BACKDROP: NEBULA GLOW + TWO STAR DEPTH LAYERS +
 * A FEW SLOW AMBIENT PARTICLES + SUBTLE MOUSE PARALLAX. RENDERS BEHIND
 * PAGE CONTENT (CALLER SHOULD GIVE CONTENT Z-10+). PARALLAX RUNS VIA
 * REFS/RAF, NOT REACT STATE, SO IT DOESN'T TRIGGER RE-RENDERS.
 */
export function StarBackground() {
  const nearLayerRef = useRef(null);
  const farLayerRef = useRef(null);
  const glowLayerRef = useRef(null);

  const starsNear = useMemo(
    () =>
      Array.from({ length: STAR_COUNT_NEAR }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 1.5 + Math.random() * 1,
        opacity: 0.4 + Math.random() * 0.5,
        duration: 4 + Math.random() * 4,
        delay: Math.random() * 6,
      })),
    [],
  );

  const starsFar = useMemo(
    () =>
      Array.from({ length: STAR_COUNT_FAR }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 1,
        opacity: 0.15 + Math.random() * 0.35,
        duration: 5 + Math.random() * 5,
        delay: Math.random() * 6,
      })),
    [],
  );

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, () => ({
        top: 15 + Math.random() * 70,
        left: 10 + Math.random() * 80,
        size: 3 + Math.random() * 4,
        duration: 14 + Math.random() * 10,
        delay: Math.random() * 8,
      })),
    [],
  );

  useEffect(() => {
    let raf = null;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;

    function onMouseMove(e) {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    }

    function tick() {
      x += (targetX - x) * 0.04;
      y += (targetY - y) * 0.04;

      if (nearLayerRef.current) {
        nearLayerRef.current.style.transform = `translate3d(${x * -10}px, ${y * -10}px, 0)`;
      }
      if (farLayerRef.current) {
        farLayerRef.current.style.transform = `translate3d(${x * -4}px, ${y * -4}px, 0)`;
      }
      if (glowLayerRef.current) {
        glowLayerRef.current.style.transform = `translate3d(${x * -18}px, ${y * -18}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMouseMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden bg-nebula-bg"
      aria-hidden="true"
    >
      {/* AMBIENT NEBULA GLOW */}
      <div
        ref={glowLayerRef}
        className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(167,139,250,0.32) 0%, rgba(103,232,249,0.1) 45%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full opacity-20 blur-3xl translate-x-1/4 translate-y-1/4"
        style={{
          background:
            "radial-gradient(circle, rgba(103,232,249,0.25) 0%, transparent 70%)",
        }}
      />

      {/* FAR, DIM STAR LAYER */}
      <div ref={farLayerRef} className="absolute inset-0">
        {starsFar.map((star, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-nebula-silver"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      {/* NEAR, BRIGHTER STAR LAYER */}
      <div ref={nearLayerRef} className="absolute inset-0">
        {starsNear.map((star, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-nebula-silver animate-pulse"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* AMBIENT DRIFTING PARTICLES */}
      <div className="absolute inset-0">
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full blur-[2px]"
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              background:
                "radial-gradient(circle, rgba(167,139,250,0.5), transparent 70%)",
              animation: `nebula-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
