import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./features/auth/LoginPage.jsx";
import { RegisterPage } from "./features/auth/RegisterPage.jsx";
import { HomePage } from "./features/home/HomePage.jsx";
import { StartInterview } from "./features/interview-chamber/pages/StartInterview.jsx";
import { InterviewChamber } from "./features/interview-chamber/pages/InterviewChamber.jsx";
import { MemoryCrystals } from "./features/memory-crystals/pages/MemoryCrystals.jsx";
import { SkillGalaxy } from "./features/skill-galaxy/SkillGalaxy.jsx";
import {
  ProtectedRoute,
  PublicRoute,
} from "./features/auth/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/start-interview"
        element={
          <ProtectedRoute>
            <StartInterview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview/:id"
        element={
          <ProtectedRoute>
            <InterviewChamber />
          </ProtectedRoute>
        }
      />
      <Route
        path="/memory-crystals"
        element={
          <ProtectedRoute>
            <MemoryCrystals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/skill-galaxy"
        element={
          <ProtectedRoute>
            <SkillGalaxy />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
