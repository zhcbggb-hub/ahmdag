import { interpolate, useCurrentFrame } from "remotion";

// A young man from Jarablus, drawn flat. `pose` sets his arms and face; he breathes and blinks on his own.
export type Pose = "shoot" | "type" | "sad" | "happy";

const SKIN = "#D6A27A";
const SKIN_SHADE = "#BF8A63";
const HAIR = "#2A1E17";
const SHIRT = "#4A6B8A";
const SHIRT_SHADE = "#3B5874";
const JEANS = "#2B3547";
const SHOES = "#1A1A1A";

// Shoulder and elbow angles in degrees (0 = straight down, positive = towards his left, the viewer's right).
const ARMS: Record<Pose, { l: [number, number]; r: [number, number]; head: number; phoneY: number }> = {
  shoot: { l: [-100, -10], r: [-60, -40], head: -6, phoneY: 230 },
  type: { l: [-10, -35], r: [10, 35], head: 10, phoneY: 400 },
  sad: { l: [-4, -30], r: [4, 30], head: 18, phoneY: 420 },
  happy: { l: [-15, -100], r: [165, 10], head: -4, phoneY: 0 },
};

const Arm: React.FC<{ x: number; y: number; a: number; b: number; hand?: React.ReactNode }> = ({ x, y, a, b, hand }) => (
  <g transform={`translate(${x} ${y}) rotate(${a})`}>
    <rect x={-17} y={-6} width={34} height={96} rx={17} fill={SHIRT} />
    <g transform={`translate(0 84) rotate(${b})`}>
      <rect x={-14} y={-6} width={28} height={88} rx={14} fill={SKIN} />
      <rect x={-17} y={-8} width={34} height={22} rx={10} fill={SHIRT_SHADE} />
      <circle cx={0} cy={84} r={17} fill={SKIN} />
      {hand}
    </g>
  </g>
);

