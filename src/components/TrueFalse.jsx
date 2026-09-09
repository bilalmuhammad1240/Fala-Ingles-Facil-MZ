import { useState } from "react";

export default function TrueFalse({ items }) {
  const [answers, setAnswers] = useState({});

  return (
    <div className="truefalse">
      {items.map((it, i) => (
        <div key={i} className="tf-row">
          <p>{it.statement}</p>
          <div className="tf-btns">
            {["V", "F"].map((opt) => {
              const chosen = answers[i] === opt;
              const isRight = opt === it.answer;
              return (
                <button
                  key={opt}
                  type="button"
                  className={`tf-btn ${chosen ? (isRight ? "correct" : "wrong") : ""}`}
                  onClick={() => setAnswers((a) => ({ ...a, [i]: opt }))}
                >
                  {opt === "V" ? "Verdadeiro" : "Falso"}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
