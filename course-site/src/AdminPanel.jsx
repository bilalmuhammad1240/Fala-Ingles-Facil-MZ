import React, { useState, useEffect, useMemo } from "react";
import { Lock, Volume2, Download, Check, Loader2, RefreshCw } from "lucide-react";
import { getAllAudioItems } from "./data.jsx";

const ROLE_LABELS = { narrator: "Narrador(a)", ana: "Ana", carlos: "Carlos" };
const ROLE_COLORS = { narrator: "#8A8F98", ana: "#E8743B", carlos: "#1F9E89" };

function useAdminAuth() {
  const [passphrase, setPassphrase] = useState(() => sessionStorage.getItem("fife-admin-pass") || "");
  const [unlocked, setUnlocked] = useState(() => Boolean(sessionStorage.getItem("fife-admin-pass")));

  function tryUnlock(value) {
    sessionStorage.setItem("fife-admin-pass", value);
    setPassphrase(value);
    setUnlocked(true);
  }
  function lock() {
    sessionStorage.removeItem("fife-admin-pass");
    setPassphrase("");
    setUnlocked(false);
  }
  return { passphrase, unlocked, tryUnlock, lock };
}

function PassphraseGate({ onUnlock }) {
  const [value, setValue] = useState("");
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={18} />
          <h1 className="font-semibold text-lg">Painel Admin</h1>
        </div>
        <p className="text-sm text-gray-500 mb-4">Introduz a palavra-passe para gerir os áudios das lições.</p>
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && value) onUnlock(value); }}
          placeholder="Palavra-passe"
          className="w-full border rounded-lg px-3 py-2 mb-3 outline-none focus:border-black"
        />
        <button
          onClick={() => value && onUnlock(value)}
          className="w-full bg-black text-white rounded-lg py-2 font-medium"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}

function downloadBlobUrl(url, filename) {
  fetch(url)
    .then((r) => r.blob())
    .then((blob) => {
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objUrl);
    })
    .catch(() => { /* noop */ });
}

function AudioRow({ item, passphrase, savedUrl, onSaved }) {
  const [status, setStatus] = useState("idle"); // idle | generating | saving | error
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function preview() {
    setStatus("generating");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Passphrase": passphrase },
        body: JSON.stringify({ text: item.text, voiceRole: item.voiceRole }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "erro");
      }
      const blob = await res.blob();
      setPreviewUrl(URL.createObjectURL(blob));
      setStatus("idle");
    } catch (e) {
      setErrorMsg(String(e.message || e));
      setStatus("error");
    }
  }

  async function saveToLesson() {
    setStatus("saving");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Passphrase": passphrase },
        body: JSON.stringify({ key: item.key, text: item.text, voiceRole: item.voiceRole }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "erro");
      }
      const data = await res.json();
      onSaved(item.key, data.url);
      setStatus("idle");
    } catch (e) {
      setErrorMsg(String(e.message || e));
      setStatus("error");
    }
  }

  const roleColor = ROLE_COLORS[item.voiceRole] || "#8A8F98";

  return (
    <div className="border rounded-xl p-3 flex flex-col gap-2" style={{ borderColor: "#EAEAE7" }}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: `${roleColor}22`, color: roleColor }}>
              {ROLE_LABELS[item.voiceRole] || item.voiceRole}
            </span>
            <span className="text-[10px] font-mono text-gray-400">{item.key}</span>
          </div>
          <p className="text-sm font-medium truncate">{item.text}</p>
        </div>
        {savedUrl && (
          <span className="flex-shrink-0 inline-flex items-center gap-1 text-[10px] font-mono text-green-600">
            <Check size={12} /> guardado
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={preview}
          disabled={status === "generating"}
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium disabled:opacity-50"
          style={{ borderColor: "#D8D8D4" }}
        >
          {status === "generating" ? <Loader2 size={13} className="animate-spin" /> : <Volume2 size={13} />}
          Pré-visualizar
        </button>
        <button
          onClick={saveToLesson}
          disabled={status === "saving"}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
          style={{ background: "#102A3C" }}
        >
          {status === "saving" ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
          {savedUrl ? "Regenerar e guardar" : "Gerar e guardar"}
        </button>
        {(previewUrl || savedUrl) && (
          <button
            onClick={() => downloadBlobUrl(previewUrl || savedUrl, `${item.key}.mp3`)}
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium"
            style={{ borderColor: "#D8D8D4" }}
          >
            <Download size={13} /> Baixar
          </button>
        )}
      </div>

      {previewUrl && <audio controls src={previewUrl} className="w-full h-8" />}
      {errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}
    </div>
  );
}

export default function AdminPanel() {
  const { passphrase, unlocked, tryUnlock, lock } = useAdminAuth();
  const [manifest, setManifest] = useState({});
  const [filterLesson, setFilterLesson] = useState("all");
  const items = useMemo(() => getAllAudioItems(), []);

  useEffect(() => {
    fetch("/api/manifest").then((r) => r.json()).then(setManifest).catch(() => {});
  }, []);

  function handleSaved(key, url) {
    setManifest((m) => ({ ...m, [key]: url }));
  }

  if (!unlocked) return <PassphraseGate onUnlock={tryUnlock} />;

  const lessonIds = [...new Set(items.map((i) => i.lessonId))];
  const filtered = filterLesson === "all" ? items : items.filter((i) => i.lessonId === Number(filterLesson));
  const savedCount = items.filter((i) => manifest[i.key]).length;

  return (
    <div className="min-h-screen bg-[#F7F7F5] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-bold text-2xl">Painel Admin · Áudios</h1>
          <button onClick={lock} className="text-xs text-gray-500 underline">sair</button>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          {savedCount}/{items.length} frases já têm áudio gerado. Vozes geradas via ElevenLabs e guardadas
          diretamente nas lições — os alunos ouvem instantaneamente, sem esperar por geração.
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setFilterLesson("all")}
            className="rounded-full px-3 py-1.5 text-xs font-medium"
            style={{ background: filterLesson === "all" ? "#102A3C" : "#EEEEEC", color: filterLesson === "all" ? "#fff" : "#16181A" }}
          >
            Todas
          </button>
          {lessonIds.map((id) => (
            <button
              key={id}
              onClick={() => setFilterLesson(String(id))}
              className="rounded-full px-3 py-1.5 text-xs font-medium"
              style={{ background: filterLesson === String(id) ? "#102A3C" : "#EEEEEC", color: filterLesson === String(id) ? "#fff" : "#16181A" }}
            >
              Lição {id}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map((item) => (
            <AudioRow key={item.key} item={item} passphrase={passphrase} savedUrl={manifest[item.key]} onSaved={handleSaved} />
          ))}
        </div>
      </div>
    </div>
  );
}
