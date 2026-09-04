import { useState, useEffect } from "react";

/**
 * SentenceBuilder: o aluno toca as palavras na ordem certa para formar a frase.
 * Feedback em duas fases (guia, secção 15):
 * 1ª tentativa errada -> "Almost, tenta outra vez"; 2ª tentativa errada -> revela a frase certa.
 * onComplete(isCorrect) é chamado uma vez, quando o exercício fica resolvido.
 */
export default function SentenceBuilder({ words, correctOrder, translation, onComplete }) {
  const [available, setAvailable] = useState(words.map((w, i) => ({ w, i })));
  const [chosen, setChosen] = useState([]);
  const [attempt, setAttempt] = useState(0);
  const [resolved, setResolved] = useState(false);

  function pick(item) {
    setChosen((c) => [...c, item]);
    setAvailable((a) => a.filter((x) => x.i !== item.i));
  }
  function unpick(item) {
    setAvailable((a) => [...a, item]);
    setChosen((c) => c.filter((x) => x.i !== item.i));
  }
  function reset() {
    setAvailable(words.map((w, i) => ({ w, i })));
    setChosen([]);
  }

  const done = available.length === 0;
  const isCorrect = done && chosen.map((c) => c.w).join(" ") === correctOrder.join(" ");

  useEffect(() => {
    if (!done || resolved) return;
    if (isCorrect) {
      setResolved(true);
      if (onComplete) onComplete(true);
    } else if (attempt === 0) {
      setAttempt(1);
    } else {
      setResolved(true);
      if (onComplete) onComplete(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, isCorrect]);

  return (
    <div className="sentence-builder">
      <div className="sb-slot-row">
        {chosen.length === 0 && <span className="sb-placeholder">Toca as palavras abaixo, por ordem</span>}
        {chosen.map((c) => (
          <button key={c.i} type="button" className="sb-chip chosen" onClick={() => unpick(c)}>
            {c.w}
          </button>
        ))}
      </div>
      <div className="sb-bank-row">
        {available.map((a) => (
          <button key={a.i} type="button" className="sb-chip" onClick={() => pick(a)}>
            {a.w}
          </button>
        ))}
      </div>
      {done && !isCorrect && !resolved && (
        <div className="dragfill-feedback">
          <span>Almost. Verifica a ordem das palavras e tenta outra vez.</span>
          <button className="p-btn-outline" type="button" onClick={reset}>Tentar de novo</button>
        </div>
      )}
      {resolved && !isCorrect && (
        <div className="dragfill-feedback">
          <span>A frase certa é: <b>{correctOrder.join(" ")}</b></span>
        </div>
      )}
      {resolved && isCorrect && (
        <div className="dragfill-feedback">
          <span>✅ Correct!</span>
        </div>
      )}
      {translation && <p className="sb-hint">{translation}</p>}
    </div>
  );
}
