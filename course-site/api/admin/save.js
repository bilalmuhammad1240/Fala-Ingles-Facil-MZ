// POST /api/admin/save
// Body: { key, text, voiceRole } — header X-Admin-Passphrase required.
// Generates audio via ElevenLabs, stores it in Vercel Blob at audio/<key>.mp3,
// and updates the shared manifest.json (key -> public URL) that the live
// site reads at runtime. Returns { url, manifest }.

import { put, list } from "@vercel/blob";
import { generateSpeech, checkAdminAuth, readJsonBody } from "../_lib/eleven.js";

const MANIFEST_PATH = "manifest.json";

async function readManifest() {
  try {
    const { blobs } = await list({ prefix: MANIFEST_PATH, limit: 1 });
    if (!blobs.length) return {};
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    if (!res.ok) return {};
    return await res.json();
  } catch (e) {
    return {};
  }
}

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
    const { key, text, voiceRole } = await readJsonBody(req);
    if (!key || !text || !text.trim()) {
      res.status(400).json({ error: "missing_fields" });
      return;
    }

    const audioBuffer = await generateSpeech(text, voiceRole || "narrator");

    const blob = await put(`audio/${key}.mp3`, audioBuffer, {
      access: "public",
      contentType: "audio/mpeg",
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    const manifest = await readManifest();
    manifest[key] = blob.url;

    await put(MANIFEST_PATH, JSON.stringify(manifest), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    res.status(200).json({ url: blob.url, manifest });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message, detail: err.detail });
  }
}
