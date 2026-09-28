// The story video is cut to "What About Action?" at 120 BPM: one beat is exactly 15 frames.
// The track starts 0.4 s in so its beats land on multiples of 15, and its break (about
// 14.2-15.4 s into the video) falls inside the map scene, whose villages light up on the return.
export const b = (n: number) => Math.round(n * 15);

export const MUSIC_TRIM = 12;

export const HOOK_START = b(0);
export const SELLER_START = b(6);
export const MAP_START = b(20);
export const MAP_DROP = b(31);
export const BUYER_START = b(36);
export const FEATURES_START = b(48);
export const FINALE_START = b(54);
export const STORY_DURATION = b(61);
