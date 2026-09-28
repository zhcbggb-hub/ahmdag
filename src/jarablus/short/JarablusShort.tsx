import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile } from "remotion";
import { C, CLAMP } from "../theme";
import { APP_SHOWCASE_DURATION, AppShowcase } from "./AppShowcase";
import { Finale, FINALE_DURATION } from "./Finale";
import { LOGO_BUILD_DURATION, LogoBuild } from "./LogoBuild";
import { APP_START, beat, FINALE_START, IMPACT, MUSIC_TRIM, SHORT_DURATION } from "./timing";

// Sound effects (public/sfx, fetched by scripts/fetch-music.sh). `at` is when the file starts playing:
// each one is shifted by the time its hit takes to arrive, so the hit lands on the picture.
const SFX = [
  { name: "pin-fall", at: 15, volume: 0.45 },
  { name: "impact-deep", at: IMPACT - 16, volume: 0.85 },
  { name: "whoosh-fast", at: beat(1) - 32, volume: 0.3 },
  { name: "pop", at: beat(1.5) - 1, volume: 0.45 },
  { name: "wings", at: beat(2) - 21, volume: 0.4 },
  { name: "pop", at: beat(3) - 1, volume: 0.45 },
  { name: "sparkle", at: beat(4) - 16, volume: 0.45 },
  { name: "zoom", at: APP_START - 18, volume: 0.6 },
  { name: "pop", at: beat(9) - 1, volume: 0.45 },
  { name: "notify", at: beat(10) - 4, volume: 0.5 },
  { name: "pop", at: beat(11) - 1, volume: 0.45 },
  { name: "pop", at: beat(12) - 1, volume: 0.35 },
  { name: "pop", at: beat(12.5) - 1, volume: 0.35 },
  { name: "pop", at: beat(13) - 1, volume: 0.35 },
  { name: "whoosh-fast", at: FINALE_START - 32, volume: 0.45 },
  { name: "impact-epic", at: FINALE_START - 28, volume: 0.75 },
  { name: "tap", at: beat(24), volume: 0.6 },
  { name: "pop", at: beat(24) - 1, volume: 0.5 },
  { name: "sparkle", at: beat(24) + 28 - 16, volume: 0.4 },
  { name: "impact-deep", at: beat(28) - 16, volume: 0.6 },
];

// Overall level (-3 dB), so the mix lands at about -14 LUFS with peaks under -1 dBTP, as social platforms expect.
const MIX = 0.708;
const musicVolume = (frame: number) => MIX * interpolate(frame, [0, 3, SHORT_DURATION - 30, SHORT_DURATION - 1], [0, 0.9, 0.9, 0], CLAMP);

export const JarablusShort: React.FC = () => (
  <AbsoluteFill style={{ background: C.ink }}>
    <Sequence name="LogoBuild" durationInFrames={LOGO_BUILD_DURATION}>
      <LogoBuild />
    </Sequence>
    <Sequence name="AppShowcase" from={APP_START} durationInFrames={APP_SHOWCASE_DURATION}>
      <AppShowcase />
    </Sequence>
    <Sequence name="Finale" from={FINALE_START} durationInFrames={FINALE_DURATION}>
      <Finale />
    </Sequence>
    <Audio src={staticFile("music/cat-walk.mp3")} trimBefore={MUSIC_TRIM} volume={musicVolume} />
    {SFX.map((sfx, i) => (
      <Sequence key={i} name={`Sound ${sfx.name}`} from={sfx.at} layout="none">
        <Audio src={staticFile(`sfx/${sfx.name}.mp3`)} volume={() => MIX * sfx.volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
