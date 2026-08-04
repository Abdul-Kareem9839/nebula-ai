import React, { useState, useEffect, useMemo, useRef } from "react";
import { api } from "../../shared/api/client.js";
import { useNavigate } from "react-router-dom";
import { GalaxyBackground } from "./components/GalaxyBackground.jsx";
import { GalaxyHeader } from "./components/GalaxyHeader.jsx";
import { GalaxyCanvas } from "./components/GalaxyCanvas.jsx";
import { SkillDetailDrawer } from "./components/SkillDetailDrawer.jsx";
import { GalaxyStatsFooter } from "./components/GalaxyStatsFooter.jsx";
import { normalizeConfidence, TIER_CONFIG, getTier } from "./utils/skillHelpers.js";

export function SkillGalaxy() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Search, Filter, Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Interactive Selection & Zoom State
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Fetch live skill data from the backend.
  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    api
      .get("/skills")
      .then(({ data }) => {
        if (!active) return;
        const normalizedSkills = (data.skills || []).map((skill) => ({
          ...skill,
          _id: skill._id || skill.id || skill.name,
          name: skill.name || "Unnamed Skill",
          confidence: normalizeConfidence(skill.confidence, skill.score),
          score: typeof skill.score === "number" ? skill.score : 0,
          avgScore:
            typeof skill.avgScore === "number"
              ? skill.avgScore
              : typeof skill.score === "number"
                ? skill.score
                : 0,
          questionsAnswered:
            skill.questionsAnswered ?? skill.interviewsAppeared ?? 0,
          lastImproved: skill.lastImproved || skill.lastPracticed || "Recently",
          strengths: Array.isArray(skill.strengths) ? skill.strengths : [],
          weakAreas: Array.isArray(skill.weakAreas) ? skill.weakAreas : [],
        }));
        setSkills(normalizedSkills);
      })
      .catch((err) => {
        if (!active) return;
        setError(
          err.response?.data?.message ||
            "Unable to load your skill galaxy right now.",
        );
        setSkills([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Compute stats
  const stats = useMemo(() => {
    if (!skills.length) return null;
    const sortedByConf = [...skills].sort(
      (a, b) => b.confidence - a.confidence,
    );
    const totalConf = skills.reduce((acc, s) => acc + s.confidence, 0);
    const totalScore = skills.reduce(
      (acc, s) => acc + (s.avgScore ?? s.confidence * 100),
      0,
    );
    return {
      totalSkills: skills.length,
      overallConfidence: Math.round((totalConf / skills.length) * 100),
      avgInterviewScore: Math.round(totalScore / skills.length),
      strongest: sortedByConf[0],
      weakest: sortedByConf[sortedByConf.length - 1],
      mostImproved: [...skills].sort(
        (a, b) =>
          new Date(b.lastPracticed || 0) - new Date(a.lastPracticed || 0),
      )[0],
    };
  }, [skills]);

  // Position nodes dynamically across orbit rings
  const positionedSkills = useMemo(() => {
    if (!skills.length) return [];

    // Group skills into 4 rings by tier
    const rings = { 1: [], 2: [], 3: [], 4: [] };
    skills.forEach((skill) => {
      const tier = getTier(skill.confidence);
      const ringId = TIER_CONFIG[tier].ring;
      rings[ringId].push(skill);
    });

    const result = [];
    const ringRadii = { 1: 150, 2: 240, 3: 330, 4: 420 };

    Object.keys(rings).forEach((ringId) => {
      const ringSkills = rings[ringId];
      const radius = ringRadii[ringId];
      const count = ringSkills.length;

      ringSkills.forEach((skill, idx) => {
        const angle = (idx / (count || 1)) * 2 * Math.PI;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        result.push({
          ...skill,
          tier: getTier(skill.confidence),
          ring: Number(ringId),
          radius,
          angle,
          x,
          y,
        });
      });
    });

    return result;
  }, [skills]);

  // Filter & Sort for rendering or searching
  const filteredSkills = useMemo(() => {
    return positionedSkills.filter((s) => {
      const matchesSearch = (s.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      if (filterCategory === "Strong")
        return matchesSearch && s.confidence >= 0.7;
      if (filterCategory === "Medium")
        return matchesSearch && s.confidence >= 0.5 && s.confidence < 0.7;
      if (filterCategory === "Needs Practice")
        return matchesSearch && s.confidence < 0.5;
      return matchesSearch;
    });
  }, [positionedSkills, searchQuery, filterCategory]);

  const filteredSet = useMemo(
    () => new Set(filteredSkills.map((s) => s._id)),
    [filteredSkills],
  );

  // Handle Zoom and Pan
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoomLevel((prev) => Math.min(Math.max(prev * zoomFactor, 0.6), 2.2));
  };

  const handleMouseDown = (e) => {
    if (e.target.closest(".interactive-node") || e.target.closest(".no-pan"))
      return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - panOffset.x,
      y: e.clientY - panOffset.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Focus Camera on Selected Skill
  const handleSelectSkill = (skill) => {
    setSelectedSkill(skill);
    // Smoothly pan towards selected node
    if (skill) {
      setPanOffset({
        x: -skill.x * zoomLevel * 0.5,
        y: -skill.y * zoomLevel * 0.5,
      });
    }
  };

  const onStartInterview = () => navigate("/start-interview");

  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedSkill(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-slate-400">
            Loading Skill Galaxy…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-[#060713] text-slate-100 overflow-hidden select-none font-sans">
      <GalaxyBackground />

      <GalaxyHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterCategory={filterCategory}
        onFilterChange={setFilterCategory}
        onResetView={handleResetView}
      />

      <GalaxyCanvas
        hasSkills={!!skills.length}
        error={error}
        onStartInterview={onStartInterview}
        zoomLevel={zoomLevel}
        panOffset={panOffset}
        positionedSkills={positionedSkills}
        filteredSet={filteredSet}
        searchQuery={searchQuery}
        selectedSkill={selectedSkill}
        hoveredSkill={hoveredSkill}
        stats={stats}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onSelectSkill={handleSelectSkill}
        onHoverSkill={setHoveredSkill}
      />

      <SkillDetailDrawer
        selectedSkill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
        onStartInterview={onStartInterview}
      />

      <GalaxyStatsFooter stats={stats} />
    </div>
  );
}
