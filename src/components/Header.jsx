import { Link, useNavigate } from "react-router-dom";
import {
  FaSignInAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaClipboardList,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isAdmin = (user?.role || "").toLowerCase() === "admin";

  return (
    <header className="bg-zinc-900 border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo / Inicio */}
        <Link to="/" className="text-lg font-bold text-white">
          InmoConect
        </Link>

        {/* Acciones */}
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-md text-sm font-semibold transition"
            >
              <FaSignInAlt />
              Iniciar sesión
            </Link>
          ) : (
            <>
              {/* SOLO USUARIO (NO ADMIN): Mis solicitudes */}
              {!isAdmin && (
                <Link
                  to="/mis-solicitudes"
                  className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm font-semibold transition"
                >
                  <FaClipboardList />
                  Mis solicitudes
                </Link>
              )}

              {/* Usuario */}
              <div className="flex items-center gap-2 text-gray-200">
                <FaUserCircle className="text-xl" />
                <span className="text-sm">
                  {user?.username}
                  {isAdmin && (
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full">
                      
                    </span>
                  )}
                </span>
              </div>

              {/* Salir */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-semibold transition"
              >
                <FaSignOutAlt />
                Salir
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
