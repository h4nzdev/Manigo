import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  BookOpen,
  Send,
  Search,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Sparkles,
  Clock,
  ArrowRight,
  X,
  Info,
  FileText,
  Shield,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Tag,
} from "lucide-react";
import { policyFAQs } from "../../data/mockData";
import { matchWorkflow } from "../../data/workflows";
import WorkflowSuggestion from "../../components/WorkflowSuggestion";

const CATEGORIES = [
  "All",
  ...Array.from(new Set(policyFAQs.map((f) => f.category))),
];

const botReplies = {
  default: "Here's what I found based on your question:",
  notfound:
    "I couldn't find a specific policy for that. Try rephrasing or browse the FAQ library. You can also ask your supervisor for clarification.",
  greeting:
    "Hi! I'm your Manigo Policy Guide. I can help with loan policies, documentation requirements, collection procedures, interest rates, and more. What would you like to know?",
  thanks: "You're welcome! Is there anything else I can help with?",
};

// ─── Search with highlighting ───
function highlightText(text, query) {
  if (!query || query.length < 2) return text;
  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi",
  );
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-amber-100 text-amber-900 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

// ─── Category icon mapper ───
function getCategoryIcon(category) {
  const lower = category?.toLowerCase() || "";
  if (lower.includes("loan") || lower.includes("limit")) return FileText;
  if (lower.includes("document")) return FileText;
  if (lower.includes("collection") || lower.includes("payment")) return Shield;
  if (lower.includes("interest") || lower.includes("rate")) return Tag;
  return HelpCircle;
}

