import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Hud, Words } from "../components";
import { C, CLAMP, DISPLAY, EASE_OUT } from "../theme";

export const NO_MIDDLEMAN_DURATION = 110;

const CELL = 120;
const COLS = Math.ceil(1080 / CELL) + 1;
const ROWS = Math.ceil(1920 / CELL) + 1;
const hash = (n: number) => {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
};

// Truchet tiles: quarter circles that flip in a wave spreading from the center.
const Pattern: React.FC = () => {
  const frame = useCurrentFrame();
  const r = CELL / 2;
  const tile = `M ${r} 0 A ${r} ${r} 0 0 1 0 ${r} M ${CELL} ${r} A ${r} ${r} 0 0 0 ${r} ${CELL}`;
  const cells = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cx = col * CELL + r;
      const cy = row * CELL + r;
      const dist = Math.hypot(cx - 540, cy - 960);
      const phase = frame * 1.3 - dist / 14;
      const k = Math.floor(phase / 26);
      const turn = interpolate(phase - k * 26, [0, 9], [0, 1], { ...CLAMP, easing: EASE_OUT });
      const rotation = (hash(row * COLS + col) > 0.5 ? 90 : 0) + 90 * (Math.max(k, 0) + (phase > 0 ? turn : 0));
      cells.push(<path key={`${row}-${col}`} d={tile} transform={`translate(${col * CELL} ${row * CELL}) rotate(${rotation} ${r} ${r})`} />);
    }
  }
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g fill="none" stroke={C.mint} strokeWidth={16} strokeLinecap="round" opacity={0.28}>
        {cells}
      </g>
    </svg>
  );
};

const Band: React.FC<{ text: string; top: number; from: "right" | "left"; start: number; bg: string; tilt: number }> = ({ text, top, from, start, bg, tilt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - start, fps, config: { damping: 18, stiffness: 150 } });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: -60,
        right: -60,
        height: 250,
        background: bg,
        rotate: `${tilt}deg`,
        translate: `${interpolate(p, [0, 1], [from === "right" ? 1300 : -1300, 0])}px 0`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 30px 70px rgba(2, 27, 23, 0.4)",
      }}
    >
      <div style={{ direction: "rtl", fontFamily: DISPLAY, fontWeight: 900, fontSize: 170, color: C.deep, lineHeight: 1 }}>{text}</div>
    </div>
  );
};

export const NoMiddlemanScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.deep, overflow: "hidden" }}>
      <Pattern />
      <AbsoluteFill style={{ scale: interpolate(frame, [0, NO_MIDDLEMAN_DURATION], [1, 1.06], CLAMP) }}>
        <Band text="بلا وسيط" top={640} from="right" start={4} bg={C.cream} tilt={-4} />
        <Band text="بلا عمولة" top={930} from="left" start={18} bg={C.mint} tilt={-4} />
      </AbsoluteFill>
      <AbsoluteFill style={{ top: 1290, height: 200, justifyContent: "center" }}>
        <Words text={"بيع واشتري داخل *مدينتك"} start={44} stagger={4} size={62} weight={700} color={C.paper} accent={C.mint} />
      </AbsoluteFill>
      <Hud index={4} total={6} label="تواصل مع البائع مباشرة" color={C.cream} />
    </AbsoluteFill>
  );
};
