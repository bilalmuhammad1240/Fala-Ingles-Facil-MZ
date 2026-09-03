import { useState } from "react";
import { speak } from "../lib/speech";

/**
 * MultipleChoice: pergunta de escolha múltipla com feedback em duas fases,
 * conforme o guia — 1ª tentativa errada: "Almost, tenta outra vez.";
 * 2ª tentativa errada: revela a resposta certa.
 * onComplete(isCorrect) é chamado exatamente uma vez, quando a pergunta fica resolvida.
 */
export default function MultipleChoice({ audioText, q, options, answer, onComplete }) {
  const [attempt, setAttempt] = useState(0);
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);

  function choose(i) {
    if (done) return;
    setSelected(i);
    if (i === answer) {
      setDone(true);
      if (onComplete) onComplete(true);
    } else if (attempt === 0) {
      setAttempt(1);
    } else {
      setDone(true);
      if (onComplete) onComplete(false);
    }
  }

  return (
    <div className="mc-item">
      {audioText && (
        <button type="button" className="audio-btn big" onClick={() => speak(audioText, { rate: 0.9 })}>
          🔊 Ouvir
        </button>
      )}
      {q && <p className="mc-q">{q}</p>}
      <div className="mc-options">
        {options.map((o, i) => {
          const isSel = selected === i;
          const showCorrect = done && i === answer;
          const showWrong = isSel && i !== answer;
          return (
            <button
              key={i}
              type="button"
              className={`v-quiz-opt ${showCorrect ? "correct" : ""} ${showWrong ? "wrong" : ""}`}
              onClick={() => choose(i)}
              disabled={done && i !== answer}
            >
              {o}
            </button>
          );
        })}
      </div>
      {attempt === 1 && !done && <p className="mc-feedback">Almost. Tenta outra vez.</p>}
      {done && selected === answer && <p className="mc-feedback ok">Correct!</p>}
      {done && selected !== answer && (
        <p className="mc-feedback">
          A resposta certa é: <b>{options[answer]}</b>
        </p>
      )}
    </div>
  );
}
