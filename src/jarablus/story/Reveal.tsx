import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Burst, Rings, Words } from "../components";
import { C, CLAMP, TEXT } from "../theme";
import { b, REVEAL_START, SELLER_START } from "./timing";

export const REVEAL_DURATION = SELLER_START - REVEAL_START;

const LOGO_W = 900;
const LOGO_H = (LOGO_W * 733) / 1205;
const LOGO_TOP = 560;
const PIN_X = 540 - LOGO_W / 2 + 0.7303 * LOGO_W;
const PIN_Y = LOGO_TOP + 0.5075 * LOGO_H;

// On the drop: the logo slams in out of a white flash, the frame shakes, and the answer appears.
export const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = spring({ frame, fps, config: { damping: 11, stiffness: 260, mass: 0.8 } });
  const shake = frame < 12 ? 22 * (1 - frame / 12) : 0;
  const leave = interpolate(frame, [REVEAL_DURATION - 8, REVEAL_DURATION], [0, 1], CLAMP);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 700px 620px at 540px 820px, #FFFFFF 0%, ${C.paper} 45%, #CFE3DC 80%, ${C.brand} 130%)`, overflow: "hidden" }}>
      <AbsoluteFill style={{ translate: `${Math.sin(frame * 2.7) * shake}px ${Math.cos(frame * 3.3) * shake}px`, scale: 1 + leave * 0.25, opacity: 1 - leave }}>
        <Rings x={PIN_X} y={PIN_Y} color={C.brand} start={0} every={6} count={4} total={4} maxRadius={1200} strokeWidth={6} />
        <Img
          src={staticFile("logo.png")}
          style={{
            position: "absolute",
            left: 540 - LOGO_W / 2,
            top: LOGO_TOP,
            width: LOGO_W,
            height: LOGO_H,
            maxWidth: "none",
            scale: interpolate(slam, [0, 1], [3, 1]),
            filter: `blur(${(1 - Math.min(1, slam)) * 20}px) drop-shadow(0 30px 40px rgba(2,27,23,0.25))`,
          }}
        />
        <Burst x={PIN_X} y={PIN_Y} start={1} seed="reveal" colors={[C.mint, C.brand, C.cream]} count={60} power={1.6} />
        <AbsoluteFill style={{ top: 1150, height: 220, justifyContent: "center" }}>
          <Words text={"*كلّو هون."} start={b(1)} size={150} color={C.deep} accent={C.brand} />
        </AbsoluteFill>
        <div style={{ position: "absolute", top: 1370, left: 0, right: 0, textAlign: "center", direction: "rtl", fontFamily: TEXT, fontWeight: 600, fontSize: 48, color: C.deep, opacity: interpolate(frame, [b(2), b(2) + 8], [0, 0.85], CLAMP) }}>
          سوق جرابلس وريفها بجيبتك
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "white", opacity: interpolate(frame, [0, 8], [1, 0], CLAMP) }} />
    </AbsoluteFill>
  );
};
