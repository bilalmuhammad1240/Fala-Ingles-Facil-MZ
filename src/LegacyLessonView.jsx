import React, { useState, useEffect } from "react";
import { Check, Volume2, Sparkles, Mic, ChevronRight } from "lucide-react";
import { speak, SoundBars } from "./data.jsx";

function LegacyLessonView({ lesson, completedMap, onComplete, onGoNext, hasNext }) {
  const [quizAnswers, setQuizAnswers] = useState({});
  useEffect(() => { setQuizAnswers({}); }, [lesson.id]);
  const isComplete = !!completedMap[lesson.id];

  return (
    <div>
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-wider mb-1" style={{ color: lesson.accent }}>Lição {lesson.id}</p>
        <h1 className="font-display font-700 text-3xl md:text-4xl leading-tight mb-1">{lesson.title}</h1>
        <p className="text-base" style={{ color: "#6B7280" }}>{lesson.subtitle}</p>
      </div>

      <section className="rounded-2xl p-5 md:p-6 mb-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between" style={{ background: "#102A3C" }}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <SoundBars color={lesson.accent} />
            <span className="font-mono text-[11px] uppercase tracking-wider" style={{ color: lesson.accent }}>Fale agora</span>
          </div>
          <p className="font-display font-600 text-xl md:text-2xl" style={{ color: "#FBF6EC" }}>"{lesson.hookEn}"</p>
          <p className="text-sm mt-1" style={{ color: "#FBF6EC99" }}>{lesson.hookPt}</p>
        </div>
        <button onClick={() => speak(lesson.hookEn)} className="flex-shrink-0 self-start sm:self-center flex items-center gap-2 rounded-full px-4 py-2.5 font-semibold text-sm transition hover:scale-105 active:scale-95" style={{ background: lesson.accent, color: "#102A3C" }}><Volume2 size={16} /> Ouvir e repetir</button>
      </section>

      <section className="mb-6">
        <h2 className="font-display font-600 text-lg mb-2 flex items-center gap-2"><Sparkles size={16} style={{ color: lesson.accent }} />{lesson.grammarTitle}</h2>
        <p className="text-sm mb-4" style={{ color: "#4B5058" }}>{lesson.grammarPt}</p>
        <div className="rounded-xl border p-4 mb-3" style={{ borderColor: "#EAEAE7" }}>
          <div className="grid sm:grid-cols-2 gap-2">
            {lesson.pattern.map((p, i) => (<div key={i} className="flex items-baseline justify-between gap-3 py-1"><span className="font-mono text-sm font-medium">{p.en}</span><span className="text-xs" style={{ color: "#8A8F98" }}>{p.pt}</span></div>))}
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-2">
          {lesson.examples.map((ex, i) => (
            <div key={i} className="rounded-xl p-3" style={{ background: `${lesson.accent}12` }}>
              <div className="flex items-center justify-between mb-1"><p className="text-sm font-medium">{ex.en}</p><button onClick={() => speak(ex.en)} aria-label="Ouvir exemplo"><Volume2 size={14} style={{ color: lesson.accent }} /></button></div>
              <p className="text-xs" style={{ color: "#8A8F98" }}>{ex.pt}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="font-display font-600 text-lg mb-3">Vocabulário essencial</h2>
        <div className="flex flex-wrap gap-2">
          {lesson.vocab.map(([en, pt], i) => (<button key={i} onClick={() => speak(en)} className="rounded-full border px-3 py-1.5 text-sm flex items-center gap-1.5 hover:scale-[1.03] transition" style={{ borderColor: "#EAEAE7" }}><span className="font-medium">{en}</span><span style={{ color: "#8A8F98" }}>· {pt}</span><Volume2 size={11} style={{ color: lesson.accent }} /></button>))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="font-display font-600 text-lg mb-3">Diálogo modelo</h2>
        <div className="rounded-2xl p-4 md:p-5 flex flex-col gap-2.5" style={{ background: "#F7F7F5" }}>
          {lesson.dialogue.map((d, i) => (
            <div key={i} className={`flex ${d.who === "A" ? "justify-start" : "justify-end"}`}>
              <div className="max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5" style={{ background: d.who === "A" ? "#102A3C" : lesson.accent, color: d.who === "A" ? "#FBF6EC" : "#102A3C" }}>
                <div className="flex items-center gap-2"><p className="text-sm font-medium">{d.en}</p><button onClick={() => speak(d.en)} aria-label="Ouvir fala" className="flex-shrink-0"><Volume2 size={12} /></button></div>
                <p className="text-xs mt-0.5 opacity-80">{d.pt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="font-display font-600 text-lg mb-3">Pratica a gramática</h2>
        <div className="flex flex-col gap-4">
          {lesson.quiz.map((q, qi) => {
            const chosen = quizAnswers[qi];
            return (
              <div key={qi} className="rounded-xl border p-4" style={{ borderColor: "#EAEAE7" }}>
                <p className="text-sm font-medium mb-3">{q.q}</p>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt) => {
                    const isChosen = chosen === opt;
                    const isCorrect = opt === q.answer;
                    let style = { borderColor: "#D8D8D4", color: "#16181A" };
                    if (chosen && isChosen && isCorrect) style = { background: "#1F9E89", borderColor: "#1F9E89", color: "#fff" };
                    else if (chosen && isChosen && !isCorrect) style = { background: "#C6408D", borderColor: "#C6408D", color: "#fff" };
                    else if (chosen && isCorrect) style = { borderColor: "#1F9E89", color: "#1F9E89" };
                    return (<button key={opt} onClick={() => setQuizAnswers((a) => ({ ...a, [qi]: opt }))} className="rounded-full border px-3.5 py-1.5 text-sm font-medium transition" style={style}>{opt}</button>);
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl p-5 md:p-6 mb-10" style={{ background: `${lesson.accent}14`, border: `1px solid ${lesson.accent}55` }}>
        <div className="flex items-center gap-2 mb-2"><Mic size={16} style={{ color: lesson.accent }} /><span className="font-mono text-[11px] uppercase tracking-wider" style={{ color: lesson.accent }}>Desafio de fala</span></div>
        <p className="text-sm mb-4">{lesson.speakingTask}</p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <button onClick={() => onComplete(lesson.id)} disabled={isComplete} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-sm transition disabled:opacity-70" style={{ background: isComplete ? "#1F9E89" : "#102A3C", color: "#FBF6EC" }}>
            <Check size={15} /> {isComplete ? "Lição concluída" : "Já pratiquei em voz alta"}
          </button>
          {isComplete && hasNext && (
            <button
              onClick={onGoNext}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-sm shadow-lg transition hover:scale-105 active:scale-95"
              style={{ background: "#1F9E89", color: "#fff" }}
            >
              Ir para a Lição seguinte <ChevronRight size={17} />
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default LegacyLessonView;
