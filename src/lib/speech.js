// Motor de áudio: usa a Web Speech API nativa do navegador (SpeechSynthesis).
// Sem custo, sem backend, e escolhe automaticamente a melhor voz inglesa disponível.

let cachedVoice = null;

function pickBestVoice() {
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const priorityNames = /Google US English|Natural|Aria|Samantha|Jenny|Online/i;
  cachedVoice =
    voices.find((v) => v.lang === "en-US" && priorityNames.test(v.name)) ||
    voices.find((v) => v.lang === "en-US") ||
    voices.find((v) => v.lang.startsWith("en")) ||
    voices[0];
  return cachedVoice;
}

// Garante que a lista de vozes carregou (em alguns browsers é assíncrono)
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => { cachedVoice = null; };
}

export function speak(text, { rate = 1, onEnd } = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  utter.rate = rate;
  utter.pitch = 1;
  const voice = pickBestVoice();
  if (voice) utter.voice = voice;
  if (onEnd) utter.onend = onEnd;
  window.speechSynthesis.speak(utter);
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
