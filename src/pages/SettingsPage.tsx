import { Sidebar, TopNav } from "../components/Navigation";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  LogOut,
  User,
  Shield,
  Loader2,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { useState } from "react";

export function SettingsPage() {
  const { user, signOut, isLoading } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex ${isDark ? "bg-zinc-950" : "bg-slate-50"}`}
    >
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <TopNav />

        <div className="p-8 max-w-2xl mx-auto space-y-8">
          <div>
            <h1
              className={`text-3xl font-bold mb-2 ${
                isDark ? "text-zinc-100" : "text-slate-900"
              }`}
            >
              Settings
            </h1>
            <p className={isDark ? "text-zinc-500" : "text-slate-500"}>
              Manage your account and preferences.
            </p>
          </div>

          {/* Profile */}
          <div
            className={`rounded-3xl p-8 border ${
              isDark
                ? "bg-zinc-900 border-zinc-800"
                : "bg-white border-slate-100"
            }`}
          >
            <h2
              className={`text-lg font-bold mb-6 flex items-center gap-2 ${
                isDark ? "text-zinc-100" : "text-slate-900"
              }`}
            >
              <User className="w-5 h-5" /> Profile
            </h2>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p
                  className={`font-bold text-lg ${
                    isDark ? "text-zinc-100" : "text-slate-900"
                  }`}
                >
                  {user?.username || "User"}
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-zinc-500" : "text-slate-500"
                  }`}
                >
                  {user?.email || "Signed in with Puter"}
                </p>
              </div>
            </div>
          </div>

          {/* Theme */}
          <div
            className={`rounded-3xl p-8 border ${
              isDark
                ? "bg-zinc-900 border-zinc-800"
                : "bg-white border-slate-100"
            }`}
          >
            <h2
              className={`text-lg font-bold mb-6 flex items-center gap-2 ${
                isDark ? "text-zinc-100" : "text-slate-900"
              }`}
            >
              {isDark ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}{" "}
              Appearance
            </h2>

            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "light", label: "Light", icon: Sun },
                { value: "dark", label: "Dark", icon: Moon },
                { value: "system", label: "System", icon: Monitor },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value as "light" | "dark" | "system")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                    theme === value
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : isDark
                      ? "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Security */}
          <div
            className={`rounded-3xl p-8 border ${
              isDark
                ? "bg-zinc-900 border-zinc-800"
                : "bg-white border-slate-100"
            }`}
          >
            <h2
              className={`text-lg font-bold mb-6 flex items-center gap-2 ${
                isDark ? "text-zinc-100" : "text-slate-900"
              }`}
            >
              <Shield className="w-5 h-5" /> Security
            </h2>

            <button
              onClick={handleSignOut}
              disabled={isSigningOut || isLoading}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-xl transition-all disabled:opacity-50 ${
                isDark
                  ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                  : "bg-rose-50 text-rose-700 hover:bg-rose-100"
              }`}
            >
              {isSigningOut ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogOut className="w-5 h-5" />
              )}
              Sign Out
            </button>
          </div>

          <div
            className={`text-center text-sm ${
              isDark ? "text-zinc-600" : "text-slate-400"
            }`}
          >
            <p>Teddy v1.0.0 • Powered by Puter</p>
          </div>
        </div>
      </main>
    </div>
  );
}
