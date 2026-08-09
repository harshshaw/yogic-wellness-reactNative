import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { topK, type EmbeddedVerse } from '../lib/retrieve.js';
import { buildSystemPrompt, type Mode, type UserContext } from '../lib/prompts.js';

const VALID_MODES: Mode[] = [
  'Pranayama Guru',
  'Gita Companion',
  'Sleep Guide',
  'Confidence Coach',
  'Relationship Guru',
];

const EMBEDDING_MODEL = 'text-embedding-3-small';
// Chat completion runs on Claude via the Anthropic API.
const CHAT_MODEL = 'claude-opus-4-8';
const TOP_K = 3;
// How many recent turns of the *current* session to resend. Kept generous so
// the AI reliably recalls things said earlier in the same conversation;
// cross-session recall is handled separately by the distilled memory summary.
const MAX_HISTORY = 30;

// Each mode retrieves from its own knowledge base. Relationship Guru has a
// dedicated corpus; every other mode draws on the Gita corpus.
const CORPUS_FILES: Record<string, string> = {
  'Relationship Guru': 'data/relationship-embeddings.json',
  'Pranayama Guru': 'data/pranayama-embeddings.json',
  default: 'data/gita-embeddings.json',
};

// Load and cache each corpus once per cold start.
const corpusCache: Record<string, EmbeddedVerse[]> = {};
const loadCorpus = (mode: Mode): EmbeddedVerse[] => {
  const file = CORPUS_FILES[mode] ?? CORPUS_FILES.default;
  if (corpusCache[file]) return corpusCache[file];
  const raw = readFileSync(resolve(process.cwd(), file), 'utf-8');
  corpusCache[file] = JSON.parse(raw) as EmbeddedVerse[];
  return corpusCache[file];
};

type ChatMessage = { role: 'user' | 'assistant'; content: string };
type RequestBody = { mode: Mode; messages: ChatMessage[]; context?: UserContext };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS — open while developing. Lock to your app's origin before launch.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const { mode, messages, context } = (req.body ?? {}) as RequestBody;

  if (!VALID_MODES.includes(mode)) return res.status(400).json({ error: 'invalid mode' });
  if (!Array.isArray(messages) || messages.length === 0)
    return res.status(400).json({ error: 'messages required' });

  const lastUser = [...messages].reverse().find(m => m.role === 'user');
  if (!lastUser) return res.status(400).json({ error: 'no user message' });

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Chat completion runs on Claude.
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    // 1. Embed the latest user query (still via OpenAI — cheap, reliable).
    const emb = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: lastUser.content,
    });
    const queryEmbedding = emb.data[0].embedding;

    // 2. Retrieve top-K verses. Only feed retrieval to Gita-style modes; other
    //    companions can still benefit from verses but with a lower threshold.
    const retrieved = topK(queryEmbedding, loadCorpus(mode), TOP_K);
    // text-embedding-3-small typically scores 0.15–0.4 for relevant matches.
    // Gita Companion and Relationship Guru lean on their corpus, so they get a
    // lower floor to retrieve grounding more generously.
    const SCORE_FLOOR =
      mode === 'Gita Companion' || mode === 'Relationship Guru' || mode === 'Pranayama Guru'
        ? 0.15
        : 0.18;
    const relevant = retrieved.filter(r => r.score >= SCORE_FLOOR).map(r => r.verse);

    // 3. Build the prompt, personalised with the user context if provided.
    const system = buildSystemPrompt(mode, relevant, context);

    // 4. Call Claude with rolling history. The Messages API takes the system
    //    prompt as a top-level field; the array holds only user/assistant turns.
    const trimmed = messages.slice(-MAX_HISTORY);
    const completion = await anthropic.messages.create({
      model: CHAT_MODEL,
      max_tokens: 400,
      system,
      messages: trimmed.map(m => ({ role: m.role, content: m.content })),
    });

    const text = completion.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map(b => b.text)
      .join('')
      .trim();
    const usedModel = completion.model ?? CHAT_MODEL;

    return res.status(200).json({
      content: text,
      citations: relevant.map(v => ({ ref: v.ref, english: v.english })),
      retrieval: retrieved.map(r => ({ ref: r.verse.ref, score: r.score })),
      model: usedModel,
    });
  } catch (err: any) {
    console.error('chat handler error', err);
    return res.status(500).json({
      error: err?.message ?? 'internal error',
    });
  }
}
