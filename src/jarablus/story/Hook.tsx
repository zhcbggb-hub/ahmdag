import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Words } from "../components";
import { C, EASE_IN_OUT, CLAMP } from "../theme";
import { b, SELLER_START } from "./timing";

export const HOOK_DURATION = SELLER_START;

// The screen is split in two: the seller's question on top, the buyer's below. At the end the halves part.
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const top = spring({ frame, fps, config: { damping: 16, stiffness: 140 } });
  const bottom = spring({ frame: frame - b(2), fps, config: { damping: 16, stiffness: 140 } });
  const part = interpolate(frame, [HOOK_DURATION - 9, HOOK_DURATION], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  return (
    <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: C.cream,
          clipPath: "polygon(0 0, 100% 0, 100% 46%, 0 54%)",
          translate: `${(1 - top) * 1100}px ${part * -1000}px`,
        }}
      >
        <AbsoluteFill style={{ top: 330, height: 420, justifyContent: "center" }}>
          <Words text={"عندك شي\n*بدك تبيعو؟"} start={3} stagger={7} size={124} color={C.deep} accent={C.brand} />
        </AbsoluteFill>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(160deg, ${C.deep}, ${C.ink})`,
          clipPath: "polygon(0 54%, 100% 46%, 100% 100%, 0 100%)",
          translate: `${(1 - bottom) * -1100}px ${part * 1000}px`,
          opacity: frame < b(2) - 2 ? 0 : 1,
        }}
      >
        <AbsoluteFill style={{ top: 1080, height: 420, justifyContent: "center" }}>
          <Words text={"ولّا عم تدوّر\n*على شي؟"} start={b(2) + 3} stagger={7} size={124} color={C.paper} accent={C.mint} />
        </AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};
