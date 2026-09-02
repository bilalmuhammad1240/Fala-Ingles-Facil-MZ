import { useState } from "react";

/** SentenceBuilder: o aluno toca as palavras na ordem certa para formar a frase. */
export default function SentenceBuilder({ words, correctOrder, translation }) {
  const [available, setAvailable] = useState(words.map((w, i) => ({ w, i })));
  const [chosen, setChosen] = useState([]);

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
      {done && (
        <div className="dragfill-feedback">
          <span>{isCorrect ? "✅ Boa! Frase correta." : "❌ Ordem errada, tenta outra vez."}</span>
          <button className="p-btn-outline" type="button" onClick={reset}>Repetir</button>
        </div>
      )}
      {translation && <p className="sb-hint">{translation}</p>}
    </div>
  );
}
