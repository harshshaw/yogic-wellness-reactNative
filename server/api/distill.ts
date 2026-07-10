import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

// Distils a rolling "what I know about this user" memory from the previous
// summary plus the latest conversation turns. Returns a compact summary the app
// stores back in Postgres and injects into future system prompts. Keeping a
// summary (rather than resending whole transcripts) bounds token cost.

const MODEL = 'claude-opus-4-8';

type Turn = { role: 'user' | 'assistant'; content: string };
type RequestBody = { previousSummary?: string; messages?: Turn[] };

const SYSTEM = `You maintain a private memory profile of a user of a wellness app, for their AI companion.
Given the existing memory and the latest conversation, produce an UPDATED memory summary.
Rules:
- Write in third person about the user ("They are...", "They mentioned...").
- Keep it under 200 words. Merge new facts into the old summary; drop nothing important, but don't repeat.
- Capture: their name if known, life situation, recurring themes and worries, relationships mentioned, goals, what seems to help them, and sensitivities to be gentle about.
- Do NOT include the assistant's advice or generic pleasantries — only durable facts about the user.
- Output ONLY the summary text, no preamble, no headings.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const { previousSummary, messages } = (req.body ?? {}) as RequestBody;
  if (!Array.isArray(messages) || messages.length === 0)
    return res.status(400).json({ error: 'messages required' });

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const transcript = messages
      .map(m => `${m.role === 'user' ? 'User' : 'Companion'}: ${m.content}`)
      .join('\n');

    const userMsg =
      `Existing memory (may be empty):\n${previousSummary?.trim() || '(none yet)'}\n\n` +
      `Latest conversation:\n${transcript}\n\n` +
      `Return the updated memory summary.`;

    const completion = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 400,
      system: SYSTEM,
      messages: [{ role: 'user', content: userMsg }],
    });

    const summary = completion.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map(b => b.text)
      .join('')
      .trim();

    return res.status(200).json({ summary });
  } catch (err: any) {
    console.error('distill handler error', err);
    return res.status(500).json({ error: err?.message ?? 'internal error' });
  }
}
