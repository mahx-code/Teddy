import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, PieChart, Sparkles, ArrowRight, Check } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    title: "Track Your Expenses",
    description:
      "Easily log and categorize your daily spending. Add transactions with just a few taps and watch your financial picture come into focus.",
  },
  {
    icon: PieChart,
    title: "Visualize Your Spending",
    description:
      "Beautiful charts show you exactly where your money goes. Analyze daily, weekly, monthly, or yearly trends at a glance.",
  },
  {
    icon: Sparkles,
    title: "Meet Leo, Your AI Advisor",
    description:
      "Get personalized financial advice from Leo, your AI assistant. Ask questions about your spending habits and receive actionable insights.",
  },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem("teddy-onboarding-complete", "true");
      navigate("/");
    }
  };

  const handleSkip = () => {
    localStorage.setItem("teddy-onboarding-complete", "true");
    navigate("/");
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-8 ${
        isDark ? "bg-zinc-950" : "bg-slate-50"
      }`}
    >
      <div className="max-w-lg w-full">
        {/* Progress */}
        <div className="flex gap-2 mb-12 justify-center">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-12 rounded-full transition-colors ${
                index <= currentStep
                  ? "bg-indigo-600"
                  : isDark
                  ? "bg-zinc-800"
                  : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <div
              className={`w-24 h-24 mx-auto mb-8 rounded-3xl flex items-center justify-center ${
                isDark ? "bg-zinc-900" : "bg-white shadow-lg"
              }`}
            >
              {(() => {
                const Icon = steps[currentStep].icon;
                return <Icon className="w-12 h-12 text-indigo-600" />;
              })()}
            </div>

            <h1
              className={`text-3xl font-bold mb-4 ${
                isDark ? "text-zinc-100" : "text-slate-900"
              }`}
            >
              {steps[currentStep].title}
            </h1>
            <p
              className={`text-lg mb-12 ${
                isDark ? "text-zinc-400" : "text-slate-500"
              }`}
            >
              {steps[currentStep].description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          <button
            onClick={handleNext}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors"
          >
            {currentStep === steps.length - 1 ? (
              <>
                Get Started <Check className="w-5 h-5" />
              </>
            ) : (
              <>
                Continue <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {currentStep < steps.length - 1 && (
            <button
              onClick={handleSkip}
              className={`py-3 font-medium rounded-xl transition-colors ${
                isDark
                  ? "text-zinc-500 hover:text-zinc-300"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Skip for now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
