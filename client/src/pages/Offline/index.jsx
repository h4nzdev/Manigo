import { useState, useEffect } from "react";
import {
  Globe,
  WifiOff,
  CheckCircle2,
  AlertCircle,
  ClipboardList,
  CreditCard,
  Plus,
  RefreshCw,
  Trash2,
  Clock,
  ShieldCheck,
  Cloud,
  CloudOff,
  Download,
  Upload,
  Battery,
  Signal,
  ChevronDown,
  ChevronUp,
  FileText,
  Users,
  X,
  Zap,
} from "lucide-react";
import { offlineQueue } from "../../data/mockData";
import { getQueue, saveQueue, onQueueChange } from "../../utils/offlineQueue";

const SYNC_STEPS = [
  { label: "Establishing connection...", icon: Signal },
  { label: "Uploading interview forms...", icon: FileText },
  { label: "Uploading payment records...", icon: CreditCard },
  { label: "Verifying data integrity...", icon: ShieldCheck },
  { label: "Sync complete!", icon: CheckCircle2 },
];

// ─── Connection Strength Indicator ───
function ConnectionStrength({ isOnline }) {
  const bars = isOnline ? 4 : 0;
  return (
    <div className="flex items-end gap-0.5 h-4">
      {[1, 2, 3, 4].map((bar) => (
        <div
          key={bar}
          className={`w-1 rounded-t-sm transition-colors ${
            bar <= bars
              ? bar <= 2
                ? "bg-amber-400"
                : "bg-emerald-500"
              : "bg-slate-200"
          }`}
          style={{ height: `${bar * 25}%` }}
        />
      ))}
    </div>
  );
}

// ─── Status Badge ───
function StatusBadge({ status }) {
  const config = {
    queued: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      icon: Clock,
    },
    uploading: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: Upload,
    },
    synced: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      icon: CheckCircle2,
    },
    failed: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      icon: AlertCircle,
    },
  };
  const cfg = config[status] || config.queued;
  const Icon = cfg.icon;
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium border flex items-center gap-1 ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <Icon size={11} /> {status}
    </span>
  );
}

