// Loads the audio manifest once (key -> hosted mp3 URL) and plays clips
// instantly from it. If a key has no audio yet, falls back to the browser's
// built-in speech synthesis so nothing breaks while Bilal is still recording
// clips in the admin panel.

let manifestCache = null;
let manifestPromise = null;

async function loadManifest() {
  if (manifestCache) return manifestCache;
  if (!manifestPromise) {
    manifestPromise = fetch("/api/manifest")
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({}));
  }
  manifestCache = await manifestPromise;
  return manifestCache;
}

function preloadManifest() {
  loadManifest();
}

function invalidateManifestCache() {
  manifestCache = null;
  manifestPromise = null;
}

async function resolveAudioUrl(key) {
  if (!key) return null;
  try {
    const manifest = await loadManifest();
    return (manifest && manifest[key]) || null;
  } catch (e) {
    return null;
  }
}

function speakFallback(text, pitch = 1) {
  try {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.78;
    u.pitch = pitch;
    window.speechSynthesis.speak(u);
  } catch (e) { /* speech unavailable */ }
}

// Fire-and-forget playback for simple taps (hook, examples, vocab, questions).
async function playAudio(key, fallbackText, fallbackPitch = 1) {
  const url = await resolveAudioUrl(key);
  if (url) {
    try {
      const audio = new Audio(url);
      await audio.play();
      return;
    } catch (e) { /* fall through to browser speech */ }
  }
  if (fallbackText) speakFallback(fallbackText, fallbackPitch);
}

export { playAudio, resolveAudioUrl, preloadManifest, invalidateManifestCache, speakFallback };
