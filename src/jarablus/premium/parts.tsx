import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { C, CLAMP, DISPLAY, EASE_IN_OUT, EASE_OUT } from "../theme";

// Calm, premium motion: every element eases in over about two thirds of a second and nothing bounces.
export const ease = (frame: number, from: number, duration = 20, easing = EASE_OUT) => interpolate(frame, [from, from + duration], [0, 1], { ...CLAMP, easing });

// A line of Arabic text revealed by a mask sweeping right to left, the reading direction, and faded out at `out`.
export const Line: React.FC<{
  text: string;
  at: number;
  out?: number;
  top: number;
  size: number;
  color: string;
  weight?: number;
  glow?: string;
  style?: React.CSSProperties;
}> = ({ text, at, out, top, size, color, weight = 900, glow, style }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, at, 22);
  const q = out === undefined ? 0 : ease(frame, out, 12, EASE_IN_OUT);
  if (p === 0 || q === 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 50,
        right: 50,
        direction: "rtl",
        textAlign: "center",
        fontFamily: DISPLAY,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.35,
        color,
        clipPath: `inset(-30% 0 -30% ${(1 - p) * 100}%)`,
        translate: `0 ${(1 - p) * 26 - q * 24}px`,
        opacity: Math.min(1, p * 1.4) * (1 - q),
        filter: `blur(${(1 - p) * 6}px)`,
        textShadow: glow ? `0 0 40px ${glow}` : "0 6px 24px rgba(0,0,0,0.35)",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// The dark brand backdrop: a deep green gradient with two slow glows and a few drifting specks of light.
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 120% 80% at 50% 30%, #07483E 0%, ${C.ink} 70%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: 450, left: -300 + Math.sin(frame / 90) * 60, top: 200, background: C.brand, opacity: 0.22, filter: "blur(160px)" }} />
      <div style={{ position: "absolute", width: 800, height: 800, borderRadius: 400, right: -320 + Math.cos(frame / 110) * 60, top: 1100, background: C.mint, opacity: 0.12, filter: "blur(170px)" }} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        {new Array(26).fill(0).map((_, i) => {
          const x = random(`px${i}`) * 1080 + Math.sin(frame / 60 + i) * 20;
          const y = (((random(`py${i}`) * 2100 - frame * (0.4 + random(`pv${i}`) * 0.6)) % 2100) + 2100) % 2100 - 90;
          return <circle key={i} cx={x} cy={y} r={1.5 + random(`pr${i}`) * 3} fill={C.mint} opacity={0.12 + random(`po${i}`) * 0.25} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

// A soft band of light crossing its parent once, between `at` and `at + duration`.
export const LightSweep: React.FC<{ at: number; duration?: number; strength?: number }> = ({ at, duration = 30, strength = 0.22 }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [at, at + duration], [-40, 140], { ...CLAMP, easing: EASE_IN_OUT });
  if (frame < at || frame > at + duration) return null;
  return <AbsoluteFill style={{ pointerEvents: "none", background: `linear-gradient(110deg, transparent ${x - 18}%, rgba(255,255,255,${strength}) ${x}%, transparent ${x + 18}%)` }} />;
};

export const PHONE_W = 400;
export const PHONE_H = (PHONE_W * 1280) / 627;
const BEZEL = 12;

// A phone held slightly turned, floating gently. `top` is its top edge; `scale` shrinks it about that edge.
export const Phone: React.FC<{ cx: number; top: number; scale?: number; opacity?: number; blur?: number; turn?: number; children: React.ReactNode }> = ({
  cx,
  top,
  scale = 1,
  opacity = 1,
  blur = 0,
  turn = -7,
  children,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: cx - PHONE_W / 2 - BEZEL,
        top,
        width: PHONE_W + BEZEL * 2,
        height: PHONE_H + BEZEL * 2,
        padding: BEZEL,
        borderRadius: 58,
        background: "#0A100F",
        boxShadow: "0 70px 120px rgba(0,0,0,0.5), 0 0 0 2px #25302E, 0 0 90px rgba(18,201,178,0.18)",
        transformOrigin: "50% 0%",
        transform: `perspective(2000px) rotateY(${turn + Math.sin(frame / 45) * 3}deg) rotateX(${3 + Math.cos(frame / 60) * 1.5}deg) scale(${scale}) translateY(${Math.sin(frame / 38) * 8}px)`,
        opacity,
        filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
      }}
    >
      <div style={{ position: "relative", width: PHONE_W, height: PHONE_H, borderRadius: 46, overflow: "hidden", background: C.paper }}>
        {children}
        {/* A faint reflection on the glass. */}
        <AbsoluteFill style={{ background: "linear-gradient(125deg, rgba(255,255,255,0.14) 0%, transparent 32%)", pointerEvents: "none" }} />
      </div>
    </div>
  );
};

// A real screenshot filling the phone's screen. Screenshots keep their proportions and are cropped only at the bottom.
export const Shot: React.FC<{ src: string; x?: number; dim?: number }> = ({ src, x = 0, dim = 0 }) => (
  <Img
    src={staticFile(src)}
    style={{ position: "absolute", width: PHONE_W, height: PHONE_H, objectFit: "cover", objectPosition: "top", maxWidth: "none", translate: `${x * PHONE_W}px 0`, filter: dim ? `brightness(${1 - dim})` : undefined }}
  />
);

// Screens changing like the app's own navigation: the next screen slides in from the left over 12 frames.
export const Screens: React.FC<{ list: { src: string; at: number }[] }> = ({ list }) => {
  const frame = useCurrentFrame();
  const current = Math.max(0, list.filter((s) => frame >= s.at).length - 1);
  const p = current === 0 ? 1 : interpolate(frame, [list[current].at, list[current].at + 12], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  return (
    <>
      {p < 1 && <Shot src={list[current - 1].src} x={p * 0.3} dim={p * 0.4} />}
      <Shot src={list[current].src} x={p - 1} />
    </>
  );
};

// A frosted-glass panel.
export const glass = (radius = 32): React.CSSProperties => ({
  background: "rgba(255,255,255,0.09)",
  border: "1.5px solid rgba(255,255,255,0.22)",
  borderRadius: radius,
  backdropFilter: "blur(18px)",
  boxShadow: "0 24px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.18)",
});
