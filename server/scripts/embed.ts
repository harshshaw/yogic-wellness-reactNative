import OpenAI from 'openai';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

type Verse = {
  ref: string;
  topic: string;
  sanskrit?: string;
  transliteration?: string;
  english: string;
  context: string;
  themes: string[];
};

// Input/output default to the Gita corpus, but any knowledge base with the
// same schema can be embedded by passing file paths:
//   tsx scripts/embed.ts data/relationship.json data/relationship-embeddings.json
const INPUT_FILE = process.argv[2] ?? 'data/gita.json';
const OUTPUT_FILE = process.argv[3] ?? 'data/gita-embeddings.json';

type EmbeddedVerse = Verse & { embedding: number[] };

const EMBEDDING_MODEL = 'text-embedding-3-small';

const toIndexableText = (v: Verse): string =>
  [
    v.english,
    v.context,
    `Themes: ${v.themes.join(', ')}.`,
    `Topic: ${v.topic}.`,
  ].join(' ');

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('Missing OPENAI_API_KEY in .env');
    process.exit(1);
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const raw = await readFile(resolve(ROOT, INPUT_FILE), 'utf-8');
  const verses: Verse[] = JSON.parse(raw);

  console.log(`Embedding ${verses.length} entries from ${INPUT_FILE} with ${EMBEDDING_MODEL}...`);

  const texts = verses.map(toIndexableText);
  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });

  const embedded: EmbeddedVerse[] = verses.map((v, i) => ({
    ...v,
    embedding: response.data[i].embedding,
  }));

  const outPath = resolve(ROOT, OUTPUT_FILE);
  await writeFile(outPath, JSON.stringify(embedded), 'utf-8');

  console.log(`Wrote ${embedded.length} embeddings to ${outPath}`);
  console.log(`Total tokens used: ${response.usage.total_tokens}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
