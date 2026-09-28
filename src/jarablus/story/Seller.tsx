import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Words } from "../components";
import { Notification } from "../short/AppShowcase";
import { C, CLAMP, DISPLAY } from "../theme";
import { Phone3D, RoleTag, Screen, slideProgress, Tap } from "./parts";
import { b, MAP_START, SELLER_START } from "./timing";

export const SELLER_DURATION = MAP_START - SELLER_START;

// Beat n of the music, counted from the start of this scene.
const at = (n: number) => b(n) - SELLER_START;

const PHONE_W = 380;
const PHONE_H = (PHONE_W * 1280) / 627;
// The app's four steps; `tap` is where the "متابعة" button is, as a fraction of the screen.
const STEPS = [
  { screen: "screen-category.jpg", label: "القسم", tap: { x: 0.5, y: 0.95 } },
  { screen: "screen-title.jpg", label: "العنوان", tap: { x: 0.38, y: 0.61 } },
  { screen: "screen-description.jpg", label: "السعر والوصف", tap: { x: 0.38, y: 0.61 } },
  { screen: "screen-photos.jpg", label: "الصور", tap: { x: 0.38, y: 0.94 } },
];
const STEP_AT = [at(7), at(10), at(13), at(16)];
const PUBLISHED_AT = at(18.5);

const Steps: React.FC = () => {
  const frame = useCurrentFrame();
  const current = STEP_AT.filter((s) => frame >= s).length - 1;
  return (
    <div style={{ position: "absolute", top: 590, left: 60, right: 60, display: "flex", direction: "rtl", justifyContent: "center", gap: 14, opacity: interpolate(frame, [at(7) - 4, at(7)], [0, 1], CLAMP) }}>
      {STEPS.map((s, i) => {
        const on = i <= current;
        return (
          <div
            key={s.label}
            style={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: 30,
              padding: "8px 20px 12px",
              borderRadius: 30,
              background: on ? C.mint : "rgba(248,247,242,0.12)",
              color: on ? C.deep : C.paper,
              scale: i === current ? 1.08 : 1,
            }}
          >
            {`${"١٢٣٤"[i]}. ${s.label}`}
          </div>
        );
      })}
    </div>
  );
};

export const Seller: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const note = spring({ frame: frame - PUBLISHED_AT, fps, config: { damping: 12, stiffness: 170 } });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 65%, #0B5E52 0%, ${C.deep} 50%, ${C.ink} 100%)`, overflow: "hidden" }}>
      <RoleTag label="البائع" at={1} bg={C.cream} color={C.deep} />
      <AbsoluteFill style={{ top: 310, height: 260, justifyContent: "center" }}>
        <Words text={"نزّل إعلانك\n*بأربع *خطوات"} start={3} stagger={5} size={92} color={C.paper} accent={C.mint} lineHeight={1.3} />
      </AbsoluteFill>
      <Steps />
      <Phone3D width={PHONE_W} top={700} tilt={14}>
        {STEPS.map((s, i) => {
          const inP = i === 0 ? 1 : slideProgress(frame, STEP_AT[i]);
          const outP = i === STEPS.length - 1 ? 0 : slideProgress(frame, STEP_AT[i + 1]);
          if (inP === 0 || outP === 1) return null;
          return <Screen key={s.screen} src={s.screen} width={PHONE_W} x={inP - 1 + outP * 0.35} dim={outP * 0.4} />;
        })}
        {STEPS.slice(0, 3).map((s, i) => (
          <Tap key={s.screen} at={STEP_AT[i + 1] - 12} x={s.tap.x * PHONE_W} y={s.tap.y * PHONE_H} />
        ))}
        <Tap at={PUBLISHED_AT - 8} x={STEPS[3].tap.x * PHONE_W} y={STEPS[3].tap.y * PHONE_H} />
      </Phone3D>
      <div style={{ position: "absolute", top: 1180, left: 305, opacity: frame < PUBLISHED_AT ? 0 : Math.min(1, note * 2), scale: interpolate(note, [0, 1], [0.4, 1]), translate: `0 ${(1 - note) * 120}px` }}>
        <Notification />
      </div>
    </AbsoluteFill>
  );
};
