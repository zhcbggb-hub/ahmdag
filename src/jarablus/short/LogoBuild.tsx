import { AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Burst, Rings } from "../components";
import { C, CLAMP, TEXT } from "../theme";
import { APP_START, beat, IMPACT } from "./timing";

export const LOGO_BUILD_DURATION = APP_START;

// The logo is drawn from the layers made by scripts/split-logo.py, each on the full logo canvas.
const LOGO_W = 1205;
const LOGO_H = 733;
const SCALE = 0.75;
const W = LOGO_W * SCALE;
const H = LOGO_H * SCALE;
const LEFT = (1080 - W) / 2;
const TOP = 860 - H / 2;
// The pin, in logo pixels: the centre of its cream dot, the dot's radius, and its tip.
const PIN = { x: 879, y: 371, dot: 34, tipY: 510 };
const PIN_X = LEFT + PIN.x * SCALE;
const PIN_Y = TOP + PIN.y * SCALE;
const PIN_CREAM = "#F8F5D8";
const ZOOM_START = APP_START - 26;
const SHINE_START = beat(4);

const origin = (x: number, y: number) => `${(x / LOGO_W) * 100}% ${(y / LOGO_H) * 100}%`;

const Part: React.FC<{ name: string; style?: React.CSSProperties }> = ({ name, style }) => (
  <Img src={staticFile(`logo-parts/${name}.png`)} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, ...style }} />
);

// Streaks of light rushing into the spot where the pin is about to land.
const Gather: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame > IMPACT) return null;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {new Array(70).fill(0).map((_, i) => {
        const angle = random(`gather-a-${i}`) * Math.PI * 2;
        const dist = 620 + random(`gather-d-${i}`) * 700;
        // Every streak is already on screen at the first frame, so the video opens in motion.
        const p = interpolate(frame, [-random(`gather-s-${i}`) * 10, IMPACT], [0, 1], { ...CLAMP, easing: Easing.in(Easing.cubic) });
        const r = dist * (1 - p);
        const trail = 40 + 420 * p * (1 - p);
        return (
          <line
            key={i}
            x1={PIN_X + Math.cos(angle) * r}
            y1={PIN_Y + Math.sin(angle) * r}
            x2={PIN_X + Math.cos(angle) * (r + trail)}
            y2={PIN_Y + Math.sin(angle) * (r + trail)}
            stroke={i % 3 === 0 ? C.cream : C.mint}
            strokeWidth={2 + random(`gather-w-${i}`) * 4}
            strokeLinecap="round"
            opacity={interpolate(p, [0, 0.9, 1], [0.8, 0.9, 0])}
          />
        );
      })}
    </svg>
  );
};

const Pin: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fall = (f: number) => interpolate(f, [10, IMPACT], [-1400, 0], { ...CLAMP, easing: Easing.in(Easing.quad) });
  const land = spring({ frame: frame - IMPACT, fps, config: { damping: 7, stiffness: 320 } });
  const squash = frame < IMPACT ? 1.12 : interpolate(land, [0, 1], [0.72, 1]);
  const style = { transformOrigin: origin(PIN.x, PIN.tipY), scale: `${frame < IMPACT ? 0.94 : 2 - squash} ${squash}` };
  return (
    <>
      {/* A fading trail behind the falling pin reads as motion blur. */}
      {frame < IMPACT &&
        [3, 2, 1].map((k) => <Part key={k} name="pin" style={{ ...style, translate: `0 ${fall(frame - k * 1.3)}px`, opacity: 0.12 * (4 - k) }} />)}
      <Part name="pin" style={{ ...style, translate: `0 ${fall(frame)}px`, opacity: frame < 10 ? 0 : 1 }} />
    </>
  );
};