// ─── FAQ Card ───
function FAQCard({ faq, searchQuery, onAskChat }) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const CategoryIcon = getCategoryIcon(faq.category);
  const relatedWorkflow = matchWorkflow(`${faq.question} ${faq.category}`);

  function handleCopy() {
    navigator.clipboard?.writeText(`${faq.question}\n\n${faq.answer}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden hover:border-emerald-200 transition-all">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left p-4 flex items-start gap-3"
      >
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
            open ? "bg-emerald-100" : "bg-slate-100"
          }`}
        >
          <CategoryIcon
            size={15}
            className={open ? "text-emerald-600" : "text-slate-500"}
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 block mb-0.5">
            {faq.category}
          </span>
          <p className="text-sm font-semibold text-slate-800">
            {searchQuery
              ? highlightText(faq.question, searchQuery)
              : faq.question}
          </p>
          {faq.tags && (
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {faq.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <ChevronRight
          size={16}
          className={`text-slate-400 mt-1 shrink-0 transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-50 pt-3">
          <p className="text-sm text-slate-600 leading-relaxed pl-11">
            {searchQuery ? highlightText(faq.answer, searchQuery) : faq.answer}
          </p>

          {/* Action bar */}
          <div className="flex items-center gap-2 pl-11 pt-1">
            <button
              onClick={() => setFeedback(feedback === "up" ? null : "up")}
              className={`text-xs px-2 py-1 rounded-lg transition flex items-center gap-1 ${
                feedback === "up"
                  ? "bg-emerald-100 text-emerald-700"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              }`}
            >
              <ThumbsUp size={12} /> Helpful
            </button>
            <button
              onClick={() => setFeedback(feedback === "down" ? null : "down")}
              className={`text-xs px-2 py-1 rounded-lg transition flex items-center gap-1 ${
                feedback === "down"
                  ? "bg-red-100 text-red-700"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              }`}
            >
              <ThumbsDown size={12} /> Not helpful
            </button>
            <button
              onClick={handleCopy}
              className="text-xs px-2 py-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition flex items-center gap-1"
            >
              <Copy size={12} /> {copied ? "Copied!" : "Copy"}
            </button>
            {onAskChat && (
              <button
                onClick={() => onAskChat(faq.question)}
                className="text-xs px-2 py-1 rounded-lg text-emerald-600 hover:bg-emerald-50 transition flex items-center gap-1 ml-auto"
              >
                <MessageCircle size={12} /> Ask follow-up
              </button>
            )}
          </div>

          {/* Related workflow */}
          {relatedWorkflow && !showWorkflow && (
            <div className="pl-11">
              <button
                onClick={() => setShowWorkflow(true)}
                className="w-full text-left text-xs border border-dashed border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg px-3 py-2 flex items-center gap-2 transition"
              >
                <ArrowRight size={12} className="shrink-0" />
                <span>
                  <span className="font-semibold">Related workflow:</span>{' '}
                  {relatedWorkflow.title} · {relatedWorkflow.steps.length} steps
                </span>
              </button>
            </div>
          )}
          {relatedWorkflow && showWorkflow && (
            <div className="pl-11">
              <WorkflowSuggestion
                workflow={relatedWorkflow}
                onDismiss={() => setShowWorkflow(false)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Typing Indicator ───
function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1">
          <span
            className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Chat Message ───
function ChatMessage({ msg, onCopy }) {
  const isUser = msg.from === "user";
  const [copied, setCopied] = useState(false);
  const [workflowDismissed, setWorkflowDismissed] = useState(false);

  function handleCopy(text) {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[85%] space-y-2">
        {/* Message bubble */}
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm ${
            isUser
              ? "bg-emerald-700 text-white rounded-br-sm"
              : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm"
          }`}
        >
          <p className="leading-relaxed">{msg.text}</p>
          {msg.time && (
            <p
              className={`text-[10px] mt-1 ${isUser ? "text-emerald-200" : "text-slate-400"}`}
            >
              {msg.time}
            </p>
          )}
        </div>

        {/* FAQ cards attached to bot message */}
        {msg.faqs &&
          msg.faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white border border-emerald-100 rounded-xl p-3 shadow-sm space-y-2"
            >
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-emerald-100 rounded flex items-center justify-center shrink-0">
                  <Info size={12} className="text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800">
                    {faq.question}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-emerald-50">
                <span className="text-[10px] text-emerald-600 font-medium uppercase">
                  {faq.category}
                </span>
                <button
                  onClick={() => handleCopy(`${faq.question}\n${faq.answer}`)}
                  className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-1 ml-auto"
                >
                  <Copy size={10} /> {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          ))}

        {/* Workflow suggestion attached to bot message */}
        {!isUser && msg.workflow && !workflowDismissed && (
          <WorkflowSuggestion
            workflow={msg.workflow}
            onDismiss={() => setWorkflowDismissed(true)}
          />
        )}

        {/* Copy button for bot messages */}
        {!isUser && !msg.faqs && (
          <button
            onClick={() => onCopy(msg.text)}
            className="text-[10px] text-slate-400 hover:text-slate-600 ml-2 flex items-center gap-1"
          >
            <Copy size={10} /> Copy
          </button>
        )}
      </div>
    </div>
  );
}

// ─── MAIN POLICY GUIDE ───
export default function PolicyGuide() {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: botReplies.greeting,
      time: new Date().toLocaleTimeString("en-PH", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [catFilter, setCatFilter] = useState("All");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function matchFAQ(text) {
    const lower = text.toLowerCase();
    return policyFAQs.filter(
      (f) =>
        f.question.toLowerCase().includes(lower) ||
        f.answer.toLowerCase().includes(lower) ||
        f.category.toLowerCase().includes(lower) ||
        (f.tags && f.tags.some((t) => t.toLowerCase().includes(lower))),
    );
  }

  function sendMessage(text) {
    const userMsg = text || input.trim();
    if (!userMsg || isTyping) return;
    setInput("");

    const time = new Date().toLocaleTimeString("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const updated = [...messages, { from: "user", text: userMsg, time }];
    setMessages(updated);

    // Simulate typing delay
    setIsTyping(true);
    setTimeout(
      () => {
        const lower = userMsg.toLowerCase();

        // Greeting response
        if (
          ["hi", "hello", "hey", "good morning", "good afternoon"].some((g) =>
            lower.includes(g),
          )
        ) {
          setMessages((prev) => [
            ...prev,
            { from: "bot", text: botReplies.greeting, time },
          ]);
        }
        // Thanks response
        else if (
          ["thanks", "thank you", "thx"].some((t) => lower.includes(t))
        ) {
          setMessages((prev) => [
            ...prev,
            { from: "bot", text: botReplies.thanks, time },
          ]);
        }
        // Search for matches
        else {
          const matches = matchFAQ(userMsg);
          if (matches.length > 0) {
            setMessages((prev) => [
              ...prev,
              {
                from: "bot",
                text: botReplies.default,
                faqs: matches.slice(0, 3),
                workflow: matchWorkflow(userMsg),
                time,
              },
            ]);
          } else {
            setMessages((prev) => [
              ...prev,
              { from: "bot", text: botReplies.notfound, time },
            ]);
          }
        }
        setIsTyping(false);
      },
      800 + Math.random() * 800,
    );
  }

  function handleAskFromFAQ(question) {
    setActiveTab("chat");
    setInput(question);
    setTimeout(() => {
      sendMessage(question);
      inputRef.current?.focus();
    }, 100);
  }

  function handleCopy(text) {
    navigator.clipboard?.writeText(text);
  }

  function clearChat() {
    setMessages([
      {
        from: "bot",
        text: botReplies.greeting,
        time: new Date().toLocaleTimeString("en-PH", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  }

  const visibleFAQs =
    catFilter === "All"
      ? policyFAQs
      : policyFAQs.filter((f) => f.category === catFilter);

  const suggestions = [
    { text: "Loan limits", icon: FileText },
    { text: "Required documents", icon: FileText },
    { text: "Missed payment", icon: Shield },
    { text: "Interest rate", icon: Tag },
    { text: "Top-up loan", icon: HelpCircle },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] max-w-7xl mx-auto">
      {/* Tab bar */}
      <div className="flex border-b border-slate-200 bg-white shrink-0">
        {[
          { id: "chat", label: "Chat", Icon: MessageCircle, count: null },
          {
            id: "faq",
            label: "FAQ Library",
            Icon: BookOpen,
            count: policyFAQs.length,
          },
        ].map(({ id, label, Icon, count }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 py-3 text-sm font-medium transition flex items-center justify-center gap-2 relative ${
              activeTab === id
                ? "border-b-2 border-emerald-600 text-emerald-700"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon size={15} />
            {label}
            {count && (
              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-medium">
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── CHAT TAB ─── */}
      {activeTab === "chat" && (
        <>
          {/* Chat header */}
          <div className="bg-white border-b border-slate-100 px-4 py-2 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Sparkles size={14} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">
                  Policy Assistant
                </p>
                <p className="text-[10px] text-slate-400">
                  Answers based on company policy
                </p>
              </div>
            </div>
            {messages.length > 1 && (
              <button
                onClick={clearChat}
                className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((msg, i) => (
              <ChatMessage key={i} msg={msg} onCopy={handleCopy} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          <div className="bg-white border-t border-slate-100 px-4 py-2.5 flex gap-2 overflow-x-auto shrink-0">
            {suggestions.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.text}
                  onClick={() => sendMessage(s.text)}
                  className="text-xs bg-slate-50 text-slate-600 px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-emerald-50 hover:text-emerald-700 transition flex items-center gap-1.5 border border-slate-100"
                >
                  <Icon size={11} />
                  {s.text}
                </button>
              );
            })}
          </div>

          {/* Input */}
          <div className="bg-white border-t border-slate-200 px-4 py-3 flex gap-2 shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about policy..."
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
              className="bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-40 active:scale-95 transition flex items-center gap-1.5 hover:bg-emerald-800"
            >
              <Send size={14} />
            </button>
          </div>
        </>
      )}

      {/* ─── FAQ TAB ─── */}
      {activeTab === "faq" && (
        <>
          {/* Search + Filter */}
          <div className="bg-white border-b border-slate-100 px-4 py-3 space-y-2.5 shrink-0">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search policies..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              />
              {input && (
                <button
                  onClick={() => setInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                >
                  <X size={15} />
                </button>
              )}
            </div>
            <div className="flex gap-1.5 overflow-x-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCatFilter(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition border ${
                    catFilter === cat
                      ? "bg-emerald-700 text-white border-emerald-700"
                      : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {visibleFAQs
              .filter((faq) => {
                if (!input) return true;
                const q = input.toLowerCase();
                return (
                  faq.question.toLowerCase().includes(q) ||
                  faq.answer.toLowerCase().includes(q) ||
                  faq.category.toLowerCase().includes(q) ||
                  (faq.tags &&
                    faq.tags.some((t) => t.toLowerCase().includes(q)))
                );
              })
              .map((faq) => (
                <FAQCard
                  key={faq.id}
                  faq={faq}
                  searchQuery={input}
                  onAskChat={handleAskFromFAQ}
                />
              ))}
            {visibleFAQs.filter((faq) => {
              if (!input) return true;
              const q = input.toLowerCase();
              return (
                faq.question.toLowerCase().includes(q) ||
                faq.answer.toLowerCase().includes(q) ||
                faq.category.toLowerCase().includes(q)
              );
            }).length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <Search size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">No policies found</p>
                <p className="text-xs mt-1">
                  Try a different search term or category
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
