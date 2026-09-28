import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { C, CLAMP, DISPLAY, EASE_IN_OUT, EASE_OUT, TEXT } from "./theme";

const toArabicDigits = (n: number) => String(n).padStart(2, "0").replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);

// Arabic letters must stay connected, so text is animated word by word, never letter by letter.
// Lines are split on "\n"; a word starting with "*" is drawn in the accent color.
export const Words: React.FC<{
  text: string;
  start?: number;
  stagger?: number;
  size: number;
  color: string;
  accent?: string;
  weight?: number;
  font?: string;
  lineHeight?: number;
  style?: React.CSSProperties;
}> = ({ text, start = 0, stagger = 4, size, color, accent = C.mint, weight = 900, font = DISPLAY, lineHeight = 1.3, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = text.split("\n");
  let index = 0;

  return (
    <div style={{ direction: "rtl", textAlign: "center", fontFamily: font, fontWeight: weight, fontSize: size, lineHeight, color, ...style }}>
      {lines.map((line, li) => (
        <div key={li}>
          {line.split(" ").map((word, wi) => {
            const p = spring({ frame: frame - start - index++ * stagger, fps, config: { damping: 14, stiffness: 180, mass: 0.7 } });
            return (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  marginInline: size * 0.12,
                  color: word.startsWith("*") ? accent : undefined,
                  opacity: interpolate(p, [0, 0.35], [0, 1], CLAMP),
                  scale: interpolate(p, [0, 1], [1.6, 1]),
                  translate: `0 ${interpolate(p, [0, 1], [size * 0.25, 0])}px`,
                  filter: `blur(${interpolate(p, [0, 0.6], [18, 0], CLAMP)}px)`,
                }}
              >
                {word.replace(/^\*/, "")}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Small corner labels, like a motion designer's working frame.
export const Hud: React.FC<{ index: number; total: number; label: string; color: string }> = ({ index, total, label, color }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ direction: "rtl", fontFamily: TEXT, fontSize: 28, fontWeight: 500, color, opacity: interpolate(frame, [0, 8], [0, 0.75], CLAMP) }}>
      <div style={{ position: "absolute", top: 170, right: 80, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 14, height: 14, borderRadius: 7, background: color }} />
        سوق جرابلس
      </div>
      <div style={{ position: "absolute", top: 170, left: 80, letterSpacing: 2 }}>
        {toArabicDigits(index)} / {toArabicDigits(total)}
      </div>
      <div style={{ position: "absolute", top: 222, right: 80, left: 80, height: 2, background: color, opacity: 0.35 }} />
      <div style={{ position: "absolute", top: 240, right: 80, fontSize: 24, opacity: 0.8 }}>{label}</div>
    </AbsoluteFill>
  );
};

// Ripples spreading out from a point, like the pin in the logo. `total` limits how many rings are sent out.
export const Rings: React.FC<{ x: number; y: number; color: string; count?: number; every?: number; maxRadius?: number; start?: number; strokeWidth?: number; total?: number }> = ({
  x,
  y,
  color,
  count = 4,
  every = 14,
  maxRadius = 900,
  start = 0,
  strokeWidth = 4,
  total,
}) => {
  const frame = useCurrentFrame();
  const life = every * count;
  return (
    <AbsoluteFill>
      <svg width="100%" height="100%" style={{ overflow: "visible" }}>
        {new Array(total ?? count * 3).fill(0).map((_, i) => {
          const t = frame - start - i * every;
          if (t < 0 || t > life) return null;
          const p = t / life;
          return (
            <circle key={i} cx={x} cy={y} r={interpolate(p, [0, 1], [20, maxRadius], { easing: EASE_OUT })} fill="none" stroke={color} strokeWidth={strokeWidth} opacity={interpolate(p, [0, 0.1, 1], [0, 0.9, 0])} />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// A ring of dots slowly turning around a center.
export const OrbitDots: React.FC<{ x: number; y: number; radius: number; count: number; color: string; size?: number; start?: number }> = ({ x, y, radius, count, color, size = 16, start = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <svg width="100%" height="100%">
        {new Array(count).fill(0).map((_, i) => {
          const appear = spring({ frame: frame - start - i * 1.5, fps, config: { damping: 12 } });
          const a = (i / count) * Math.PI * 2 + frame * 0.02;
          const r = radius * interpolate(appear, [0, 1], [0.6, 1]);
          const pulse = 1 + 0.35 * Math.sin(frame * 0.15 + i);
          return <circle key={i} cx={x + Math.cos(a) * r} cy={y + Math.sin(a) * r} r={(size / 2) * appear * pulse} fill={color} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

// Particles thrown out from a point, slowing down and falling a little as they fade.
export const Burst: React.FC<{ x: number; y: number; start: number; seed: string; colors: string[]; count?: number; power?: number; life?: number }> = ({
  x,
  y,
  start,
  seed,
  colors,
  count = 36,
  power = 1,
  life = 36,
}) => {
  const frame = useCurrentFrame();
  const t = frame - start;
  if (t < 0 || t > life) return null;
  return (
    <AbsoluteFill>
      <svg width="100%" height="100%" style={{ overflow: "visible" }}>
        {new Array(count).fill(0).map((_, i) => {
          const angle = random(`${seed}-a-${i}`) * Math.PI * 2;
          const speed = (10 + random(`${seed}-s-${i}`) * 26) * power;
          const travel = speed * 9 * (1 - Math.exp(-t / 9));
          const size = 3 + random(`${seed}-r-${i}`) * 8;
          return (
            <circle
              key={i}
              cx={x + Math.cos(angle) * travel}
              cy={y + Math.sin(angle) * travel + 0.12 * t * t}
              r={size * interpolate(t, [0, life], [1, 0.3])}
              fill={colors[i % colors.length]}
              opacity={interpolate(t, [0, 3, life], [0, 1, 0], CLAMP)}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

export const Icon: React.FC<{ path: string; size: number; color: string; style?: React.CSSProperties }> = ({ path, size, color, style }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={style}>
    <path d={path} fill={color} />
  </svg>
);

// Scene transition: the next scene grows out of a circle.
type CircleProps = { x?: number; y?: number };
const CircleReveal: React.FC<TransitionPresentationComponentProps<CircleProps>> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const x = passedProps.x ?? 50;
  const y = passedProps.y ?? 50;
  // 90% of the reference length (the diagonal / √2) reaches every corner of a 9:16 frame.
  const r = interpolate(presentationProgress, [0, 1], [0, 90], { easing: EASE_IN_OUT });
  return (
    <AbsoluteFill style={presentationDirection === "entering" ? { clipPath: `circle(${r}% at ${x}% ${y}%)` } : undefined}>{children}</AbsoluteFill>
  );
};
export const circleReveal = (props: CircleProps = {}): TransitionPresentation<CircleProps> => ({ component: CircleReveal, props });

// Scene transition: a solid brand-colored bar sweeps across, then the next scene is underneath.
type SweepProps = { color: string };
const Sweep: React.FC<TransitionPresentationComponentProps<SweepProps>> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  if (presentationDirection === "exiting") {
    return <AbsoluteFill style={{ opacity: presentationProgress < 0.5 ? 1 : 0 }}>{children}</AbsoluteFill>;
  }
  // The bar moves right to left, the reading direction of Arabic, and fully covers the frame at the halfway cut.
  const edge = interpolate(presentationProgress, [0, 1], [-20, 280], { easing: EASE_IN_OUT });
  const x = (v: number) => `${100 - v}%`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: presentationProgress < 0.5 ? 0 : 1 }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ background: passedProps.color, clipPath: `polygon(${x(edge - 160)} 0, ${x(edge)} 0, ${x(edge - 20)} 100%, ${x(edge - 180)} 100%)` }} />
    </AbsoluteFill>
  );
};
export const sweep = (props: SweepProps): TransitionPresentation<SweepProps> => ({ component: Sweep, props });

export const Center: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", ...style }}>{children}</AbsoluteFill>
);

export { C };
