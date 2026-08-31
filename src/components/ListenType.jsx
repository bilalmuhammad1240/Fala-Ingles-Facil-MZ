import { useState } from "react";
import { speak } from "../lib/speech";

function normalize(s) {
  return s.trim().toLowerCase().replace(/[.,!?']/g, "");
}

export default function ListenType({ text, hintPt }) {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const isCorrect = normalize(value) === normalize(text);

  return (
    <div className="listen-type">
      <button type="button" className="audio-btn big" onClick={() => speak(text, { rate: 0.85 })}>
        🔊 Ouvir
      </button>
      <input
        type="text"
        className="listen-input"
        placeholder="Escreve o que ouviste em inglês..."
        value={value}
        onChange={(e) => { setValue(e.target.value); setChecked(false); }}
      />
      <button type="button" className="p-btn-outline" onClick={() => setChecked(true)}>Verificar</button>
      {checked && (
        <p className={`listen-feedback ${isCorrect ? "ok" : "bad"}`}>
          {isCorrect ? "✅ Certo!" : `❌ Quase — a frase certa é: "${text}"`}
        </p>
      )}
      {hintPt && <p className="sb-hint">{hintPt}</p>}
    </div>
  );
}
