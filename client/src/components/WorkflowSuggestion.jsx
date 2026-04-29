import { useState } from 'react';
import {
  ChevronDown, ChevronUp, Play, Sliders, X,
  CheckCircle2, Circle, Clock, ArrowRight, Check,
} from 'lucide-react';

const colorMap = {
  amber:   { bg: 'bg-amber-50',   border: 'border-amber-200',  icon: 'bg-amber-100 text-amber-700',  badge: 'bg-amber-100 text-amber-700',  active: 'bg-amber-600',  ring: 'ring-amber-400'  },
  blue:    { bg: 'bg-blue-50',    border: 'border-blue-200',   icon: 'bg-blue-100 text-blue-700',    badge: 'bg-blue-100 text-blue-700',    active: 'bg-blue-600',   ring: 'ring-blue-400'   },
  purple:  { bg: 'bg-purple-50',  border: 'border-purple-200', icon: 'bg-purple-100 text-purple-700',badge: 'bg-purple-100 text-purple-700',active: 'bg-purple-600', ring: 'ring-purple-400' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200',icon: 'bg-emerald-100 text-emerald-700',badge:'bg-emerald-100 text-emerald-700',active:'bg-emerald-600',ring:'ring-emerald-400'},
  red:     { bg: 'bg-red-50',     border: 'border-red-200',    icon: 'bg-red-100 text-red-700',      badge: 'bg-red-100 text-red-700',      active: 'bg-red-600',    ring: 'ring-red-400'    },
};

// ─── Single step row in active mode ───
function ActiveStep({ step, index, isDone, isCurrent, onComplete }) {
  const [note, setNote] = useState(step.note || '');
  const { Icon } = step;

  return (
    <div className={`flex gap-3 ${!isCurrent && !isDone ? 'opacity-50' : ''}`}>
      {/* Timeline dot */}
      <div className="flex flex-col items-center">
        <button
          onClick={isCurrent ? onComplete : undefined}
          disabled={!isCurrent}
          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
            isDone
              ? 'bg-emerald-500 text-white'
              : isCurrent
              ? 'bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 cursor-pointer'
              : 'bg-white border-2 border-slate-200 text-slate-300'
          }`}
        >
          {isDone ? <Check size={13} strokeWidth={3} /> : <span className="text-[10px] font-bold">{index + 1}</span>}
        </button>
        {index < 99 && <div className={`w-0.5 flex-1 min-h-[12px] mt-1 ${isDone ? 'bg-emerald-300' : 'bg-slate-100'}`} />}
      </div>

      {/* Content */}
      <div className="flex-1 pb-3">
        <div className="flex items-start gap-2">
          <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5 ${isDone ? 'bg-emerald-100' : 'bg-slate-100'}`}>
            <Icon size={12} className={isDone ? 'text-emerald-600' : 'text-slate-500'} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium leading-snug ${isDone ? 'line-through text-slate-400' : 'text-slate-800'}`}>
              {step.label}
            </p>
            {step.required && !isDone && (
              <span className="text-[10px] text-slate-400 font-medium">Required</span>
            )}
            {/* Note field — only on current step */}
            {isCurrent && (
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note (optional)..."
                rows={2}
                className="w-full mt-2 text-xs border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400 resize-none text-slate-700 placeholder:text-slate-300"
              />
            )}
            {isDone && step.note && (
              <p className="text-[11px] text-slate-400 mt-0.5 italic">Note: {step.note}</p>
            )}
          </div>
        </div>
        {isCurrent && (
          <button
            onClick={onComplete}
            className="mt-2 ml-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 active:scale-95 transition"
          >
            <Check size={12} strokeWidth={3} /> Mark done
          </button>
        )}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───
export default function WorkflowSuggestion({ workflow, onDismiss }) {
  const c = colorMap[workflow.color] || colorMap.emerald;
  const [mode, setMode] = useState('preview'); // preview | customize | active | done
  const [steps, setSteps] = useState(
    workflow.steps.map((s) => ({ ...s, enabled: true, note: '' }))
  );
  const [doneIds, setDoneIds] = useState([]);

  const enabledSteps = steps.filter((s) => s.enabled);
  const currentStepIndex = enabledSteps.findIndex((s) => !doneIds.includes(s.id));
  const currentStep = enabledSteps[currentStepIndex];
  const allDone = enabledSteps.length > 0 && enabledSteps.every((s) => doneIds.includes(s.id));

  function toggleStep(id) {
    setSteps((prev) => prev.map((s) => s.id === id ? { ...s, enabled: !s.enabled } : s));
  }

  function updateNote(id, note) {
    setSteps((prev) => prev.map((s) => s.id === id ? { ...s, note } : s));
  }

  function startWorkflow() {
    setDoneIds([]);
    setMode('active');
  }

  function completeStep(id) {
    setDoneIds((prev) => [...prev, id]);
    if (enabledSteps.filter((s) => !doneIds.includes(s.id)).length === 1) {
      setTimeout(() => setMode('done'), 300);
    }
  }

  // ── DONE state ──
  if (mode === 'done') {
    return (
      <div className={`rounded-xl border ${c.border} ${c.bg} p-4 space-y-2`}>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={20} className="text-emerald-600" />
          <p className="text-sm font-bold text-emerald-800">Workflow Complete</p>
        </div>
        <p className="text-xs text-slate-600">{workflow.title} — all steps checked off.</p>
        <button
          onClick={onDismiss}
          className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 mt-1"
        >
          <X size={11} /> Dismiss
        </button>
      </div>
    );
  }

  // ── ACTIVE state ──
  if (mode === 'active') {
    return (
      <div className={`rounded-xl border ${c.border} bg-white overflow-hidden`}>
        {/* Header */}
        <div className={`${c.bg} px-4 py-3 flex items-center justify-between`}>
          <div>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">In Progress</p>
            <p className="text-sm font-semibold text-slate-800">{workflow.title}</p>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.badge}`}>
            {doneIds.length} / {enabledSteps.length} done
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-slate-100">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${enabledSteps.length ? (doneIds.length / enabledSteps.length) * 100 : 0}%` }}
          />
        </div>

        {/* Steps timeline */}
        <div className="px-4 pt-4">
          {enabledSteps.map((step, i) => (
            <ActiveStep
              key={step.id}
              step={step}
              index={i}
              isDone={doneIds.includes(step.id)}
              isCurrent={step.id === currentStep?.id}
              onComplete={() => completeStep(step.id)}
            />
          ))}
        </div>
      </div>
    );
  }

  // ── CUSTOMIZE state ──
  if (mode === 'customize') {
    return (
      <div className={`rounded-xl border ${c.border} bg-white overflow-hidden`}>
        <div className={`${c.bg} px-4 py-3 flex items-center justify-between`}>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Customize Workflow</p>
            <p className="text-sm font-semibold text-slate-800">{workflow.title}</p>
          </div>
          <button onClick={() => setMode('preview')} className="text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>

        <div className="px-4 py-3 space-y-2.5">
          <p className="text-xs text-slate-500">Toggle steps on/off and add notes before starting.</p>
          {steps.map((step) => {
            const { Icon } = step;
            return (
              <div
                key={step.id}
                className={`border rounded-xl p-3 transition-colors ${
                  step.enabled ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => !step.required && toggleStep(step.id)}
                    disabled={step.required}
                    className={`mt-0.5 shrink-0 ${step.required ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    title={step.required ? 'Required step — cannot be removed' : 'Toggle step'}
                  >
                    {step.enabled
                      ? <CheckCircle2 size={18} className="text-emerald-500" />
                      : <Circle size={18} className="text-slate-300" />
                    }
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Icon size={13} className="text-slate-400 shrink-0" />
                      <p className={`text-sm font-medium ${step.enabled ? 'text-slate-800' : 'text-slate-400 line-through'}`}>
                        {step.label}
                      </p>
                      {step.required && (
                        <span className="text-[10px] text-slate-400 border border-slate-200 px-1 rounded">Required</span>
                      )}
                    </div>
                    {step.enabled && (
                      <input
                        type="text"
                        value={step.note}
                        onChange={(e) => updateNote(step.id, e.target.value)}
                        placeholder="Add a note..."
                        className="w-full mt-1.5 text-xs border border-slate-100 bg-slate-50 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-600 placeholder:text-slate-300"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-4 pb-4">
          <button
            onClick={startWorkflow}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition"
          >
            <Play size={14} fill="currentColor" />
            Start with {enabledSteps.length} step{enabledSteps.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    );
  }

  // ── PREVIEW state (default) ──
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
        </div>

        {/* Step preview pills */}
        <div className="flex gap-1.5 mt-2.5 flex-wrap">
          {workflow.steps.slice(0, 4).map((s, i) => (
            <span key={s.id} className="text-[10px] bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
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
          onClick={startWorkflow}
          className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
        >
          <Play size={12} fill="currentColor" /> Start <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}
