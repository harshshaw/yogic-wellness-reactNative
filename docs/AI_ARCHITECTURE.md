# AI Architecture — YogicWellness

How the AI Companion is wired, from phone tap to Claude reply.

---

## 1. TL;DR

```
┌──────────────────┐      HTTPS         ┌────────────────────────┐
│  Expo App        │  ───POST chat──▶   │  Vercel Serverless     │
│  (React Native)  │  ◀──JSON reply──   │  (Node 22, ESM)        │
└──────────────────┘                    └────────┬───────────────┘
                                                 │
                                  ┌──────────────┼──────────────────┐
                                  │              │                  │
                                  ▼              ▼                  ▼
                         ┌───────────────┐  ┌─────────────┐  ┌──────────────┐
                         │  OpenAI       │  │  Anthropic  │  │  Local JSON  │
                         │  embeddings   │  │  Claude 4.6 │  │  corpus      │
                         │  (3-small)    │  │  Sonnet     │  │  (Gita 20×)  │
                         └───────────────┘  └─────────────┘  └──────────────┘
```

- **Client** never holds API keys. Only knows the public Vercel URL.
- **Server** is a single serverless function — stateless, cold-startable in ~300ms.
- **Retrieval** is in-memory cosine similarity over a JSON file. No DB.
- **Generation** is Claude Sonnet 4.6 with a per-companion system prompt.

---

## 2. Components

### Client (`/`)

| File | Role |
| --- | --- |
| [components/AICompanionScreen.tsx](../components/AICompanionScreen.tsx) | Chat UI. Renders modes, holds local message state, calls API on submit. |
| [lib/aiCompanion.ts](../lib/aiCompanion.ts) | Single typed `fetch` wrapper. Knows the Vercel URL. |
| [components/AppNavigator.tsx](../components/AppNavigator.tsx) | Registers `AICompanion` as a modal stack screen accessible from anywhere. |

### Server (`/server`)

| File | Role |
| --- | --- |
| [server/api/chat.ts](../server/api/chat.ts) | The HTTP handler. Orchestrates embed → retrieve → Claude. |
| [server/lib/retrieve.ts](../server/lib/retrieve.ts) | Cosine similarity + top-K selection. ~10 lines of math. |
| [server/lib/prompts.ts](../server/lib/prompts.ts) | Per-companion system prompts + guardrails. |
| [server/data/gita.json](../server/data/gita.json) | The raw corpus — 20 verses with Sanskrit, English, themes. |
| [server/data/gita-embeddings.json](../server/data/gita-embeddings.json) | Build artifact — same verses + 1536-dim vectors. ~600 KB. |
| [server/scripts/embed.ts](../server/scripts/embed.ts) | One-time job to vectorize the corpus. Run on corpus change. |

---

## 3. Request lifecycle

1. **User taps "Pranayama Guru"** on Breathe screen.
2. `AICompanionScreen` mounts in modal-mode with `mode = 'Pranayama Guru'`.
3. User types *"I'm anxious"* → `sendToCompanion()` POSTs to `/api/chat`:

   ```json
   {
     "mode": "Pranayama Guru",
     "messages": [
       { "role": "assistant", "content": "Take one slow breath with me..." },
       { "role": "user", "content": "I'm anxious" }
     ]
   }
   ```

4. **Vercel cold start (if needed):** Node 22 loads `chat.js` and the 600 KB embeddings file is read into memory once and cached for the life of the function instance.
5. **Embed query:** OpenAI `text-embedding-3-small` returns a 1536-dim vector. ~80 ms.
6. **Retrieve:** Brute-force cosine vs all 20 verses → top-3 by score. <1 ms.
7. **Filter:** Anything below the score floor (0.15 for Gita, 0.18 for others) gets dropped.
8. **Build prompt:** Guardrails + companion persona + retrieved verses block. ~600 tokens.
9. **Call Claude:** Sonnet 4.6, max 400 output tokens, with rolling history (last 10 turns).
10. **Return:**

    ```json
    {
      "content": "Let's slow it down. Three rounds of 4-7-8 — inhale four, hold seven, exhale eight. I'll wait with you.",
      "citations": [
        { "ref": "BG 6.35", "english": "Without doubt, the mind is restless..." }
      ],
      "retrieval": [
        { "ref": "BG 6.35", "score": 0.31 },
        { "ref": "BG 2.66", "score": 0.22 }
      ]
    }
    ```

11. **Client** renders bubble + citations underneath.

