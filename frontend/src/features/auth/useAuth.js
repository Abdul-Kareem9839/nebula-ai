import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../../shared/api/client.js";

const TOKEN_KEY = "nebula_token";

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const restoreSession = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      clearSession();
      setLoading(false);
      return false;
    }

    setLoading(true);
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
      setIsAuthenticated(true);
      return true;
    } catch {
      clearSession();
      return false;
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      return data.user;
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      return data.user;
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return useMemo(
    () => ({
      login,
      register,
      logout,
      restoreSession,
      loading,
      error,
      user,
      isAuthenticated,
    }),
    [
      login,
      register,
      logout,
      restoreSession,
      loading,
      error,
      user,
      isAuthenticated,
    ],
  );
}
