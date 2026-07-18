// The "Foundations" course — four sequential guided-audio modules that teach
// the basics of meditation. Real narration lives in assets/meditation-audio/.

export type FoundationModule = {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  durationSec: number;   // actual audio length, keeps the timer in sync
  audio: ReturnType<typeof require>;
};

export const FOUNDATIONS: FoundationModule[] = [
  {
    id: 'getting-started',
    order: 1,
    title: 'Getting Started',
    subtitle: 'How to sit, hands, eyes, and what meditation really is',
    durationSec: 167,
    audio: require('../assets/meditation-audio/gettingStartedFoundation.mp3'),
  },
  {
    id: 'breath-awareness',
    order: 2,
    title: 'Breath Awareness',
    subtitle: 'Feel your natural breath, without controlling it',
    durationSec: 80,
    audio: require('../assets/meditation-audio/breatheAwareness.mp3'),
  },
  {
    id: 'body-relaxation',
    order: 3,
    title: 'Body Relaxation',
    subtitle: 'Soften the face, jaw, shoulders and body',
    durationSec: 82,
    audio: require('../assets/meditation-audio/bodyRelaxation.mp3'),
  },
  {
    id: 'basic-body-scan',
    order: 4,
    title: 'Basic Body Scan',
    subtitle: 'Move attention slowly from head to feet',
    durationSec: 77,
    audio: require('../assets/meditation-audio/bodyScan.mp3'),
  },
  {
    id: 'level-1',
    order: 5,
    title: 'Level 1 Meditation',
    subtitle: 'Your first full guided meditation',
    durationSec: 546,
    audio: require('../assets/meditation-audio/mediation-1.mp3'),
  },
];