---

## 4. The RAG pipeline in detail

### Build-time (run once per corpus change)

```
gita.json  ──┐
             │
             ▼
       toIndexableText(v)             ← english + context + themes + topic
             │
             ▼
   OpenAI embeddings.create()         ← batched, 1 API call
             │
             ▼
   gita-embeddings.json               ← {ref, english, ..., embedding: [1536 floats]}
```

`toIndexableText` is the most important function nobody thinks about. It controls *what* the embedding represents. We deliberately exclude Sanskrit/transliteration from indexing (they'd dilute semantic signal) and include `themes` (rich keyword signal).

### Request-time

```
user.content
     │
     ▼
embeddings.create()                   ← 1 vector for query
     │
     ▼
for v in corpus:                      ← brute-force, fine for ≤10K verses
    score = cosine(query, v.embedding)
     │
     ▼
sort desc, take top 3
     │
     ▼
filter by SCORE_FLOOR                 ← drops irrelevant matches; Claude works fine with 0 context if nothing fits
     │
     ▼
relevant verses → buildSystemPrompt()
```

### Why no vector DB

| Decision | Reasoning |
| --- | --- |
| **In-memory** | 20 verses × 1536 dims = ~30K floats. Sub-millisecond brute force. |
| **JSON file** | One artifact, deployed with the function. Zero infrastructure. |
| **No re-embed at request time** | Embeddings are pre-computed, query is the only thing we embed live. |

**Break-even:** Brute force in-memory is faster than a DB call until you hit ~10,000 vectors. We're at 20.

### Score thresholds

OpenAI `text-embedding-3-small` produces scores in a narrower range than older models. Typical:

| Match quality | Cosine score |
| --- | --- |
| Verbatim quote | 0.6–1.0 |
| Highly relevant | 0.25–0.45 |
| Loosely related | 0.15–0.25 |
| Unrelated | <0.10 |

Floor of 0.15 means we'll show a verse if there's any meaningful overlap; Claude decides whether to actually use it. Erring on the side of including more.

---

## 5. Prompt structure

The system prompt has three parts, in this order:

```
┌──────────────────────────────────────────────┐
│ 1. BASE GUARDRAILS                           │  ← same for every mode
│    - Keep replies short.                     │
│    - Not a therapist. Escalate crisis.       │
│    - No impersonation claims.                │
├──────────────────────────────────────────────┤
│ 2. MODE PERSONA                              │  ← Pranayama / Gita / Sleep / Coach
│    - Voice and posture for this companion.   │
│    - Specific techniques to recommend.       │
├──────────────────────────────────────────────┤
│ 3. RETRIEVED CONTEXT (optional)              │  ← top-K verses, only if score ≥ floor
│    - "Use a verse only if it genuinely fits  │
│       the user's situation."                 │
└──────────────────────────────────────────────┘
```

The retrieved block is conditional. If nothing crosses the score floor, Claude responds in pure persona — which is fine for non-Gita modes especially.

---

## 6. Data model

### Verse shape ([server/data/gita.json](../server/data/gita.json))

```ts
type Verse = {
  ref: string;                // "BG 2.47"
  topic: string;              // "karma-yoga"
  sanskrit: string;           // for display only — never embedded
  transliteration: string;    // for display only
  english: string;            // translation — embedded
  context: string;            // 1-2 sentence gloss — embedded (high signal)
  themes: string[];           // ["effort vs outcome", "perfectionism"] — embedded as joined string
};
```

### Embedded verse (build artifact)

```ts
type EmbeddedVerse = Verse & {
  embedding: number[];        // 1536 floats
};
```

The embedding is added by `embed.ts` and never modified at runtime.

### API contract

```ts
// POST /api/chat
type RequestBody = {
  mode: 'Pranayama Guru' | 'Gita Companion' | 'Sleep Guide' | 'Confidence Coach';
  messages: { role: 'user' | 'assistant'; content: string }[];
};

type ResponseBody = {
  content: string;                                        // Claude's text reply
  citations: { ref: string; english: string }[];          // verses Claude was given
  retrieval: { ref: string; score: number }[];            // top-K with scores (debug)
};
```

---

## 7. Configuration & secrets

| Where | What | Why there |
| --- | --- | --- |
| `server/.env` (local) | `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` | Used by `embed.ts` and local dev. Gitignored. |
| Vercel env vars (prod) | Same two keys | Injected into the function at runtime. |
| `lib/aiCompanion.ts:6` | Vercel URL | Hardcoded with `EXPO_PUBLIC_AI_API_URL` env override path. |

**Why this split:** the client must never hold model API keys. The backend exists primarily to be the trusted holder of those keys. Everything else (retrieval, prompting) could theoretically live elsewhere, but co-locating it with the key holder is the simplest deploy.

---

## 8. Failure modes

| Failure | What happens | User sees |
| --- | --- | --- |
| Network unreachable | `fetch` rejects | "I couldn't reach the companion just now…" |
| 5xx from server | Caught in `sendToCompanion` | Same fallback bubble |
| Anthropic over quota | 400 with `invalid_request_error` | Same fallback bubble (logs reveal cause) |
| OpenAI over quota | 429 from embedding call | Same fallback bubble |
| Corrupt embedding file | `JSON.parse` throws on cold start | Function fails, returns 500 |
| Empty retrieval (no verse passes floor) | Claude responds in pure persona | Reply with `citations: []` |
| Bad mode in request | Server returns 400 | Fallback bubble |

The single fallback message is intentional — non-judgmental, in voice, doesn't betray the underlying technology.

---

## 9. Cost model

Per chat turn (with retrieval):

| Component | Cost |
| --- | --- |
| OpenAI embedding (1 query, ~30 tokens) | ~$0.000001 |
| Claude Sonnet 4.6 input (~1.5K tokens) | ~$0.0045 |
| Claude Sonnet 4.6 output (~150 tokens) | ~$0.00225 |
| Vercel invocation | Free (within free tier) |
| **Total per turn** | **~$0.007** |

A casual user (~20 turns/day): **$0.14/day**. A $5 Anthropic credit buys ~700 turns.

**Caching opportunity:** the system prompt + persona is ~400 tokens and never changes within a session. Enabling Anthropic prompt caching with `cache_control: { type: 'ephemeral' }` would drop input cost ~80% after the first turn. Not yet implemented.

---

## 10. Scaling decisions (when to revisit)

| Trigger | What changes |
| --- | --- |
| Corpus > 500 verses | Still in-memory, but switch to batched cosine (Float32Array math) |
| Corpus > 10,000 entries | Move to Cloudflare Vectorize or Supabase pgvector |
| > 100 RPS sustained | Add streaming (`anthropic.messages.stream`) so UI feels faster |
| Per-user memory needed | Add Supabase for session/journal storage; embed user notes into per-user namespaces |
| Multi-language | Add language detection at ingest, embed each language separately, retrieve in the user's language |
| Stricter latency | Add Anthropic prompt caching (5-min TTL); precompute embedding for common queries |

---

## 11. What's not built yet

- **Streaming responses.** Currently `await`s the full reply. ~2-4 sec wait. Switching to `stream: true` lets the bubble fill word-by-word. Roughly 50 lines of change.
- **Conversation persistence.** Each chat session starts fresh. Adding AsyncStorage or Supabase would let users return to a thread.
- **Tool use.** Claude could trigger app actions (e.g., "start a 4-7-8 session" → opens BreathingSession). This would use `anthropic.messages.create({ tools: [...] })`.
- **Crisis detection.** Currently relies on Claude's own training. A dedicated pre-classifier (small model or keyword check) before Claude could escalate self-harm signals more reliably.
- **Prompt caching.** Free 80% input-cost reduction; few lines of change.
- **Voice in/out.** Mic button is decorative. Adding ElevenLabs/OpenAI Whisper + TTS would close that loop.
- **Per-user content.** Right now everyone sees the same Gita corpus. Adding user-specific notes (journals, intentions, past breakthroughs) to retrieval would make replies dramatically more personal.

---

## 12. Sequence diagram

```
User       AICompanionScreen     /api/chat        OpenAI       Anthropic
 │                │                  │              │              │
 │─tap suggestion─▶                  │              │              │
 │                │─POST chat───────▶│              │              │
 │                │                  │              │              │
 │                │                  │─embed query─▶│              │
 │                │                  │◀──vector─────│              │
 │                │                  │              │              │
 │                │              [cosine top-K, in-memory]         │
 │                │              [buildSystemPrompt(mode, verses)] │
 │                │                  │              │              │
 │                │                  │─messages.create─────────────▶│
 │                │                  │◀──content────────────────────│
 │                │                  │              │              │
 │                │◀──{content,──────│              │              │
 │                │   citations}     │              │              │
 │                │                  │              │              │
 │◀─render bubble─│                  │              │              │
```
