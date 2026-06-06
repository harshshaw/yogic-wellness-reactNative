# Prompt — Generate an AI Architecture Document

Paste this into Claude / GPT / Gemini to regenerate (or adapt) the AI architecture doc.

The prompt has **three sections**:

1. **The template** — works for any RAG + LLM mobile app
2. **Project-specific fill-ins** — what you'd swap per project
3. **Style guidance** — what makes it useful instead of bloated

---

## 1. Template prompt (copy and paste this whole block)

> You are a senior staff engineer writing an internal architecture document for the AI part of a production mobile app.
>
> **Audience:** other engineers joining the team — they need to understand the system in under 15 minutes and make safe changes within their first week.
>
> **Format:** a single markdown file, ~1,500-2,500 words, with these 12 sections in this exact order:
>
> 1. **TL;DR** — one paragraph + one ASCII diagram showing client → server → AI providers + data store. Maximum 6 boxes.
> 2. **Components** — two tables (client files / server files) listing each file path and its single-sentence role. No more than 8 files per table.
> 3. **Request lifecycle** — 10-12 numbered steps from user tap to rendered reply. Include a concrete JSON request example mid-flow and a JSON response example at the end.
> 4. **The RAG pipeline in detail** — two sub-diagrams (build-time vs request-time), a `toIndexableText` design note (what gets embedded and why), a "why no vector DB" table with decision + reasoning, and a score-threshold semantics table mapping cosine ranges to match-quality buckets.
> 5. **Prompt structure** — an ASCII box showing the three layers (guardrails / persona / retrieved context) in their build order.
> 6. **Data model** — TypeScript types for the corpus shape, the embedded shape, and the API request/response contract. Include comments explaining which fields are embedded vs display-only.
> 7. **Configuration & secrets** — a 3-column table: Where / What / Why-there. One row per secret or env var.
> 8. **Failure modes** — a table mapping each failure (network, quota, 5xx, corrupt data, empty retrieval, bad input) to what the user sees. One row per failure. End with a sentence on the *deliberate* fallback voice.
> 9. **Cost model** — per-turn cost table (embedding / input tokens / output tokens / infra) summing to a single total. End with a one-day cost projection for a typical user and the equivalent "X turns per $5 of credit." Include a one-paragraph caching opportunity.
> 10. **Scaling decisions** — a 2-column table: Trigger → What changes. Cover corpus growth, request rate, per-user memory, multi-language, latency. Six rows.
> 11. **What's not built yet** — bullet list of 6-8 honest gaps. For each, a short sentence on what it'd take to add. Streaming, persistence, tool use, prompt caching, voice, per-user content are the typical entries.
> 12. **Sequence diagram** — vertical ASCII swim-lanes (User / Client screen / Server / Embedding provider / LLM). Show every hop including cache lookups and the in-memory retrieval step.
>
> **Style rules:**
>
> - Concrete over abstract. Refer to actual file paths (e.g., `lib/foo.ts:42`) using markdown links.
> - Tables instead of prose whenever you have ≥3 parallel items.
> - No headers below `###`. Three levels of hierarchy is the limit.
> - No emoji. No corporate hedging ("we should consider", "it might be worth"). Just decisions and the reasoning.
> - Each section earns its place — if a section would be under 60 words, fold it into a neighbor.
> - Include a "why" sentence for every non-obvious choice. Architecture without rationale ages badly.
> - The "What's not built yet" section is required. It's the highest-value section in 6 months.
>
> **What to avoid:**
>
> - Don't restate what the code already shows. Skip "the function takes a request object and returns a response."
> - Don't list every npm package. Mention only the ones whose *replacement would change the architecture*.
> - Don't speculate. If a number isn't measured, mark it ~ or say "estimated."
> - Don't include marketing language about the AI ("delivers a delightful experience").
>
> Now write the architecture document for the project described below.

---

## 2. Project-specific fill-ins

Below the template, paste a project summary like this. **This is the only part you change per project.**

