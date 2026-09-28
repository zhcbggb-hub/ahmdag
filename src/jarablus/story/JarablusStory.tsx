import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile } from "remotion";
import { C, CLAMP } from "../theme";
import { Buyer, BUYER_DURATION } from "./Buyer";
import { Features, FEATURES_DURATION } from "./Features";
import { StoryFinale, STORY_FINALE_DURATION } from "./Finale";
import { Hook, HOOK_DURATION } from "./Hook";
import { MAP_DURATION, MapScene } from "./MapScene";
import { Reveal, REVEAL_DURATION } from "./Reveal";
import { Seller, SELLER_DURATION } from "./Seller";
import { b, BUYER_START, DROP_AT, FEATURES_START, FINALE_START, MAP_DROP, MAP_START, MUSIC_TRIM, REVEAL_START, SELLER_START, STORY_DURATION } from "./timing";

// Sound effects from public/sfx. `at` is when the file starts; each is shifted by the time its hit takes to
// arrive (a negative `at` starts the file part-way through).
const SFX = [
  { name: "impact-deep", at: -16, volume: 0.7 },
  { name: "riser", at: DROP_AT - 75, volume: 0.6 },
  { name: "whoosh-fast", at: b(1) - 32, volume: 0.45 },
  { name: "whoosh-fast", at: b(2) - 32, volume: 0.45 },
  { name: "whoosh-fast", at: b(3) - 32, volume: 0.45 },
  { name: "impact-epic", at: DROP_AT - 28, volume: 0.7 },
  { name: "whoosh-fast", at: SELLER_START - 32, volume: 0.4 },
  { name: "tap", at: b(11.5) - 12, volume: 0.5 },
  { name: "tap", at: b(14) - 12, volume: 0.5 },
  { name: "tap", at: b(16.5) - 12, volume: 0.5 },
  { name: "tap", at: b(18.5) - 8, volume: 0.5 },
  { name: "notify", at: b(18.5) - 4, volume: 0.55 },
  { name: "wings", at: b(23) - 21, volume: 0.45 },
  { name: "pop", at: b(24) - 1, volume: 0.5 },
  { name: "riser", at: MAP_DROP - 75, volume: 0.55 },
  { name: "impact-deep", at: MAP_DROP - 16, volume: 0.6 },
  { name: "sparkle", at: MAP_DROP - 10, volume: 0.4 },
  { name: "whoosh-fast", at: BUYER_START - 32, volume: 0.4 },
  { name: "tap", at: b(38) - 12, volume: 0.5 },
  { name: "tap", at: b(41), volume: 0.55 },
  { name: "notify", at: b(41) + 6, volume: 0.45 },
  { name: "pop", at: FEATURES_START - 1, volume: 0.5 },
  { name: "pop", at: FEATURES_START + 19, volume: 0.5 },
  { name: "pop", at: FEATURES_START + 39, volume: 0.5 },
  { name: "impact-epic", at: FINALE_START - 28, volume: 0.45 },
  { name: "pop", at: b(49) - 1, volume: 0.45 },
  { name: "tap", at: b(49.5), volume: 0.5 },
  { name: "sparkle", at: b(51) - 16, volume: 0.4 },
];

const MIX = 0.708;
// The music drops out for the beat before the villages light up, so they land with the beat's return.
const musicVolume = (frame: number) =>
  MIX *
  0.9 *
  interpolate(frame, [0, 2, STORY_DURATION - 15, STORY_DURATION - 1], [0, 1, 1, 0], CLAMP) *
  interpolate(frame, [MAP_DROP - 16, MAP_DROP - 12, MAP_DROP - 1, MAP_DROP], [1, 0.12, 0.12, 1], CLAMP);

const SCENES = [
  { name: "Hook", from: 0, duration: HOOK_DURATION, Scene: Hook },
  { name: "Reveal", from: REVEAL_START, duration: REVEAL_DURATION, Scene: Reveal },
  { name: "Seller", from: SELLER_START, duration: SELLER_DURATION, Scene: Seller },
  { name: "Map", from: MAP_START, duration: MAP_DURATION, Scene: MapScene },
  { name: "Buyer", from: BUYER_START, duration: BUYER_DURATION, Scene: Buyer },
  { name: "Features", from: FEATURES_START, duration: FEATURES_DURATION, Scene: Features },
  { name: "Finale", from: FINALE_START, duration: STORY_FINALE_DURATION, Scene: StoryFinale },
];

export const JarablusStory: React.FC = () => (
  <AbsoluteFill style={{ background: C.ink }}>
    {SCENES.map(({ name, from, duration, Scene }) => (
      <Sequence key={name} name={name} from={from} durationInFrames={duration}>
        <Scene />
      </Sequence>
    ))}
    <Audio src={staticFile("music/arab-nights.mp3")} trimBefore={MUSIC_TRIM} volume={musicVolume} />
    {SFX.map((sfx, i) => (
      <Sequence key={i} name={`Sound ${sfx.name}`} from={Math.max(0, sfx.at)} layout="none">
        <Audio src={staticFile(`sfx/${sfx.name}.mp3`)} trimBefore={Math.max(0, -sfx.at)} volume={() => MIX * sfx.volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
