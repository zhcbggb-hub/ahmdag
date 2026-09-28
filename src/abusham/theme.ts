// Abu Sham real estate office: its navy and royal blue, with sky blue and a warm gold for accents.
export const A = {
  night: "#00112F",
  navy: "#001749",
  deep: "#062158",
  royal: "#0647AF",
  sky: "#4FA3F7",
  ice: "#EAF4FF",
  white: "#FFFFFF",
  gold: "#F5B942",
  stamp: "#D93636",
  blueprint: "#0A2A66",
};

// The ad is cut to "Golden Storm" (Mixkit), about 127.6 BPM: one beat is 14.1 frames.
// Its drop (15.14 s into the track) lands on DROP_AT, when the logo builds.
const BEAT_FRAMES = 0.4702 * 30;
export const beat = (n: number) => Math.round(n * BEAT_FRAMES);

export const DROP_AT = beat(7);
export const MUSIC_TRIM = Math.round(15.14 * 30) - DROP_AT;

export const LOGO_START = DROP_AT;
export const SERVICES_START = beat(15);
export const SERVICE_BEATS = 4;
export const OFFICE_START = beat(35);
export const COVERAGE_START = beat(42);
export const END_START = beat(46);
export const PROMO_DURATION = beat(56);

export const PHONE_CALL = "+90 531 373 5294";
export const PHONE_WHATSAPP = "+963 991 858 206";
