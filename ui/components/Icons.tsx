import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

type Props = { size?: number; color?: string; strokeWidth?: number; filled?: boolean };

const stroke = (s = 22, w = 1.7) => ({
  width: s,
  height: s,
  viewBox: '0 0 24 24',
  fill: 'none',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  strokeWidth: w,
});

export const Sparkles = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z" stroke={color} />
    <Path d="M5 3v4M19 17v4M3 5h4M17 19h4" stroke={color} />
  </Svg>
);

export const Wind = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" stroke={color} />
    <Path d="M9.6 4.6A2 2 0 1 1 11 8H2" stroke={color} />
    <Path d="M12.6 19.4A2 2 0 1 0 14 16H2" stroke={color} />
  </Svg>
);

export const Moon = ({ size, color = '#fff', strokeWidth, filled }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      stroke={color}
      fill={filled ? color : 'none'}
    />
  </Svg>
);

export const Flame = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.4-2.4-1-5.5 1.5-7C13 4.5 16.5 7 17 12a5 5 0 1 1-10 0c0-1 .5-2 1.5-2.5" stroke={color} />
  </Svg>
);

export const Activity = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.5.5 0 0 1-.96 0L9.24 2.18a.5.5 0 0 0-.96 0l-2.35 8.36A2 2 0 0 1 4 12H2" stroke={color} />
  </Svg>
);

export const HeartPulse = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" stroke={color} />
    <Path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" stroke={color} />
  </Svg>
);

export const Play = ({ size = 16, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M8 5v14l11-7z" fill={color} />
  </Svg>
);

export const Pause = ({ size = 16, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M6 5h4v14H6zM14 5h4v14h-4z" fill={color} />
  </Svg>
);

export const ChevronRight = ({ size, color = '#fff', strokeWidth = 2.2 }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path d="m9 18 6-6-6-6" stroke={color} />
  </Svg>
);

export const ChevronLeft = ({ size, color = '#fff', strokeWidth = 2.2 }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path d="m15 18-6-6 6-6" stroke={color} />
  </Svg>
);

export const Sun = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Circle cx="12" cy="12" r="4" stroke={color} />
    <Path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke={color} />
  </Svg>
);

export const Leaf = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96a1 1 0 0 1 1.5.86V17a7 7 0 0 1-7 7" stroke={color} />
    <Path d="M2 21c0-3 1.85-5.36 5.08-6" stroke={color} />
  </Svg>
);

export const Waveform = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path d="M2 12h2l2-7 4 14 4-10 2 6h6" stroke={color} />
  </Svg>
);

export const CloudRain = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path d="M16 13a5 5 0 0 0-9.5-2A4 4 0 0 0 6 19h11a4 4 0 0 0 0-8z" stroke={color} />
    <Path d="M8 19v3M12 19v3M16 19v3" stroke={color} />
  </Svg>
);

export const Bowl = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path d="M3 11h18a9 9 0 0 1-18 0z" stroke={color} />
    <Path d="M7 4c0 2 2 3 2 5M12 3c0 2 2 3 2 5M17 4c0 2 2 3 2 5" stroke={color} />
  </Svg>
);

export const Check = ({ size, color = '#fff', strokeWidth = 2.4 }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path d="M20 6 9 17l-5-5" stroke={color} />
  </Svg>
);

export const Star = ({ size, color = '#fff', strokeWidth, filled }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path
      d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"
      stroke={color}
      fill={filled ? color : 'none'}
    />
  </Svg>
);

export const Stretch = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Circle cx="12" cy="4" r="2" stroke={color} />
    <Path d="M5 9l4 2 3-2 3 2 4-2M9 11v4l-2 5M15 11v4l2 5" stroke={color} />
  </Svg>
);

export const Calendar = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path d="M3 8h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke={color} />
    <Path d="M8 2v4M16 2v4" stroke={color} />
  </Svg>
);

export const Pencil = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" stroke={color} />
  </Svg>
);

export const Footprints = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path d="M4 16a2 2 0 0 0 2 2c1.5 0 2-1 2-2v-2c0-1.5 1-3 1-5a3 3 0 0 0-6 0c0 1.5 1 3 1 5z" stroke={color} />
    <Path d="M14 16a2 2 0 0 0 2 2c1.5 0 2-1 2-2v-2c0-1.5 1-3 1-5a3 3 0 0 0-6 0c0 1.5 1 3 1 5z" stroke={color} />
  </Svg>
);

export const Clock = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Circle cx="12" cy="12" r="10" stroke={color} />
    <Path d="M12 6v6l4 2" stroke={color} />
  </Svg>
);

