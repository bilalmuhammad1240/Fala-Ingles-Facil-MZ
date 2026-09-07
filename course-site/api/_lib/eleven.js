// Shared helpers used by the admin TTS endpoints.

export function resolveVoiceId(voiceRole) {
  if (voiceRole === "ana") return process.env.ELEVENLABS_VOICE_ANA;
  if (voiceRole === "carlos") return process.env.ELEVENLABS_VOICE_CARLOS;
  return process.env.ELEVENLABS_VOICE_NARRATOR;
}

export async function generateSpeech(text, voiceRole) {
  const voiceId = resolveVoiceId(voiceRole);
  if (!voiceId) {
    const err = new Error("unknown_voice");
    err.status = 400;
    throw err;
  }

  const elevenRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });

  if (!elevenRes.ok) {
    const detail = await elevenRes.text();
    const err = new Error("elevenlabs_error");
    err.status = 502;
    err.detail = detail;
    throw err;
  }

  return Buffer.from(await elevenRes.arrayBuffer());
}

export function checkAdminAuth(req) {
  const passphrase = req.headers["x-admin-passphrase"];
  return Boolean(process.env.ADMIN_PASSPHRASE) && passphrase === process.env.ADMIN_PASSPHRASE;
}

export async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf-8");
  return raw ? JSON.parse(raw) : {};
}
