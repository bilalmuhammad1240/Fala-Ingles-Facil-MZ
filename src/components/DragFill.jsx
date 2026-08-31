import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * DragFill (v3): arrastar com Pointer Events + toque simples como reforço.
 * Cada espaço é verificado instantaneamente ao ser preenchido (verde/vermelho),
 * com um pequeno efeito de "encaixe" (snap) na animação.
 */
export default function DragFill({ segments, words, correctMap, onComplete }) {
  const [filled, setFilled] = useState({});
  const [snapId, setSnapId] = useState(null);
  const [dragWord, setDragWord] = useState(null);
  const [usedIdx, setUsedIdx] = useState([]);
  const blankRefs = useRef({});
  const startPos = useRef({ x: 0, y: 0 });
  const moved = useRef(false);

  const blankIds = segments.filter((s) => s.blank).map((s) => s.id);
  const allFilled = blankIds.every((id) => filled[id]);
  const allCorrect = allFilled && blankIds.every((id) => filled[id] === correctMap[id]);

  function commitPlacement(id, word, sourceIndex) {
    setFilled((f) => {
      const nf = { ...f, [id]: word };
      const stillEmpty = blankIds.filter((bid) => !nf[bid]);
      if (stillEmpty.length === 0 && onComplete) onComplete(nf);
      return nf;
    });
    setUsedIdx((u) => [...u, sourceIndex]);
    setSnapId(id);
    setTimeout(() => setSnapId(null), 260);
  }

  function place(word, sourceIndex) {
    const nextEmptyId = blankIds.find((id) => !filled[id]);
    if (!nextEmptyId) return;
    commitPlacement(nextEmptyId, word, sourceIndex);
  }

  function onPointerDownChip(e, word, sourceIndex) {
    if (usedIdx.includes(sourceIndex)) return;
    startPos.current = { x: e.clientX, y: e.clientY };
    moved.current = false;
    setDragWord({ word, x: e.clientX, y: e.clientY, sourceIndex });
  }

  useEffect(() => {
    if (!dragWord) return;

    function onMove(e) {
      const dx = Math.abs(e.clientX - startPos.current.x);
      const dy = Math.abs(e.clientY - startPos.current.y);
      if (dx > 6 || dy > 6) moved.current = true;
      setDragWord((d) => (d ? { ...d, x: e.clientX, y: e.clientY } : d));
    }

    function onUp(e) {
      setDragWord((d) => {
        if (!d) return null;
        if (!moved.current) {
          place(d.word, d.sourceIndex);
          return null;
        }
        for (const id of blankIds) {
          const el = blankRefs.current[id];
          if (!el) continue;
          const r = el.getBoundingClientRect();
          const pad = 14; // margem de tolerância para "encaixar" mais facilmente
          if (
            e.clientX >= r.left - pad && e.clientX <= r.right + pad &&
            e.clientY >= r.top - pad && e.clientY <= r.bottom + pad
          ) {
            commitPlacement(id, d.word, d.sourceIndex);
            return null;
          }
        }
        place(d.word, d.sourceIndex);
        return null;
      });
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragWord]);

  function reset() {
    setFilled({});
    setUsedIdx([]);
  }

  function removeFromBlank(id) {
    setFilled((f) => {
      const nf = { ...f };
      delete nf[id];
      return nf;
    });
  }

  return (
    <div className="dragfill">
      <p className="dragfill-sentence">
        {segments.map((seg, i) => {
          if (!seg.blank) return <span key={i}>{seg.text}</span>;
          const val = filled[seg.id];
          const state = val ? (val === correctMap[seg.id] ? "correct" : "wrong") : "";
          return (
            <span
              key={seg.id}
              ref={(el) => (blankRefs.current[seg.id] = el)}
              className={`dragfill-blank ${val ? "filled" : ""} ${state} ${snapId === seg.id ? "snap" : ""}`}
              onClick={() => val && removeFromBlank(seg.id)}
            >
              {val || "____"}
            </span>
          );
        })}
      </p>

      <p className="p-chat-hint" style={{ marginTop: 4 }}>
        Arrasta a palavra até ao espaço certo — ou toca nela para a colocar no próximo espaço vazio. Cada espaço é corrigido na hora.
      </p>

      <div className="dragfill-bank">
        {words.map((w, i) => (
          <button
            key={i}
            type="button"
            className={`dragfill-chip ${usedIdx.includes(i) ? "used" : ""}`}
            onPointerDown={(e) => onPointerDownChip(e, w, i)}
          >
            {w}
          </button>
        ))}
      </div>

      {dragWord && createPortal(
        <div className="dragfill-ghost" style={{ left: dragWord.x, top: dragWord.y }}>
          {dragWord.word}
        </div>,
        document.body
      )}

      {allFilled && (
        <div className="dragfill-feedback">
          <span>{allCorrect ? "✅ Perfeito! Está tudo certo." : "❌ Alguns espaços estão errados — os espaços a vermelho precisam de correção."}</span>
          <button className="p-btn-outline" type="button" onClick={reset}>Repetir</button>
        </div>
      )}
    </div>
  );
}