```
PROJECT: YogicWellness — wellness mobile app with AI companion modes

CLIENT:
- React Native via Expo SDK 54
- Distributed through EAS Update + Expo Go
- 5 bottom tabs: Home, Breathe, Sleep, Progress, Profile
- AICompanionScreen is a modal accessible from any inner screen's sparkle icon

SERVER:
- Vercel serverless function (Node 22, ESM)
- Single endpoint: POST /api/chat
- Linked alias: https://karmana.vercel.app
- Source in /server, deploys from monorepo root via Vercel CLI

AI STACK:
- Embeddings: OpenAI text-embedding-3-small (1536 dim)
- LLM: Anthropic Claude Sonnet 4.6 (claude-sonnet-4-6)
- Vector store: in-memory cosine similarity over a JSON file
- Corpus: ~20 Bhagavad Gita verses, hand-curated, with Sanskrit + English + themes

COMPANION MODES (4):
- Pranayama Guru — breath coaching
- Gita Companion — Gita-inspired reflection (never impersonates a deity)
- Sleep Guide — bedtime support
- Confidence Coach — encouragement

KEY FILES:
- components/AICompanionScreen.tsx — chat UI
- lib/aiCompanion.ts — typed fetch wrapper, holds the API URL
- server/api/chat.ts — handler
- server/lib/retrieve.ts — cosine + top-K
- server/lib/prompts.ts — per-mode system prompts
- server/scripts/embed.ts — build-time vectorizer
- server/data/gita.json — raw corpus
- server/data/gita-embeddings.json — built artifact

CONSTRAINTS:
- API keys live only on the server. Client must never hold them.
- Free Vercel tier; ~100K requests/mo headroom.
- $5 Anthropic credit. Cost per turn matters.
- No real DB yet. Migration path to Cloudflare Vectorize is documented.
```

---

## 3. Style notes — what makes architecture docs useful vs useless

These aren't part of the prompt but explain the design choices baked into the template:

**Why 12 sections in fixed order:** the brain finds documents faster when they always look the same. Engineers grep for "Failure modes" or "Cost model" in three different docs and expect them to be in similar spots.

**Why TL;DR first, sequence diagram last:** readers skim top-to-bottom. The TL;DR has to work standalone (most people stop there). The sequence diagram is for the reader who wants to trace a specific bug end-to-end — by the time they reach it, they have the vocabulary.

**Why "What's not built yet" is required:** every architecture doc is a snapshot of decisions. The most valuable snapshot is the *frontier* — what's about to change. New engineers can immediately see the on-ramp ideas. Future-you will thank yourself for writing it down before you forgot.

**Why concrete file paths matter:** abstractions like "the embedding layer" decay. `server/lib/retrieve.ts` either still exists or doesn't — the doc is self-validating.

**Why no emoji:** they don't render in some PDFs, paste targets, or terminal previews. And they signal "decorative" when the doc should signal "load-bearing."

**Why include cost numbers:** an architecture decision without a cost is a wish. Forcing the writer to estimate makes the trade-offs honest.

**Why the failure modes table:** failure paths are the lowest-described, highest-debugged part of any system. Documenting them once saves an hour the first time a fallback fires in production.

---

## 4. Adapting to other architectures

Swap the project fill-in section. The template works for:

- **Streaming voice agent** — replace "embedding/LLM" with "STT/TTS/turn-detection," replace cosine with VAD logic, the lifecycle stays the same shape
- **Multi-agent orchestration** — section 4 becomes "the orchestrator pipeline" with agent handoffs; section 5 becomes per-agent prompts
- **Computer-use agent** — section 8 (failure modes) becomes the most important section; add a "sandbox boundary" subsection
- **Pure RAG search (no chat)** — drop the persona section; expand retrieval scoring and reranking

The skeleton — **TL;DR → components → lifecycle → core pipeline → prompts → data → secrets → failures → cost → scaling → gaps → sequence** — applies to any LLM-backed system.
