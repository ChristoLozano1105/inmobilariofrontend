import { createContext, useState, useContext, useEffect } from "react";
import {
  registerRequest,
  loginRequst,
  logoutRequest,
  verifyTokenRequest,
} from "../api/auth";

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
  const [loading, setLoading] = useState(true); // opcional pero recomendado

  const signUp = async (user) => {
    try {
      const res = await registerRequest(user);
      setUser(res.data);
      setIsAuthenticated(true);
      setIsAdmin((res.data?.role || "").toLowerCase() === "admin");
      setErrors([]);
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error al registrar usuario"]);
    }
  };

  const signIn = async (user) => {
    try {
      const res = await loginRequst(user);
      setUser(res.data);
      setIsAuthenticated(true);
      setIsAdmin((res.data?.role || "").toLowerCase() === "admin");
      setErrors([]);
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error al iniciar sesión"]);
    }
  };

  //  borra cookie en backend + limpia estado
  const logout = async () => {
    try {
      await logoutRequest(); // POST /logout
    } catch (error) {
      console.error("logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setErrors([]);
    }
  };


  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await verifyTokenRequest(); // GET /verify (o /profile según tu backend)
        setUser(res.data);
        setIsAuthenticated(true);
        setIsAdmin((res.data?.role || "").toLowerCase() === "admin");
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  // useEffect que limpia errores después de 5 segundos
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
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
