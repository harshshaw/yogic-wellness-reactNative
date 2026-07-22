# Karmana — Monthly Cost Estimate at 10,000 Users

**Prepared:** 2026-07-22
**Status:** Modeled estimate, not a quote. Read the Assumptions section first — the
total moves far more on those than on any pricing detail.

## TL;DR

**~$2,700–2,950/month**, of which **~90% is the AI companion (LLM API), not GCP.**
Infrastructure is roughly $80–125/month. Optimizing Cloud Run here would be
rearranging deck chairs; the model tier on the companion is the decision that
matters.

---

## Assumptions

These drive everything below. They are estimates, not measurements — argue with
these rather than with the arithmetic.

| Assumption | Value | Why it matters |
|---|---|---|
| Registered users | 10,000 | The stated scenario |
| Daily active users | 30% → 3,000 | Drives backend request volume |
| API calls per active user per day | ~30 | → ~2.7M backend requests/month |
| Share of DAU using the AI companion | 20% → 600/day | **The single most sensitive input** |
| Companion messages per user per day | ~8 | → ~144,000 chat messages/month |
| Input tokens per companion message | ~2,000 | System prompt + history + retrieved context |
| Output tokens per companion message | ~300 | `max_tokens` is capped at 400 in `server/api/chat.ts` |
| Voice transcription | ~2 min/day per companion user | → ~36,000 min/month |
| Region | `europe-west1` (Belgium) | Matches the deployment target |

---

## Cost Breakdown

| Component | Monthly | Basis |
|---|---:|---|
| **Claude Opus 4.8** — companion chat | **$2,400–2,600** | 288M input tokens @ $5/M + 43M output @ $25/M |
| **Whisper** — voice transcription | ~$220 | $0.006/min × ~36,000 min |
| **OpenAI embeddings** | ~$5 | `text-embedding-3-small`, effectively free at this volume |
| **Cloud Run** — Spring Boot backend | $35–70 | Dominated by `--min-instances=1`, not request count |
| **Cloud SQL** — Postgres | $35–50 | `db-f1-micro` is undersized at 10k users; budget `db-g1-small`+ |
| Egress, Artifact Registry, Secret Manager | ~$5 | Audio/video ship in the app bundle, so egress stays JSON-sized |
| **Total** | **~$2,700–2,950** | |

### Where the money goes

```
AI companion (Opus + Whisper + embeddings)   ~$2,650   ~90%
GCP infrastructure (Cloud Run + Cloud SQL)     ~$105   ~10%
```

---

## Cost Levers, Highest Impact First

### 1. Model choice on the companion — up to 5× savings

`server/api/chat.ts` currently uses `claude-opus-4-8`, the top-tier model.
Same traffic on a smaller model:

| Model | Input $/M | Output $/M | Est. monthly | vs. Opus |
|---|---:|---:|---:|---|
| Claude Opus 4.8 (current) | $5.00 | $25.00 | ~$2,500 | — |
| Claude Sonnet 5 | $3.00 ($2.00 intro¹) | $15.00 ($10.00 intro¹) | ~$1,500 | −40% |
| Claude Haiku 4.5 | $1.00 | $5.00 | ~$500 | **−80%** |

¹ Introductory Sonnet 5 pricing runs through 2026-08-31.

For a wellness chat companion, Haiku or Sonnet is very likely sufficient.
**Recommendation:** A/B the companion on Haiku 4.5 against Opus before committing
to Opus rates on every message. This is by far the largest single lever.

### 2. Prompt caching — several hundred $/month

Every companion call re-sends a system prompt plus retrieved context. Cached
input bills at ~0.1× the normal rate. If even half of the ~2,000 input tokens
per message are a stable prefix, adding a `cache_control` marker recovers a
meaningful fraction of the input cost for a one-line change.

Caching is a **prefix match** — the cacheable portion must be byte-identical and
must come *before* the volatile per-message content in the prompt.

### 3. `--min-instances=0` on Cloud Run — ~$25/month

Saves most of the Cloud Run line, at the cost of ~10s Spring Boot cold starts on
the first request after idle. **Decide this on user experience, not cost** — the
savings are noise next to the LLM bill.

---

## Sensitivity

The estimate is driven almost entirely by **companion engagement**, assumed here
at 20% of DAU:

| Companion usage | LLM cost | Total monthly |
|---|---:|---:|
| 5% of DAU | ~$650 | ~$800 |
| **20% of DAU (baseline)** | **~$2,650** | **~$2,750** |
| 50% of DAU | ~$6,600 | ~$6,700 |

**Action:** instrument messages-per-user before committing to a model tier. That
single number determines the bill far more than anything about GCP.

Backend request volume, by contrast, barely matters — Cloud Run at 2.7M requests
costs about $1 in per-request charges. The infrastructure cost is essentially a
fixed floor (one always-on database, one warm container), not a variable one.

---

## Caveats

- **The Cloud Run figure is a modeled range, not a quote.** Idle-instance CPU
  billing for `--min-instances=1` is the least certain line item. Worth
  confirming in Google's pricing calculator — though at ~2% of the total it
  won't change any decision here.
- **Cloud SQL sizing is a judgement call.** `db-f1-micro` (~$10/mo) is what the
  deployment runbook provisions and is fine for launch, but will not comfortably
  serve 10k users. The estimate assumes an upgrade to `db-g1-small` or similar.
- **No CDN or media hosting is included.** Audio and video currently ship inside
  the app bundle. If media ever moves to Cloud Storage, egress becomes a new and
  potentially large line item that this estimate does not cover.
- **No Whisper/OpenAI volume discounts** are assumed.
- Excludes: Apple/Google app store fees, domain and email, monitoring/logging
  beyond free tiers, and any staging environment.

---

## Related

- `backend/GCP_DEPLOYMENT.md` — the Cloud Run + Cloud SQL deployment runbook
- `server/api/chat.ts` — companion chat implementation (model selection lives here)
- `server/api/transcribe.ts` — Whisper transcription
