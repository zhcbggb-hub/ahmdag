import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile } from "remotion";
import { CLAMP } from "../jarablus/theme";
import { Coverage, COVERAGE_DURATION, EndCard, END_DURATION, Office, OFFICE_DURATION } from "./Closing";
import { Hook, HOOK_DURATION } from "./Hook";
import { LogoReveal, LOGO_REVEAL_DURATION } from "./LogoReveal";
import { SERVICE_DURATION, Services, SERVICES_DURATION } from "./Services";
import { A, beat, COVERAGE_START, DROP_AT, END_START, LOGO_START, MUSIC_TRIM, OFFICE_START, PROMO_DURATION, SERVICES_START } from "./theme";

const S = (i: number) => SERVICES_START + i * SERVICE_DURATION;

// Sound effects from public/sfx. `at` is when the file starts, shifted by the time its hit takes to arrive
// (a negative `at` starts the file part-way through).
const SFX = [
  { name: "impact-deep", at: -16, volume: 0.55 },
  { name: "pen", at: 2, volume: 0.45 },
  { name: "pen", at: 34, volume: 0.4 },
  { name: "whoosh-fast", at: beat(3) - 32, volume: 0.35 },
  { name: "whoosh-fast", at: beat(5) - 32, volume: 0.35 },
  { name: "riser", at: DROP_AT - 75, volume: 0.6 },
  { name: "impact-epic", at: DROP_AT - 28, volume: 0.7 },
  { name: "pop", at: LOGO_START + 6, volume: 0.35 },
  { name: "pop", at: LOGO_START + 10, volume: 0.35 },
  { name: "pop", at: LOGO_START + 14, volume: 0.35 },
  { name: "stamp", at: LOGO_START + 20, volume: 0.55 },
  { name: "sparkle", at: LOGO_START + 54, volume: 0.4 },
  ...[0, 1, 2, 3, 4].map((i) => ({ name: "whoosh-fast", at: S(i) - 30, volume: 0.35 })),
  { name: "stamp", at: S(0) + 14 - 5, volume: 0.95 },
  { name: "impact-deep", at: S(0) + 14 - 16, volume: 0.35 },
  { name: "coins", at: S(1) + 12 - 2, volume: 0.6 },
  { name: "pop", at: S(1) + 3, volume: 0.45 },
  { name: "key", at: S(2) + 26 - 48, volume: 0.7 },
  { name: "hammer", at: S(3) + 6, volume: 0.5 },
  { name: "hammer", at: S(3) + 18, volume: 0.5 },
  { name: "hammer", at: S(3) + 30, volume: 0.5 },
  { name: "pen", at: S(4) + 20 - 15, volume: 0.6 },
  { name: "stamp", at: S(4) + 40 - 5, volume: 0.7 },
  { name: "whoosh-fast", at: OFFICE_START - 30, volume: 0.35 },
  { name: "pop", at: OFFICE_START + 18, volume: 0.5 },
  { name: "whoosh-fast", at: COVERAGE_START - 30, volume: 0.35 },
  { name: "pop", at: COVERAGE_START + 10, volume: 0.45 },
  { name: "pop", at: COVERAGE_START + 18, volume: 0.45 },
  { name: "impact-epic", at: END_START - 28, volume: 0.5 },
  { name: "tap", at: END_START + beat(3), volume: 0.5 },
  { name: "sparkle", at: END_START + beat(5) - 16, volume: 0.4 },
];

const MIX = 0.708;
const musicVolume = (frame: number) => MIX * 0.9 * interpolate(frame, [0, 2, PROMO_DURATION - 20, PROMO_DURATION - 1], [0, 1, 1, 0], CLAMP);

const SCENES = [
  { name: "Hook", from: 0, duration: HOOK_DURATION, Scene: Hook },
  { name: "Logo", from: LOGO_START, duration: LOGO_REVEAL_DURATION, Scene: LogoReveal },
  { name: "Services", from: SERVICES_START, duration: SERVICES_DURATION, Scene: Services },
  { name: "Office", from: OFFICE_START, duration: OFFICE_DURATION, Scene: Office },
  { name: "Coverage", from: COVERAGE_START, duration: COVERAGE_DURATION, Scene: Coverage },
  { name: "End", from: END_START, duration: END_DURATION, Scene: EndCard },
];

// A 26-second vertical ad for Abu Sham real estate office in Jarablus, cut to the music's beat.
export const AbuShamPromo: React.FC = () => (
  <AbsoluteFill style={{ background: A.night }}>
    {SCENES.map(({ name, from, duration, Scene }) => (
      <Sequence key={name} name={name} from={from} durationInFrames={duration}>
        <Scene />
      </Sequence>
    ))}
    <Audio src={staticFile("music/golden-storm.mp3")} trimBefore={MUSIC_TRIM} volume={musicVolume} />
    {SFX.map((sfx, i) => (
      <Sequence key={i} name={`Sound ${sfx.name}`} from={Math.max(0, sfx.at)} layout="none">
        <Audio src={staticFile(`sfx/${sfx.name}.mp3`)} trimBefore={Math.max(0, -sfx.at)} volume={() => MIX * sfx.volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
