import { useState, useRef, useEffect } from "react";
import { Sidebar, TopNav } from "../components/Navigation";
import { usePuterStorage } from "../hooks/usePuterStorage";
import { useTheme } from "../context/ThemeContext";
import { Send, Loader2, Sparkles, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are Leo, a friendly and knowledgeable AI financial advisor embedded in an expense tracking app called Teddy. 
Your personality is warm, encouraging, and professional. You help users understand their spending habits and provide actionable financial advice.
You have access to the user's transaction data which will be provided to you.
Keep responses concise but helpful. Use emojis sparingly to add warmth.
If asked about specific transactions, refer to the data provided.
Always be supportive and never judgmental about spending habits.`;

export function LeoPage() {
  const { transactions } = usePuterStorage();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hey there! 👋 I'm Leo, your personal financial advisor. I can see your transaction history and help you understand your spending patterns, create budgets, or answer any questions about managing your finances. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getTransactionContext = () => {
    if (transactions.length === 0) {
      return "The user has no transactions recorded yet.";
    }

    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    const categories = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([cat, amount]) => `${cat}: $${amount.toFixed(2)}`)
      .join(", ");

    const recentTransactions = transactions
      .slice(0, 5)
      .map(
        (t) =>
          `${t.category}: $${t.amount} on ${new Date(
            t.date
          ).toLocaleDateString()}`
      )
      .join("; ");

    return `User's financial data:
- Total transactions: ${transactions.length}
- Total spent: $${totalSpent.toFixed(2)}
- Top spending categories: ${topCategories}
- Recent transactions: ${recentTransactions}`;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await puter.ai.chat(input.trim(), {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `${SYSTEM_PROMPT}\n\n${getTransactionContext()}`,
          },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          { role: "user", content: input.trim() },
        ],
      });

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.message.content,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Oops! I'm having trouble connecting right now. Please try again in a moment. 🙁",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex ${isDark ? "bg-zinc-950" : "bg-slate-50"}`}
    >
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        <TopNav />

        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1
                className={`text-2xl font-bold ${
                  isDark ? "text-zinc-100" : "text-slate-900"
                }`}
              >
                Leo
              </h1>
              <p
                className={`text-sm ${
                  isDark ? "text-zinc-500" : "text-slate-500"
                }`}
              >
                Your AI Financial Advisor
              </p>
            </div>
          </div>

          <div
            className={`flex-1 rounded-3xl p-6 mb-6 overflow-y-auto max-h-[60vh] ${
              isDark
                ? "bg-zinc-900 border border-zinc-800"
                : "bg-white border border-slate-100 shadow-sm"
            }`}
          >
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 mb-6 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-indigo-600 text-white"
                        : isDark
                        ? "bg-zinc-800 text-zinc-200"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    isDark ? "bg-zinc-800" : "bg-slate-100"
                  }`}
                >
                  <Loader2
                    className={`w-5 h-5 animate-spin ${
                      isDark ? "text-zinc-400" : "text-slate-400"
                    }`}
                  />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div
            className={`flex gap-4 p-4 rounded-2xl ${
              isDark
                ? "bg-zinc-900 border border-zinc-800"
                : "bg-white border border-slate-100 shadow-sm"
            }`}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask Leo anything about your finances..."
              className={`flex-1 bg-transparent outline-none text-sm ${
                isDark
                  ? "text-zinc-200 placeholder-zinc-500"
                  : "text-slate-800 placeholder-slate-400"
              }`}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
