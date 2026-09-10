import React, { useState, useEffect, useRef, useMemo } from "react";
import { Check, ChevronRight, ChevronLeft, Mic, Square, RotateCcw, GripVertical } from "lucide-react";
import { speak, LESSON1 } from "./data.jsx";
import { blobToWav16kMono } from "./audioUtils.js";
import { StepShell, ContinueButton, StepAccordion, SoundCard, RevealPt, STEP_DEFS } from "./ui.jsx";
import { HookStep, GrammarExplainStep, VocabStep, DialogueStep } from "./steps1.jsx";

function DragGrammarStep({ accent, onComplete }) {
  const SENTENCES = LESSON1.dragSentences;
  const initialBank = useMemo(() => {
    const words = SENTENCES.map((s, i) => ({ uid: `w${i}`, word: s.answer }));
    for (let i = words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [words[i], words[j]] = [words[j], words[i]];
    }
    return words;
  }, []);

  const [bank, setBank] = useState(initialBank);
  const [blanks, setBlanks] = useState(Array(SENTENCES.length).fill(null));
  const [correctFlags, setCorrectFlags] = useState(Array(SENTENCES.length).fill(false));
  const [wrongIdx, setWrongIdx] = useState(null);
  const [dragVisual, setDragVisual] = useState(null);

  const dragDataRef = useRef(null);
  const blanksRef = useRef(blanks);
  const blankRefs = useRef([]);
  const chipRefs = useRef({});

  useEffect(() => { blanksRef.current = blanks; }, [blanks]);

  const correctCount = correctFlags.filter(Boolean).length;
  const allDone = correctCount === SENTENCES.length;

  useEffect(() => {
    function onMove(e) {
      if (!dragDataRef.current) return;
      const p = e.touches ? e.touches[0] : e;
      dragDataRef.current = { ...dragDataRef.current, x: p.clientX, y: p.clientY };
      setDragVisual(dragDataRef.current);
    }
    function onUp(e) {
      if (!dragDataRef.current) return;
      const p = e.changedTouches ? e.changedTouches[0] : e;
      const x = p.clientX, y = p.clientY;
      const cur = dragDataRef.current;
      let targetIdx = null;
      blankRefs.current.forEach((el, idx) => {
        if (!el || blanksRef.current[idx]) return;
        const r = el.getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) targetIdx = idx;
      });
      dragDataRef.current = null;
      setDragVisual(null);
      if (targetIdx !== null) {
        const correct = SENTENCES[targetIdx].answer === cur.word;
        if (correct) {
          setBlanks((b) => { const nb = [...b]; nb[targetIdx] = { uid: cur.uid, word: cur.word }; return nb; });
          setCorrectFlags((f) => { const nf = [...f]; nf[targetIdx] = true; return nf; });
          setBank((bk) => bk.filter((c) => c.uid !== cur.uid));
        } else {
          setWrongIdx(targetIdx);
          setTimeout(() => setWrongIdx(null), 450);
        }
      }
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [SENTENCES]);

  function onChipDown(e, chip) {
    e.preventDefault();
    dragDataRef.current = { uid: chip.uid, word: chip.word, x: e.clientX, y: e.clientY };
    setDragVisual(dragDataRef.current);
  }

  return (
    <StepShell title="Arrasta a palavra certa para o espaço" accent={accent}>
      <p className="text-xs font-mono mb-4" style={{ color: "#8A8F98" }}>{correctCount}/{SENTENCES.length} corretas</p>
      <div className="flex flex-col gap-3 mb-6">
        {SENTENCES.map((s, idx) => (
          <div key={idx} className="flex items-center flex-wrap gap-2 text-base font-medium">
            <span>{s.before}</span>
            <span
              ref={(el) => (blankRefs.current[idx] = el)}
              className="inline-flex items-center justify-center min-w-[64px] h-10 px-3 rounded-xl border-2 border-dashed transition"
              style={{
                borderColor: correctFlags[idx] ? "#1F9E89" : wrongIdx === idx ? "#C6408D" : `${accent}66`,
                background: correctFlags[idx] ? "#1F9E8918" : wrongIdx === idx ? "#C6408D18" : `${accent}0C`,
                color: correctFlags[idx] ? "#1F9E89" : "#16181A",
              }}
            >
              {blanks[idx]?.word || ""}
            </span>
            <span>{s.after}</span>
            {correctFlags[idx] && <Check size={16} style={{ color: "#1F9E89" }} />}
          </div>
        ))}
      </div>
      <p className="text-xs font-mono mb-2" style={{ color: "#8A8F98" }}>Banco de palavras</p>
      <div className="flex flex-wrap gap-2 min-h-[48px]">
        {bank.map((chip) => (
          <div
            key={chip.uid}
            ref={(el) => (chipRefs.current[chip.uid] = el)}
            onPointerDown={(e) => onChipDown(e, chip)}
            className="select-none inline-flex items-center gap-1 rounded-xl px-4 py-2.5 font-mono text-sm font-semibold cursor-grab active:cursor-grabbing"
            style={{ background: accent, color: "#fff", touchAction: "none", opacity: dragVisual?.uid === chip.uid ? 0.25 : 1 }}
          >
            <GripVertical size={13} className="opacity-50" />
            {chip.word}
          </div>
        ))}
      </div>
      {dragVisual && (
        <div
          className="fixed z-50 pointer-events-none inline-flex items-center gap-1 rounded-xl px-4 py-2.5 font-mono text-sm font-semibold shadow-lg"
          style={{ left: dragVisual.x - 30, top: dragVisual.y - 22, background: accent, color: "#fff" }}
        >
          {dragVisual.word}
        </div>
      )}
      <ContinueButton accent={accent} disabled={!allDone} onClick={onComplete} />
    </StepShell>
  );
}

function PronScoreCard({ score, accent }) {
  const overall = Math.round(score.PronScore ?? score.PronunciationScore ?? 0);
  let label, emoji;
  if (overall >= 80) { label = "Excelente pronúncia!"; emoji = "🌟"; }
  else if (overall >= 60) { label = "Boa pronúncia — continua a praticar."; emoji = "👍"; }
  else if (overall >= 40) { label = "Dá para perceber, mas pratica mais."; emoji = "🙂"; }
  else { label = "Tenta outra vez, mais devagar e claro."; emoji = "🔁"; }
  return (
    <div className="rounded-xl p-3" style={{ background: `${accent}12` }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold">{emoji} {label}</span>
        <span className="font-mono text-sm font-bold" style={{ color: accent }}>{overall}/100</span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[["Precisão", score.AccuracyScore], ["Fluência", score.FluencyScore], ["Completude", score.CompletenessScore]].map(([lbl, val]) => (
          <div key={lbl}>
            <div className="text-[10px] font-mono uppercase" style={{ color: "#8A8F98" }}>{lbl}</div>
            <div className="text-sm font-semibold">{Math.round(val ?? 0)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpeakingChallengeStep({ accent, onFinish }) {
  const QUESTIONS = LESSON1.speakingQuestions;
  const [qIdx, setQIdx] = useState(0);
  const [status, setStatus] = useState({});
  const [urls, setUrls] = useState({});
  const [feedback, setFeedback] = useState({});
  const [scores, setScores] = useState({});
  const [assessing, setAssessing] = useState({});
  const [liveLevel, setLiveLevel] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioCtxRef = useRef(null);
  const rafRef = useRef(null);
  const volumesRef = useRef([]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (audioCtxRef.current) { try { audioCtxRef.current.close(); } catch (e) { /* noop */ } }
    };
  }, []);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      volumesRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      let analyser = null;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const source = ctx.createMediaStreamSource(stream);
        analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        audioCtxRef.current = ctx;
        const data = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) { const v = (data[i] - 128) / 128; sum += v * v; }
          const rms = Math.sqrt(sum / data.length);
          volumesRef.current.push(rms);
          setLiveLevel(rms);
          rafRef.current = requestAnimationFrame(tick);
        };
        tick();
      }

      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" });
        const url = URL.createObjectURL(blob);
        setUrls((u) => ({ ...u, [qIdx]: url }));
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        setLiveLevel(0);

        const vols = volumesRef.current;
        const avg = vols.length ? vols.reduce((a, b) => a + b, 0) / vols.length : 0;
        let basicMsg;
        if (avg > 0.06 && vols.length > 15) basicMsg = "Boa clareza — deu para ouvir-te bem! 🔊";
        else if (avg > 0.02) basicMsg = "Deu para ouvir, mas tenta falar um pouco mais alto. 🔉";
        else basicMsg = "Quase não se ouviu — aproxima-te do microfone e fala mais alto. 🔈";
        setFeedback((f) => ({ ...f, [qIdx]: basicMsg }));
        setStatus((s) => ({ ...s, [qIdx]: "recorded" }));
        stream.getTracks().forEach((t) => t.stop());
        if (audioCtxRef.current) { try { audioCtxRef.current.close(); } catch (e) { /* noop */ } }

        // Try a real pronunciation assessment (Azure). If it's not configured yet,
        // or the request fails for any reason, we quietly keep the basic feedback above.
        const capturedQIdx = qIdx;
        const referenceText = QUESTIONS[capturedQIdx].en;
        setAssessing((a) => ({ ...a, [capturedQIdx]: true }));
        blobToWav16kMono(blob)
          .then((wavBlob) =>
            fetch("/api/pronunciation", {
              method: "POST",
              headers: { "Content-Type": "audio/wav", "X-Reference-Text": encodeURIComponent(referenceText) },
              body: wavBlob,
            })
          )
          .then(async (res) => {
            if (!res.ok) throw new Error("assessment unavailable");
            const data = await res.json();
            const pa = data?.NBest?.[0]?.PronunciationAssessment;
            if (!pa) throw new Error("no assessment data");
            setScores((s) => ({ ...s, [capturedQIdx]: pa }));
          })
          .catch(() => { /* Azure not configured or request failed — basic feedback stands */ })
          .finally(() => setAssessing((a) => ({ ...a, [capturedQIdx]: false })));
      };
      mr.start();
      setStatus((s) => ({ ...s, [qIdx]: "recording" }));
    } catch (err) {
      setStatus((s) => ({ ...s, [qIdx]: "error" }));
    }
  }
  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") mediaRecorderRef.current.stop();
  }
  function redo() {
    if (urls[qIdx]) URL.revokeObjectURL(urls[qIdx]);
    setUrls((u) => { const nu = { ...u }; delete nu[qIdx]; return nu; });
    setFeedback((f) => { const nf = { ...f }; delete nf[qIdx]; return nf; });
    setScores((s) => { const ns = { ...s }; delete ns[qIdx]; return ns; });
    setAssessing((a) => { const na = { ...a }; delete na[qIdx]; return na; });
    setStatus((s) => ({ ...s, [qIdx]: "idle" }));
  }

  const st = status[qIdx] || "idle";
  const isLast = qIdx === QUESTIONS.length - 1;
  const attempted = (i) => status[i] === "recorded" || status[i] === "error";
  const allAttempted = QUESTIONS.every((_, i) => attempted(i));
  const q = QUESTIONS[qIdx];

  return (
    <StepShell title="Grava-te a responder — sem precisares de ninguém" accent={accent}>
      <div className="flex items-center gap-1.5 mb-4">
        {QUESTIONS.map((_, i) => (
          <span key={i} className="h-1.5 flex-1 rounded-full" style={{ background: attempted(i) ? accent : i === qIdx ? "#D8D8D4" : "#EEEEEC" }} />
        ))}
      </div>
      <div className="rounded-2xl p-5 md:p-6" style={{ background: "#F7F7F5" }}>
        <SoundCard onClick={() => speak(q.en)} accent={accent} tag="OUVIR PRONÚNCIA">
          {q.en}
        </SoundCard>
        <div className="mt-2 mb-5"><RevealPt pt={q.pt} /></div>

        {st === "idle" && (
          <button
            onClick={startRecording}
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold text-sm text-white transition hover:scale-105 active:scale-95"
            style={{ background: accent }}
          >
            <Mic size={16} /> Gravar resposta
          </button>
        )}
        {st === "recording" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-end justify-center gap-1.5 h-10">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="w-2 rounded-full"
                  style={{
                    background: "#C6408D",
                    height: `${Math.max(6, Math.min(40, liveLevel * 220 + i * 3))}px`,
                    transition: "height 0.08s linear",
                  }}
                />
              ))}
            </div>
            <button
              onClick={stopRecording}
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold text-sm text-white animate-pulse self-center"
              style={{ background: "#C6408D" }}
            >
              <Square size={14} /> A gravar... toca para parar
            </button>
          </div>
        )}
        {st === "recorded" && (
          <div className="flex flex-col gap-3">
            <audio controls src={urls[qIdx]} className="w-full" />
            {assessing[qIdx] && (
              <p className="text-xs font-mono" style={{ color: "#8A8F98" }}>A avaliar pronúncia…</p>
            )}
            {scores[qIdx] ? (
              <PronScoreCard score={scores[qIdx]} accent={accent} />
            ) : (
              !assessing[qIdx] && feedback[qIdx] && (
                <p className="text-xs font-mono" style={{ color: "#8A8F98" }}>{feedback[qIdx]}</p>
              )
            )}
            <div className="flex flex-wrap gap-2">
              <button onClick={redo} className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium" style={{ borderColor: "#D8D8D4" }}>
                <RotateCcw size={14} /> Gravar novamente
              </button>
            </div>
          </div>
        )}
        {st === "error" && (
          <div className="flex flex-col gap-3">
            <p className="text-sm" style={{ color: "#C6408D" }}>
              Não conseguimos aceder ao microfone. Verifica as permissões do navegador.
            </p>
            <button onClick={startRecording} className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium self-start" style={{ borderColor: "#D8D8D4" }}>
              <RotateCcw size={14} /> Tentar novamente
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-5">
        <button
          onClick={() => setQIdx((i) => Math.max(0, i - 1))}
          disabled={qIdx === 0}
          className="inline-flex items-center gap-1 text-sm font-medium disabled:opacity-30"
          style={{ color: "#6B7280" }}
        >
          <ChevronLeft size={16} /> Anterior
        </button>
        {!isLast ? (
          <button
            onClick={() => setQIdx((i) => i + 1)}
            disabled={!attempted(qIdx)}
            className="inline-flex items-center gap-1 rounded-full px-5 py-2.5 font-semibold text-sm text-white transition disabled:opacity-30"
            style={{ background: accent }}
          >
            Próxima pergunta <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={onFinish}
            disabled={!allAttempted}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-sm text-white transition disabled:opacity-30 hover:scale-[1.02] active:scale-95"
            style={{ background: "#1F9E89" }}
          >
            <Check size={16} /> Concluir Lição 1
          </button>
        )}
      </div>
    </StepShell>
  );
}

