import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { topK, type EmbeddedVerse } from '../lib/retrieve.js';
import { buildSystemPrompt, type Mode } from '../lib/prompts.js';

const VALID_MODES: Mode[] = [
  'Pranayama Guru',
  'Gita Companion',
  'Sleep Guide',
  'Confidence Coach',
];

const EMBEDDING_MODEL = 'text-embedding-3-small';
const CHAT_MODEL = 'claude-sonnet-4-6';
const TOP_K = 3;
const MAX_HISTORY = 10;

// Load corpus once per cold start.
let corpus: EmbeddedVerse[] | null = null;
const loadCorpus = (): EmbeddedVerse[] => {
  if (corpus) return corpus;
  const path = resolve(process.cwd(), 'data/gita-embeddings.json');
  const raw = readFileSync(path, 'utf-8');
  corpus = JSON.parse(raw) as EmbeddedVerse[];
  return corpus;
};

type ChatMessage = { role: 'user' | 'assistant'; content: string };
type RequestBody = { mode: Mode; messages: ChatMessage[] };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS — open while developing. Lock to your app's origin before launch.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const { mode, messages } = (req.body ?? {}) as RequestBody;

  if (!VALID_MODES.includes(mode)) return res.status(400).json({ error: 'invalid mode' });
  if (!Array.isArray(messages) || messages.length === 0)
    return res.status(400).json({ error: 'messages required' });

  const lastUser = [...messages].reverse().find(m => m.role === 'user');
  if (!lastUser) return res.status(400).json({ error: 'no user message' });

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    // 1. Embed the latest user query.
    const emb = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: lastUser.content,
    });
    const queryEmbedding = emb.data[0].embedding;

    // 2. Retrieve top-K verses. Only feed retrieval to Gita-style modes; other
    //    companions can still benefit from verses but with a lower threshold.
    const retrieved = topK(queryEmbedding, loadCorpus(), TOP_K);
    // text-embedding-3-small typically scores 0.15–0.4 for relevant matches.
    // Gita Companion gets the lowest floor so it cites generously.
    const SCORE_FLOOR = mode === 'Gita Companion' ? 0.15 : 0.18;
    const relevant = retrieved.filter(r => r.score >= SCORE_FLOOR).map(r => r.verse);

    // 3. Build the prompt.
    const system = buildSystemPrompt(mode, relevant);

    // 4. Call Claude with rolling history.
    const trimmed = messages.slice(-MAX_HISTORY);
    const completion = await anthropic.messages.create({
      model: CHAT_MODEL,
      max_tokens: 400,
      system,
      messages: trimmed.map(m => ({ role: m.role, content: m.content })),
    });

    const text = completion.content
      .filter(block => block.type === 'text')
      .map(block => (block as { type: 'text'; text: string }).text)
      .join('\n')
      .trim();

    return res.status(200).json({
      content: text,
      citations: relevant.map(v => ({ ref: v.ref, english: v.english })),
      retrieval: retrieved.map(r => ({ ref: r.verse.ref, score: r.score })),
    });
  } catch (err: any) {
    console.error('chat handler error', err);
    return res.status(500).json({
      error: err?.message ?? 'internal error',
    });
  }
}
