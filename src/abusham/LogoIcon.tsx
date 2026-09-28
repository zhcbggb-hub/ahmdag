import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP } from "../jarablus/theme";
import { A } from "./theme";

// The office's mark redrawn as vector shapes so each part can move: three towers rising out of an arc,
// with a house roof and its little window in front. Drawn on a 400 x 340 grid.
const TOWERS = [
  { x: 118, w: 58, top: 118, cols: 2, delay: 4 },
  { x: 176, w: 68, top: 40, cols: 3, delay: 0, slant: 18 },
  { x: 244, w: 56, top: 92, cols: 2, delay: 8 },
];
const BASE = 262;

export const LogoIcon: React.FC<{ size: number; start?: number; color?: string; accent?: string }> = ({ size, start = 0, color = A.navy, accent = A.royal }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - start;
  const arc = interpolate(f, [0, 12], [1, 0], CLAMP);
  const roof = spring({ frame: f - 16, fps, config: { damping: 10, stiffness: 220 } });
  const win = spring({ frame: f - 24, fps, config: { damping: 9, stiffness: 260 } });
  return (
    <svg viewBox="0 0 400 340" width={size} height={(size * 340) / 400} style={{ overflow: "visible" }}>
      <defs>
        {TOWERS.map((t, i) => {
          const rise = spring({ frame: f - 4 - t.delay, fps, config: { damping: 16, stiffness: 120 } });
          const top = t.top + (1 - Math.min(1, rise)) * (BASE - t.top);
          return (
            <clipPath key={i} id={`tower-rise-${i}`}>
              <rect x={t.x - 2} y={top} width={t.w + 4} height={BASE - top + 2} />
            </clipPath>
          );
        })}
      </defs>
      {/* The arc underneath, drawn like a pen stroke. */}
      <path d="M 44 150 A 158 158 0 0 0 356 150" fill="none" stroke={accent} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={arc} />
      {TOWERS.map((t, i) => (
        <g key={i} clipPath={`url(#tower-rise-${i})`}>
          <path d={`M ${t.x} ${BASE} L ${t.x} ${t.top + (t.slant ?? 0)} L ${t.x + t.w} ${t.top} L ${t.x + t.w} ${BASE} Z`} fill={color} stroke="white" strokeWidth={4} />
          {new Array(t.cols).fill(0).map((_, c) => (
            <rect key={c} x={t.x + 10 + c * ((t.w - 20) / t.cols) + 2} y={t.top + (t.slant ?? 0) + 18} width={(t.w - 20) / t.cols - 6} height={BASE - t.top - (t.slant ?? 0) - 60} rx={2} fill="white" opacity={0.95} />
          ))}
        </g>
      ))}
      {/* The house roof drops onto the towers, outlined in white so it reads in front of them. */}
      <g style={{ translate: `0 ${(1 - roof) * -90}px`, opacity: Math.min(1, roof * 2) }}>
        <path d="M 70 262 L 200 168 L 330 262" fill="none" stroke="white" strokeWidth={40} strokeLinejoin="round" strokeLinecap="round" />
        <path d="M 70 262 L 200 168 L 330 262" fill="none" stroke={color} strokeWidth={24} strokeLinejoin="round" strokeLinecap="round" />
        {/* The house front under the roof, which the window sits on. */}
        <path d="M 96 264 L 200 188 L 304 264 Z" fill="white" />
      </g>
      <g style={{ scale: win, transformOrigin: "200px 238px" }}>
        <rect x={186} y={222} width={13} height={13} fill={color} />
        <rect x={202} y={222} width={13} height={13} fill={color} />
        <rect x={186} y={238} width={13} height={13} fill={color} />
        <rect x={202} y={238} width={13} height={13} fill={color} />
      </g>
    </svg>
  );
};
