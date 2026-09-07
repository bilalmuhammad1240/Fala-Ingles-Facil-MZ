// Vercel Serverless Function: POST /api/pronunciation
// Body: raw WAV bytes (16kHz mono PCM), header X-Reference-Text: encodeURIComponent(expected phrase)
// Requires env vars AZURE_SPEECH_KEY and AZURE_SPEECH_REGION (set in Vercel project settings).
// Returns Azure's raw JSON response (includes NBest[0].PronunciationAssessment scores) on success,
// or { error: "..." } with an appropriate status code if anything is missing or fails.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;
  if (!key || !region) {
    res.status(503).json({ error: "not_configured" });
    return;
  }

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const audioBuffer = Buffer.concat(chunks);
    if (!audioBuffer.length) {
      res.status(400).json({ error: "empty_audio" });
      return;
    }

    const referenceText = decodeURIComponent(req.headers["x-reference-text"] || "");
    const pronAssessmentParams = Buffer.from(
      JSON.stringify({
        ReferenceText: referenceText,
        GradingSystem: "HundredMark",
        Granularity: "Phoneme",
        Dimension: "Comprehensive",
      })
    ).toString("base64");

    const azureUrl = `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=detailed`;

    const azureRes = await fetch(azureUrl, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
        "Pronunciation-Assessment": pronAssessmentParams,
        Accept: "application/json",
      },
      body: audioBuffer,
    });

    if (!azureRes.ok) {
      const detail = await azureRes.text();
      res.status(502).json({ error: "azure_error", detail });
      return;
    }

    const data = await azureRes.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "server_error", detail: String(err) });
  }
}
