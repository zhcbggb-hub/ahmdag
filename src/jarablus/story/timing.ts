// The story video is cut to "Arab Nights", an Arabic trap beat at 120 BPM: one beat is exactly 15 frames.
// The track's quiet intro plays under the hook and its drop (16.0 s into the track) lands on DROP_AT,
// when the logo slams in; its strong section then carries the rest of the video.
export const b = (n: number) => Math.round(n * 15);

export const DROP_AT = b(4);
export const MUSIC_TRIM = Math.round(16.0 * 30) - DROP_AT;

export const HOOK_START = b(0);
export const REVEAL_START = DROP_AT;
export const SELLER_START = b(8);
export const MAP_START = b(20);
export const MAP_DROP = b(30);
export const BUYER_START = b(34);
export const FEATURES_START = b(44);
export const FINALE_START = b(48);
export const STORY_DURATION = b(54);
