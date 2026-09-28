import { FPS } from "../theme";

// The short is cut to its music, "Cat Walk": the track's drop lands on the frame the pin hits,
// and every later cue sits on one of its beats (129.2 BPM).
export const IMPACT = 30;
const DROP_SECONDS = 29.538;
const BEAT_FRAMES = 0.4644 * FPS;

export const beat = (n: number) => Math.round(IMPACT + n * BEAT_FRAMES);

export const APP_START = beat(8);
export const FINALE_START = beat(20);
export const SHORT_DURATION = beat(32);

// Frames of the track skipped so that its drop plays at IMPACT.
export const MUSIC_TRIM = Math.round(DROP_SECONDS * FPS) - IMPACT;
