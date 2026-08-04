import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth.js";

function SessionScreen({ message }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060713] text-slate-200">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-5 text-sm text-slate-300">
        {message}
      </div>
    </div>
  );
}

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, restoreSession } = useAuth();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  if (loading && !isAuthenticated) {
    return <SessionScreen message="Checking your session…" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function PublicRoute({ children }) {
  const { isAuthenticated, loading, restoreSession } = useAuth();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  if (loading && isAuthenticated) {
    return <SessionScreen message="Restoring your session…" />;
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
