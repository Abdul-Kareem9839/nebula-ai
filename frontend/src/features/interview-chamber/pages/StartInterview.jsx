import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../../../shared/api/client.js";
import { StarBackground } from "../../universe/StarBackground.jsx";
import { Orb } from "../../orb/Orb.jsx";
import { Code2, Server, Layers, Bot, BarChart3, Terminal } from "lucide-react";

<div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border-x border-white/10">
  <Code2 className="w-5 h-5 text-purple-400" />
  <span className="text-sm font-medium text-slate-200">Frontend Developer</span>
</div>;

const ROLES = [
  {
    value: "Frontend Developer",
    icon: <Code2 className="w-5 h-5 text-purple-400" />,
  },
  {
    value: "Backend Developer",
    icon: <Server className="w-5 h-5 text-cyan-400" />,
  },
  {
    value: "Full Stack Developer",
    icon: <Layers className="w-5 h-5 text-blue-400" />,
  },
  { value: "AI Engineer", icon: <Bot className="w-5 h-5 text-green-400" /> },
  {
    value: "Data Analyst",
    icon: <BarChart3 className="w-5 h-5 text-yellow-400" />,
  },
  {
    value: "DevOps Engineer",
    icon: <Terminal className="w-5 h-5 text-red-400" />,
  },
];

const SKILL_LEVELS = [
  { value: "beginner", label: "Beginner", tagline: "Foundation builder" },
  { value: "intermediate", label: "Intermediate", tagline: "Interview ready" },
  { value: "advanced", label: "Advanced", tagline: "Senior level challenge" },
];

const TYPES = [
  { value: "technical", label: "Technical" },
  { value: "behavioral", label: "Behavioral" },
  { value: "coding", label: "Coding" },
];

const PERSONAS = [
  { value: "friendly", label: "Friendly Mentor", glow: "167,139,250" },
  { value: "strict", label: "Strict Mentor", glow: "103,232,249" },
  { value: "supportive", label: "Supportive Coach", glow: "167,139,250" },
  { value: "senior_engineer", label: "Senior Engineer", glow: "103,232,249" },
  { value: "hr_recruiter", label: "HR Recruiter", glow: "199,201,217" },
  { value: "startup_founder", label: "Startup Founder", glow: "245,158,11" },
];

