import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame, Easing } from "remotion";
import { Words } from "../components";
import { C, CLAMP } from "../theme";
import { b, REVEAL_START } from "./timing";

export const HOOK_DURATION = REVEAL_START;

// A region of a screenshot: x, y, width and height in the screenshot's pixels, and the screenshot's width.
type Crop = { src: string; x: number; y: number; w: number; h: number; W: number };

// Real things for sale in the app, one per beat, each asking the viewer a question.
const SHOTS: { crop: Crop; text: string }[] = [
  { crop: { src: "screen-ad-moto.jpg", x: 0, y: 0, w: 618, h: 460, W: 618 }, text: "بدك *تبيع؟" },
  { crop: { src: "screen-home.jpg", x: 325, y: 780, w: 275, h: 205, W: 627 }, text: "بدك *تشتري؟" },
  { crop: { src: "screen-home.jpg", x: 28, y: 780, w: 272, h: 205, W: 627 }, text: "جديد ولّا *مستعمل؟" },
  { crop: { src: "screen-home.jpg", x: 28, y: 465, w: 572, h: 190, W: 627 }, text: "بجرابلس *وريفها؟" },
];

const CropImg: React.FC<{ crop: Crop; width: number; style?: React.CSSProperties }> = ({ crop, width, style }) => {
  const k = width / crop.w;
  return (
    <div style={{ position: "relative", width, height: crop.h * k, overflow: "hidden", ...style }}>
      <Img src={staticFile(crop.src)} style={{ position: "absolute", width: crop.W * k, maxWidth: "none", left: -crop.x * k, top: -crop.y * k }} />
    </div>
  );
};

const Shot: React.FC<{ crop: Crop; text: string; index: number; last: boolean }> = ({ crop, text, index, last }) => {
  const frame = useCurrentFrame();
  const punch = interpolate(frame, [0, 15], [1.18, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  // The last shot keeps pushing in and shaking, building up to the drop.
  const push = last ? interpolate(frame, [0, 15], [1, 1.35], { ...CLAMP, easing: Easing.in(Easing.cubic) }) : 1;
  const shake = last ? frame * 0.8 : 0;
  const side = index % 2 === 0 ? 1 : -1;
  return (
    <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
      {/* The same photo, blown up and blurred, fills the frame behind the card. */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", filter: "blur(38px) brightness(0.45) saturate(1.3)", scale: 1.3 }}>
        <CropImg crop={crop} width={(1920 * crop.w) / crop.h} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(2,27,23,0) 40%, ${C.ink} 100%)` }} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 260,
          scale: punch * push,
          rotate: `${side * interpolate(frame, [0, 15], [4, 1.5], CLAMP)}deg`,
          translate: `${Math.sin(frame * 3.1) * shake}px ${Math.cos(frame * 2.3) * shake}px`,
        }}
      >
        <CropImg crop={crop} width={860} style={{ borderRadius: 40, boxShadow: "0 50px 100px rgba(0,0,0,0.55)", border: "6px solid rgba(248,247,242,0.9)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ top: 1180, height: 260, justifyContent: "center" }}>
        <Words text={text} start={index === 0 ? 0 : 1} stagger={3} size={100} color={C.paper} accent={C.mint} style={{ textShadow: "0 8px 30px rgba(0,0,0,0.6)" }} />
      </AbsoluteFill>
      {/* A flash on every cut, except the very first frame, which TikTok uses as the cover. */}
      {index > 0 && <AbsoluteFill style={{ background: "white", opacity: interpolate(frame, [0, 4], [0.7, 0], CLAMP) }} />}
    </AbsoluteFill>
  );
};

// Four quick shots on the beat while the music builds, ending on a white-out as the drop hits.
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {SHOTS.map((s, i) => (
        <Sequence key={i} from={b(i)} durationInFrames={b(1)} layout="absolute-fill">
          <Shot crop={s.crop} text={s.text} index={i} last={i === SHOTS.length - 1} />
        </Sequence>
      ))}
      <AbsoluteFill style={{ background: "white", opacity: interpolate(frame, [HOOK_DURATION - 4, HOOK_DURATION], [0, 1], CLAMP) }} />
    </AbsoluteFill>
  );
};
