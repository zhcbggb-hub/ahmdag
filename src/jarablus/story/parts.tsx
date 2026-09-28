import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, CLAMP, DISPLAY, TEXT } from "../theme";

// A phone held at an angle, floating gently. The screen content is passed as children.
export const Phone3D: React.FC<{ width: number; top: number; enterAt?: number; tilt?: number; children: React.ReactNode }> = ({ width, top, enterAt = 0, tilt = -16, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - enterAt, fps, config: { damping: 15, stiffness: 110 } });
  const screenH = (width * 1280) / 627;
  const bezel = 12;
  return (
    <AbsoluteFill style={{ perspective: 1800 }}>
      <div
        style={{
          position: "absolute",
          left: (1080 - width) / 2 - bezel,
          top,
          width: width + bezel * 2,
          height: screenH + bezel * 2,
          borderRadius: 58,
          padding: bezel,
          background: "#0B1110",
          boxShadow: "0 60px 110px rgba(2, 27, 23, 0.45), inset 0 0 0 3px #2A3533",
          transform: `translateY(${(1 - enter) * 1300}px) rotateY(${interpolate(enter, [0, 1], [tilt * 3.5, tilt]) + Math.sin(frame / 22) * 4}deg) rotateX(8deg) rotateZ(${-3 + Math.sin(frame / 30)}deg)`,
        }}
      >
        <div style={{ position: "relative", width, height: screenH, borderRadius: 46, overflow: "hidden", background: C.paper }}>{children}</div>
      </div>
    </AbsoluteFill>
  );
};

// A full-screen app screenshot inside a phone. `x` slides it sideways (screen widths).
export const Screen: React.FC<{ src: string; width: number; x?: number; dim?: number }> = ({ src, width, x = 0, dim = 0 }) => (
  <Img
    src={staticFile(src)}
    style={{ position: "absolute", width, height: (width * 1280) / 627, objectFit: "cover", objectPosition: "top", maxWidth: "none", translate: `${x * width}px 0`, filter: `brightness(${1 - dim})` }}
  />
);

// Two screens sliding like the app's own navigation: the new one comes in from the left.
export const slideProgress = (frame: number, at: number) => interpolate(frame, [at - 10, at], [0, 1], { ...CLAMP, easing: (t) => 1 - Math.pow(1 - t, 3) });

// A finger tap: a ring that appears and fades where the user taps.
export const Tap: React.FC<{ at: number; x: number; y: number }> = ({ at, x, y }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 14) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 40,
        top: y - 40,
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
};

// A small rounded label such as "البائع".
export const RoleTag: React.FC<{ label: string; at: number; bg: string; color: string }> = ({ label, at, bg, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 200 } });
  return (
    <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          direction: "rtl",
          fontFamily: TEXT,
          fontWeight: 700,
          fontSize: 38,
          color,
          background: bg,
          borderRadius: 40,
          padding: "8px 34px 12px",
          opacity: frame < at ? 0 : p,
          scale: interpolate(p, [0, 1], [0.6, 1]),
        }}
      >
        {label}
      </div>
    </div>
  );
};

// The app icon as it sits on a phone's home screen, drawn from the logo so it stays sharp.
export const AppIcon: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.24,
        background: "white",
        boxShadow: "0 24px 50px rgba(2, 27, 23, 0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Img src={staticFile("logo.png")} style={{ width: size * 0.82, maxWidth: "none" }} />
    </div>
    <div style={{ direction: "rtl", fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, color: C.deep }}>سوق جرابلس</div>
  </div>
);

// The real motorcycle ad, reduced to a card: its photo, price and title.
export const MotoCard: React.FC<{ width: number }> = ({ width }) => {
  const k = width / 618;
  return (
    <div style={{ width, borderRadius: 26, overflow: "hidden", background: "white", boxShadow: "0 30px 70px rgba(2, 27, 23, 0.4)" }}>
      <div style={{ position: "relative", width, height: 430 * k, overflow: "hidden" }}>
        <Img src={staticFile("screen-ad-moto.jpg")} style={{ position: "absolute", width, maxWidth: "none", top: 0, left: 0 }} />
      </div>
      <div style={{ direction: "rtl", padding: `${16 * k * 1.6}px ${24 * k * 1.6}px ${22 * k * 1.6}px` }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 64 * k * 1.6 * 0.6, color: C.deep }}>570 $</div>
        <div style={{ fontFamily: TEXT, fontWeight: 600, fontSize: 40 * k * 1.6 * 0.6, color: "#33413E" }}>مرش امانه 150 نكل</div>
      </div>
    </div>
  );
};
