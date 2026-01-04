import { Sidebar, TopNav } from "../components/Navigation";
import { useAuth } from "../context/AuthContext";
import { LogOut, User, Shield, Loader2 } from "lucide-react";
import { useState } from "react";

export function SettingsPage() {
  const { user, signOut, isLoading } = useAuth();
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
    <div className="min-h-screen flex bg-[var(--color-bg-main)]">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <TopNav />

        <div className="p-8 max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]">
              Settings
            </h1>
            <p className="text-[var(--color-text-muted)]">
              Manage your account and preferences.
            </p>
          </div>

          {/* Profile */}
          <div className="rounded-3xl p-8 border bg-[var(--color-bg-card)] border-[var(--color-border-standard)]">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-[var(--color-text-primary)]">
              <User className="w-5 h-5" /> Profile
            </h2>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-bold text-lg text-[var(--color-text-primary)]">
                  {user?.username || "User"}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {user?.email || "Signed in with Puter"}
                </p>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="rounded-3xl p-8 border bg-[var(--color-bg-card)] border-[var(--color-border-standard)]">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-[var(--color-text-primary)]">
              <Shield className="w-5 h-5" /> Security
            </h2>

            <button
              onClick={handleSignOut}
              disabled={isSigningOut || isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-xl transition-all disabled:opacity-50 bg-[var(--color-bg-expense-tag)] text-[var(--color-status-error)] hover:bg-red-100 disabled:bg-[var(--color-btn-disabled-bg)] disabled:text-[var(--color-btn-disabled-text)] disabled:shadow-none disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isSigningOut ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogOut className="w-5 h-5" />
              )}
              Sign Out
            </button>
          </div>

          <div className="text-center text-sm text-[var(--color-text-muted)]">
            <p>Teddy v1.0.0 • Powered by Puter</p>
          </div>
        </div>
      </main>
    </div>
  );
}