// ─── Storage Usage Bar ───
function StorageBar({ usedMB, totalMB }) {
  const pct = (usedMB / totalMB) * 100;
  const color =
    pct > 80 ? "bg-amber-500" : pct > 60 ? "bg-emerald-500" : "bg-emerald-400";
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-500 mb-1">
        <span>Local storage</span>
        <span>
          {usedMB} MB / {totalMB} MB
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── MAIN OFFLINE PAGE ───
export default function Offline({ isOnline }) {
  const [queue, setQueue] = useState(() => {
    const persisted = getQueue();
    return persisted.length > 0 ? persisted : offlineQueue;
  });
  const [syncing, setSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState(0);
  const [syncDone, setSyncDone] = useState(false);
  const [lastSync, setLastSync] = useState("Apr 28, 2026 — 6:43 PM");
  const [showTips, setShowTips] = useState(false);
  const [showCleared, setShowCleared] = useState(false);
  const [showLog, setShowLog] = useState(false);

  // Simulated sync log
  const [syncLog, setSyncLog] = useState([
    { time: "Apr 28, 6:43 PM", status: "success", items: 3 },
    { time: "Apr 27, 2:15 PM", status: "success", items: 5 },
    { time: "Apr 26, 9:30 AM", status: "partial", items: 4 },
  ]);

  // Stay in sync with items added from other pages (e.g. Interview Form)
  useEffect(() => {
    return onQueueChange(() => setQueue(getQueue()));
  }, []);

  // Persist queue changes to localStorage
  useEffect(() => {
    saveQueue(queue);
  }, [queue]);

  const pendingCount = queue.filter((i) => i.status === "queued").length;
  const failedCount = queue.filter((i) => i.status === "failed").length;

  function startSync() {
    if (!isOnline || syncing) return;
    setSyncing(true);
    setSyncDone(false);
    setShowCleared(false);
    setSyncStep(0);

    // Mark all as uploading
    setQueue((q) => q.map((item) => ({ ...item, status: "uploading" })));

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setSyncStep(step);
      if (step >= SYNC_STEPS.length - 1) {
        clearInterval(interval);
        // Mark all as synced
        setQueue((q) => q.map((item) => ({ ...item, status: "synced" })));
        setSyncing(false);
        setSyncDone(true);
        setLastSync(
          new Date().toLocaleString("en-PH", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
        );
        setSyncLog((prev) => [
          {
            time: new Date().toLocaleString("en-PH", {
              dateStyle: "medium",
              timeStyle: "short",
            }),
            status: "success",
            items: queue.length,
          },
          ...prev.slice(0, 4),
        ]);
        // Clear synced items after showing success
        setTimeout(() => {
          setQueue([]);
          setShowCleared(true);
        }, 2000);
      }
    }, 800);
  }

  function addMockItem() {
    const types = [
      { type: "Interview Form", icon: ClipboardList },
      { type: "Payment Record", icon: CreditCard },
      { type: "Client Update", icon: Users },
    ];
    const t = types[Math.floor(Math.random() * types.length)];
    const newItem = {
      id: `q-${Date.now()}`,
      type: t.type,
      client: ["Rosa Mendoza", "Ben Aquino", "Lita Ramos", "Carlos Bautista"][
        Math.floor(Math.random() * 4)
      ],
      timestamp: new Date().toLocaleString("en-PH", {
        dateStyle: "short",
        timeStyle: "short",
      }),
      status: "queued",
    };
    setQueue((q) => [...q, newItem]);
    setSyncDone(false);
    setShowCleared(false);
  }

  function removeItem(id) {
    setQueue((q) => q.filter((item) => item.id !== id));
  }

  function clearSynced() {
    setQueue((q) => q.filter((item) => item.status !== "synced"));
  }

  function retryFailed() {
    setQueue((q) =>
      q.map((item) =>
        item.status === "failed" ? { ...item, status: "queued" } : item,
      ),
    );
  }

  // Sync step icon
  const CurrentStepIcon = syncing ? SYNC_STEPS[syncStep].icon : RefreshCw;

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Offline & Sync</h1>
          <p className="text-sm text-slate-500">
            Manage field data and sync status
          </p>
        </div>
        <ConnectionStrength isOnline={isOnline} />
      </div>

      {/* Connection status card */}
      <div
        className={`rounded-xl p-4 border transition-colors ${
          isOnline
            ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200"
            : "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200"
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isOnline ? "bg-emerald-100" : "bg-slate-200"
            }`}
          >
            {isOnline ? (
              <Cloud size={24} className="text-emerald-600" />
            ) : (
              <CloudOff size={24} className="text-slate-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`font-bold ${isOnline ? "text-emerald-800" : "text-slate-700"}`}
            >
              {isOnline ? "Connected to internet" : "No internet connection"}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
              <Clock size={11} /> Last sync: {lastSync}
            </p>
          </div>
        </div>
        {!isOnline && (
          <div className="mt-3 pt-3 border-t border-slate-200/50">
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Battery size={12} /> Data is saving locally. Connect to sync.
            </p>
          </div>
        )}
      </div>

      {/* Storage usage */}
      <StorageBar usedMB={4.2} totalMB={10} />

      {/* Sync progress */}
      {syncing && (
        <div className="bg-white rounded-xl border border-emerald-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center gap-2">
            <RefreshCw size={16} className="text-emerald-600 animate-spin" />
            <p className="text-sm font-semibold text-emerald-800">
              Syncing in progress...
            </p>
          </div>

          {/* Step list */}
          <div className="space-y-1.5">
            {SYNC_STEPS.map((step, i) => {
              const Icon = step.icon;
              const isComplete = i < syncStep;
              const isCurrent = i === syncStep;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-2 text-xs transition-colors ${
                    isComplete
                      ? "text-emerald-600"
                      : isCurrent
                        ? "text-slate-800 font-medium"
                        : "text-slate-300"
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  ) : isCurrent ? (
                    <RefreshCw
                      size={14}
                      className="text-emerald-600 animate-spin"
                    />
                  ) : (
                    <Icon size={14} />
                  )}
                  <span>{step.label}</span>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{
                width: `${((syncStep + 1) / SYNC_STEPS.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Sync success + cleared */}
      {syncDone && (
        <div className="space-y-2">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 size={20} className="text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-emerald-800">
                All data synced successfully
              </p>
              <p className="text-xs text-emerald-600">
                {queue.filter((i) => i.status === "synced").length} records
                uploaded
              </p>
            </div>
          </div>
          {showCleared && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-2">
              <Zap size={14} className="text-slate-400" />
              <p className="text-xs text-slate-500">
                Queue has been cleared automatically.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Failed items alert */}
      {failedCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <p className="text-sm text-red-700">
              {failedCount} item{failedCount !== 1 ? "s" : ""} failed to sync
            </p>
          </div>
          <button
            onClick={retryFailed}
            className="text-xs text-red-700 font-medium bg-red-100 px-3 py-1.5 rounded-lg hover:bg-red-200 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Queue */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Upload Queue
            </h2>
            <p className="text-xs text-slate-500">
              {queue.length === 0
                ? "No items waiting"
                : `${pendingCount} pending · ${queue.filter((i) => i.status === "synced").length} synced`}
            </p>
          </div>
          <div className="flex gap-1.5">
            {queue.some((i) => i.status === "synced") && (
              <button
                onClick={clearSynced}
                className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-200 transition flex items-center gap-1"
              >
                <Trash2 size={11} /> Clear
              </button>
            )}
            <button
              onClick={addMockItem}
              className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-200 transition flex items-center gap-1"
            >
              <Plus size={11} /> Add
            </button>
          </div>
        </div>

        {queue.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Cloud size={20} className="text-slate-400" />
            </div>
            <p className="text-sm text-slate-500 font-medium">Queue is empty</p>
            <p className="text-xs text-slate-400 mt-1">
              All field data has been synced.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-50">
            {queue.map((item) => {
              const Icon =
                item.type === "Interview Form"
                  ? ClipboardList
                  : item.type === "Payment Record"
                    ? CreditCard
                    : Users;
              return (
                <li
                  key={item.id}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                    item.status === "synced"
                      ? "bg-slate-50/50"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      item.status === "synced"
                        ? "bg-emerald-100"
                        : item.status === "failed"
                          ? "bg-red-100"
                          : item.status === "uploading"
                            ? "bg-blue-100"
                            : "bg-slate-100"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={
                        item.status === "synced"
                          ? "text-emerald-600"
                          : item.status === "failed"
                            ? "text-red-600"
                            : item.status === "uploading"
                              ? "text-blue-600"
                              : "text-slate-500"
                      }
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {item.client}
                    </p>
                    <p className="text-xs text-slate-400">
                      {item.type} · {item.timestamp}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                  {item.status === "queued" && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-slate-300 hover:text-red-500 transition shrink-0"
                    >
                      <X size={14} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Sync button */}
      <button
        onClick={startSync}
        disabled={!isOnline || syncing || pendingCount === 0}
        className={`w-full py-3.5 rounded-xl font-semibold text-sm transition active:scale-[0.98] flex items-center justify-center gap-2 ${
          isOnline && !syncing && pendingCount > 0
            ? "bg-emerald-700 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-800"
            : "bg-slate-200 text-slate-400 cursor-not-allowed"
        }`}
      >
        {syncing ? (
          <>
            <RefreshCw size={16} className="animate-spin" /> Syncing...
          </>
        ) : !isOnline ? (
          <>
            <WifiOff size={16} /> Offline — Cannot Sync
          </>
        ) : pendingCount === 0 ? (
          <>
            <CheckCircle2 size={16} /> All Synced
          </>
        ) : (
          <>
            <Upload size={16} /> Sync Now ({pendingCount} item
            {pendingCount !== 1 ? "s" : ""})
          </>
        )}
      </button>

      {/* Sync history */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
        <button
          onClick={() => setShowLog(!showLog)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition rounded-xl"
        >
          <div className="flex items-center gap-2">
            <Download size={15} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-800">
              Sync History
            </span>
          </div>
          {showLog ? (
            <ChevronUp size={16} className="text-slate-400" />
          ) : (
            <ChevronDown size={16} className="text-slate-400" />
          )}
        </button>
        {showLog && (
          <div className="px-4 pb-3 space-y-2 border-t border-slate-50 pt-3">
            {syncLog.map((entry, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                {entry.status === "success" ? (
                  <CheckCircle2
                    size={14}
                    className="text-emerald-500 shrink-0"
                  />
                ) : (
                  <AlertCircle size={14} className="text-amber-500 shrink-0" />
                )}
                <div className="flex-1 flex justify-between">
                  <span className="text-slate-700">{entry.items} records</span>
                  <span className="text-xs text-slate-400">{entry.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
        <button
          onClick={() => setShowTips(!showTips)}
          className="w-full flex items-center justify-between"
        >
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Offline Tips
          </p>
          {showTips ? (
            <ChevronUp size={14} className="text-slate-400" />
          ) : (
            <ChevronDown size={14} className="text-slate-400" />
          )}
        </button>
        {showTips && (
          <ul className="text-xs text-slate-500 space-y-2 mt-3 pt-3 border-t border-slate-200">
            <li className="flex items-start gap-2">
              <CheckCircle2
                size={13}
                className="text-emerald-500 mt-0.5 shrink-0"
              />
              <span>
                Interview forms and payment records save locally automatically
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2
                size={13}
                className="text-emerald-500 mt-0.5 shrink-0"
              />
              <span>Dashboard and heatmap use cached data when offline</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle
                size={13}
                className="text-amber-500 mt-0.5 shrink-0"
              />
              <span>Risk scores update only after a successful sync</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle
                size={13}
                className="text-amber-500 mt-0.5 shrink-0"
              />
              <span>
                Policy guide uses local cache — responses may be outdated
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2
                size={13}
                className="text-emerald-500 mt-0.5 shrink-0"
              />
              <span>
                Sync will automatically retry failed items on next connection
              </span>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
