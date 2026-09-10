import React, { useState } from "react";
import { Check, ChevronRight, ChevronDown, Volume2 } from "lucide-react";

const STEP_DEFS = [
  { key: "hook", label: "Ouvir" },
  { key: "grammar", label: "Gramática" },
  { key: "vocab", label: "Vocabulário" },
  { key: "dialogue", label: "Diálogo" },
  { key: "practice", label: "Praticar" },
  { key: "speaking", label: "Falar" },
];

function StepShell({ title, accent, children }) {
  return (
    <div className="animate-fadein">
      {title && (
        <h2 className="font-display font-600 text-xl md:text-2xl mb-4" style={{ color: "#16181A" }}>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

function ContinueButton({ onClick, disabled, label = "Continuar", accent }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-sm transition disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
      style={{ background: disabled ? "#E5E5E2" : accent, color: disabled ? "#9A9A96" : "#fff" }}
    >
      {label} <ChevronRight size={16} />
    </button>
  );
}

/* Vertical accordion: completed steps stay visible (collapsed, reopenable),
   the current step is expanded, future steps are not rendered at all. */
function StepAccordion({ steps, unlocked, openIndex, onToggle, accent, renderStep }) {
  return (
    <div className="flex flex-col gap-3 mb-2">
      {steps.slice(0, unlocked + 1).map((s, i) => {
        const isDone = i < unlocked;
        const isOpen = openIndex === i;
        return (
          <div
            key={s.key}
            className="rounded-2xl border overflow-hidden transition"
            style={{ borderColor: isOpen ? accent : "#EAEAE7", background: isOpen ? "#FFFFFF" : "#FBFBFA" }}
          >
            <button onClick={() => onToggle(i)} className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
              <span
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-semibold"
                style={{
                  background: isDone ? "#1F9E89" : isOpen ? accent : "#EFEFEC",
                  color: isDone || isOpen ? "#fff" : "#8A8F98",
                }}
              >
                {isDone ? <Check size={14} /> : i + 1}
              </span>
              <span className="flex-1 font-body font-semibold text-sm" style={{ color: "#16181A" }}>
                {s.label}
              </span>
              {isDone && !isOpen && (
                <span className="font-mono text-[10px] uppercase tracking-wide" style={{ color: "#1F9E89" }}>
                  Concluído · rever
                </span>
              )}
              <ChevronDown
                size={16}
                style={{ color: "#8A8F98", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-5 pt-1 border-t" style={{ borderColor: "#F0F0EE" }}>
                {renderStep(i)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* Modern "tap anywhere to hear it" card — glassy, single tap target, no separate icon required. */
function SoundCard({ onClick, accent, tag = "ÁUDIO", dark, children }) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onClick(); }}
      className="sound-card"
      style={{
        background: dark ? "#0F2A3C" : "#F7F7F5",
        borderColor: dark ? "#FBF6EC2A" : "#EAEAE7",
      }}
    >
      <div className="sound-card-content">
        <span className="sound-card-tag" style={{ color: dark ? "#FBF6EC88" : "#8A8F98" }}>{tag}</span>
        <div className="sound-card-text" style={{ color: dark ? "#FBF6EC" : "#16181A" }}>{children}</div>
      </div>
      <div className="sound-card-icon" style={{ background: accent }}>
        <Volume2 size={18} color="#fff" />
      </div>
    </div>
  );
}

/* Translation hidden until the learner asks for it — tap "tradução" to reveal. */
function RevealPt({ pt, dark }) {
  const [shown, setShown] = useState(false);
  const dim = dark ? "#FBF6EC99" : "#8A8F98";
  const muted = dark ? "#FBF6EC77" : "#B0B0AC";
  return (
    <span className="inline-flex items-center flex-wrap gap-2">
      {shown && <span className="text-xs" style={{ color: dim }}>{pt}</span>}
      <button
        onClick={(e) => { e.stopPropagation(); setShown((s) => !s); }}
        className="text-[10px] font-mono uppercase tracking-wide underline"
        style={{ color: muted }}
      >
        {shown ? "ocultar" : "tradução"}
      </button>
    </span>
  );
}

export { STEP_DEFS, StepShell, ContinueButton, StepAccordion, SoundCard, RevealPt };
