import { useState } from "react";
import { normalize } from "../lib/text";

/**
 * WriteSentence: exercício de escrita mais longo.
 * - Se `expected` for dado: corrige a frase, com feedback em duas fases.
 * - Se `freeform` for true: aceita qualquer resposta não vazia e revela o `model`
 *   para o aluno comparar (autoavaliação), sem marcar como certo/errado.
 */
export default function WriteSentence({ instruction, placeholder, expected, freeform, model, onComplete }) {
  const [value, setValue] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [done, setDone] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);

  function submit() {
    if (!value.trim() || done) return;
    if (freeform) {
      setDone(true);
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
    <div className="write-sentence">
      {instruction && <p className="tf-prompt">{instruction}</p>}
      <textarea
        className="listen-input"
        rows={2}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={done}
      />
      {!done && (
        <button type="button" className="p-btn-outline" onClick={submit}>
          Verificar
        </button>
      )}
      {!freeform && attempt === 1 && !done && <p className="mc-feedback">Almost. Tenta outra vez.</p>}
      {!freeform && done && wasCorrect && <p className="mc-feedback ok">Correct!</p>}
      {!freeform && done && !wasCorrect && (
        <p className="mc-feedback">
          A frase certa é: <b>{expected}</b>
        </p>
      )}
      {freeform && done && model && (
        <p className="mc-feedback ok">
          Boa! Compara com o modelo: <b>{model}</b>
        </p>
      )}
    </div>
  );
}
