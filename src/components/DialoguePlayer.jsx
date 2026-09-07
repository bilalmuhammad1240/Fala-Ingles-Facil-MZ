import { useEffect, useState } from "react";
import { speak } from "../lib/speech";

const COLOR_CYCLE = ["c1", "c2", "c3"];

function Avatar({ name, colorClass }) {
  const initials = name.slice(0, 2).toUpperCase();
  return <div className={`p-avatar ${colorClass}`}>{initials}</div>;
}

/**
 * DialoguePlayer: revela as falas uma a uma (~2s de intervalo) e cada bolha é clicável para ouvir.
 * A cor do avatar de cada interveniente (d.who) é atribuída dinamicamente pela ordem em que
 * aparece pela primeira vez no diálogo — nunca fixa no código — para nunca desalinhar do
 * conteúdo real (nomes das personagens definidos nos dados da lição).
 */
export default function DialoguePlayer({ dialogue }) {
  const [revealed, setRevealed] = useState(1);

  useEffect(() => {
    if (revealed >= dialogue.length) return;
    const t = setTimeout(() => setRevealed((r) => r + 1), 2000);
    return () => clearTimeout(t);
  }, [revealed, dialogue.length]);

  function playAll() {
    let i = 0;
    function next() {
      if (i >= dialogue.length) return;
      speak(dialogue[i].en, { rate: 1, onEnd: () => { i++; setTimeout(next, 350); } });
    }
    next();
  }

  const colorByWho = {};
  let nextColorIdx = 0;
  function colorFor(who) {
    if (!colorByWho[who]) {
      colorByWho[who] = COLOR_CYCLE[nextColorIdx % COLOR_CYCLE.length];
      nextColorIdx++;
    }
    return colorByWho[who];
  }

  return (
    <div className="dialogue-player">
      <button className="p-btn-outline" style={{ marginBottom: 16 }} onClick={playAll}>
        ▶ Reproduzir diálogo completo
      </button>
      {dialogue.slice(0, revealed).map((d, i) => (
        <button
          key={i}
          type="button"
          className="p-chat-line p-chat-line-btn dialogue-in"
          onClick={() => speak(d.en, { rate: 1 })}
        >
          <Avatar name={d.who} colorClass={colorFor(d.who)} />
          <span className="p-chat-bubble">
            <span className="en">{d.en} <span className="audio-hint">🔊</span></span>
            <span className="pt2">{d.pt}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