function Lesson1Journey({ accent, onFinish, onGoNext, hasNext }) {
  // "unlocked" = index of the step currently active/being worked on.
  // Steps 0..unlocked-1 are completed and shown collapsed (reopenable).
  // Steps > unlocked are not rendered at all yet.
  const [unlocked, setUnlocked] = useState(0);
  const [openIndex, setOpenIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  function advance() {
    setUnlocked((u) => {
      const n = Math.min(u + 1, STEP_DEFS.length - 1);
      setOpenIndex(n);
      return n;
    });
  }
  function toggle(i) {
    if (i > unlocked) return;
    setOpenIndex((cur) => (cur === i ? -1 : i));
  }
  function handleFinish() {
    setFinished(true);
    onFinish();
  }

  function renderStep(i) {
    const key = STEP_DEFS[i].key;
    if (key === "hook") return <HookStep accent={accent} onComplete={advance} />;
    if (key === "grammar") return <GrammarExplainStep accent={accent} onComplete={advance} />;
    if (key === "vocab") return <VocabStep accent={accent} onComplete={advance} />;
    if (key === "dialogue") return <DialogueStep accent={accent} onComplete={advance} />;
    if (key === "practice") return <DragGrammarStep accent={accent} onComplete={advance} />;
    if (key === "speaking") return <SpeakingChallengeStep accent={accent} onFinish={handleFinish} />;
    return null;
  }

  if (finished) {
    return (
      <div className="rounded-3xl p-8 text-center" style={{ background: "#102A3C" }}>
        <p className="font-display font-700 text-2xl mb-2" style={{ color: "#FBF6EC" }}>Lição 1 concluída! 🎉</p>
        <p className="text-sm mb-6" style={{ color: "#FBF6EC99" }}>
          Já cumprimentaste, praticaste "to be", ouviste um diálogo real e gravaste-te a falar inglês.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => { setFinished(false); setUnlocked(0); setOpenIndex(0); }}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-sm border"
            style={{ borderColor: "#FBF6EC55", color: "#FBF6EC", background: "transparent" }}
          >
            <RotateCcw size={15} /> Rever a lição
          </button>
          {hasNext && (
            <button
              onClick={onGoNext}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-sm shadow-lg transition hover:scale-105 active:scale-95"
              style={{ background: "#1F9E89", color: "#fff" }}
            >
              Ir para a Lição seguinte <ChevronRight size={17} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <StepAccordion
      steps={STEP_DEFS}
      unlocked={unlocked}
      openIndex={openIndex}
      onToggle={toggle}
      accent={accent}
      renderStep={renderStep}
    />
  );
}

export { HookStep, GrammarExplainStep, VocabStep, DialogueStep, DragGrammarStep, SpeakingChallengeStep, Lesson1Journey };
