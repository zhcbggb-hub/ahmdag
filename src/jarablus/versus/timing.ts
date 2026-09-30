// The "before and after" video is cut to "Arab Nights" (120 BPM, one beat is 15 frames). Its intro plays under
// the split-screen comparison, and its drop (16.0 s into the track) lands on DROP_AT, when the old way is
// pushed off the screen and the logo slams in.
export const b = (n: number) => Math.round(n * 15);

export const HOOK_END = b(4);
// Four comparisons of four beats each.
export const rowStart = (i: number) => b(4 + i * 4);
export const ROWS = 4;
export const DROP_AT = b(20);
export const MUSIC_TRIM = Math.round(16.0 * 30) - DROP_AT;

export const BRAND_START = DROP_AT;
export const CTA_START = b(26);
export const ASK_START = b(31);
export const VERSUS_DURATION = b(35);
