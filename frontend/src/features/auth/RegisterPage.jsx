import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Orbit,
} from "lucide-react";
import { useAuth } from "./useAuth.js";

const FEATURES = [
  "Personalized Interviews",
  "AI Feedback",
  "Skill Galaxy",
  "Memory Crystals",
];

export function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await register(fullName, email, password);
      navigate("/home");
    } catch {
      // Handled by useAuth error state
    }
  }

  return (
    <div className="min-h-screen relative bg-[#060713] text-slate-100 flex items-center justify-center p-6 sm:p-8 lg:p-12 overflow-hidden font-sans select-none">
      {/* ================= BACKGROUND COSMIC ENVIRONMENT ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-900/15 blur-[160px] -top-32 -left-32" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-900/15 blur-[160px] -bottom-32 -right-32" />
        <div className="absolute w-[350px] h-[350px] rounded-full bg-pink-900/10 blur-[140px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        {/* Subtle Particles (~20 particles) */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${(i * 47) % 100}%`,
                top: `${(i * 61) % 100}%`,
                width: (i % 2) + 1,
                height: (i % 2) + 1,
                opacity: 0.1 + (i % 4) * 0.1,
              }}
              animate={{ opacity: [0.1, 0.5, 0.1], scale: [1, 1.2, 1] }}
              transition={{
                duration: 4 + (i % 4),
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>

      {/* ================= MAIN TWO-COLUMN CONTAINER ================= */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center my-auto">
        {/* LEFT COLUMN: HERO BRANDING */}
        <div className="lg:col-span-6 space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start">
          {/* Integrated Rotating Orbit Icon & Larger Brand Name (No Border/Pill) */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-3"
          >
            {/* Rotating Orbit Icon with Dual-Color (Purple + Cyan) Nebula Glow */}
            <div className="relative flex items-center justify-center">
              {/* Outer Purple Ambient Glow */}
              <div className="absolute -inset-1.5 rounded-full bg-purple-600/50 blur-md pointer-events-none animate-pulse" />

              {/* Inner Cyan Ambient Glow */}
              <div className="absolute inset-0 rounded-full bg-cyan-400/40 blur-sm pointer-events-none" />

              {/* Icon with Cyan Drop Shadow */}
              <Orbit className="relative w-6 h-6 text-cyan-300 animate-[spin_10s_linear_infinite] drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            </div>

            {/* Larger Brand Name */}
            <span className="font-display text-base font-semibold tracking-wider uppercase text-slate-100">
              Nebula <span className="text-purple-400">AI</span>
            </span>
          </motion.div>

          {/* Headline & Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-3"
          >
            <h1 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-slate-100 leading-[1.1]">
              Start Your Journey <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent">
                With AI Mentorship
              </span>
            </h1>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Create your account today and unlock adaptive interview practice
              tailored to your career goals.
            </p>
          </motion.div>

          {/* Feature Checklist */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 gap-y-3 gap-x-6 pt-2"
          >
            {FEATURES.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs text-slate-300 font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT COLUMN: EXPANDED REGISTER CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 w-full max-w-lg mx-auto"
        >
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-2xl p-8 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />

            <div className="space-y-1.5 mb-8">
              <h2 className="font-display text-2xl font-medium tracking-tight text-slate-100">
                Create your account
              </h2>
              <p className="text-xs text-slate-400">
                Join thousands of candidates mastering technical interviews.
              </p>
            </div>

            {/* ERROR ALERT BANNER */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -6 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -6 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-3.5 flex items-start gap-2.5 text-xs text-rose-300">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Field */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-400 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 transition-colors" />
                  <input
                    required
                    type="text"
                    placeholder="Alex Morgan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-400 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 transition-colors" />
                  <input
                    required
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-400 ml-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 transition-colors" />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl pl-11 pr-11 py-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full pt-3 pb-3 mt-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Creating account…</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </motion.button>
            </form>

            {/* COMPACT GOOGLE SIGN UP OPTION */}
            <div className="mt-4 pt-4">
              <button
                type="button"
                className="w-full py-2.5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-xs font-medium text-slate-300 transition flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.3s.7 2.6 1.9 5l3.7-2.5z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                  />
                </svg>
                <span>Sign up with Google</span>
              </button>
            </div>

            {/* TRUST & LOGIN LINK */}
            <div className="mt-8 pt-5 border-t border-white/10 flex flex-col items-center gap-2.5 text-center">
              <p className="text-xs text-slate-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Protected by end-to-end encryption</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
