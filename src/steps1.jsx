import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { speak, LESSON1, SoundBars } from "./data.jsx";
import { StepShell, ContinueButton, SoundCard, RevealPt } from "./ui.jsx";

function HookStep({ accent, onComplete }) {
  const [played, setPlayed] = useState(false);

  function playHook() {
    speak(LESSON1.hookEn);
    setPlayed(true);
  }

  return (
    <StepShell title="Antes de qualquer regra, diz isto em voz alta" accent={accent}>
      <div className="flex flex-col items-center gap-3 mb-4">
        <SoundBars color={accent} />
      </div>
      <SoundCard onClick={playHook} accent={accent} dark tag={played ? "TOCAR OUTRA VEZ" : "ÁUDIO · TOCA PARA OUVIR"}>
        "{LESSON1.hookEn}"
      </SoundCard>
      <div className="mt-3">
        <RevealPt pt={LESSON1.hookPt} />
      </div>
      <p className="text-sm mt-4" style={{ color: "#6B7280" }}>
        Toca no cartão para ouvir e diz a frase em voz alta, mesmo sem perceber a gramática ainda.
      </p>
      <ContinueButton accent={accent} disabled={!played} onClick={onComplete} />
    </StepShell>
  );
}

function GrammarExplainStep({ accent, onComplete }) {
  return (
    <StepShell title={LESSON1.grammarTitle} accent={accent}>
      <p className="text-sm mb-5" style={{ color: "#4B5058" }}>{LESSON1.grammarPt}</p>
      <div className="rounded-2xl border p-2 mb-4" style={{ borderColor: "#EAEAE7" }}>
        <div className="grid sm:grid-cols-2 gap-1">
          {LESSON1.pattern.map((p, i) => (
            <button
              key={i}
              onClick={() => speak(p.en)}
              className="flex items-center justify-between gap-3 py-2 px-2.5 rounded-xl transition text-left hover:bg-black/[0.03] active:scale-[0.99]"
            >
              <span className="font-mono text-sm font-medium">{p.en}</span>
              <span className="text-xs" style={{ color: "#8A8F98" }}>{p.pt}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        {LESSON1.examples.map((ex, i) => (
          <SoundCard key={i} onClick={() => speak(ex.en)} accent={accent}>
            {ex.en}
            <div className="mt-1"><RevealPt pt={ex.pt} /></div>
          </SoundCard>
        ))}
      </div>
      <ContinueButton accent={accent} onClick={onComplete} />
    </StepShell>
  );
}

function VocabStep({ accent, onComplete }) {
  const [tapped, setTapped] = useState(new Set());
  const need = 5;
  return (
    <StepShell title="Toca em cada palavra para ouvir" accent={accent}>
      <div className="flex flex-wrap gap-2 mb-3">
        {LESSON1.vocab.map(([en, pt], i) => {
          const isTapped = tapped.has(i);
          return (
            <button
              key={i}
              onClick={() => { speak(en); setTapped((s) => new Set(s).add(i)); }}
              className="rounded-full border px-3 py-1.5 text-sm flex items-center gap-1.5 transition hover:scale-[1.03]"
              style={{ borderColor: isTapped ? accent : "#EAEAE7", background: isTapped ? `${accent}14` : "transparent" }}
            >
              <span className="font-medium">{en}</span>
              <span style={{ color: "#8A8F98" }}>· {pt}</span>
            </button>
          );
        })}
      </div>
      <p className="text-xs font-mono" style={{ color: "#8A8F98" }}>
        {Math.min(tapped.size, need)}/{need} palavras ouvidas
      </p>
      <ContinueButton accent={accent} disabled={tapped.size < need} onClick={onComplete} />
    </StepShell>
  );
}

/* Fully automatic dialogue: each line plays, waits 2s, then the next line
   appears and plays on its own. Ana and Carlos get distinct vocal pitches
   so the two voices are easy to tell apart. Tap any bubble to hear it again;
   translations stay hidden until the learner asks for them. */
function DialogueStep({ accent, onComplete }) {
  const dialogue = LESSON1.dialogue;
  const [shown, setShown] = useState(1);
  const [waiting, setWaiting] = useState(false);
  const [done, setDone] = useState(false);
  const scrollRef = useRef(null);
  const timerRef = useRef(null);

  function pitchFor(side) {
    return side === "left" ? 1.18 : 0.82;
  }

  useEffect(() => {
    let cancelled = false;
    const line = dialogue[shown - 1];
    if (!line) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(line.en);
      u.lang = "en-US";
      u.rate = 0.72;
      u.pitch = pitchFor(line.side);
      u.onend = () => {
        if (cancelled) return;
        setWaiting(true);
        timerRef.current = setTimeout(() => {
          if (cancelled) return;
          setWaiting(false);
          if (shown < dialogue.length) setShown((s) => s + 1);
          else setDone(true);
        }, 2000);
      };
      u.onerror = u.onend;
      window.speechSynthesis.speak(u);
    } catch (e) { /* speech unavailable */ }
    return () => {
      cancelled = true;
      clearTimeout(timerRef.current);
      try { window.speechSynthesis.cancel(); } catch (e) { /* noop */ }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [shown]);

  function replay(line) {
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(line.en);
      u.lang = "en-US";
      u.rate = 0.72;
      u.pitch = pitchFor(line.side);
      window.speechSynthesis.speak(u);
    } catch (e) { /* noop */ }
  }

  function skipWait() {
    clearTimeout(timerRef.current);
    setWaiting(false);
    if (shown < dialogue.length) setShown((s) => s + 1);
    else setDone(true);
  }

  return (
    <StepShell title="Ana e Carlos conhecem-se" accent={accent}>
      <p className="text-xs mb-3" style={{ color: "#8A8F98" }}>
        A conversa avança sozinha. Toca em qualquer fala para a ouvir outra vez.
      </p>
      <div ref={scrollRef} className="rounded-2xl p-4 md:p-5 flex flex-col gap-2.5 max-h-96 overflow-y-auto" style={{ background: "#F7F7F5" }}>
        {dialogue.slice(0, shown).map((d, i) => {
          const isLast = i === shown - 1;
          return (
            <div key={i} className={`flex flex-col ${d.side === "left" ? "items-start" : "items-end"} chat-in`}>
              <span className="text-[10px] font-mono mb-0.5 px-1" style={{ color: "#9A9A96" }}>{d.who}</span>
              <div
                className="max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 cursor-pointer"
                style={{
                  background: d.side === "left" ? "#102A3C" : accent,
                  color: d.side === "left" ? "#FBF6EC" : "#102A3C",
                  outline: isLast ? `2px solid ${d.side === "left" ? accent : "#102A3C"}55` : "none",
                }}
                onClick={() => replay(d)}
              >
                <p className="text-sm font-medium">{d.en}</p>
                <div className="mt-0.5 opacity-90">
                  <RevealPt pt={d.pt} dark={d.side === "left"} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center mt-3" style={{ minHeight: 36 }}>
        {waiting && (
          <button
            onClick={skipWait}
            aria-label="Continuar"
            className="animate-bounce rounded-full p-1.5"
            style={{ color: accent }}
          >
            <ChevronDown size={26} />
          </button>
        )}
      </div>
      <ContinueButton accent={accent} disabled={!done} onClick={onComplete} />
    </StepShell>
  );
}

export { HookStep, GrammarExplainStep, VocabStep, DialogueStep };
