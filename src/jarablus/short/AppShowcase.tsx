import { mdiCar, mdiCellphone, mdiCheckBold, mdiHomeCity } from "@mdi/js";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Icon, Words } from "../components";
import { C, CLAMP, DISPLAY, EASE_IN_OUT, TEXT } from "../theme";
import { APP_START, beat, FINALE_START } from "./timing";

export const APP_SHOWCASE_DURATION = FINALE_START - APP_START;

// Beat n of the music, counted from the start of this scene.
const at = (n: number) => beat(n) - APP_START;

const SCREEN_W = 372;
const SCREEN_H = (SCREEN_W * 1280) / 627;
const BEZEL = 12;
const PHONE_W = SCREEN_W + BEZEL * 2;
const PHONE_H = SCREEN_H + BEZEL * 2;
const PHONE_TOP = 660;
const EXIT = APP_SHOWCASE_DURATION - 12;

const Phone: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 15, stiffness: 110 } });
  const glare = interpolate(frame, [at(9) + 4, at(9) + 30], [-40, 140], CLAMP);
  return (
    <AbsoluteFill style={{ perspective: 1800 }}>
      <div
        style={{
          position: "absolute",
          left: (1080 - PHONE_W) / 2,
          top: PHONE_TOP,
          width: PHONE_W,
          height: PHONE_H,
          borderRadius: 58,
          padding: BEZEL,
          background: "#0B1110",
          boxShadow: "0 60px 110px rgba(5, 68, 59, 0.45), inset 0 0 0 3px #2A3533",
          transform: `translateY(${(1 - enter) * 1300}px) rotateY(${interpolate(enter, [0, 1], [-60, -16]) + Math.sin(frame / 22) * 4}deg) rotateX(9deg) rotateZ(${-4 + Math.sin(frame / 30)}deg)`,
        }}
      >
        <div style={{ position: "relative", width: SCREEN_W, height: SCREEN_H, borderRadius: 46, overflow: "hidden" }}>
          <Img src={staticFile("screen-home.jpg")} style={{ width: SCREEN_W, height: SCREEN_H }} />
          <AbsoluteFill style={{ background: `linear-gradient(115deg, transparent ${glare - 18}%, rgba(255,255,255,0.45) ${glare}%, transparent ${glare + 18}%)` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// A card that pops out from the phone and then floats gently. `from` is where it starts, relative to where it ends.
const Pop: React.FC<{ at: number; from: [number, number]; tilt?: number; style: React.CSSProperties; children: React.ReactNode }> = ({ at: start, from, tilt = 0, style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - start, fps, config: { damping: 12, stiffness: 170 } });
  const float = frame < start ? 0 : Math.sin((frame - start) / 18) * 8;
  return (
    <div
      style={{
        position: "absolute",
        ...style,
        opacity: frame < start ? 0 : Math.min(1, p * 2),
        scale: interpolate(p, [0, 1], [0.3, 1]),
        translate: `${(1 - p) * from[0]}px ${(1 - p) * from[1] + float}px`,
        rotate: `${tilt + (1 - p) * -20}deg`,
      }}
    >
      {children}
    </div>
  );
};

// A real ad card, cut out of the app's home screen.
const AdCard: React.FC = () => (
  <div style={{ position: "relative", width: 276, height: 370, borderRadius: 26, overflow: "hidden", background: "white", boxShadow: "0 30px 60px rgba(5, 68, 59, 0.3)" }}>
    {/* maxWidth: the Tailwind reset would otherwise shrink the image to the card's width. */}
    <Img src={staticFile("screen-home.jpg")} style={{ position: "absolute", width: 627, height: 1280, maxWidth: "none", left: -324, top: -778 }} />
  </div>
);

// The app's pin, used as the notification icon.
const PinIcon: React.FC<{ size: number }> = ({ size }) => {
  const k = (size * 0.8) / 220;
  return (
    <div style={{ position: "relative", width: size, height: size, borderRadius: size * 0.26, background: C.paper, overflow: "hidden", flexShrink: 0, boxShadow: `inset 0 0 0 2px ${C.mint}55` }}>
      <Img src={staticFile("logo-parts/pin.png")} style={{ position: "absolute", width: 1205 * k, height: 733 * k, maxWidth: "none", left: size / 2 - 879 * k, top: size / 2 - 405 * k }} />
    </div>
  );
};

const Notification: React.FC = () => (
  <div style={{ direction: "rtl", display: "flex", alignItems: "center", gap: 18, width: 470, background: "rgba(255,255,255,0.97)", borderRadius: 30, padding: "18px 22px", boxShadow: "0 30px 60px rgba(5, 68, 59, 0.25)" }}>
    <PinIcon size={76} />
    <div>
      <div style={{ fontFamily: TEXT, fontSize: 25, color: "#5E6F6B" }}>سوق جرابلس • الآن</div>
      <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 36, color: C.deep, lineHeight: 1.4 }}>تم نشر إعلانك ✓</div>
    </div>
  </div>
);

