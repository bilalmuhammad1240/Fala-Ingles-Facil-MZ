import React, { useState, useEffect, useRef } from "react";
import { Check, Volume2, Menu, X, Lock } from "lucide-react";
import { ALL_LESSONS, LEGACY_LESSONS } from "./data.jsx";
import { Lesson1Journey } from "./steps2.jsx";
import LegacyLessonView from "./LegacyLessonView.jsx";

export default function App() {
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState({});
  const [navOpen, setNavOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("fife-progress");
      if (raw) setCompleted(JSON.parse(raw));
    } catch (e) { /* first run */ }
    finally { setLoaded(true); }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { window.localStorage.setItem("fife-progress", JSON.stringify(completed)); }
    catch (e) { /* storage unavailable */ }
  }, [completed, loaded]);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }, [current]);

  const doneCount = Object.values(completed).filter(Boolean).length;
  const progressPct = Math.round((doneCount / ALL_LESSONS.length) * 100);
  const markComplete = (id) => setCompleted((c) => ({ ...c, [id]: true }));

  // Lesson i is unlocked only once every lesson before it is completed.
  // Lesson 0 (Lesson 1) is always unlocked.
  let unlockedCount = 1;
  for (let i = 1; i < ALL_LESSONS.length; i++) {
    if (completed[ALL_LESSONS[i - 1].id]) unlockedCount = i + 1;
    else break;
  }
  const visibleLessons = ALL_LESSONS.slice(0, unlockedCount);
  const hasNext = current < ALL_LESSONS.length - 1;
  function goToNextLesson() {
    setCurrent((c) => Math.min(c + 1, ALL_LESSONS.length - 1));
  }

  const activeMeta = ALL_LESSONS[current];
  const legacyLesson = activeMeta.id === 1 ? null : LEGACY_LESSONS.find((l) => l.id === activeMeta.id);

  return (
    <div className="min-h-screen w-full font-body" style={{ background: "#FFFFFF", color: "#16181A" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Manrope:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');
        .font-display { font-family: 'Fredoka', sans-serif; }
        .font-body { font-family: 'Manrope', sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
        .soundbar { animation: bar 0.9s ease-in-out infinite; transform-origin: bottom; }
        @keyframes bar { 0%, 100% { transform: scaleY(0.5); } 50% { transform: scaleY(1.3); } }
        .chat-in { animation: chatIn 0.25s ease-out; }
        @keyframes chatIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadein { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .lesson-scroll::-webkit-scrollbar { width: 6px; }
        .lesson-scroll::-webkit-scrollbar-thumb { background: #16181A22; border-radius: 3px; }
        .sound-card {
          display: flex; align-items: center; justify-content: space-between; gap: 14px;
          padding: 16px 18px; border-radius: 18px; border: 1px solid; cursor: pointer;
          transition: all 0.25s cubic-bezier(0.25,0.8,0.25,1);
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
        }
        .sound-card:hover { transform: translateY(-2px); }
        .sound-card:active { transform: translateY(0); }
        .sound-card-content { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
        .sound-card-tag { font-size: 10px; font-weight: 700; letter-spacing: 1px; font-family: 'IBM Plex Mono', monospace; }
        .sound-card-text { font-family: 'Fredoka', sans-serif; font-weight: 600; font-size: 1.02rem; }
        .sound-card-icon {
          flex-shrink: 0; width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; transition: transform 0.2s;
        }
        .sound-card:hover .sound-card-icon { transform: scale(1.08); }
      `}</style>

      <header className="sticky top-0 z-30" style={{ background: "#102A3C" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="md:hidden text-[#FBF6EC]" onClick={() => setNavOpen(true)} aria-label="Abrir lições"><Menu size={22} /></button>
            <span className="font-display font-700 text-lg md:text-xl" style={{ color: "#FBF6EC" }}>Fala Inglês Fácil</span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full tracking-wide" style={{ background: "#E8743B", color: "#102A3C" }}>MZ</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs" style={{ color: "#FBF6EC99" }}>Módulo 1 · Primeiros Passos</div>
        </div>
        <div className="h-[3px] w-full" style={{ background: "#0E2A3D" }}>
          <div className="h-[3px] transition-all duration-500" style={{ width: `${progressPct}%`, background: "linear-gradient(90deg,#E8743B,#1F9E89,#C6408D)" }} />
        </div>
      </header>

      <div className="max-w-6xl mx-auto md:grid md:grid-cols-[260px_1fr] md:gap-6 px-0 md:px-6">
        <aside className="hidden md:block py-6">
          <div className="sticky top-24">
            <p className="font-mono text-[11px] uppercase tracking-wider mb-3" style={{ color: "#8A8F98" }}>{doneCount}/{ALL_LESSONS.length} lições concluídas</p>
            <nav className="flex flex-col gap-1">
              {visibleLessons.map((l, i) => (
                <button key={l.id} onClick={() => setCurrent(i)} className="text-left rounded-xl px-3 py-2.5 transition flex items-start gap-2.5" style={{ background: i === current ? "#102A3C" : "transparent", color: i === current ? "#FBF6EC" : "#16181A" }}>
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px]" style={{ background: completed[l.id] ? "#1F9E89" : i === current ? "#E8743B" : "#16181A14", color: completed[l.id] || i === current ? "#fff" : "#16181A" }}>
                    {completed[l.id] ? <Check size={12} /> : l.id}
                  </span>
                  <span className="font-body text-sm leading-snug">{l.title}</span>
                </button>
              ))}
              {unlockedCount < ALL_LESSONS.length && (
                <div className="flex items-center gap-2.5 px-3 py-2.5 opacity-40">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#16181A14" }}>
                    <Lock size={10} />
                  </span>
                  <span className="font-body text-sm">Termina a lição atual para desbloquear</span>
                </div>
              )}
            </nav>
          </div>
        </aside>

        {navOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setNavOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white p-5 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="font-display font-600 text-base">Módulo 1</span>
                <button onClick={() => setNavOpen(false)} aria-label="Fechar"><X size={20} /></button>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-wider mb-3" style={{ color: "#8A8F98" }}>{doneCount}/{ALL_LESSONS.length} lições concluídas</p>
              {visibleLessons.map((l, i) => (
                <button key={l.id} onClick={() => { setCurrent(i); setNavOpen(false); }} className="w-full text-left rounded-xl px-3 py-2.5 mb-1 flex items-start gap-2.5" style={{ background: i === current ? "#102A3C" : "transparent", color: i === current ? "#FBF6EC" : "#16181A" }}>
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px]" style={{ background: completed[l.id] ? "#1F9E89" : i === current ? "#E8743B" : "#16181A14", color: completed[l.id] || i === current ? "#fff" : "#16181A" }}>
                    {completed[l.id] ? <Check size={12} /> : l.id}
                  </span>
                  <span className="text-sm">{l.title}</span>
                </button>
              ))}
              {unlockedCount < ALL_LESSONS.length && (
                <div className="flex items-center gap-2.5 px-3 py-2.5 opacity-40">
                  <Lock size={12} />
                  <span className="text-sm">Termina a lição atual para desbloquear</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="md:hidden overflow-x-auto flex gap-2 px-4 py-3 border-b" style={{ borderColor: "#F0F0EE" }}>
          {visibleLessons.map((l, i) => (
            <button key={l.id} onClick={() => setCurrent(i)} className="flex-shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-xs" style={{ background: i === current ? "#102A3C" : "#F2F2F0", color: i === current ? "#FBF6EC" : "#16181A" }}>
              {completed[l.id] ? <Check size={12} /> : <span>{l.id}</span>} Lição {l.id}
            </button>
          ))}
        </div>

        <main ref={contentRef} className="lesson-scroll px-4 md:px-0 py-6 md:py-8">
          {activeMeta.id === 1 ? (
            <>
              <div className="mb-6">
                <p className="font-mono text-xs uppercase tracking-wider mb-1" style={{ color: activeMeta.accent }}>Lição 1</p>
                <h1 className="font-display font-700 text-3xl md:text-4xl leading-tight mb-1">{activeMeta.title}</h1>
                <p className="text-base" style={{ color: "#6B7280" }}>{activeMeta.subtitle}</p>
              </div>
              <Lesson1Journey accent={activeMeta.accent} onFinish={() => markComplete(1)} onGoNext={goToNextLesson} hasNext={hasNext} />
            </>
          ) : (
            legacyLesson && (
              <LegacyLessonView
                lesson={legacyLesson}
                completedMap={completed}
                onComplete={markComplete}
                onGoNext={goToNextLesson}
                hasNext={hasNext}
              />
            )
          )}
        </main>
      </div>
    </div>
  );
}
