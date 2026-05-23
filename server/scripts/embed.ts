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
  sanskrit: string;
  transliteration: string;
  english: string;
  context: string;
  themes: string[];
};

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

  const raw = await readFile(resolve(ROOT, 'data/gita.json'), 'utf-8');
  const verses: Verse[] = JSON.parse(raw);

  console.log(`Embedding ${verses.length} verses with ${EMBEDDING_MODEL}...`);

  const texts = verses.map(toIndexableText);
  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });

  const embedded: EmbeddedVerse[] = verses.map((v, i) => ({
    ...v,
    embedding: response.data[i].embedding,
  }));

  const outPath = resolve(ROOT, 'data/gita-embeddings.json');
  await writeFile(outPath, JSON.stringify(embedded), 'utf-8');

  console.log(`Wrote ${embedded.length} embeddings to ${outPath}`);
  console.log(`Total tokens used: ${response.usage.total_tokens}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
