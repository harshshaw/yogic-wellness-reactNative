import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI, { toFile } from 'openai';

// Whisper transcription endpoint.
// The app records a short voice clip, base64-encodes it, and POSTs it here.
// We decode it back to a buffer and hand it to OpenAI's whisper model.
const TRANSCRIBE_MODEL = 'whisper-1';

type RequestBody = {
  // base64-encoded audio (no data: prefix)
  audio: string;
  // file extension hint, e.g. 'm4a' | 'mp4' | 'wav'
  format?: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const { audio, format } = (req.body ?? {}) as RequestBody;
  if (!audio || typeof audio !== 'string') {
    return res.status(400).json({ error: 'audio (base64) required' });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const buffer = Buffer.from(audio, 'base64');
    const ext = (format ?? 'm4a').replace(/[^a-z0-9]/gi, '') || 'm4a';
    const file = await toFile(buffer, `voice.${ext}`);

    const result = await openai.audio.transcriptions.create({
      model: TRANSCRIBE_MODEL,
      file,
    });

    return res.status(200).json({ text: (result.text ?? '').trim() });
  } catch (err: any) {
    console.error('transcribe handler error', err);
    return res.status(500).json({ error: err?.message ?? 'internal error' });
  }
}
