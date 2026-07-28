// Point this at your deployed Vercel URL.
// For local dev with an Expo Go client on the same network, use your machine's
// LAN IP, e.g. http://192.168.1.42:3000
//
// Set EXPO_PUBLIC_AI_API_URL in app.json -> extra, or use a .env file with
// expo-constants. Hard-coded here for simplicity.
export const AI_API_URL =
  process.env.EXPO_PUBLIC_AI_API_URL ??
  'https://karmana.vercel.app';

export type CompanionMode =
  | 'Gita Companion'
  | 'Sleep Guide'
  | 'Confidence Coach'
  | 'Relationship Guru';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

// Personalisation context sent with each chat so the AI knows who it's talking
// to and remembers past conversations.
export type UserContext = {
  name?: string;
  profile?: {
    age?: string;
    gender?: string;
    occupation?: string;
    goals?: string[];
    medicalConditions?: string;
  };
  reflection?: { mood?: string; energy?: string; sleep?: string };
  memory?: string;
};

export type Citation = { ref: string; english: string };

export type ChatResponse = {
  content: string;
  citations: Citation[];
};

// Sends a recorded voice clip to the Whisper endpoint and returns the transcript.
// `uri` is the local file URI from expo-av; `format` is the file extension.
export async function transcribeAudio(
  base64: string,
  format = 'm4a'
): Promise<string> {
  const res = await fetch(`${AI_API_URL}/api/transcribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audio: base64, format }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Transcription failed (${res.status}): ${text}`);
  }

  const json = (await res.json()) as { text: string };
  return json.text ?? '';
}

export async function sendToCompanion(
  mode: CompanionMode,
  messages: ChatMessage[],
  context?: UserContext
): Promise<ChatResponse> {
  const res = await fetch(`${AI_API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode, messages, context }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`AI request failed (${res.status}): ${text}`);
  }

  const json = (await res.json()) as ChatResponse;
  return json;
}

// Distils an updated memory summary from the prior summary + latest turns.
// Called at the end of a session; the result is persisted via companionMemory.
export async function distillMemory(
  previousSummary: string,
  messages: ChatMessage[]
): Promise<string> {
  const res = await fetch(`${AI_API_URL}/api/distill`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ previousSummary, messages }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Distill request failed (${res.status}): ${text}`);
  }
  const json = (await res.json()) as { summary: string };
  return json.summary ?? '';
}
