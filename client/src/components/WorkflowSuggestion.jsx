import { useState, useRef } from 'react';
import {
  ChevronDown, ChevronUp, Play, Sliders, X,
  CheckCircle2, Circle, Clock, ArrowRight, Check,
  MessageSquare, Calendar, GitCompare,
} from 'lucide-react';

const colorMap = {
  amber:   { bg: 'bg-amber-50',   border: 'border-amber-200',  iconBox: 'bg-amber-100 text-amber-700',   badge: 'bg-amber-100 text-amber-700'   },
  blue:    { bg: 'bg-blue-50',    border: 'border-blue-200',   iconBox: 'bg-blue-100 text-blue-700',     badge: 'bg-blue-100 text-blue-700'     },
  purple:  { bg: 'bg-purple-50',  border: 'border-purple-200', iconBox: 'bg-purple-100 text-purple-700', badge: 'bg-purple-100 text-purple-700' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200',iconBox: 'bg-emerald-100 text-emerald-700',badge:'bg-emerald-100 text-emerald-700'},
  red:     { bg: 'bg-red-50',     border: 'border-red-200',    iconBox: 'bg-red-100 text-red-700',       badge: 'bg-red-100 text-red-700'       },
};

// ─── Compute what changed vs the workflow defaults ───
function computeDiff(originalSteps, currentSteps) {
  const changes = [];
  originalSteps.forEach((orig) => {
    const curr = currentSteps.find((c) => c.id === orig.id);
    if (!curr) return;
    if (!curr.enabled) {
      changes.push({ kind: 'removed', label: orig.label });
    } else {
      if (orig.type === 'message' && curr.messageContent !== orig.defaultMessage) {
        changes.push({ kind: 'message-edited', label: orig.label, original: orig.defaultMessage, modified: curr.messageContent });
      }
      if (orig.type === 'schedule' && curr.scheduledDate) {
        const dateStr = curr.scheduledDate + (curr.scheduledTime ? ` at ${curr.scheduledTime}` : '');
        changes.push({ kind: 'scheduled', label: orig.label, date: dateStr });
      }
      if (curr.note) {
        changes.push({ kind: 'note-added', label: orig.label, note: curr.note });
      }
    }
  });
  return changes;
}

// ─── Diff summary display ───
function DiffSummary({ diff }) {
  const [open, setOpen] = useState(false);
  if (!diff.length) return null;
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 transition text-left"
      >
        <GitCompare size={13} className="text-slate-500 shrink-0" />
        <span className="text-xs font-medium text-slate-700 flex-1">
          {diff.length} modification{diff.length !== 1 ? 's' : ''} from default
        </span>
        {open ? <ChevronUp size={13} className="text-slate-400" /> : <ChevronDown size={13} className="text-slate-400" />}
      </button>
      {open && (
        <ul className="px-3 py-2 space-y-2 border-t border-slate-100">
          {diff.map((d, i) => (
            <li key={i} className="text-xs text-slate-600">
              {d.kind === 'removed' && (
                <span><span className="text-red-500 font-medium">Removed:</span> {d.label}</span>
              )}
              {d.kind === 'message-edited' && (
                <div className="space-y-1">
                  <p><span className="text-amber-600 font-medium">Message edited:</span> {d.label}</p>
                  <p className="text-slate-400 line-through text-[10px] leading-relaxed pl-2">{d.original?.slice(0, 80)}…</p>
                  <p className="text-slate-700 text-[10px] leading-relaxed pl-2 border-l-2 border-emerald-400">{d.modified?.slice(0, 80)}{d.modified?.length > 80 ? '…' : ''}</p>
                </div>
              )}
              {d.kind === 'scheduled' && (
                <span><span className="text-blue-600 font-medium">Scheduled:</span> {d.label} — {d.date}</span>
              )}
              {d.kind === 'note-added' && (
                <span><span className="text-purple-600 font-medium">Note added:</span> {d.label} — "{d.note}"</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Step customize row (type-aware) ───
function CustomizeStep({ step, onChange }) {
  const { Icon } = step;
  return (
    <div className={`border rounded-xl overflow-hidden transition-colors ${step.enabled ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-55'}`}>
      {/* Header row */}
      <div className="flex items-start gap-3 p-3">
        <button
          onClick={() => !step.required && onChange({ enabled: !step.enabled })}
          disabled={step.required}
          className={`mt-0.5 shrink-0 ${step.required ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          title={step.required ? 'Required — cannot be removed' : ''}
        >
          {step.enabled
            ? <CheckCircle2 size={18} className="text-emerald-500" />
            : <Circle size={18} className="text-slate-300" />
          }
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Icon size={13} className="text-slate-400 shrink-0" />
            <p className={`text-sm font-medium leading-snug ${step.enabled ? 'text-slate-800' : 'text-slate-400 line-through'}`}>
              {step.label}
            </p>
            {step.required && <span className="text-[10px] text-slate-400 border border-slate-200 px-1 rounded">Required</span>}
            {step.type === 'message' && step.enabled && (
              <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-200 px-1.5 rounded flex items-center gap-0.5">
                <MessageSquare size={9} /> message
              </span>
            )}
            {step.type === 'schedule' && step.enabled && (
              <span className="text-[10px] bg-purple-50 text-purple-600 border border-purple-200 px-1.5 rounded flex items-center gap-0.5">
                <Calendar size={9} /> schedule
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Type-specific fields */}
      {step.enabled && step.type === 'message' && (
        <div className="px-3 pb-3 space-y-1">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1">
            <MessageSquare size={10} /> Message content
          </p>
          <textarea
            value={step.messageContent}
            onChange={(e) => onChange({ messageContent: e.target.value })}
            rows={3}
            className="w-full text-xs border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white resize-none text-slate-700 leading-relaxed transition"
          />
          {step.messageContent !== step.defaultMessage && (
            <button
              onClick={() => onChange({ messageContent: step.defaultMessage })}
              className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              ↩ Reset to default
            </button>
          )}
        </div>
      )}

      {step.enabled && step.type === 'schedule' && (
        <div className="px-3 pb-3 flex gap-2">
          <div className="flex-1 space-y-1">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1">
              <Calendar size={10} /> Date
            </p>
            <input
              type="date"
              value={step.scheduledDate || ''}
              onChange={(e) => onChange({ scheduledDate: e.target.value })}
              className="w-full text-xs border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:bg-white transition"
            />
          </div>
          <div className="w-28 space-y-1">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Time</p>
            <input
              type="time"
              value={step.scheduledTime || ''}
              onChange={(e) => onChange({ scheduledTime: e.target.value })}
              className="w-full text-xs border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:bg-white transition"
            />
          </div>
        </div>
      )}

      {step.enabled && step.type === 'task' && (
        <div className="px-3 pb-3">
          <input
            type="text"
            value={step.note || ''}
            onChange={(e) => onChange({ note: e.target.value })}
            placeholder="Add a note (optional)..."
            className="w-full text-xs border border-slate-100 bg-slate-50 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-600 placeholder:text-slate-300"
          />
        </div>
      )}
    </div>
  );
}

// ─── Active step in timeline ───
function ActiveStep({ step, index, isDone, isCurrent, onComplete, isLast }) {
  const { Icon } = step;
  const [localMsg, setLocalMsg] = useState(step.messageContent || step.defaultMessage || '');
  const [localDate, setLocalDate] = useState(step.scheduledDate || '');
  const [localTime, setLocalTime] = useState(step.scheduledTime || '');

  return (
    <div className={`flex gap-3 ${!isCurrent && !isDone ? 'opacity-40' : ''}`}>
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        <button
          onClick={isCurrent ? onComplete : undefined}
          disabled={!isCurrent}
          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
            isDone ? 'bg-emerald-500 text-white'
            : isCurrent ? 'bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 cursor-pointer'
            : 'bg-white border-2 border-slate-200 text-slate-300'
          }`}
        >
          {isDone ? <Check size={13} strokeWidth={3} /> : <span className="text-[10px] font-bold">{index + 1}</span>}
        </button>
        {!isLast && <div className={`w-0.5 flex-1 min-h-[12px] mt-1 ${isDone ? 'bg-emerald-200' : 'bg-slate-100'}`} />}
      </div>

      {/* Content */}
      <div className="flex-1 pb-4 min-w-0">
        <div className="flex items-start gap-2">
          <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5 ${isDone ? 'bg-emerald-100' : 'bg-slate-100'}`}>
            <Icon size={12} className={isDone ? 'text-emerald-600' : 'text-slate-500'} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium leading-snug ${isDone ? 'line-through text-slate-400' : 'text-slate-800'}`}>
              {step.label}
            </p>

            {/* Show saved data for done steps */}
            {isDone && step.type === 'message' && step.messageContent && (
              <p className="text-[11px] text-slate-400 mt-0.5 italic truncate">Sent: "{step.messageContent.slice(0, 60)}…"</p>
            )}
            {isDone && step.type === 'schedule' && step.scheduledDate && (
              <p className="text-[11px] text-slate-400 mt-0.5">Scheduled: {step.scheduledDate}{step.scheduledTime ? ` at ${step.scheduledTime}` : ''}</p>
            )}

            {/* Current step interactive fields */}
            {isCurrent && step.type === 'message' && (
              <div className="mt-2 space-y-1.5">
                <p className="text-[10px] font-semibold text-blue-600 flex items-center gap-1">
                  <MessageSquare size={10} /> Review message before sending
                </p>
                <textarea
                  value={localMsg}
                  onChange={(e) => setLocalMsg(e.target.value)}
                  rows={3}
                  className="w-full text-xs border border-blue-200 bg-blue-50 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none text-slate-700 leading-relaxed"
                />
              </div>
            )}

            {isCurrent && step.type === 'schedule' && (
              <div className="mt-2 flex gap-2">
                <input
                  type="date"
                  value={localDate}
                  onChange={(e) => setLocalDate(e.target.value)}
                  className="flex-1 text-xs border border-purple-200 bg-purple-50 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-400"
                />
                <input
                  type="time"
                  value={localTime}
                  onChange={(e) => setLocalTime(e.target.value)}
                  className="w-24 text-xs border border-purple-200 bg-purple-50 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-400"
                />
              </div>
            )}

            {isCurrent && step.type === 'task' && (
              <textarea
                rows={2}
                placeholder="Add a note (optional)..."
                className="w-full mt-2 text-xs border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400 resize-none text-slate-700 placeholder:text-slate-300"
              />
            )}
          </div>
        </div>

        {isCurrent && (
          <button
            onClick={() => onComplete({
              messageContent: step.type === 'message' ? localMsg : undefined,
              scheduledDate: step.type === 'schedule' ? localDate : undefined,
              scheduledTime: step.type === 'schedule' ? localTime : undefined,
            })}
            className={`mt-2 ml-8 text-xs text-white px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 active:scale-95 transition ${
              step.type === 'message' ? 'bg-blue-600 hover:bg-blue-700'
              : step.type === 'schedule' ? 'bg-purple-600 hover:bg-purple-700'
              : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            <Check size={12} strokeWidth={3} />
            {step.type === 'message' ? 'Mark as sent' : step.type === 'schedule' ? 'Confirm schedule' : 'Mark done'}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───
export default function WorkflowSuggestion({ workflow, onDismiss }) {
  const c = colorMap[workflow.color] || colorMap.emerald;

  const initSteps = () =>
    workflow.steps.map((s) => ({
      ...s,
      enabled: true,
      note: '',
      messageContent: s.defaultMessage || '',
      scheduledDate: '',
      scheduledTime: '',
    }));

  const [mode, setMode] = useState('preview');
  const [steps, setSteps] = useState(initSteps);
  const [doneStepData, setDoneStepData] = useState({});
  const originalSteps = useRef(initSteps());

  const enabledSteps = steps.filter((s) => s.enabled);
  const doneIds = Object.keys(doneStepData).map(Number);
  const currentStep = enabledSteps.find((s) => !doneIds.includes(s.id));
  const allDone = enabledSteps.length > 0 && enabledSteps.every((s) => doneIds.includes(s.id));
  const diff = computeDiff(originalSteps.current, steps);

  function updateStep(id, patch) {
    setSteps((prev) => prev.map((s) => s.id === id ? { ...s, ...patch } : s));
  }

  function completeStep(id, data = {}) {
    setDoneStepData((prev) => ({ ...prev, [id]: data }));
    // Persist data back to step for display
    if (Object.keys(data).some((k) => data[k])) {
      updateStep(id, data);
    }
  }

  // ── DONE ──
  if (mode === 'active' && allDone) {
    return (
      <div className={`rounded-xl border ${c.border} bg-white overflow-hidden`}>
        <div className={`${c.bg} px-4 py-3 flex items-center gap-3`}>
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-emerald-800">Workflow Complete</p>
            <p className="text-xs text-emerald-700">{workflow.title} — all steps checked off.</p>
          </div>
          {onDismiss && (
            <button onClick={onDismiss} className="text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </div>
        {diff.length > 0 && (
          <div className="p-3">
            <DiffSummary diff={diff} />
          </div>
        )}
      </div>
    );
  }

  // ── ACTIVE ──
  if (mode === 'active') {
    return (
      <div className={`rounded-xl border ${c.border} bg-white overflow-hidden`}>
        <div className={`${c.bg} px-4 py-3 flex items-center justify-between`}>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">In Progress</p>
            <p className="text-sm font-semibold text-slate-800">{workflow.title}</p>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.badge}`}>
            {doneIds.length} / {enabledSteps.length}
          </span>
        </div>
        <div className="h-1 bg-slate-100">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${enabledSteps.length ? (doneIds.length / enabledSteps.length) * 100 : 0}%` }}
          />
        </div>
        {diff.length > 0 && (
          <div className="px-4 pt-3">
            <DiffSummary diff={diff} />
          </div>
        )}
        <div className="px-4 pt-4">
          {enabledSteps.map((step, i) => (
            <ActiveStep
              key={step.id}
              step={step}
              index={i}
              isDone={doneIds.includes(step.id)}
              isCurrent={step.id === currentStep?.id}
              isLast={i === enabledSteps.length - 1}
              onComplete={(data) => completeStep(step.id, data)}
            />
          ))}
        </div>
      </div>
    );
  }

  // ── CUSTOMIZE ──
  if (mode === 'customize') {
    return (
      <div className={`rounded-xl border ${c.border} bg-white overflow-hidden`}>
        <div className={`${c.bg} px-4 py-3 flex items-center justify-between`}>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Customize Workflow</p>
            <p className="text-sm font-semibold text-slate-800">{workflow.title}</p>
          </div>
          <button onClick={() => setMode('preview')} className="text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>

        <div className="px-4 py-3 space-y-2">
          <p className="text-xs text-slate-500">
            Toggle steps, edit messages, and set schedules before starting.
            <span className="text-slate-400"> Required steps cannot be removed.</span>
          </p>
          {steps.map((step) => (
            <CustomizeStep
              key={step.id}
              step={step}
              onChange={(patch) => updateStep(step.id, patch)}
            />
          ))}
        </div>

        {diff.length > 0 && (
          <div className="px-4 pb-2">
            <DiffSummary diff={diff} />
          </div>
        )}

        <div className="px-4 pb-4">
          <button
            onClick={() => setMode('active')}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition"
          >
            <Play size={14} fill="currentColor" />
            Start with {enabledSteps.length} step{enabledSteps.length !== 1 ? 's' : ''}
            {diff.length > 0 && <span className="text-emerald-300 font-normal">· {diff.length} modified</span>}
          </button>
        </div>
      </div>
    );
  }

  // ── PREVIEW ──
  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} overflow-hidden`}>
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-0.5">Suggested Workflow</p>
            <p className="text-sm font-semibold text-slate-800">{workflow.title}</p>
            <p className="text-xs text-slate-500 mt-0.5">{workflow.description}</p>
          </div>
          {onDismiss && (
            <button onClick={onDismiss} className="text-slate-300 hover:text-slate-500 shrink-0">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 mt-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${c.badge}`}>
            <Clock size={10} /> {workflow.estimatedTime}
          </span>
          <span className="text-xs text-slate-500">{workflow.steps.length} steps</span>
          {workflow.steps.filter(s => s.type === 'message').length > 0 && (
            <span className="text-xs text-blue-600 flex items-center gap-0.5">
              <MessageSquare size={10} /> {workflow.steps.filter(s => s.type === 'message').length} messages
            </span>
          )}
          {workflow.steps.filter(s => s.type === 'schedule').length > 0 && (
            <span className="text-xs text-purple-600 flex items-center gap-0.5">
              <Calendar size={10} /> {workflow.steps.filter(s => s.type === 'schedule').length} schedule
            </span>
          )}
        </div>

        <div className="flex gap-1.5 mt-2.5 flex-wrap">
          {workflow.steps.slice(0, 4).map((s, i) => (
            <span key={s.id} className={`text-[10px] bg-white border px-2 py-0.5 rounded-full ${
              s.type === 'message' ? 'border-blue-200 text-blue-600'
              : s.type === 'schedule' ? 'border-purple-200 text-purple-600'
              : 'border-slate-200 text-slate-500'
            }`}>
              {i + 1}. {s.label.length > 28 ? s.label.slice(0, 28) + '…' : s.label}
            </span>
          ))}
          {workflow.steps.length > 4 && (
            <span className="text-[10px] bg-white border border-slate-200 text-slate-400 px-2 py-0.5 rounded-full">
              +{workflow.steps.length - 4} more
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-white/60 px-4 py-2.5 flex gap-2">
        <button
          onClick={() => setMode('customize')}
          className="flex-1 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition active:scale-95"
        >
          <Sliders size={12} /> Customize
        </button>
        <button
          onClick={() => setMode('active')}
          className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
        >
          <Play size={12} fill="currentColor" /> Start <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}
