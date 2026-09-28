import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile } from "remotion";
import { C, CLAMP } from "../theme";
import { Buyer, BUYER_DURATION } from "./Buyer";
import { Features, FEATURES_DURATION } from "./Features";
import { StoryFinale, STORY_FINALE_DURATION } from "./Finale";
import { Hook, HOOK_DURATION } from "./Hook";
import { MAP_DURATION, MapScene } from "./MapScene";
import { Seller, SELLER_DURATION } from "./Seller";
import { b, BUYER_START, FEATURES_START, FINALE_START, MAP_DROP, MAP_START, MUSIC_TRIM, SELLER_START, STORY_DURATION } from "./timing";

// Sound effects from public/sfx. `at` is when the file starts; each is shifted by the time its hit takes to arrive.
const SFX = [
  { name: "whoosh-fast", at: b(0) - 20, volume: 0.35 },
  { name: "whoosh-fast", at: b(2) - 32, volume: 0.35 },
  { name: "zoom", at: SELLER_START - 13, volume: 0.5 },
  { name: "tap", at: b(10) - 12, volume: 0.5 },
  { name: "tap", at: b(13) - 12, volume: 0.5 },
  { name: "tap", at: b(16) - 12, volume: 0.5 },
  { name: "tap", at: b(18.5) - 8, volume: 0.5 },
  { name: "notify", at: b(18.5) - 4, volume: 0.55 },
  { name: "wings", at: b(25) - 21, volume: 0.45 },
  { name: "pop", at: b(26) - 1, volume: 0.5 },
  { name: "impact-deep", at: MAP_DROP - 16, volume: 0.45 },
  { name: "sparkle", at: MAP_DROP - 10, volume: 0.4 },
  { name: "whoosh-fast", at: BUYER_START - 32, volume: 0.4 },
  { name: "tap", at: b(40) - 12, volume: 0.5 },
  { name: "tap", at: b(43), volume: 0.55 },
  { name: "notify", at: b(43) + 6, volume: 0.45 },
  { name: "pop", at: FEATURES_START - 1, volume: 0.5 },
  { name: "pop", at: b(50) - 1, volume: 0.5 },
  { name: "pop", at: b(52) - 1, volume: 0.5 },
  { name: "impact-epic", at: FINALE_START - 28, volume: 0.4 },
  { name: "pop", at: b(56) - 1, volume: 0.45 },
  { name: "tap", at: b(57), volume: 0.5 },
  { name: "sparkle", at: b(59) - 16, volume: 0.4 },
];

// -3 dB overall, so the mix lands near -14 LUFS like the short.
const MIX = 0.708;
const musicVolume = (frame: number) => MIX * interpolate(frame, [0, 2, STORY_DURATION - 20, STORY_DURATION - 1], [0, 0.9, 0.9, 0], CLAMP);

const SCENES = [
  { name: "Hook", from: 0, duration: HOOK_DURATION, Scene: Hook },
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
    <Audio src={staticFile("music/what-about-action.mp3")} trimBefore={MUSIC_TRIM} volume={musicVolume} />
    {SFX.map((sfx, i) => (
      <Sequence key={i} name={`Sound ${sfx.name}`} from={Math.max(0, sfx.at)} layout="none">
        <Audio src={staticFile(`sfx/${sfx.name}.mp3`)} trimBefore={Math.max(0, -sfx.at)} volume={() => MIX * sfx.volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
