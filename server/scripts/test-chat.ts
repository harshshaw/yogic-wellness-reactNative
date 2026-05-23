import 'dotenv/config';
import handler from '../api/chat.js';

const mode = (process.argv[2] as any) ?? 'Gita Companion';
const userText =
  process.argv.slice(3).join(' ') || 'I missed my fitness goal again.';

const req = {
  method: 'POST',
  body: {
    mode,
    messages: [{ role: 'user', content: userText }],
  },
} as any;

const res = {
  status(code: number) {
    this._status = code;
    return this;
  },
  json(data: unknown) {
    console.log(`\n— status ${this._status ?? 200} —\n`);
    console.log(JSON.stringify(data, null, 2));
    return this;
  },
  setHeader() {
    return this;
  },
  end() {
    return this;
  },
  _status: 200,
} as any;

console.log(`Mode:  ${mode}`);
console.log(`Query: "${userText}"\n`);
console.log('Calling handler…');

handler(req, res).catch(err => {
  console.error('Handler threw:', err);
  process.exit(1);
});
