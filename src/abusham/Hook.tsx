import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { Words } from "../jarablus/components";
import { CLAMP, TEXT } from "../jarablus/theme";
import { A, beat, LOGO_START } from "./theme";

export const HOOK_DURATION = LOGO_START;

const draw = (frame: number, from: number, to: number) => interpolate(frame, [from, to], [1, 0], CLAMP);

// An architect's elevation of a tower, drawn line by line on blueprint paper, then glazed just before the drop.
const Blueprint: React.FC = () => {
  const frame = useCurrentFrame();
  const floors = new Array(12).fill(0).map((_, i) => 1430 - i * 66);
  const mullions = [400, 470, 540, 610, 680];
  const topAt = (x: number) => 620 - ((x - 330) / 420) * 60;
  const glaze = interpolate(frame, [beat(5.2), beat(6.6)], [0, 1], CLAMP);
  const line = { fill: "none", stroke: "white", strokeLinecap: "round" as const, pathLength: 1, strokeDasharray: 1 };
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={A.sky} />
          <stop offset="55%" stopColor={A.royal} />
          <stop offset="100%" stopColor={A.navy} />
        </linearGradient>
      </defs>
      <path d="M 330 1500 L 330 620 L 750 560 L 750 1500 Z" fill="url(#glass)" opacity={glaze * 0.9} />
      <path d="M 120 1500 L 960 1500" {...line} strokeWidth={5} strokeDashoffset={draw(frame, 0, 12)} />
      <path d="M 330 1500 L 330 620 L 750 560 L 750 1500" {...line} strokeWidth={6} strokeDashoffset={draw(frame, 2, 30)} />
      {floors.map((y, i) => (
        <path key={y} d={`M 330 ${y} L 750 ${y}`} {...line} strokeWidth={2.5} opacity={0.85} strokeDashoffset={draw(frame, 14 + i * 3, 24 + i * 3)} />
      ))}
      {mullions.map((x, i) => (
        <path key={x} d={`M ${x} 1500 L ${x} ${topAt(x)}`} {...line} strokeWidth={2.5} opacity={0.85} strokeDashoffset={draw(frame, 30 + i * 4, 52 + i * 4)} />
      ))}
      {/* Dimension line with ticks, as on a real drawing. */}
      <path d="M 830 560 L 830 1500 M 810 560 L 850 560 M 810 1500 L 850 1500" {...line} strokeWidth={3} opacity={0.7} strokeDashoffset={draw(frame, 40, 62)} />
      <text x={870} y={1040} fill="white" opacity={interpolate(frame, [58, 66], [0, 0.8], CLAMP)} fontFamily={TEXT} fontSize={34} transform="rotate(90 870 1040)">٤٨٫٠٠ م</text>
      <text x={330} y={1560} fill="white" opacity={interpolate(frame, [20, 30], [0, 0.6], CLAMP)} fontFamily={TEXT} fontSize={30}>مخطط رقم ٠١</text>
    </svg>
  );
};

const QUESTIONS = ["بدك *بيت؟", "*أرض؟", "*محل؟"];

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: A.blueprint,
        backgroundImage: `linear-gradient(rgba(79,163,247,0.35) 2px, transparent 2px), linear-gradient(90deg, rgba(79,163,247,0.35) 2px, transparent 2px), linear-gradient(rgba(79,163,247,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(79,163,247,0.14) 1px, transparent 1px)`,
        backgroundSize: "240px 240px, 240px 240px, 60px 60px, 60px 60px",
        overflow: "hidden",
      }}
    >
      <AbsoluteFill style={{ scale: interpolate(frame, [0, HOOK_DURATION], [1, 1.08], CLAMP), transformOrigin: "540px 1000px" }}>
        <Blueprint />
      </AbsoluteFill>
      {QUESTIONS.map((q, i) => (
        <Sequence key={q} from={i === 0 ? 0 : beat(1 + i * 2)} durationInFrames={i === 0 ? beat(3) : beat(2)} layout="absolute-fill">
          <AbsoluteFill style={{ top: 230, height: 300, justifyContent: "center" }}>
            <Words text={q} start={i === 0 ? 2 : 0} stagger={4} size={150} color="white" accent={A.sky} style={{ textShadow: "0 10px 40px rgba(0,17,47,0.6)" }} />
          </AbsoluteFill>
        </Sequence>
      ))}
      <AbsoluteFill style={{ background: "white", opacity: interpolate(frame, [HOOK_DURATION - 4, HOOK_DURATION], [0, 1], CLAMP) }} />
    </AbsoluteFill>
  );
};
