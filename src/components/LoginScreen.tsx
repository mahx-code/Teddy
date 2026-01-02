import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Wallet, ArrowRight, Loader2 } from "lucide-react";

export function LoginScreen() {
  const { signIn, isLoading } = useAuth();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        isDark
          ? "bg-zinc-950"
          : "bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-3xl p-10 max-w-md w-full text-center ${
          isDark ? "bg-zinc-900 border border-zinc-800" : "bg-white shadow-2xl"
        }`}
      >
        <div className="w-20 h-20 bg-linear-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Wallet className="w-10 h-10 text-white" />
        </div>

        <h1
          className={`text-3xl font-black mb-2 ${
            isDark ? "text-zinc-100" : "text-slate-900"
          }`}
        >
          Welcome to Teddy
        </h1>
        <p className={`mb-8 ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
          Your personal expense tracker with cloud sync. Sign in to get started.
        </p>

        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in with Puter
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <p
          className={`text-xs mt-6 ${
            isDark ? "text-zinc-600" : "text-slate-400"
          }`}
        >
          By signing in, you agree to our Terms of Service. Your data is
          securely stored in your Puter cloud.
        </p>
      </motion.div>
    </div>
  );
}
