// GET /api/manifest
// Public, read-only. Returns the key -> audio URL map that the site uses
// to play pre-generated ElevenLabs audio instead of on-the-fly synthesis.

import { list } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    const { blobs } = await list({ prefix: "manifest.json", limit: 1 });
    if (!blobs.length) {
      res.setHeader("Cache-Control", "public, max-age=30");
      res.status(200).json({});
      return;
    }
    const r = await fetch(blobs[0].url, { cache: "no-store" });
    const data = r.ok ? await r.json() : {};
    res.setHeader("Cache-Control", "public, max-age=30");
    res.status(200).json(data);
  } catch (e) {
    res.status(200).json({});
  }
}
