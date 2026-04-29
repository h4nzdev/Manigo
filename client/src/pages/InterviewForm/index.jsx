import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Check,
  User,
  Calendar,
  Clock,
  Save,
  Wifi,
  WifiOff,
  ChevronDown,
  FileText,
  X,
  Pencil,
  Info,
  Users,
  DollarSign,
  Phone,
} from "lucide-react";
import { interviewQuestions } from "../../data/mockData";
import { addToQueue } from "../../utils/offlineQueue";

function getQuestion(id) {
  return interviewQuestions.find((q) => q.id === id);
}

// ─── Animated Dots for thinking/loading ───
function Dots() {
  return (
    <span className="inline-flex gap-0.5 ml-1">
      <span
        className="w-1 h-1 bg-current rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="w-1 h-1 bg-current rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="w-1 h-1 bg-current rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </span>
  );
}

// ─── Text Input Component ───
function TextInput({ question, onNext }) {
  const [val, setVal] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const isValid = val.trim().length > 0;
  const inputType = question.type === "number" ? "number" : "text";

  return (
    <div className="space-y-3">
      <div className="relative">
        {question.prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">
            {question.prefix}
          </span>
        )}
        <input
          ref={inputRef}
          type={inputType}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder={question.placeholder || "Type your answer..."}
          className={`w-full border border-slate-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition ${
            question.prefix ? "pl-8" : ""
          }`}
          onKeyDown={(e) => {
            if (e.key === "Enter" && isValid) onNext(val);
          }}
        />
        {val && (
          <button
            onClick={() => setVal("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <button
        disabled={!isValid}
        onClick={() => onNext(val)}
        className="w-full py-3 bg-emerald-700 text-white rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition flex items-center justify-center gap-2"
      >
        Next <ArrowRight size={15} />
      </button>
    </div>
  );
}

// ─── Textarea Input Component ───
function TextareaInput({ question, onNext }) {
  const [val, setVal] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="space-y-3">
      <textarea
        ref={textareaRef}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder={question.placeholder || "Type your notes..."}
        rows={4}
        className="w-full border border-slate-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 resize-none transition"
      />
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{val.length} characters</span>
        <span>
          {val.trim() ? "Ready to submit" : "Enter notes to continue"}
        </span>
      </div>
      <button
        onClick={() => onNext(val)}
        className="w-full py-3 bg-emerald-700 text-white rounded-xl font-semibold text-sm active:scale-[0.98] transition flex items-center justify-center gap-2"
      >
        Submit Interview <Check size={15} />
      </button>
    </div>
  );
}

// ─── Select with visual indicators ───
function SelectInput({ question, onSelect, answers }) {
  const previouslySelected = answers[question.id];

  const getIcon = (opt) => {
    if (opt.icon === "warning")
      return <AlertTriangle size={18} className="text-amber-500 shrink-0" />;
    if (opt.icon === "check")
      return <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />;
    return null;
  };

  const getStyle = (opt) => {
    if (opt.risk === "high")
      return "border-red-200 hover:border-red-400 hover:bg-red-50";
    if (opt.risk === "medium")
      return "border-amber-200 hover:border-amber-400 hover:bg-amber-50";
    return "border-slate-200 hover:border-emerald-400 hover:bg-emerald-50";
  };

  return (
    <div className="space-y-2">
      {question.options.map((opt) => {
        const isSelected = previouslySelected === opt.label;
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt)}
            className={`w-full text-left px-4 py-3.5 border rounded-xl text-sm transition-all active:scale-[0.98] flex items-center gap-3 ${
              isSelected
                ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                : getStyle(opt)
            }`}
          >
            {getIcon(opt)}
            <span
              className={`flex-1 font-medium ${isSelected ? "text-emerald-800" : "text-slate-700"}`}
            >
              {opt.label}
            </span>
            {opt.hint && (
              <span className="text-xs text-slate-400">{opt.hint}</span>
            )}
            {isSelected && (
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Progress Stepper ───
function ProgressStepper({ current, total, history, questions }) {
  // Show mini dots for all questions, filled for answered
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-slate-500">
        <span>
          Question {history.length} of {questions.length}
        </span>
        <span className="font-medium text-emerald-700">
          {Math.round((history.length / questions.length) * 100)}% complete
        </span>
      </div>
      <div className="flex gap-1">
        {questions.map((q, i) => (
          <div
            key={q.id}
            className="flex-1 h-1.5 rounded-full transition-colors duration-300"
            style={{
              backgroundColor:
                i < history.length - 1
                  ? "#10b981"
                  : i === history.length - 1
                    ? "#34d399"
                    : "#e2e8f0",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Question Number Badge ───
function QuestionBadge({ index, total, category }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
        Q{index} of {total}
      </span>
      {category && (
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Info size={12} /> {category}
        </span>
      )}
    </div>
  );
}

// ─── Saved Answers Preview ───
function SavedAnswersPreview({ answers, onEdit, questions }) {
  const [expanded, setExpanded] = useState(false);
  const answeredCount = Object.keys(answers).length;

  if (answeredCount === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition"
      >
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-700">
            {answeredCount} answered question{answeredCount !== 1 ? "s" : ""}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      {expanded && (
        <div className="px-4 pb-3 space-y-2 border-t border-slate-50 pt-3">
          {Object.entries(answers).map(([qId, val]) => {
            const q = questions.find((q) => q.id === qId);
            if (!q) return null;
            return (
              <div key={qId} className="flex items-start gap-2 text-sm group">
                <span className="text-slate-400 flex-1 min-w-0 truncate">
                  {q.text}
                </span>
                <span className="font-medium text-slate-800 text-right max-w-[140px] truncate">
                  {val || "—"}
                </span>
                <button
                  onClick={() => onEdit(qId)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-emerald-600 transition shrink-0"
                >
                  <Pencil size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Offline Banner ───
function OfflineBanner() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-amber-800">
      <WifiOff size={16} className="shrink-0" />
      <span className="flex-1">
        You're offline. Answers will be saved locally and synced when connected.
      </span>
      <Save size={16} className="shrink-0" />
    </div>
  );
}

// ─── MAIN INTERVIEW FORM ───
export default function InterviewForm() {
  const [currentId, setCurrentId] = useState("q1");
  const [answers, setAnswers] = useState({});
  const [history, setHistory] = useState(["q1"]);
  const [submitted, setSubmitted] = useState(false);
  const [clientName, setClientName] = useState("");
  const [isOffline, setIsOffline] = useState(false);

  const question = getQuestion(currentId);
  const currentIndex =
    interviewQuestions.findIndex((q) => q.id === currentId) + 1;

  // Simulate offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    setIsOffline(!navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  function advance(nextId, value) {
    const newAnswers = { ...answers, [currentId]: value };
    setAnswers(newAnswers);
    if (nextId) {
      setHistory((h) => [...h, nextId]);
      setCurrentId(nextId);
    } else {
      addToQueue({
        id: `q-${Date.now()}`,
        type: 'Interview Form',
        client: clientName || 'Unknown Client',
        timestamp: new Date().toLocaleString('en-PH', { dateStyle: 'short', timeStyle: 'short' }),
        status: 'queued',
      });
      setSubmitted(true);
    }
  }

  function handleSelect(option) {
    advance(option.next, option.label);
  }

  function handleTextNext(value) {
    const nextId = question.next || null;
    advance(nextId, value);
  }

  function goBack() {
    if (history.length <= 1) return;
    const prev = history[history.length - 2];
    setHistory((h) => h.slice(0, -1));
    setCurrentId(prev);
  }

  function editAnswer(qId) {
    // Jump back to a specific question
    const idx = interviewQuestions.findIndex((q) => q.id === qId);
    if (idx === -1) return;
    const newHistory = history.slice(0, idx + 1);
    setHistory(newHistory);
    setCurrentId(qId);
  }

  function reset() {
    setCurrentId("q1");
    setAnswers({});
    setHistory(["q1"]);
    setSubmitted(false);
    setClientName("");
  }

  const progress = submitted
    ? 100
    : Math.round((history.length / interviewQuestions.length) * 100);

  // ─── SUBMITTED STATE ───
  if (submitted) {
    return (
      <div className="p-4 space-y-5">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-lg font-bold text-emerald-800">
            Interview Submitted
          </h2>
          <p className="text-sm text-emerald-700">
            {clientName ? `${clientName}'s` : "This"} application has been
            {isOffline
              ? " saved locally and will sync when online."
              : " uploaded successfully."}
          </p>
        </div>

        {/* Offline status */}
        {isOffline && <OfflineBanner />}

        {/* Summary */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <FileText size={16} className="text-slate-400" /> Interview Summary
          </h3>
          <div className="space-y-2">
            {Object.entries(answers).map(([qId, val]) => {
              const q = getQuestion(qId);
              if (!q) return null;
              return (
                <div
                  key={qId}
                  className="flex gap-2 text-sm py-1.5 border-b border-slate-50 last:border-0"
                >
                  <span className="text-slate-400 flex-1 text-xs">
                    {q.text}
                  </span>
                  <span className="font-semibold text-slate-800 text-right max-w-[140px] truncate">
                    {val || "—"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={reset}
            className="w-full py-3 bg-emerald-700 text-white rounded-xl font-semibold text-sm active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <Users size={16} /> Start New Interview
          </button>
          <button className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm active:scale-[0.98] transition">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ─── INTERVIEW ACTIVE STATE ───
  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Borrower Interview
          </h1>
          <p className="text-sm text-slate-500">
            {clientName ? `Interviewing ${clientName}` : "New application"}
          </p>
        </div>
        {isOffline && (
          <span className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
            <WifiOff size={12} /> Offline
          </span>
        )}
        {!isOffline && (
          <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
            <Wifi size={12} /> Online
          </span>
        )}
      </div>

      {/* Client name input */}
      {history.length === 1 && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <User size={15} className="text-slate-400" /> Client Full Name
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="e.g. Maria Santos"
            className="w-full border border-slate-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            autoFocus
          />
        </div>
      )}

      {/* Offline banner */}
      {isOffline && <OfflineBanner />}

      {/* Progress stepper */}
      <ProgressStepper
        current={currentIndex}
        total={interviewQuestions.length}
        history={history}
        questions={interviewQuestions}
      />

      {/* Saved answers preview */}
      <SavedAnswersPreview
        answers={answers}
        onEdit={editAnswer}
        questions={interviewQuestions}
      />

      {/* Question card */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4">
        {/* Flag / Warning */}
        {question.flag && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 text-xs text-amber-700 font-medium flex items-start gap-2">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <span>{question.flag}</span>
          </div>
        )}

        {/* Badge */}
        <QuestionBadge
          index={currentIndex}
          total={interviewQuestions.length}
          category={question.category}
        />

        {/* Question text */}
        <p className="text-base font-semibold text-slate-800 leading-relaxed">
          {question.text}
        </p>
        {question.description && (
          <p className="text-xs text-slate-500 -mt-3">{question.description}</p>
        )}

        {/* Input based on type */}
        {question.type === "select" && (
          <SelectInput
            question={question}
            onSelect={handleSelect}
            answers={answers}
          />
        )}

        {(question.type === "text" || question.type === "number") && (
          <TextInput question={question} onNext={handleTextNext} />
        )}

        {question.type === "textarea" && (
          <TextareaInput question={question} onNext={handleTextNext} />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        {history.length > 1 ? (
          <button
            onClick={goBack}
            className="text-sm text-slate-500 flex items-center gap-1.5 hover:text-slate-700 transition px-3 py-2 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft size={16} /> Previous
          </button>
        ) : (
          <div />
        )}
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Clock size={12} /> ~{interviewQuestions.length - history.length}{" "}
          questions left
        </span>
      </div>
    </div>
  );
}
