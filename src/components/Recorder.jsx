import { useRef, useState } from "react";

export default function Recorder({ prompt, onRecorded }) {
  const [state, setState] = useState("idle");
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        setState("recorded");
        stream.getTracks().forEach((t) => t.stop());
        if (onRecorded) onRecorded();
      };
      recorder.start();
      mediaRef.current = recorder;
      setState("recording");
    } catch (err) {
      setState("error");
    }
  }

  function stopRecording() {
    mediaRef.current?.stop();
  }

  return (
    <div className="recorder">
      <p className="p-speech-target">"{prompt}"</p>
      <button
        type="button"
        className={`p-mic-btn ${state === "recording" ? "recording" : ""}`}
        onClick={state === "recording" ? stopRecording : startRecording}
      >
        {state === "recording" ? "⏹" : "🎙"}
      </button>
      <p className="p-speech-status">
        {state === "idle" && "Toca para começar a gravar"}
        {state === "recording" && "A gravar... toca para parar"}
        {state === "recorded" && "Gravação pronta — ouve-te abaixo"}
        {state === "error" && "Não foi possível aceder ao microfone. Verifica as permissões do navegador."}
      </p>
      {audioUrl && (
        <audio controls src={audioUrl} className="recorder-audio" />
      )}
    </div>
  );
}
