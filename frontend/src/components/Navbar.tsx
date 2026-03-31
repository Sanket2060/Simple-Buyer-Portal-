import { Link, useLocation } from "react-router";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path
      ? "text-white"
      : "text-zinc-400 hover:text-white transition-colors";

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <Link
            to="/dashboard"
            className="text-white font-semibold text-sm tracking-wide"
          >
            BuyerPortal
          </Link>

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

          <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-300 text-xs font-medium select-none">
            J
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
