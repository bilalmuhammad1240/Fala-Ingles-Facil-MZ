// POST /api/admin/generate
// Body: { text, voiceRole } — header X-Admin-Passphrase required.
// Generates audio via ElevenLabs and returns it directly (audio/mpeg) for
// preview/download in the admin panel. Nothing is saved by this endpoint.

import { generateSpeech, checkAdminAuth, readJsonBody } from "../_lib/eleven.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }
  if (!checkAdminAuth(req)) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  try {
    const { text, voiceRole } = await readJsonBody(req);
    if (!text || !text.trim()) {
      res.status(400).json({ error: "empty_text" });
      return;
    }

    const audioBuffer = await generateSpeech(text, voiceRole || "narrator");
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(audioBuffer);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message, detail: err.detail });
  }
}
