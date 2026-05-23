# Saarthi RAG Backend

Vercel serverless function that powers the AI Companion in the mobile app.
RAG over Bhagavad Gita verses → Anthropic Claude.

## Stack

- **Hosting**: Vercel serverless (free tier covers ~100K requests/mo)
- **LLM**: Anthropic Claude Sonnet 4.6 (`claude-sonnet-4-6`)
- **Embeddings**: OpenAI `text-embedding-3-small`
- **Vector store**: in-memory cosine search over a JSON file (no DB)

## One-time setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env and add ANTHROPIC_API_KEY and OPENAI_API_KEY
npm run embed     # generates data/gita-embeddings.json
```

The `embed` step takes ~5 seconds and costs ~$0.0001 in OpenAI tokens.

## Local dev

```bash
npm run dev       # starts vercel dev on http://localhost:3000
```

Test:

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "Gita Companion",
    "messages": [
      { "role": "user", "content": "I missed my fitness goal again." }
    ]
  }'
```

## Deploy to Vercel

```bash
npm run deploy
```

First time, link to a Vercel project when prompted. Then in the Vercel dashboard:

1. **Settings → Environment Variables**
   - `ANTHROPIC_API_KEY`
   - `OPENAI_API_KEY`
2. **Settings → General**
   - Set **Root Directory** to `server` if deploying from the monorepo root

The deploy bundles `data/gita-embeddings.json` into the function automatically.

## API

### `POST /api/chat`

**Body:**

```json
{
  "mode": "Pranayama Guru" | "Gita Companion" | "Sleep Guide" | "Confidence Coach",
  "messages": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response:**

```json
{
  "content": "...",
  "citations": [
    { "ref": "BG 2.47", "english": "You have the right to..." }
  ],
  "retrieval": [
    { "ref": "BG 2.47", "score": 0.78 }
  ]
}
```

`citations` are the verses Claude was given. `retrieval` includes all top-K with scores (useful for tuning).

## Adding more corpus

1. Edit `data/gita.json` (or add new files — extend `embed.ts` to handle them).
2. `npm run embed` — regenerates the embeddings file.
3. Redeploy.

## Cost estimate

Per chat turn:
- Embedding: ~$0.00001 (1 query, ~50 tokens)
- Claude Sonnet 4.6: ~$0.003-0.01 (depends on history length and response size)

A user doing 20 turns/day costs roughly **$0.10 / user / day** at typical message lengths.
