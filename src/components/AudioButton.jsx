import { useState } from "react";
import { speak } from "../lib/speech";

export default function AudioButton({ text, showSlow = false, size = "md" }) {
  const [playing, setPlaying] = useState(false);

  function play(rate, e) {
    if (e) e.stopPropagation();
    setPlaying(true);
    speak(text, { rate, onEnd: () => setPlaying(false) });
  }

  return (
    <span className={`audio-btn-group ${size}`}>
      <button
        type="button"
        className={`audio-btn ${playing ? "is-playing" : ""}`}
        onClick={(e) => play(1, e)}
        aria-label={`Ouvir: ${text}`}
        title="Ouvir"
      >
        🔊
      </button>
      {showSlow && (
        <button
          type="button"
          className="audio-btn slow"
          onClick={(e) => play(0.65, e)}
          aria-label={`Ouvir devagar: ${text}`}
          title="Ouvir devagar"
        >
          🐢
        </button>
      )}
    </span>
  );
}
