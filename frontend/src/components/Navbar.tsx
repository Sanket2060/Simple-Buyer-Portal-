import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  const isActive = (path: string) =>
    location.pathname === path
      ? "text-white"
      : "text-zinc-400 hover:text-white transition-colors";

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate("/", { replace: true });
  };

  // Derive initials from full name
  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="text-white font-semibold text-sm tracking-wide"
          >
            BuyerPortal
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className={`text-sm ${isActive("/dashboard")}`}
            >
              Dashboard
            </Link>
            <Link
              to="/favourites"
              className={`text-sm ${isActive("/favourites")}`}
            >
              Favourites
            </Link>
          </div>

          {/* User + logout */}
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-300 text-xs font-medium select-none"
              title={user?.fullName ?? ""}
            >
              {initials}
            </div>
            <button
              onClick={handleLogout}
              className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
