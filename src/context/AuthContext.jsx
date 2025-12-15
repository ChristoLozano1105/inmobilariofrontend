import { createContext, useState, useContext, useEffect } from "react";
import {
  registerRequest,
  loginRequst,
  logoutRequest,
  verifyTokenRequest,
} from "../api/auth";
import api from "../api/axiosInstance";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe estar definido en un contexto");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const setAuthFromUser = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setIsAdmin((userData?.role || "").toLowerCase() === "admin");
  };

  const clearAuth = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  // ✅ registrar
  const signUp = async (payload) => {
    try {
      const res = await registerRequest(payload);

      // Si tu backend también regresa token al registrar:
      const token = res.data?.token || res.data?.accessToken;
      if (token) {
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const userData = res.data?.user || res.data;
      setAuthFromUser(userData);
      setErrors([]);
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error al registrar usuario"]);
    }
  };

  // ✅ login
  const signIn = async (payload) => {
    try {
      const res = await loginRequst(payload);

      // 🔥 Ajusta aquí si tu backend usa otro nombre
      const token = res.data?.token || res.data?.accessToken;

      if (token) {
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const userData = res.data?.user || res.data;
      setAuthFromUser(userData);
      setErrors([]);
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error al iniciar sesión"]);
    }
  };

  // ✅ logout
  const logout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.error("logout error:", error);
    } finally {
      clearAuth();
      setErrors([]);
    }
  };

  // ✅ mantener sesión
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          clearAuth();
          return;
        }

        // setea header para requests posteriores
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // tu verifyTokenRequest = GET /profile
        const res = await verifyTokenRequest();
        setAuthFromUser(res.data);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ limpiar errores después de 5s
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => setErrors([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  return (
    <AuthContext.Provider
      value={{
        signUp,
        signIn,
        logout,
        user,
        isAuthenticated,
        isAdmin,
        errors,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
