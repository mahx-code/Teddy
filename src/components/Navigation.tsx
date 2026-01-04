import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  Settings,
  Search,
  Receipt,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Receipt, label: "Transactions", path: "/transactions" },
  { icon: PieChart, label: "Analytics", path: "/analytics" },
  { icon: Sparkles, label: "Leo", path: "/leo" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar() {
  const location = useLocation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={`w-64 h-screen flex flex-col p-6 fixed left-0 top-0 z-50 border-r transition-colors ${
        isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-slate-100"
      }`}
    >
      <Link to="/" className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Wallet className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-500 to-violet-500">
          Teddy
        </span>
      </Link>

      <nav className="flex-1 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.label} to={item.path}>
              <motion.div
                whileHover={{ x: 5 }}
                className={`flex items-center gap-3 my-7 p-3 rounded-xl cursor-pointer transition-all ${
                  isActive
                    ? isDark
                      ? "bg-indigo-500/20 text-indigo-400 font-medium"
                      : "bg-indigo-50 text-indigo-600 font-medium shadow-sm"
                    : isDark
                    ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div
        className={`pt-6 border-t italic text-sm ${
          isDark
            ? "border-zinc-800 text-zinc-600"
            : "border-slate-100 text-slate-400"
        }`}
      >
        © Powered by{" "}
        <a href="https://docs.puter.com" target="_blank">
          Puter.js
        </a>
      </div>
    </div>
  );
}

export function TopNav() {
  const { user } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const isDark = resolvedTheme === "dark";
  const initials = user?.username?.slice(0, 2).toUpperCase() || "U";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/transactions?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div
      className={`h-20 flex items-center justify-between px-8 backdrop-blur-md sticky top-0 z-40 transition-colors ${
        isDark ? "bg-zinc-900/80" : "bg-slate-50/80"
      }`}
    >
      <div className="relative group w-96">
        <Search
          className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
            isDark
              ? "text-zinc-500 group-focus-within:text-indigo-400"
              : "text-slate-400 group-focus-within:text-indigo-500"
          }`}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Search transactions..."
          className={`w-full border-none rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none ${
            isDark
              ? "bg-zinc-800 text-zinc-200 placeholder-zinc-500"
              : "bg-slate-100 text-slate-600 placeholder-slate-400"
          }`}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className={`p-2.5 rounded-xl transition-colors ${
            isDark
              ? "hover:bg-zinc-800 text-zinc-400"
              : "hover:bg-slate-100 text-slate-500"
          }`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <Link
          to="/settings"
          className={`flex items-center gap-3 ml-2 border-l pl-6 ${
            isDark ? "border-zinc-700" : "border-slate-200"
          }`}
        >
          <div className="text-right">
            <p
              className={`text-sm font-semibold leading-none ${
                isDark ? "text-zinc-200" : "text-slate-900"
              }`}
            >
              {user?.username || "User"}
            </p>
            <p
              className={`text-xs mt-1 uppercase tracking-wider ${
                isDark ? "text-zinc-500" : "text-slate-500"
              }`}
            >
              Puter Cloud
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold">
            {initials}
          </div>
        </Link>
      </div>
    </div>
  );
}
