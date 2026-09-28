import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";

const ARABIC =
  "U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0897-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC";
const LATIN =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";

// Fonts live in public/fonts so rendering never depends on the network.
const loadFamily = (family: string, file: string, weight: string) => {
  loadFont({ family, url: staticFile(`fonts/${file}-arabic.woff2`), weight, unicodeRange: ARABIC });
  loadFont({ family, url: staticFile(`fonts/${file}-latin.woff2`), weight, unicodeRange: LATIN });
  return family;
};

export const DISPLAY = loadFamily("Alexandria", "Alexandria", "100 900");
export const TEXT = loadFamily("Readex Pro", "ReadexPro", "160 700");

// Brand colors sampled from the app and the logo.
export const C = {
  ink: "#021B17",
  deep: "#05443B",
  brand: "#007D6B",
  mint: "#12C9B2",
  cream: "#F6EAD3",
  paper: "#F8F7F2",
};

export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