const Chip: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <div style={{ direction: "rtl", display: "flex", alignItems: "center", gap: 14, background: "white", borderRadius: 50, padding: "12px 30px 16px 24px", boxShadow: "0 20px 44px rgba(5, 68, 59, 0.22)" }}>
    <Icon path={icon} size={44} color={C.brand} />
    <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 38, color: C.deep }}>{label}</span>
  </div>
);

export const AppShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const leave = interpolate(frame, [EXIT, APP_SHOWCASE_DURATION], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });

  return (
    <AbsoluteFill style={{ background: "#F8F5D8", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 20% 80%, ${C.mint}33 0%, transparent 45%), radial-gradient(circle at 85% 25%, ${C.brand}22 0%, transparent 40%), linear-gradient(180deg, #F8F5D8 0%, #EEF6F1 100%)`,
          opacity: interpolate(frame, [0, 10], [0, 1], CLAMP),
        }}
      />
      <AbsoluteFill
        style={{
          translate: `0 ${leave * -380}px`,
          scale: 1 + leave * 0.12 + interpolate(frame, [0, EXIT], [0, 0.03], CLAMP),
          filter: leave > 0 ? `blur(${leave * 18}px)` : undefined,
        }}
      >
        <AbsoluteFill style={{ top: 230, height: 330, justifyContent: "center" }}>
          <Words text={"كل سوق جرابلس\n*بجيبتك"} start={2} stagger={5} size={100} color={C.deep} accent={C.brand} lineHeight={1.35} />
        </AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: 540 - 260,
            top: PHONE_TOP + PHONE_H - 10,
            width: 520,
            height: 60,
            borderRadius: "50%",
            background: "rgba(5, 68, 59, 0.28)",
            filter: "blur(22px)",
            opacity: interpolate(frame, [8, 24], [0, 1], CLAMP),
          }}
        />
        <Phone />
        <Pop at={at(9)} from={[230, 160]} tilt={-6} style={{ left: 60, top: 740 }}>
          <AdCard />
        </Pop>
        <Pop at={at(10)} from={[-200, 140]} tilt={3} style={{ left: 540, top: 590 }}>
          <Notification />
        </Pop>
        <Pop at={at(11)} from={[240, -90]} tilt={5} style={{ left: 70, top: 1170 }}>
          <div style={{ direction: "rtl", display: "flex", alignItems: "center", gap: 12, background: C.mint, borderRadius: 50, padding: "12px 30px 18px 24px", boxShadow: "0 20px 44px rgba(5, 68, 59, 0.28)" }}>
            <Icon path={mdiCheckBold} size={42} color={C.deep} />
            <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 42, color: C.deep }}>بلا عمولة</span>
          </div>
        </Pop>
        <Pop at={at(12)} from={[-230, 40]} tilt={-3} style={{ right: 70, top: 800 }}>
          <Chip icon={mdiCar} label="سيارات" />
        </Pop>
        <Pop at={at(12.5)} from={[-250, -20]} tilt={2} style={{ right: 40, top: 890 }}>
          <Chip icon={mdiHomeCity} label="عقارات" />
        </Pop>
        <Pop at={at(13)} from={[-230, -80]} tilt={-2} style={{ right: 90, top: 980 }}>
          <Chip icon={mdiCellphone} label="هواتف" />
        </Pop>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
