import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Burst, Rings, Words } from "../jarablus/components";
import { CLAMP, DISPLAY } from "../jarablus/theme";
import { LogoIcon } from "./LogoIcon";
import { A, LOGO_START, SERVICES_START } from "./theme";

export const LOGO_REVEAL_DURATION = SERVICES_START - LOGO_START;

const SERVICES = ["بيع", "شراء", "آجار"];

// On the drop: the mark builds itself, then the office's name, its ribbon and the list of services.
export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ribbon = spring({ frame: frame - 34, fps, config: { damping: 14, stiffness: 180 } });
  const shake = frame < 10 ? 16 * (1 - frame / 10) : 0;
  const shine = interpolate(frame, [70, 92], [-30, 130], CLAMP);
  const leave = interpolate(frame, [LOGO_REVEAL_DURATION - 8, LOGO_REVEAL_DURATION], [0, 1], CLAMP);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 800px 900px at 540px 700px, white 0%, ${A.ice} 60%, #C9E2FB 100%)`, overflow: "hidden" }}>
      {/* The office's own photo of towers, faded into the bottom of the frame. */}
      <Img
        src={staticFile("abusham/banner.jpg")}
        style={{
          position: "absolute",
          width: 1600,
          maxWidth: "none",
          left: -40,
          bottom: -150, // keeps the design's row of service icons below the frame
          opacity: 0.28,
          // Only the towers: the design's text and its side panel are cut away.
          clipPath: "inset(0 34% 0 0)",
          WebkitMaskImage: "linear-gradient(0deg, black 25%, transparent 55%)",
          maskImage: "linear-gradient(0deg, black 25%, transparent 55%)",
        }}
      />
      <AbsoluteFill style={{ translate: `${Math.sin(frame * 2.7) * shake}px ${Math.cos(frame * 3.1) * shake}px`, scale: 1 + leave * 0.2, opacity: 1 - leave * 0.6 }}>
        <Rings x={540} y={560} color={A.royal} start={0} every={6} count={4} total={3} maxRadius={1000} strokeWidth={5} />
        <div style={{ position: "absolute", top: 270, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <LogoIcon size={640} />
        </div>
        <Burst x={540} y={560} start={18} seed="abusham-logo" colors={[A.royal, A.sky, A.gold]} count={40} />
        <div style={{ position: "absolute", top: 860, left: 0, right: 0, overflow: "hidden" }}>
          <Words text="مكتب أبو شام" start={20} stagger={5} size={132} color={A.navy} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(105deg, transparent ${shine - 10}%, rgba(255,255,255,0.8) ${shine}%, transparent ${shine + 10}%)`,
              mixBlendMode: "overlay",
            }}
          />
        </div>
        <div style={{ position: "absolute", top: 1060, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              direction: "rtl",
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: 58,
              color: "white",
              background: A.navy,
              borderRadius: 18,
              padding: "6px 60px 14px",
              letterSpacing: 4,
              clipPath: `inset(0 ${50 * (1 - Math.min(1, ribbon))}% 0 ${50 * (1 - Math.min(1, ribbon))}%)`,
            }}
          >
            العقاري
          </div>
        </div>
        <div style={{ position: "absolute", top: 1200, left: 50, right: 50, display: "flex", justifyContent: "center" }}>
          <div style={{ direction: "rtl", display: "flex", gap: 16, background: A.royal, borderRadius: 60, padding: "14px 34px 20px", boxShadow: "0 20px 50px rgba(6,71,175,0.35)", opacity: interpolate(frame, [44, 50], [0, 1], CLAMP) }}>
            {SERVICES.map((s, i) => (
              <span key={s} style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 44, color: "white", opacity: interpolate(frame, [48 + i * 5, 54 + i * 5], [0, 1], CLAMP) }}>
                {s}
                {i < SERVICES.length - 1 && <span style={{ color: A.sky, marginInlineStart: 16 }}>•</span>}
              </span>
            ))}
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "white", opacity: interpolate(frame, [0, 8], [1, 0], CLAMP) }} />
    </AbsoluteFill>
  );
};
