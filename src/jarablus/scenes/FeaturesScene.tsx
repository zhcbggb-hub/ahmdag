import { mdiBellRing, mdiMagnify, mdiPhoneInTalk } from "@mdi/js";
import { AbsoluteFill, interpolate, Series, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Hud, Icon, Rings, Words } from "../components";
import { C, CLAMP, TEXT } from "../theme";

const FEATURE_SLOT = 40;

const FEATURES = [
  { title: "تواصل مباشر", sub: "اتصال أو واتساب مع البائع", icon: mdiPhoneInTalk, bg: C.mint, fg: C.deep, disc: C.deep, glyph: C.mint, motion: "ring" },
  { title: "إشعارات فورية", sub: "إشعار فور نشر إعلانك", icon: mdiBellRing, bg: C.cream, fg: C.deep, disc: C.brand, glyph: C.cream, motion: "swing" },
  { title: "بحث عربي سريع", sub: "لاقي اللي بدك ياه بثواني", icon: mdiMagnify, bg: C.deep, fg: C.paper, disc: C.mint, glyph: C.deep, motion: "scan" },
] as const;

export const FEATURES_DURATION = FEATURES.length * FEATURE_SLOT;

const Feature: React.FC<(typeof FEATURES)[number]> = ({ title, sub, icon, bg, fg, disc, glyph, motion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 12, stiffness: 200 } });
  const wobble = Math.sin(frame * 1.1) * interpolate(frame, [6, 30], [1, 0], CLAMP);
  const iconMotion =
    motion === "ring"
      ? { rotate: `${wobble * 14}deg` }
      : motion === "swing"
        ? { rotate: `${wobble * 22}deg`, transformOrigin: "50% 10%" }
        : { translate: `${Math.sin(frame * 0.25) * 26}px ${Math.cos(frame * 0.25) * 16}px` };

  return (
    <AbsoluteFill style={{ background: bg }}>
      <Rings x={540} y={760} color={disc} start={4} every={10} maxRadius={700} strokeWidth={3} />
      <div
        style={{
          position: "absolute",
          left: 540 - 190,
          top: 760 - 190,
          width: 380,
          height: 380,
          borderRadius: 190,
          background: disc,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          scale: p,
          rotate: `${interpolate(p, [0, 1], [-40, 0])}deg`,
        }}
      >
        <Icon path={icon} size={200} color={glyph} style={iconMotion} />
      </div>
      <AbsoluteFill style={{ top: 1030, height: 200, justifyContent: "center" }}>
        <Words text={title} start={4} size={112} color={fg} stagger={4} />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 1250,
          left: 80,
          right: 80,
          textAlign: "center",
          direction: "rtl",
          fontFamily: TEXT,
          fontWeight: 500,
          fontSize: 52,
          color: fg,
          opacity: interpolate(frame, [12, 20], [0, 0.85], CLAMP),
          translate: `0 ${interpolate(frame, [12, 20], [20, 0], CLAMP)}px`,
        }}
      >
        {sub}
      </div>
    </AbsoluteFill>
  );
};

export const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const current = FEATURES[Math.min(FEATURES.length - 1, Math.floor(frame / FEATURE_SLOT))];
  return (
    <AbsoluteFill>
      <Series>
        {FEATURES.map((f) => (
          <Series.Sequence key={f.title} name={f.title} durationInFrames={FEATURE_SLOT}>
            <Feature {...f} />
          </Series.Sequence>
        ))}
      </Series>
      <Hud index={6} total={6} label="المميزات" color={current.fg} />
    </AbsoluteFill>
  );
};
