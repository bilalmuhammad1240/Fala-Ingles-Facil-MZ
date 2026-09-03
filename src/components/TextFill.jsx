import { useState } from "react";
import { normalize } from "../lib/text";

/**
 * TextFill: um espaço para completar.
 * mode="free"  -> qualquer resposta não vazia é aceite (ex.: o próprio nome).
 * mode="exact" -> compara com `expected`, com feedback em duas fases.
 * onComplete(isCorrect) é chamado uma vez, quando o exercício fica resolvido.
 */
export default function TextFill({ prompt, placeholder, mode = "free", expected, onComplete }) {
  const [value, setValue] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [done, setDone] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);

  function submit() {
    if (!value.trim() || done) return;
    if (mode === "free") {
      setDone(true);
      setWasCorrect(true);
      if (onComplete) onComplete(true);
      return;
    }
    const ok = normalize(value) === normalize(expected);
    if (ok) {
      setDone(true);
      setWasCorrect(true);
      if (onComplete) onComplete(true);
    } else if (attempt === 0) {
      setAttempt(1);
    } else {
      setDone(true);
      setWasCorrect(false);
      if (onComplete) onComplete(false);
    }
  }

  return (
    <div className="text-fill">
      {prompt && <p className="tf-prompt">{prompt}</p>}
      <input
        type="text"
        className="listen-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={done}
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />
      {!done && (
        <button type="button" className="p-btn-outline" onClick={submit}>
          Verificar
        </button>
      )}
      {mode === "free" && done && <p className="mc-feedback ok">Boa!</p>}
      {mode === "exact" && attempt === 1 && !done && <p className="mc-feedback">Almost. Tenta outra vez.</p>}
      {mode === "exact" && done && wasCorrect && <p className="mc-feedback ok">Correct!</p>}
      {mode === "exact" && done && !wasCorrect && (
        <p className="mc-feedback">
          A frase certa é: <b>{expected}</b>
        </p>
      )}
    </div>
  );
}
