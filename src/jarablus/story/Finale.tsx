import { mdiDownload } from "@mdi/js";
import { lightLeak } from "@remotion/effects/light-leak";
import { AbsoluteFill, Img, interpolate, Solid, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Burst, Icon, Rings } from "../components";
import { C, CLAMP, DISPLAY, TEXT } from "../theme";
import { AppIcon } from "./parts";
import { b, FINALE_START, STORY_DURATION } from "./timing";

export const STORY_FINALE_DURATION = STORY_DURATION - FINALE_START;

const at = (n: number) => b(n) - FINALE_START;
const LOGO_W = 760;
const LOGO_H = (LOGO_W * 733) / 1205;
const LOGO_TOP = 300;
const PIN_X = 540 - LOGO_W / 2 + 0.7303 * LOGO_W;
const PIN_Y = LOGO_TOP + 0.5075 * LOGO_H;

// The pin from the map lands and the logo forms around it, then the app icon and the download button.
export const StoryFinale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame, fps, config: { damping: 12, stiffness: 150 } });
  const icon = spring({ frame: frame - at(56), fps, config: { damping: 12, stiffness: 180 } });
  const cta = spring({ frame: frame - at(57), fps, config: { damping: 10, stiffness: 200 } });
  const url = spring({ frame: frame - at(58), fps, config: { damping: 18 } });
  const shine = interpolate(frame, [at(59), at(59) + 14], [-40, 140], CLAMP);
  const pulse = frame < at(57) ? 0 : (Math.sin((frame - at(57)) / 5) + 1) / 2;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 35%, white 0%, ${C.paper} 50%, #E7EDE6 100%)`, overflow: "hidden" }}>
      <Rings x={PIN_X} y={PIN_Y} color={C.brand} start={2} every={8} count={4} total={3} maxRadius={900} strokeWidth={4} />
      <Img
        src={staticFile("logo.png")}
        style={{
          position: "absolute",
          left: 540 - LOGO_W / 2,
          top: LOGO_TOP,
          width: LOGO_W,
          height: LOGO_H,
          maxWidth: "none",
          transformOrigin: `${0.7303 * 100}% ${0.5075 * 100}%`,
          scale: interpolate(logo, [0, 1], [2.6, 1]),
          opacity: Math.min(1, logo * 2),
          filter: `blur(${(1 - Math.min(1, logo)) * 14}px)`,
        }}
      />
      <Burst x={PIN_X} y={PIN_Y} start={4} seed="story-logo" colors={[C.mint, C.brand, C.cream]} count={40} />
      <div style={{ position: "absolute", top: 820, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: frame < at(56) ? 0 : icon, scale: interpolate(icon, [0, 1], [0.5, 1]) }}>
        <AppIcon size={150} />
      </div>
      <div style={{ position: "absolute", top: 1090, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            direction: "rtl",
            display: "flex",
            alignItems: "center",
            gap: 22,
            background: C.brand,
            color: C.paper,
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontSize: 74,
            borderRadius: 100,
            padding: "24px 60px 34px",
            overflow: "hidden",
            boxShadow: `0 0 ${40 + pulse * 30}px rgba(0, 125, 107, ${0.35 + pulse * 0.25})`,
            opacity: frame < at(57) ? 0 : Math.min(1, cta * 2),
            scale: interpolate(cta, [0, 1], [0.4, 1]),
          }}
        >
          <Icon path={mdiDownload} size={80} color={C.paper} />
          حمّل التطبيق
          <AbsoluteFill style={{ background: `linear-gradient(110deg, transparent ${shine - 12}%, rgba(255,255,255,0.6) ${shine}%, transparent ${shine + 12}%)` }} />
        </div>
      </div>
      <div style={{ position: "absolute", top: 1260, left: 0, right: 0, textAlign: "center", fontFamily: TEXT, fontWeight: 600, fontSize: 54, color: C.deep, opacity: frame < at(58) ? 0 : url, translate: `0 ${(1 - url) * 30}px` }}>
        jarablus.store/app
      </div>
      <Burst x={540} y={1170} start={at(57)} seed="story-cta" colors={[C.mint, C.brand]} count={36} />
      <Solid
        width={1080}
        height={1920}
        effects={[lightLeak({ seed: 9, hueShift: 0, progress: interpolate(frame, [0, 36], [0, 1], CLAMP) })]}
        style={{ position: "absolute", mixBlendMode: "screen", opacity: 0.7 }}
      />
      <AbsoluteFill style={{ background: "white", opacity: interpolate(frame, [0, 6], [0.9, 0], CLAMP) }} />
    </AbsoluteFill>
  );
};