export const LogoBuild: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = (at: number, damping = 13) => spring({ frame: frame - at, fps, config: { damping, stiffness: 160 } });
  const word = enter(beat(1));
  const souq = enter(beat(1.5), 11);
  const wings = enter(beat(2));
  const ribbon = enter(beat(3), 20);
  const tagline = enter(beat(4) + 2, 18);

  const t = frame - IMPACT;
  const shake = t >= 0 && t < 14 ? 18 * (1 - t / 14) : 0;
  const zoom = interpolate(frame, [ZOOM_START, APP_START], [0, 1], { ...CLAMP, easing: Easing.in(Easing.cubic) });
  const shine = interpolate(frame, [SHINE_START, SHINE_START + 24], [-30, 130], CLAMP);
  const hidden = (at: number) => (frame < at ? 0 : 1);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, #0B5E52 0%, ${C.deep} 45%, ${C.ink} 100%)`, overflow: "hidden" }}>
      {/* The camera: it shakes on impact, then dives into the pin's cream dot. */}
      <AbsoluteFill
        style={{
          transformOrigin: `${PIN_X}px ${PIN_Y}px`,
          scale: Math.pow(70, zoom),
          translate: `${shake * Math.sin(frame * 2.1)}px ${shake * Math.cos(frame * 2.9)}px`,
          filter: zoom > 0 ? `blur(${zoom * 6}px)` : undefined,
        }}
      >
        <AbsoluteFill
          style={{
            // Tall enough to light the tagline under the logo too.
            background: "radial-gradient(ellipse 620px 560px at 540px 930px, rgba(250,248,238,1) 0%, rgba(250,248,238,0.95) 45%, rgba(250,248,238,0.35) 75%, rgba(250,248,238,0) 100%)",
            opacity: interpolate(frame, [IMPACT, IMPACT + 8], [0, 1], CLAMP),
          }}
        />
        <Gather />
        <Rings x={PIN_X} y={PIN_Y} color={C.brand} start={IMPACT} every={6} count={4} total={3} maxRadius={1100} strokeWidth={5} />
        <div style={{ position: "absolute", left: LEFT, top: TOP, width: W, height: H, filter: "drop-shadow(0 26px 30px rgba(2, 27, 23, 0.22))" }}>
          <Part
            name="jarablus"
            style={{ opacity: hidden(beat(1)) * Math.min(1, word * 2), translate: `0 ${(1 - word) * 150}px`, filter: `blur(${(1 - Math.min(1, word)) * 14}px)` }}
          />
          <Part
            name="souq"
            style={{ opacity: hidden(beat(1.5)) * Math.min(1, souq * 2), translate: `0 ${(1 - souq) * -170}px`, rotate: `${(1 - souq) * -8}deg`, transformOrigin: origin(831, 137) }}
          />
          <Part
            name="wings"
            style={{ opacity: hidden(beat(2)) * Math.min(1, wings * 2), translate: `${(1 - wings) * -460}px 0`, rotate: `${(1 - wings) * -35}deg`, transformOrigin: origin(348, 190) }}
          />
          <Part name="ribbon" style={{ opacity: hidden(beat(3)), clipPath: `inset(0 ${50 * (1 - ribbon)}% 0 ${50 * (1 - ribbon)}%)` }} />
          <Pin />
          {/* A band of light sweeping across the logo, shaped by the logo itself. */}
          <Img
            src={staticFile("logo.png")}
            style={{
              position: "absolute",
              width: W,
              height: H,
              filter: "brightness(0) invert(1)",
              opacity: frame < SHINE_START ? 0 : 0.8,
              WebkitMaskImage: `linear-gradient(105deg, transparent ${shine - 16}%, black ${shine}%, transparent ${shine + 16}%)`,
              maskImage: `linear-gradient(105deg, transparent ${shine - 16}%, black ${shine}%, transparent ${shine + 16}%)`,
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            top: TOP + H + 34,
            left: 60,
            right: 60,
            textAlign: "center",
            direction: "rtl",
            fontFamily: TEXT,
            fontWeight: 700,
            fontSize: 56,
            color: C.deep,
            opacity: hidden(beat(4) + 2) * tagline,
            translate: `0 ${(1 - tagline) * 30}px`,
          }}
        >
          كل سوق جرابلس وريفها بمكان واحد
        </div>
        <Burst x={PIN_X} y={PIN_Y} start={IMPACT} seed="impact" colors={[C.mint, C.cream, C.brand]} count={40} />
        {/* The pin's cream dot as a crisp vector circle, which fills the screen as the camera dives in. */}
        <svg width={1080} height={1920} style={{ position: "absolute", opacity: interpolate(frame, [ZOOM_START, ZOOM_START + 4], [0, 1], CLAMP) }}>
          <circle cx={PIN_X} cy={PIN_Y} r={PIN.dot * SCALE} fill={PIN_CREAM} />
        </svg>
      </AbsoluteFill>
      {/* White flash on impact. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${PIN_X}px ${PIN_Y}px, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) ${interpolate(t, [0, 8], [10, 70], CLAMP)}%)`,
          opacity: t < 0 ? 0 : interpolate(t, [0, 8], [1, 0], CLAMP),
        }}
      />
    </AbsoluteFill>
  );
};
