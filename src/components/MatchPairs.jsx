import { useState } from "react";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** MatchPairs: toca uma palavra em inglês e depois a tradução correspondente. */
export default function MatchPairs({ pairs }) {
  const [enOrder] = useState(() => shuffle(pairs.map((p, i) => ({ ...p, i }))));
  const [ptOrder] = useState(() => shuffle(pairs.map((p, i) => ({ ...p, i }))));
  const [selectedEn, setSelectedEn] = useState(null);
  const [matched, setMatched] = useState([]);
  const [wrongFlash, setWrongFlash] = useState(null);

  function pickEn(item) {
    if (matched.includes(item.i)) return;
    setSelectedEn(item);
  }

  function pickPt(item) {
    if (matched.includes(item.i) || !selectedEn) return;
    if (selectedEn.i === item.i) {
      setMatched((m) => [...m, item.i]);
      setSelectedEn(null);
    } else {
      setWrongFlash(item.i);
      setTimeout(() => setWrongFlash(null), 500);
      setSelectedEn(null);
    }
  }

  const done = matched.length === pairs.length;

  return (
    <div className="match-pairs">
      <div className="match-cols">
        <div className="match-col">
          {enOrder.map((item) => (
            <button
              key={item.i}
              type="button"
              className={`match-chip ${matched.includes(item.i) ? "matched" : ""} ${selectedEn?.i === item.i ? "selected" : ""}`}
              onClick={() => pickEn(item)}
              disabled={matched.includes(item.i)}
            >
              {item.en}
            </button>
          ))}
        </div>
        <div className="match-col">
          {ptOrder.map((item) => (
            <button
              key={item.i}
              type="button"
              className={`match-chip ${matched.includes(item.i) ? "matched" : ""} ${wrongFlash === item.i ? "wrong" : ""}`}
              onClick={() => pickPt(item)}
              disabled={matched.includes(item.i)}
            >
              {item.pt}
            </button>
          ))}
        </div>
      </div>
      {done && <p className="match-done">✅ Todos os pares combinados!</p>}
    </div>
  );
}
