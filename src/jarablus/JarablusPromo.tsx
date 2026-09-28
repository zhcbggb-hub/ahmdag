import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill, interpolate, Sequence, staticFile } from "remotion";
import { circleReveal, sweep } from "./components";
import { CATEGORIES_DURATION, CategoriesScene } from "./scenes/CategoriesScene";
import { FEATURES_DURATION, FeaturesScene } from "./scenes/FeaturesScene";
import { HOOK_DURATION, HookScene } from "./scenes/HookScene";
import { NO_MIDDLEMAN_DURATION, NoMiddlemanScene } from "./scenes/NoMiddlemanScene";
import { OUTRO_DURATION, OutroScene } from "./scenes/OutroScene";
import { POST_AD_DURATION, PostAdScene } from "./scenes/PostAdScene";
import { SEARCH_DURATION, SearchScene } from "./scenes/SearchScene";
import { C, CLAMP } from "./theme";
import generatedVoiceover from "./voiceover.generated.json";

// Filled in by scripts/generate-voiceover.mjs; empty until the voiceover has been generated.
type VoiceClip = { id: string; file: string; start: number; durationInFrames: number };
const VOICEOVER: VoiceClip[] = generatedVoiceover;

const CIRCLE = 14;
const SWEEP = 18;

export const PROMO_DURATION =
  HOOK_DURATION + SEARCH_DURATION + CATEGORIES_DURATION + NO_MIDDLEMAN_DURATION + POST_AD_DURATION + FEATURES_DURATION + OUTRO_DURATION - 2 * CIRCLE - 2 * SWEEP;

// Background music, fetched by scripts/fetch-music.sh. It fades in and out, and dips under the voiceover.
const MUSIC_FILE = "music/what-about-action.mp3";
const MUSIC_LEVEL = 0.85;
const MUSIC_UNDER_VOICE = 0.3;
const musicVolume = (frame: number) => {
  const fade = interpolate(frame, [0, 6, PROMO_DURATION - 45, PROMO_DURATION - 1], [0, 1, 1, 0], CLAMP);
  const duck = Math.max(0, ...VOICEOVER.map((clip) => interpolate(frame, [clip.start - 6, clip.start, clip.start + clip.durationInFrames, clip.start + clip.durationInFrames + 10], [0, 1, 1, 0], CLAMP)));
  return MUSIC_LEVEL * fade * interpolate(duck, [0, 1], [1, MUSIC_UNDER_VOICE]);
};

export const JarablusPromo: React.FC = () => (
  <AbsoluteFill style={{ background: C.ink }}>
    <TransitionSeries>
      <TransitionSeries.Sequence name="Hook" durationInFrames={HOOK_DURATION}>
        <HookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={circleReveal({ x: 50, y: 48 })} timing={linearTiming({ durationInFrames: CIRCLE })} />
      <TransitionSeries.Sequence name="Search" durationInFrames={SEARCH_DURATION}>
        <SearchScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={sweep({ color: C.deep })} timing={linearTiming({ durationInFrames: SWEEP })} />
      <TransitionSeries.Sequence name="Categories" durationInFrames={CATEGORIES_DURATION}>
        <CategoriesScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Sequence name="NoMiddleman" durationInFrames={NO_MIDDLEMAN_DURATION}>
        <NoMiddlemanScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={circleReveal({ x: 50, y: 60 })} timing={linearTiming({ durationInFrames: CIRCLE })} />
      <TransitionSeries.Sequence name="PostAd" durationInFrames={POST_AD_DURATION}>
        <PostAdScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Sequence name="Features" durationInFrames={FEATURES_DURATION}>
        <FeaturesScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={sweep({ color: C.brand })} timing={linearTiming({ durationInFrames: SWEEP })} />
      <TransitionSeries.Sequence name="Outro" durationInFrames={OUTRO_DURATION}>
        <OutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Audio src={staticFile(MUSIC_FILE)} volume={musicVolume} />
    {VOICEOVER.map((clip) => (
      <Sequence key={clip.id} name={`Voice ${clip.id}`} from={clip.start} durationInFrames={clip.durationInFrames} layout="none">
        <Audio src={staticFile(clip.file)} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
