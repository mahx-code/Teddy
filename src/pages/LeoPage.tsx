import { useState, useRef, useEffect } from "react";
import { Sidebar, TopNav } from "../components/Navigation";
import { usePuterStorage } from "../hooks/usePuterStorage";
import { useAuth } from "../context/AuthContext";
import { Send, Loader2, Sparkles, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function LeoPage() {
  const { transactions } = usePuterStorage();
  const { user } = useAuth();
  const username = user?.username || "there";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hey ${username}! 👋 I'm Leo, your personal financial advisor here in Teddy. I have full access to your transaction history, so I can help you understand your spending patterns, suggest ways to save money, or answer any questions about your finances. How can I help you today?`,
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

  const buildSystemPrompt = () => {
    const now = new Date();
    // Calculate comprehensive statistics
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = thisMonthStart;

    const thisMonthTxs = transactions.filter(
      (t) => new Date(t.date) >= thisMonthStart
    );
    const lastMonthTxs = transactions.filter((t) => {
      const d = new Date(t.date);
      return d >= lastMonthStart && d < lastMonthEnd;
    });

    const thisMonthTotal = thisMonthTxs.reduce((sum, t) => sum + t.amount, 0);
    const lastMonthTotal = lastMonthTxs.reduce((sum, t) => sum + t.amount, 0);
    const allTimeTotal = transactions.reduce((sum, t) => sum + t.amount, 0);

    // Category breakdown
    const categoryBreakdown = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const sortedCategories = Object.entries(categoryBreakdown)
      .sort(([, a], [, b]) => b - a)
      .map(([cat, amount]) => `  - ${cat}: $${amount.toFixed(2)}`)
      .join("\n");

    // All transactions for reference
    const allTransactionsList = transactions
      .slice(0, 20)
      .map(
        (t) =>
          `  - ${new Date(t.date).toLocaleDateString()}: ${
            t.category
          } - $${t.amount.toFixed(2)}${
            t.description ? ` (${t.description})` : ""
          }`
      )
      .join("\n");

    return `You are Leo, a friendly, warm, and highly analytical AI financial advisor in the Teddy app.

CRITICAL INSTRUCTIONS:
1. IDENTITY: You are Leo. NOT an AI model. You have a distinct personality: smart, optimistic, and helpful.
2. DATA: You have REAL-TIME access to the user's finances (listed below). USE IT. specific numbers, dates, and categories.
3. TONE: Be human. engaging, and conversational.
4. LENGTH: Keep responses SHORT and CONCISE (2-3 sentences max usually). avoiding long lectures unless asked.

USER CONTEXT:
- Name: ${username}
- Date: ${now.toLocaleDateString()}

FINANCIAL DATA:
- Total Spent (All Time): $${allTimeTotal.toFixed(2)}
- This Month: $${thisMonthTotal.toFixed(2)}
- Last Month: $${lastMonthTotal.toFixed(2)}
- Transaction Count: ${transactions.length}

TOP CATEGORIES:
${sortedCategories || "  No data."}

RECENT TRANSACTIONS:
${allTransactionsList || "  No transactions."}

Start by answering the user's question directly using the data above.`;
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

    // Prepare the messages for the API
    // 1. System Prompt with Context
    const systemMessage = {
      role: "system",
      content: buildSystemPrompt(),
    };

    // 2. History (excluding the current user message being added now)
    const historyMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // 3. Current User Message
    const currentUserMessage = {
      role: "user",
      content: input.trim(),
    };

    // Combine into full conversation
    // Note: Puter/OpenAI expects an array of messages as the first argument for chat history
    const apiMessages = [systemMessage, ...historyMessages, currentUserMessage];

    try {
      // Debug: Log the context data being sent
      console.log("Leo Context Data:", {
        transactionCount: transactions.length,
        systemPrompt: systemMessage.content,
      });

      // Pass the ARRAY of messages as the FIRST argument
      // This ensures the System Prompt is respected
      // @ts-ignore - Puter types might expect string, but array is supported
      const response = await puter.ai.chat(apiMessages, {
        model: "gpt-4o-mini",
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
            "I'm having a little trouble connecting right now. Could you try again in a moment? 🙁",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--color-bg-main)]">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        <TopNav />

        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                Leo
              </h1>
              <p className="text-sm text-[var(--color-text-muted)]">
                Your AI Financial Advisor
              </p>
            </div>
            <div className="ml-auto text-xs px-3 py-1.5 rounded-full bg-[var(--color-bg-income-tag)] text-[var(--color-status-success)]">
              {transactions.length} transactions loaded
            </div>
          </div>

          <div className="flex-1 rounded-3xl p-6 mb-6 overflow-y-auto max-h-[60vh] bg-[var(--color-bg-card)] border border-[var(--color-border-standard)] relative">
            {/* Added relative to container to help spacing */}
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
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-[var(--color-btn-primary-bg)] text-[var(--color-btn-primary-text)]"
                        : "bg-[var(--color-btn-secondary-bg)] text-[var(--color-btn-secondary-text)]"
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
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="rounded-2xl px-4 py-3 bg-[var(--color-btn-secondary-bg)]">
                  <Loader2 className="w-5 h-5 animate-spin text-[var(--color-text-muted)]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-4 p-4 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-standard)]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask Leo anything about your finances..."
              className="flex-1 bg-transparent outline-none text-sm text-[var(--color-text-body)] placeholder-[var(--color-text-placeholder)]"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-[var(--color-btn-primary-bg)] hover:bg-[var(--color-btn-primary-hover)] text-white flex items-center justify-center disabled:bg-[var(--color-btn-disabled-bg)] disabled:text-[var(--color-btn-disabled-text)] disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
