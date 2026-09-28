import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Burst, Rings, Words } from "../components";
import { C, CLAMP, TEXT } from "../theme";
import { AppIcon } from "./parts";
import { b, END_START, STORY_DURATION } from "./timing";

export const END_DURATION = STORY_DURATION - END_START;

// The app now sits on the viewer's home screen.
export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const icon = spring({ frame: frame - 4, fps, config: { damping: 10, stiffness: 190 } });
  const logo = spring({ frame, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, white 0%, ${C.paper} 50%, #E3ECE6 100%)`, overflow: "hidden" }}>
      <Img src={staticFile("logo.png")} style={{ position: "absolute", left: 540 - 260, top: 250, width: 520, maxWidth: "none", opacity: logo, translate: `0 ${(1 - logo) * -40}px` }} />
      <Rings x={540} y={820} color={C.brand} start={4} every={8} count={4} total={3} maxRadius={700} strokeWidth={4} />
      <div style={{ position: "absolute", top: 700, left: 0, right: 0, display: "flex", justifyContent: "center", scale: interpolate(icon, [0, 1], [0.3, 1]), opacity: Math.min(1, icon * 2) }}>
        <AppIcon size={200} />
      </div>
      <Burst x={540} y={800} start={5} seed="end" colors={[C.mint, C.brand, C.cream]} count={40} />
      <AbsoluteFill style={{ top: 1030, height: 200, justifyContent: "center" }}>
        <Words text={"صار عندك *سوق *جرابلس ✓"} start={b(1)} stagger={4} size={76} color={C.deep} accent={C.brand} />
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 1240, left: 0, right: 0, textAlign: "center", fontFamily: TEXT, fontWeight: 600, fontSize: 54, color: C.deep, opacity: interpolate(frame, [b(2), b(2) + 10], [0, 1], CLAMP) }}>
        jarablus.store/app
      </div>
    </AbsoluteFill>
  );
};
