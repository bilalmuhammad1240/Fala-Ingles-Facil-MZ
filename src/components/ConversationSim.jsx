import { useState } from "react";
import { speak } from "../lib/speech";
import { normalize } from "../lib/text";

/**
 * ConversationSim: pequena simulação de conversa.
 * steps: array de { speaker: "them"|"you", en, pt, expected[], hintEn, hintPt }
 * Nas falas "you", o aluno tem de escrever a resposta (produção, não múltipla escolha).
 * Nas falas "them", o aluno toca "Continuar" para avançar (sem autoplay/temporizador).
 */
export default function ConversationSim({ steps, onComplete }) {
  const [revealed, setRevealed] = useState(1);
  const [value, setValue] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [answered, setAnswered] = useState({});

  const finished = revealed > steps.length;
  const current = !finished ? steps[revealed - 1] : null;
  const isYourTurn = current && current.speaker === "you";
  const isTheirTurn = current && current.speaker === "them";

  function advance() {
    const next = revealed + 1;
    setRevealed(next);
    if (next > steps.length && onComplete) onComplete();
  }

  function submit() {
    if (!value.trim()) return;
    const ok = current.expected.some((exp) => normalize(value).includes(normalize(exp)));
    if (ok || attempt >= 1) {
      setAnswered((a) => ({ ...a, [revealed - 1]: value }));
      setValue("");
      setAttempt(0);
      advance();
    } else {
      setAttempt(1);
    }
  }

  // Mostra todas as falas já reveladas; a fala "them" atual entra na lista,
  // mas a "you" atual só aparece depois de responderes.
  const shownSteps = steps.slice(0, isYourTurn ? revealed - 1 : revealed);

  return (
    <div className="conversation-sim">
      {shownSteps.map((s, i) =>
        s.speaker === "them" ? (
          <button
            key={i}
            type="button"
            className="p-chat-line-btn"
            onClick={() => speak(s.en, { rate: 1 })}
          >
            <span className="p-chat-bubble">
              <span className="en">{s.en} <span className="audio-hint">🔊</span></span>
              <span className="pt2">{s.pt}</span>
            </span>
          </button>
        ) : (
          answered[i] !== undefined && (
            <div key={i} className="p-chat-line you">
              <span className="p-chat-bubble you-said">
                <span className="en">{answered[i]}</span>
              </span>
            </div>
          )
        )
      )}

      {isTheirTurn && (
        <button type="button" className="p-btn-outline conv-continue" onClick={advance}>
          Continuar →
        </button>
      )}

      {isYourTurn && (
        <div className="conv-input">
          <p className="p-chat-hint">{current.hintPt}</p>
          <input
            type="text"
            className="listen-input"
            placeholder="Escreve a tua resposta em inglês..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <button type="button" className="p-btn-outline" onClick={submit}>
            Enviar
          </button>
          {attempt === 1 && (
            <p className="mc-feedback">
              Almost. Algo como: <b>{current.hintEn}</b> — tenta outra vez.
            </p>
          )}
        </div>
      )}

      {finished && <p className="match-done">✅ Conversa completa!</p>}
    </div>
  );
}
