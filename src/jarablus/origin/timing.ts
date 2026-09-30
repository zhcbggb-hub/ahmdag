import { EASE_IN_OUT } from "../theme";

// The origin story follows the narration in public/voiceover/origin/narration.mp3 (37.4 s). Times are in seconds,
// read off the pauses between phrases.
export const sec = (s: number) => Math.round(s * 30);

// Story beats, in frames.
export const DISTRICT_AT = sec(2.5); // "جرابلس": the district lights up
export const VILLAGES_AT = sec(3.8);
export const PEOPLE_AT = sec(7.7); // seller and buyer
export const REACH_AT = sec(10.1);
export const SEARCH_AT = sec(13.4);
export const MIDDLEMAN_AT = sec(15.3);
export const COMMISSION_AT = sec(16.7);
export const DIVE_AT = sec(18.15); // "ومن هنا…"
export const LOGO_AT = sec(19.4); // "تطبيق سوق جرابلس", on the music's hit
export const BACK_AT = sec(21.55);
export const GROW_AT = sec(23.4);
export const APP_AT = sec(25.6);
export const NETWORK_AT = sec(28.1);
export const REGIONS_AT = sec(30.6);
export const PEOPLE_ALL_AT = sec(32.8);
export const END_AT = sec(34.8);
export const FINAL_LOGO_AT = sec(35.9);
export const ORIGIN_DURATION = sec(38.8);

// "A New Life" swells from silence; its first full hit is 24.55 s in. Starting it 5.15 s in lands the hit on LOGO_AT.
export const MUSIC_TRIM = sec(24.55 - 19.4);

// ---------------------------------------------------------------- camera

// Map coordinates are kilometres from Jarablus town, x east and y south. `s` is pixels per kilometre.
export type Cam = { cx: number; cy: number; s: number };
const SYRIA: Cam = { cx: 91, cy: 223, s: 1.55 };
export const DISTRICT: Cam = { cx: -12.8, cy: 15.4, s: 24.5 };
const TOWN: Cam = { cx: 0, cy: 1.5, s: 95 };

const KEYS: [number, Cam][] = [
  [0, SYRIA],
  [sec(1.7), { cx: 70, cy: 170, s: 2.1 }],
  [sec(3.5), DISTRICT],
  [DIVE_AT, { cx: -12.4, cy: 15.2, s: 25.5 }],
  [sec(19.3), TOWN],
  [BACK_AT + 6, TOWN],
  [sec(25.3), DISTRICT],
  [END_AT, { cx: -12.2, cy: 15.2, s: 26 }],
  [sec(36.4), { cx: 0, cy: 1, s: 70 }],
];

// Zooms are interpolated in log scale, and the centre moves so the point being zoomed to glides smoothly on screen.
export const camera = (frame: number): Cam => {
  let i = 0;
  while (i < KEYS.length - 2 && frame >= KEYS[i + 1][0]) i++;
  const [f0, a] = KEYS[i];
  const [f1, b] = KEYS[i + 1];
  const u = EASE_IN_OUT(Math.min(1, Math.max(0, (frame - f0) / (f1 - f0))));
  const s = a.s * Math.pow(b.s / a.s, u);
  const w = Math.abs(a.s - b.s) < 1e-6 ? u : (1 / a.s - 1 / s) / (1 / a.s - 1 / b.s);
  return { cx: a.cx + (b.cx - a.cx) * w, cy: a.cy + (b.cy - a.cy) * w, s };
};

export const toPx = (cam: Cam, x: number, y: number) => ({ x: 540 + (x - cam.cx) * cam.s, y: 960 + (y - cam.cy) * cam.s });