export const Character: React.FC<{ pose: Pose; x: number; y: number; scale?: number; flip?: boolean }> = ({ pose, x, y, scale = 1, flip }) => {
  const frame = useCurrentFrame();
  const p = ARMS[pose];
  const breathe = Math.sin(frame / 14) * 2.5;
  const blink = frame % 96 > 92 ? 0.15 : 1;
  const sad = pose === "sad";
  const happy = pose === "happy";
  const lookDown = pose === "type" || sad;
  const bounce = happy ? Math.abs(Math.sin(frame / 6)) * -10 : 0;
  return (
    <svg
      width={400 * scale}
      height={820 * scale}
      viewBox="0 0 400 820"
      style={{ position: "absolute", left: x, top: y, overflow: "visible", transform: flip ? "scaleX(-1)" : undefined, filter: "drop-shadow(0 30px 30px rgba(0,0,0,0.35))" }}
    >
      <ellipse cx={200} cy={806} rx={120} ry={14} fill="black" opacity={0.3} />
      <g transform={`translate(0 ${bounce})`}>
        {/* Legs */}
        <rect x={140} y={480} width={54} height={300} rx={22} fill={JEANS} />
        <rect x={206} y={480} width={54} height={300} rx={22} fill={JEANS} />
        <rect x={128} y={770} width={72} height={30} rx={14} fill={SHOES} />
        <rect x={200} y={770} width={72} height={30} rx={14} fill={SHOES} />
        {/* Body */}
        <g transform={`translate(0 ${breathe * 0.5})`}>
          <path d={`M 125 ${sad ? 280 : 270} Q 200 ${sad ? 250 : 238} 275 ${sad ? 280 : 270} L 285 510 Q 200 530 115 510 Z`} fill={SHIRT} />
          <path d="M 200 262 L 200 515" stroke={SHIRT_SHADE} strokeWidth={4} opacity={0.6} />
          <path d="M 172 250 Q 200 285 228 250" fill={SKIN_SHADE} />
          {/* Head */}
          <g transform={`translate(200 190) rotate(${p.head * (lookDown ? 0.3 : 1)}) translate(-200 -190)`}>
            <rect x={184} y={210} width={32} height={40} rx={10} fill={SKIN_SHADE} />
            <ellipse cx={200} cy={160 + (lookDown ? 8 : 0)} rx={66} ry={74} fill={SKIN} />
            <ellipse cx={136} cy={168} rx={12} ry={18} fill={SKIN_SHADE} />
            <ellipse cx={264} cy={168} rx={12} ry={18} fill={SKIN_SHADE} />
            {/* Hair and a short beard */}
            <path d="M 134 150 Q 128 78 200 76 Q 274 76 268 150 Q 256 112 200 110 Q 150 112 134 150 Z" fill={HAIR} />
            <path d={`M 146 ${lookDown ? 196 : 188} Q 200 ${lookDown ? 262 : 254} 254 ${lookDown ? 196 : 188} Q 250 ${lookDown ? 228 : 220} 200 ${lookDown ? 240 : 232} Q 150 ${lookDown ? 228 : 220} 146 ${lookDown ? 196 : 188} Z`} fill={HAIR} opacity={0.35} />
            {/* Face */}
            <g transform={`translate(0 ${lookDown ? 14 : 0})`}>
              <ellipse cx={176} cy={156} rx={7} ry={9 * blink} fill="#1B1410" />
              <ellipse cx={224} cy={156} rx={7} ry={9 * blink} fill="#1B1410" />
              <path d={sad ? "M 162 136 L 186 130" : "M 162 132 Q 176 124 188 132"} stroke={HAIR} strokeWidth={6} strokeLinecap="round" fill="none" />
              <path d={sad ? "M 214 130 L 238 136" : "M 212 132 Q 224 124 238 132"} stroke={HAIR} strokeWidth={6} strokeLinecap="round" fill="none" />
              <path d="M 198 160 Q 194 178 202 182" stroke={SKIN_SHADE} strokeWidth={5} strokeLinecap="round" fill="none" />
              {happy ? (
                <path d="M 176 196 Q 200 222 224 196 Z" fill="#7A2E24" />
              ) : sad ? (
                <path d="M 182 206 Q 200 194 218 206" stroke="#7A2E24" strokeWidth={5} strokeLinecap="round" fill="none" />
              ) : (
                <path d="M 184 200 Q 200 208 216 200" stroke="#7A2E24" strokeWidth={5} strokeLinecap="round" fill="none" />
              )}
            </g>
          </g>
          {/* Arms; the phone is in his right hand (the viewer's left). */}
          <Arm x={128} y={290} a={p.l[0]} b={p.l[1]} />
          <Arm x={272} y={290} a={p.r[0]} b={p.r[1]} hand={pose === "happy" ? <rect x={-30} y={60} width={60} height={104} rx={12} fill="#11181A" stroke="#3A4548" strokeWidth={4} /> : undefined} />
          {(pose === "type" || pose === "sad") && <rect x={168} y={p.phoneY - 70} width={64} height={110} rx={12} fill="#11181A" stroke="#3A4548" strokeWidth={4} transform={`rotate(${sad ? 8 : -8} 200 ${p.phoneY})`} />}
          {pose === "shoot" && (
            <g>
              <rect x={318} y={p.phoneY - 80} width={40} height={150} rx={10} fill="#11181A" stroke="#3A4548" strokeWidth={4} />
              <circle cx={338} cy={p.phoneY - 50} r={7} fill="#2B3A3D" />
            </g>
          )}
          {happy && <path d={`M 110 ${260 + interpolate(Math.sin(frame / 6), [-1, 1], [0, 6])} l -24 -16 M 104 280 l -30 -2 M 110 300 l -24 12`} stroke="#F5C542" strokeWidth={6} strokeLinecap="round" />}
        </g>
      </g>
    </svg>
  );
};