const QUESTION_LIMITS = [
  { value: 3, label: "Quick", description: "3 questions • 5 min" },
  { value: 5, label: "Standard", description: "5 questions • 10 min" },
  { value: 10, label: "Deep Dive", description: "10 questions • 20 min" },
  { value: 15, label: "Extended", description: "15 questions • 30 min" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

function SectionLabel({ children }) {
  return (
    <p className="text-xs tracking-[0.2em] uppercase text-nebula-text/40 mb-3 font-medium">
      {children}
    </p>
  );
}

export function StartInterview() {
  const [source, setSource] = useState("manual");
  const [role, setRole] = useState(ROLES[0].value);
  const [skillLevel, setSkillLevel] = useState("beginner");
  const [type, setType] = useState("technical");
  const [mentorPersonality, setMentorPersonality] = useState("friendly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [questionLimit, setQuestionLimit] = useState(5);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumePreview, setResumePreview] = useState("");
  const [resumePreviewUrl, setResumePreviewUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadStage, setUploadStage] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const stages = useMemo(
    () => [
      "Uploading Resume...",
      "Extracting Text...",
      "Analyzing Resume...",
      "Finding Skills...",
      "Preparing Interview...",
      "Starting Interview...",
    ],
    [],
  );

  function attachResumeFile(file) {
    if (!file) return;
    const isPdf = file.type === "application/pdf";
    const isDocx =
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    if (!isPdf && !isDocx) {
      setError("Please upload a PDF or DOCX resume.");
      return;
    }

    if (resumePreviewUrl) {
      URL.revokeObjectURL(resumePreviewUrl);
    }

    const previewUrl =
      typeof URL.createObjectURL === "function"
        ? URL.createObjectURL(file)
        : "";

    setResumeFile(file);
    setResumePreview(file.name);
    setResumePreviewUrl(previewUrl);
    setError(null);
    setUploadStage(0);
    setUploadProgress(0);
  }

  async function handleStart() {
    if (source === "resume") {
      if (!resumeFile) {
        setError("Upload a resume to begin a resume-based interview.");
        return;
      }

      setLoading(true);
      setError(null);
      setUploadStage(0);
      setUploadProgress(0);

      try {
        const formData = new FormData();
        formData.append("resume", resumeFile);
        const { data } = await api.post("/resume/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const { data: interviewData } = await api.post("/interviews", {
          role: data?.data?.analysis?.suggestedRoles?.[0] || role,
          skillLevel,
          type,
          mentorPersonality,
          maxQuestions: questionLimit,
          mode: "resume",
          resumeAnalysis: data?.data?.analysis || null,
        });

        navigate(`/interview/${interviewData.interview._id}`);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Could not process resume-based interview",
        );
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/interviews", {
        role,
        skillLevel,
        type,
        mentorPersonality,
        maxQuestions: questionLimit,
        mode: "manual",
      });
      navigate(`/interview/${data.interview._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not start interview");
    } finally {
      setLoading(false);
    }
  }

  const activePersona = PERSONAS.find((p) => p.value === mentorPersonality);

  return (
    <div className="relative min-h-screen bg-nebula-bg overflow-hidden">
      <StarBackground />

      <div className="relative z-10 flex flex-col items-center px-6 py-16 md:py-24">
        {/* Mentor Orb Header */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="flex flex-col items-center mb-2"
        >
          <Orb state="idle" accentColor={activePersona?.glow} />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-center -mt-4 mb-12"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-nebula-cyan/70 mb-2 font-medium">
            Your mentor is ready
          </p>
          <h1 className="font-display text-2xl md:text-3xl font-medium text-nebula-text">
            Configure your AI Interview Mentor
          </h1>
          <p className="text-sm text-nebula-text/50 mt-1.5">
            Choose your mission
          </p>
        </motion.div>

        {/* Configuration Sections */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="w-full max-w-3xl space-y-8"
        >
          {/* Interview Source */}
          <motion.section variants={fadeUp}>
            <SectionLabel>Interview Source</SectionLabel>
            <div className="flex flex-wrap gap-3">
              {[
                { value: "manual", label: "Manual Setup" },
                { value: "resume", label: "Resume Based" },
              ].map((option) => {
                const selected = source === option.value;
                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => setSource(option.value)}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium border backdrop-blur-xl transition-all duration-300 ${
                      selected
                        ? "bg-nebula-glow/15 border-nebula-glow/60 text-white shadow-[0_0_20px_rgba(167,139,250,0.25)]"
                        : "bg-white/[0.03] border-white/10 text-nebula-text/60 hover:border-white/20"
                    }`}
                  >
                    {option.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.section>

          {/* Conditional Input: Target Role / Upload */}
          {source === "manual" ? (
            <>
              <motion.section variants={fadeUp}>
                <SectionLabel>Target Role</SectionLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ROLES.map((r) => {
                    const selected = role === r.value;
                    return (
                      <motion.button
                        key={r.value}
                        type="button"
                        onClick={() => setRole(r.value)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className={`relative rounded-2xl p-4 text-left bg-white/[0.03] backdrop-blur-xl border transition-all duration-300 overflow-hidden ${
                          selected
                            ? "border-nebula-glow/60"
                            : "border-white/10 hover:border-white/20"
                        }`}
                        style={
                          selected
                            ? { boxShadow: "0 0 30px rgba(167,139,250,0.25)" }
                            : undefined
                        }
                      >
                        {selected && (
                          <motion.div
                            layoutId="role-glow"
                            className="absolute inset-0 opacity-40 pointer-events-none"
                            style={{
                              background:
                                "radial-gradient(circle at 30% 20%, rgba(167,139,250,0.3), transparent 70%)",
                            }}
                          />
                        )}
                        <span className="relative block text-xl mb-2">
                          {r.icon}
                        </span>
                        <span className="relative block text-sm font-medium text-nebula-text">
                          {r.value}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.section>

              <motion.section variants={fadeUp}>
                <SectionLabel>Interview Mode</SectionLabel>
                <div className="flex flex-wrap gap-3">
                  {TYPES.map((t) => {
                    const selected = type === t.value;
                    return (
                      <motion.button
                        key={t.value}
                        type="button"
                        onClick={() => setType(t.value)}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.96 }}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium border backdrop-blur-xl transition-all duration-300 ${
                          selected
                            ? "bg-nebula-glow/15 border-nebula-glow/50 text-nebula-text"
                            : "bg-white/[0.03] border-white/10 text-nebula-text/60 hover:border-white/20"
                        }`}
                      >
                        {t.label}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.section>
            </>
          ) : (
            <motion.section
              variants={fadeUp}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
            >
              <SectionLabel>Resume Upload</SectionLabel>
              <label
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragActive(false);
                  attachResumeFile(event.dataTransfer.files?.[0]);
                }}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-10 text-center transition ${
                  dragActive
                    ? "border-nebula-glow/60 bg-nebula-glow/10"
                    : "border-nebula-cyan/40 bg-nebula-bg/50 hover:border-nebula-glow/60"
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={(event) => {
                    attachResumeFile(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
                <p className="text-base font-medium text-nebula-text">
                  {dragActive ? "Release to upload" : "Drop your resume here"}
                </p>
                <p className="mt-2 text-xs sm:text-sm text-nebula-text/50">
                  PDF or DOCX • Pick your resume, adjust settings, and start
                </p>
                {resumePreview && (
                  <p className="mt-4 text-sm font-medium text-nebula-cyan">
                    📄 {resumePreview}
                  </p>
                )}
                {resumePreviewUrl && resumePreviewUrl.includes("blob:") && (
                  <div className="mt-4 w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-2">
                    <iframe
                      title="Resume Preview"
                      src={resumePreviewUrl}
                      className="h-48 w-full rounded-lg"
                    />
                  </div>
                )}
              </label>
              {loading && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm text-nebula-text/70">
                    <span>{stages[uploadStage]}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-2 rounded-full bg-gradient-to-r from-nebula-glow to-nebula-cyan"
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </motion.section>
          )}

          {/* Skill / Experience Level */}
          <motion.section variants={fadeUp}>
            <SectionLabel>Experience Level</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SKILL_LEVELS.map((lvl) => {
                const selected = skillLevel === lvl.value;
                return (
                  <motion.button
                    key={lvl.value}
                    type="button"
                    onClick={() => setSkillLevel(lvl.value)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`rounded-2xl p-4 text-left bg-white/[0.03] backdrop-blur-xl border transition-all duration-300 ${
                      selected
                        ? "border-nebula-cyan/60"
                        : "border-white/10 hover:border-white/20"
                    }`}
                    style={
                      selected
                        ? { boxShadow: "0 0 30px rgba(103,232,249,0.2)" }
                        : undefined
                    }
                  >
                    <span className="block text-sm font-medium text-nebula-text">
                      {lvl.label}
                    </span>
                    <span className="block text-xs text-nebula-text/45 mt-1">
                      {lvl.tagline}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.section>

          {/* AI Persona */}
          <motion.section variants={fadeUp}>
            <SectionLabel>AI Personality</SectionLabel>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PERSONAS.map((p) => {
                const selected = mentorPersonality === p.value;
                return (
                  <motion.button
                    key={p.value}
                    type="button"
                    onClick={() => setMentorPersonality(p.value)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`rounded-2xl p-4 text-left bg-white/[0.03] backdrop-blur-xl border transition-all duration-300 ${
                      selected
                        ? "border-white/30"
                        : "border-white/10 hover:border-white/20"
                    }`}
                    style={
                      selected
                        ? {
                            boxShadow: `0 0 26px rgba(${p.glow},0.35)`,
                            borderColor: `rgba(${p.glow},0.6)`,
                          }
                        : undefined
                    }
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full mb-2"
                      style={{
                        background: `rgba(${p.glow},0.9)`,
                        boxShadow: `0 0 10px rgba(${p.glow},0.8)`,
                      }}
                    />
                    <span className="block text-sm font-medium text-nebula-text">
                      {p.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.section>

          {/* Question Limit / Length */}
          <motion.section variants={fadeUp}>
            <SectionLabel>Interview Length</SectionLabel>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {QUESTION_LIMITS.map((q) => {
                const selected = questionLimit === q.value;
                return (
                  <motion.button
                    key={q.value}
                    type="button"
                    onClick={() => setQuestionLimit(q.value)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`rounded-2xl p-4 text-left bg-white/[0.03] backdrop-blur-xl border transition-all ${
                      selected
                        ? "border-nebula-glow/60"
                        : "border-white/10 hover:border-white/20"
                    }`}
                    style={
                      selected
                        ? { boxShadow: "0 0 30px rgba(167,139,250,0.25)" }
                        : undefined
                    }
                  >
                    <span className="block text-sm font-medium text-nebula-text">
                      {q.label}
                    </span>
                    <span className="block text-xs text-nebula-text/45 mt-1">
                      {q.description}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.section>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          {/* Start CTA Button */}
          <motion.div variants={fadeUp} className="flex justify-center pt-4">
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 opacity-60 blur transition-all duration-500 group-hover:opacity-100 group-hover:blur-md" />
              <motion.button
                type="button"
                onClick={handleStart}
                disabled={loading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative inline-flex items-center gap-2 px-10 py-3.5 rounded-full font-medium text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 shadow-[0_0_25px_rgba(168,85,247,0.35)] disabled:opacity-50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(103,232,249,0.5)] cursor-pointer"
              >
                <span>{loading ? "Entering…" : "Enter Interview Chamber"}</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
