import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile } from "remotion";
import { C, CLAMP } from "../theme";
import { Ask, ASK_DURATION, Brand, BRAND_DURATION, Cta, CTA_DURATION } from "./Outro";
import { Split, SPLIT_DURATION } from "./Split";
import { ASK_START, b, BRAND_START, CTA_START, DROP_AT, HOOK_END, MUSIC_TRIM, rowStart, VERSUS_DURATION } from "./timing";

export type VersusProps = { music: boolean };

const R = rowStart;

// Sound effects from public/sfx. `at` is when the file starts, shifted by the time its hit takes to arrive
// (a negative `at` starts the file part-way through).
const SFX = [
  { name: "impact-deep", at: -16, volume: 0.7 },
  { name: "whoosh-fast", at: b(2) - 32, volume: 0.45 },
  { name: "pop", at: b(2) + 2, volume: 0.45 },
  { name: "whoosh-fast", at: HOOK_END - 32, volume: 0.4 },
  // Row 1: the flyer blows away; the ad is posted in three taps.
  { name: "wings", at: R(0) + 22 - 21, volume: 0.45 },
  { name: "tap", at: R(0) + 10, volume: 0.5 },
  { name: "tap", at: R(0) + 22, volume: 0.5 },
  { name: "tap", at: R(0) + 34, volume: 0.5 },
  { name: "notify", at: R(0) + 37 - 4, volume: 0.6 },
  // Row 2: the ad reaches every village.
  { name: "whoosh-fast", at: R(1) - 32, volume: 0.4 },
  { name: "pin-fall", at: R(1) - 9, volume: 0.45 },
  ...[0, 1, 2, 3].map((i) => ({ name: "pop", at: R(1) + 12 + i * 7 - 1, volume: 0.45 })),
  // Row 3: the middleman's cut, then 0%.
  { name: "whoosh-fast", at: R(2) - 32, volume: 0.4 },
  { name: "coins", at: R(2) + 8 - 2, volume: 0.5 },
  { name: "stamp", at: R(2) + 4 - 5, volume: 0.8 },
  { name: "impact-deep", at: R(2) + 4 - 16, volume: 0.45 },
  // Row 4: buyers message, sold.
  { name: "whoosh-fast", at: R(3) - 32, volume: 0.4 },
  ...[0, 1, 2].map((i) => ({ name: "notify", at: R(3) + 4 + i * 9 - 4, volume: 0.45 })),
  { name: "stamp", at: R(3) + 36 - 5, volume: 0.9 },
  // The drop.
  { name: "riser", at: DROP_AT - 75, volume: 0.6 },
  { name: "impact-epic", at: DROP_AT - 28, volume: 0.75 },
  { name: "sparkle", at: BRAND_START + b(1) - 16, volume: 0.4 },
  { name: "whoosh-fast", at: CTA_START - 32, volume: 0.4 },
  { name: "tap", at: CTA_START + 60, volume: 0.55 },
  { name: "notify", at: CTA_START + 62, volume: 0.4 },
  { name: "whoosh-fast", at: ASK_START - 32, volume: 0.35 },
  { name: "pop", at: ASK_START + 20 - 1, volume: 0.45 },
];

const MIX = 0.708;
const musicVolume = (frame: number) => MIX * 0.9 * interpolate(frame, [0, 2, VERSUS_DURATION - 20, VERSUS_DURATION - 1], [0, 1, 1, 0], CLAMP);

const SCENES = [
  { name: "Split", from: 0, duration: SPLIT_DURATION, Scene: Split },
  { name: "Brand", from: BRAND_START, duration: BRAND_DURATION, Scene: Brand },
  { name: "Cta", from: CTA_START, duration: CTA_DURATION, Scene: Cta },
  { name: "Ask", from: ASK_START, duration: ASK_DURATION, Scene: Ask },
];

// A 17-second "old way versus the app" video: split screen, four comparisons on the beat, the logo on the drop.
// With `music: false` only the sound effects play, so a trending TikTok sound can be added in the app.
export const JarablusVersus: React.FC<VersusProps> = ({ music }) => (
  <AbsoluteFill style={{ background: C.ink }}>
    {SCENES.map(({ name, from, duration, Scene }) => (
      <Sequence key={name} name={name} from={from} durationInFrames={duration}>
        <Scene />
      </Sequence>
    ))}
    {music && <Audio src={staticFile("music/arab-nights.mp3")} trimBefore={MUSIC_TRIM} volume={musicVolume} />}
    {SFX.map((sfx, i) => (
      <Sequence key={i} name={`Sound ${sfx.name}`} from={Math.max(0, sfx.at)} layout="none">
        <Audio src={staticFile(`sfx/${sfx.name}.mp3`)} trimBefore={Math.max(0, -sfx.at)} volume={() => MIX * sfx.volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
