import { mdiCheckBold, mdiCheckDecagram } from "@mdi/js";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Hud, Icon, Words } from "../components";
import { C, CLAMP, DISPLAY, EASE_IN_OUT } from "../theme";

export const POST_AD_DURATION = 205;

// Real screens from the app's "new ad" flow. `tap` is where the "متابعة" button sits, as a fraction of the screenshot.
const STEPS = [
  { screen: "screen-category.jpg", number: "١", label: "اختار القسم", tap: { x: 0.5, y: 0.95 } },
  { screen: "screen-title.jpg", number: "٢", label: "اكتب العنوان", tap: { x: 0.38, y: 0.61 } },
  { screen: "screen-description.jpg", number: "٣", label: "السعر والوصف", tap: { x: 0.38, y: 0.61 } },
  { screen: "screen-photos.jpg", number: "٤", label: "ضيف الصور", tap: { x: 0.38, y: 0.94 } },
];
const START = 8;
const SLOT = 42;
const SWITCH = 12;
const DONE = START + STEPS.length * SLOT;

const SCREEN_W = 436;
const SCREEN_H = 872;
const BEZEL = 12;
const PHONE_TOP = 660;

const Phone: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 16, stiffness: 120 } });
  const done = spring({ frame: frame - DONE, fps, config: { damping: 12 } });

  return (
    <div
      style={{
        position: "absolute",
        top: PHONE_TOP,
        left: (1080 - SCREEN_W) / 2 - BEZEL,
        width: SCREEN_W + BEZEL * 2,
        height: SCREEN_H + BEZEL * 2,
        borderRadius: 64,
        background: "#0B1110",
        padding: BEZEL,
        boxShadow: "0 50px 120px rgba(0, 0, 0, 0.5), inset 0 0 0 3px #2A3533",
        translate: `0 ${interpolate(enter, [0, 1], [1300, 0])}px`,
        rotate: `${interpolate(enter, [0, 1], [12, 0])}deg`,
      }}
    >
      <div style={{ position: "relative", width: SCREEN_W, height: SCREEN_H, borderRadius: 52, overflow: "hidden", background: C.paper }}>
        {STEPS.map((step, i) => {
          const slotStart = START + i * SLOT;
          // RTL navigation: the next screen comes in from the left, the previous one leaves to the right.
          const inP = i === 0 ? 1 : interpolate(frame, [slotStart - SWITCH, slotStart], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
          const outP = i === STEPS.length - 1 ? 0 : interpolate(frame, [slotStart + SLOT - SWITCH, slotStart + SLOT], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
          if (inP === 0 || outP === 1) return null;
          const x = interpolate(inP, [0, 1], [-SCREEN_W, 0]) + interpolate(outP, [0, 1], [0, SCREEN_W * 0.35]);
          return <Img key={step.screen} src={staticFile(step.screen)} style={{ position: "absolute", width: SCREEN_W, height: SCREEN_H, objectFit: "cover", objectPosition: "top", translate: `${x}px 0`, filter: `brightness(${1 - outP * 0.4})` }} />;
        })}
        {STEPS.map((step, i) => {
          const tapAt = START + (i + 1) * SLOT - SWITCH - 8;
          if (i === STEPS.length - 1) return null;
          const t = frame - tapAt;
          if (t < 0 || t > 14) return null;
          return (
            <div
              key={step.screen}
              style={{
                position: "absolute",
                left: step.tap.x * SCREEN_W - 40,
                top: step.tap.y * SCREEN_H - 40,
                width: 80,
                height: 80,
                borderRadius: 40,
                background: "rgba(2, 27, 23, 0.25)",
                border: "4px solid white",
                scale: interpolate(t, [0, 4, 14], [0.4, 1, 1.6]),
                opacity: interpolate(t, [0, 3, 14], [0, 1, 0]),
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 260,
          height: 260,
          marginLeft: -130,
          marginTop: -130,
          borderRadius: 130,
          background: C.mint,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          scale: done,
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.35)",
        }}
      >
        <Icon path={mdiCheckDecagram} size={170} color={C.deep} />
      </div>
    </div>
  );
};

const StepPill: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const index = Math.max(0, Math.min(STEPS.length, Math.floor((frame - START) / SLOT)));
  const local = frame - START - index * SLOT;
  const p = spring({ frame: local, fps, config: { damping: 14, stiffness: 200 } });
  const isDone = index === STEPS.length;
  const label = isDone ? "مراجعة قبل النشر" : STEPS[index].label;

  return (
    <div style={{ position: "absolute", top: 530, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: frame < START ? 0 : 1 }}>
      <div
        style={{
          direction: "rtl",
          display: "flex",
          alignItems: "center",
          gap: 20,
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: 50,
          color: C.deep,
          background: isDone ? C.cream : C.mint,
          borderRadius: 60,
          padding: "10px 12px 10px 44px",
          scale: interpolate(p, [0, 1], [0.7, 1]),
          translate: `0 ${interpolate(p, [0, 1], [30, 0])}px`,
          opacity: interpolate(p, [0, 0.3], [0, 1], CLAMP),
        }}
      >
        {/* The step number sits in its own badge: in this font "١" alone looks like the letter "ا". */}
        <div style={{ width: 80, height: 80, borderRadius: 40, background: C.deep, color: isDone ? C.cream : C.mint, display: "flex", justifyContent: "center", alignItems: "center", fontSize: 46, lineHeight: 1 }}>
          {isDone ? <Icon path={mdiCheckBold} size={50} color={C.cream} /> : STEPS[index].number}
        </div>
        <span style={{ lineHeight: 1.2, paddingBottom: 6 }}>{label}</span>
      </div>
    </div>
  );
};

export const PostAdScene: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 70%, #0B5E52 0%, ${C.deep} 50%, ${C.ink} 100%)` }}>
    <AbsoluteFill style={{ top: 240, height: 270, justifyContent: "center" }}>
      <Words text={"انشر إعلانك\n*بأربع *خطوات"} size={96} color={C.paper} lineHeight={1.42} stagger={4} />
    </AbsoluteFill>
    <StepPill />
    <Phone />
    <Hud index={5} total={6} label="إعلان جديد" color={C.cream} />
  </AbsoluteFill>
);