export const Info = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Circle cx="12" cy="12" r="10" stroke={color} />
    <Path d="M12 16v-4M12 8h.01" stroke={color} />
  </Svg>
);

export const Dots = ({ size = 22, color = '#000' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="5" cy="12" r="1.8" fill={color} />
    <Circle cx="12" cy="12" r="1.8" fill={color} />
    <Circle cx="19" cy="12" r="1.8" fill={color} />
  </Svg>
);

export const Frown = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Circle cx="12" cy="12" r="10" stroke={color} />
    <Path d="M16 16s-1.5-2-4-2-4 2-4 2" stroke={color} />
    <Path d="M9 9h.01M15 9h.01" stroke={color} />
  </Svg>
);

export const SleepyFace = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Circle cx="12" cy="12" r="10" stroke={color} />
    <Path d="M8 14h8" stroke={color} />
    <Path d="M8 9.5l2-1M14 8.5l2 1" stroke={color} />
    <Path d="M15 5l3 0-3 3 3 0" stroke={color} />
  </Svg>
);

export const Heart = ({ size, color = '#fff', strokeWidth, filled }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path
      d="M12 21s-7-4.35-7-10a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 19 11c0 5.65-7 10-7 10z"
      stroke={color}
      fill={filled ? color : 'none'}
    />
  </Svg>
);

export const Chat = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path
      d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
      stroke={color}
    />
  </Svg>
);

export const LotusEmblem = ({ size = 64, color = '#A78BFA' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* center petal */}
    <Path d="M50 22 C 45 34, 45 50, 50 60 C 55 50, 55 34, 50 22 Z" fill={color} opacity={0.85} />
    {/* mid left + right */}
    <Path d="M50 60 C 38 56, 28 46, 26 32 C 36 38, 46 52, 50 60 Z" fill={color} opacity={0.65} />
    <Path d="M50 60 C 62 56, 72 46, 74 32 C 64 38, 54 52, 50 60 Z" fill={color} opacity={0.65} />
    {/* outer left + right */}
    <Path d="M50 60 C 32 58, 18 60, 14 50 C 24 56, 38 60, 50 60 Z" fill={color} opacity={0.5} />
    <Path d="M50 60 C 68 58, 82 60, 86 50 C 76 56, 62 60, 50 60 Z" fill={color} opacity={0.5} />
  </Svg>
);

export const X = ({ size, color = '#fff', strokeWidth = 2 }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path d="M18 6 6 18M6 6l12 12" stroke={color} />
  </Svg>
);

export const Bell = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" stroke={color} />
    <Path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" stroke={color} />
  </Svg>
);

export const Mic = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path d="M9 5a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0z" stroke={color} />
    <Path d="M19 10a7 7 0 0 1-14 0M12 19v3" stroke={color} />
  </Svg>
);

export const Volume2 = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path d="M11 5 6 9H2v6h4l5 4z" stroke={color} />
    <Path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" stroke={color} />
  </Svg>
);

export const VolumeX = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path d="M11 5 6 9H2v6h4l5 4z" stroke={color} />
    <Path d="m23 9-6 6M17 9l6 6" stroke={color} />
  </Svg>
);

export const Send = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path d="m22 2-7 20-4-9-9-4Z" stroke={color} />
    <Path d="M22 2 11 13" stroke={color} />
  </Svg>
);

export const Settings = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z" stroke={color} />
    <Circle cx="12" cy="12" r="3" stroke={color} />
  </Svg>
);

export const User = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" stroke={color} />
    <Circle cx="12" cy="7" r="4" stroke={color} />
  </Svg>
);

export const Target = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Circle cx="12" cy="12" r="10" stroke={color} />
    <Circle cx="12" cy="12" r="6" stroke={color} />
    <Circle cx="12" cy="12" r="2" stroke={color} />
  </Svg>
);

export const Lock = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path d="M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z" stroke={color} />
    <Path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={color} />
  </Svg>
);

export const Crown = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path d="M11.6 3.8a.5.5 0 0 1 .8 0l3 4.2 4.4-3.5a.5.5 0 0 1 .8.5l-2 11a1 1 0 0 1-1 .8H6.4a1 1 0 0 1-1-.8l-2-11a.5.5 0 0 1 .8-.5l4.4 3.5z" stroke={color} />
    <Path d="M5 19h14" stroke={color} />
  </Svg>
);

export const Globe = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Circle cx="12" cy="12" r="10" stroke={color} />
    <Path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" stroke={color} />
  </Svg>
);

export const Quote = ({ size, color = '#fff', strokeWidth }: Props) => (
  <Svg {...stroke(size, strokeWidth)}>
    <Path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 0-1 1v2c0 1 0 1 1 1z" stroke={color} />
    <Path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" stroke={color} />
  </Svg>
);
