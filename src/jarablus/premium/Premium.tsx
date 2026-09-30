import { mdiCar, mdiCellphone, mdiCheckCircle, mdiDownload, mdiHomeCity, mdiLaptop, mdiSofa } from "@mdi/js";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Icon } from "../components";
import { Tap } from "../story/parts";
import { C, CLAMP, DISPLAY, EASE_IN_OUT, TEXT } from "../theme";
import { Backdrop, ease, glass, LightSweep, Line, Phone, PHONE_H, PHONE_W, Screens, Shot } from "./parts";

// A calm 35-second app commercial in six scenes. Every message stays on screen for at least two seconds.
const FIND = 120;
const POST = 300;
const DIRECT = 510;
const LOCAL = 690;
const CTA = 840;
export const PREMIUM_DURATION = 1050;

// "Motivating Mornings" starts quietly and lifts 12 s in; starting it 2 s in puts the lift on the posting scene.
const MUSIC_TRIM = 60;

// ---------------------------------------------------------------- scenes 1 to 4 share one phone

const CATEGORIES = [
  { label: "سيارات", icon: mdiCar, x: 205, y: 770 },
  { label: "عقارات", icon: mdiHomeCity, x: 875, y: 800 },
  { label: "أثاث", icon: mdiSofa, x: 205, y: 990 },
  { label: "موبايلات", icon: mdiCellphone, x: 875, y: 1020 },
  { label: "إلكترونيات", icon: mdiLaptop, x: 205, y: 1210 },
];

// Posting an ad with the app's real screens, in the app's own order.
const STEPS = ["أضف التفاصيل", "صوّر", "انشر إعلانك"];
const SCREENS = [
  { src: "screen-home.jpg", at: 0 },
  { src: "screen-title.jpg", at: 330 },
  { src: "screen-description.jpg", at: 370 },
  { src: "screen-photos.jpg", at: 412 },
  { src: "screen-ad-moto.jpg", at: 462 },
];
const STEP_AT = [330, 412, 462];
// Where the "متابعة" button is on each screen, as a fraction of the screen.
const TAPS = [
  { at: 322, x: 0.5, y: 0.93 },
  { at: 362, x: 0.38, y: 0.61 },
  { at: 404, x: 0.38, y: 0.61 },
  { at: 454, x: 0.38, y: 0.94 },
];

const Stage: React.FC = () => {
  const frame = useCurrentFrame();
  // The phone rises out of the depth under the hook, moves up for the posting scene, and sinks away after it.
  const enter = ease(frame, 55, 45);
  const lift = ease(frame, POST, 32, EASE_IN_OUT);
  const leave = ease(frame, DIRECT, 24, EASE_IN_OUT);
  const top = interpolate(enter, [0, 1], [860, 700]) - lift * 140 + leave * 420;
  const push = 1 + frame * 0.00006;
  // The hook's text starts in the middle of the frame and makes room for the phone.
  const hookUp = ease(frame, 50, 35, EASE_IN_OUT);
  const step = STEP_AT.filter((s) => frame >= s).length - 1;
  const toast = ease(frame, 466, 16);
  return (
    <AbsoluteFill style={{ scale: push }}>
      {/* 01 Hook */}
      <AbsoluteFill style={{ translate: `0 ${-hookUp * 330}px` }}>
        <Line text="كل سوق جرابلس وريفها…" at={8} out={108} top={640} size={76} color={C.paper} weight={800} />
        <Line text="صار بمكان واحد" at={34} out={108} top={760} size={112} color={C.mint} glow="rgba(18,201,178,0.55)" />
      </AbsoluteFill>

      {/* 02 What's in the app */}
      <Line text="بيع وشراء" at={FIND + 10} out={FIND + 82} top={230} size={100} color={C.paper} />
      <Line text="كل ما تحتاجه" at={FIND + 24} out={FIND + 82} top={370} size={100} color={C.mint} glow="rgba(18,201,178,0.45)" />
      <Line text="مستعمل وجديد" at={FIND + 96} out={POST - 12} top={300} size={116} color={C.cream} glow="rgba(246,234,211,0.35)" />
      {CATEGORIES.map((c, i) => {
        const p = ease(frame, FIND + 20 + i * 16, 22);
        const q = ease(frame, POST - 14, 14, EASE_IN_OUT);
        if (p === 0 || q === 1) return null;
        return (
          <div
            key={c.label}
            style={{
              ...glass(30),
              position: "absolute",
              left: c.x - 130,
              top: c.y + Math.sin(frame / 30 + i * 1.7) * 10,
              width: 260,
              height: 116,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              direction: "rtl",
              opacity: p * (1 - q),
              translate: `${(1 - p) * (c.x < 540 ? -40 : 40)}px ${(1 - p) * 20}px`,
              scale: 1 - q * 0.06,
            }}
          >
            <div style={{ width: 62, height: 62, borderRadius: 31, background: C.mint, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Icon path={c.icon} size={38} color={C.ink} />
            </div>
            <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 36, color: "white" }}>{c.label}</span>
          </div>
        );
      })}

      {/* 03 Posting an ad */}
      <Line text="انشر إعلانك بسهولة" at={POST + 12} out={DIRECT - 12} top={200} size={90} color={C.paper} />
      <div style={{ position: "absolute", top: 356, left: 60, right: 60, display: "flex", justifyContent: "center", gap: 18, direction: "rtl", opacity: ease(frame, POST + 24, 20) * (1 - ease(frame, DIRECT - 12, 12)) }}>
        {STEPS.map((s, i) => {
          const on = i === step;
          const done = i < step;
          return (
            <div
              key={s}
              style={{
                ...glass(40),
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 24px 14px 18px",
                background: on ? C.mint : done ? "rgba(18,201,178,0.18)" : "rgba(255,255,255,0.09)",
                borderColor: on ? C.mint : "rgba(255,255,255,0.22)",
              }}
            >
              <span style={{ width: 44, height: 44, borderRadius: 22, display: "inline-flex", justifyContent: "center", alignItems: "center", background: on ? C.ink : "rgba(255,255,255,0.16)", color: on ? C.mint : "white", fontFamily: TEXT, fontWeight: 700, fontSize: 26 }}>
                {done ? <Icon path={mdiCheckCircle} size={30} color={C.mint} /> : "١٢٣"[i]}
              </span>
              <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 34, color: on ? C.ink : "white" }}>{s}</span>
            </div>
          );
        })}
      </div>

      <Phone cx={540} top={top} scale={interpolate(enter, [0, 1], [0.62, 1]) * (1 - leave * 0.08)} opacity={Math.min(1, enter * 1.6) * (1 - leave)} blur={(1 - enter) * 12}>
        <Screens list={SCREENS} />
        {TAPS.map((t) => (
          <Tap key={t.at} at={t.at} x={t.x * PHONE_W} y={t.y * PHONE_H} />
        ))}
        <LightSweep at={78} duration={36} strength={0.28} />
      </Phone>

      {/* The ad is live. */}
      {frame >= 466 && frame < DIRECT + 14 && (
        <div style={{ position: "absolute", top: 610, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: toast * (1 - leave), translate: `0 ${(1 - toast) * -20}px` }}>
          <div style={{ ...glass(60), background: "rgba(2,27,23,0.72)", display: "flex", alignItems: "center", gap: 14, padding: "14px 36px 20px", direction: "rtl" }}>
            <Icon path={mdiCheckCircle} size={52} color={C.mint} />
            <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 46, color: "white" }}>تم نشر إعلانك</span>
          </div>
        </div>
      )}

      {/* 04 The main benefit */}
      <Line text="تواصل مباشرة" at={DIRECT + 22} out={LOCAL - 14} top={430} size={104} color={C.paper} />
      <Line text="مع البائع أو المشتري" at={DIRECT + 40} out={LOCAL - 14} top={580} size={74} color={C.paper} weight={700} />
      <Benefit text="بدون وسيط" at={DIRECT + 84} top={860} />
      <Benefit text="بدون عمولة" at={DIRECT + 108} top={1080} />
    </AbsoluteFill>
  );
};

// One of the two strongest messages: large mint text on a glowing glass band.
const Benefit: React.FC<{ text: string; at: number; top: number }> = ({ text, at, top }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, at, 26);
  const q = ease(frame, LOCAL - 14, 12, EASE_IN_OUT);
  if (p === 0 || q === 1) return null;
  return (
    <div style={{ position: "absolute", top, left: 110, right: 110, height: 180, opacity: 1 - q }}>
      <div style={{ ...glass(44), position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${(1 - p) * 100}%)`, background: "rgba(18,201,178,0.10)", borderColor: "rgba(18,201,178,0.45)" }} />
      <Line text={text} at={at + 6} top={14} size={120} color={C.mint} glow="rgba(18,201,178,0.6)" style={{ left: 0, right: 0 }} />
      <AbsoluteFill style={{ borderRadius: 44, overflow: "hidden" }}>
        <LightSweep at={at + 40} duration={34} strength={0.18} />
      </AbsoluteFill>
    </div>
  );
};

// ---------------------------------------------------------------- 05 Jarablus

// The street photo inside the app's own banner (a real photo of Jarablus), cropped away from the banner's text.
const PHOTO = { x: 40, y: 475, w: 255, h: 170, W: 627 };
const PhotoCrop: React.FC<{ width: number; zoom?: number }> = ({ width, zoom = 1 }) => {
  const k = width / PHOTO.w;
  return (
    <div style={{ position: "relative", width, height: PHOTO.h * k, overflow: "hidden" }}>
      <Img
        src={staticFile("screen-home.jpg")}
        style={{ position: "absolute", width: PHOTO.W * k, maxWidth: "none", left: -PHOTO.x * k, top: -PHOTO.y * k, scale: zoom, transformOrigin: `${((PHOTO.x + PHOTO.w / 2) / PHOTO.W) * 100}% ${((PHOTO.y + PHOTO.h / 2) / 1280) * 100}%` }}
      />
    </div>
  );
};

const Local: React.FC = () => {
  const frame = useCurrentFrame();
  const card = ease(frame, 4, 30);
  const phone = ease(frame, 34, 34);
  const out = ease(frame, CTA - LOCAL - 12, 12, EASE_IN_OUT);
  return (
    <AbsoluteFill style={{ opacity: ease(frame, 0, 10) }}>
      {/* The same photo, blurred and graded, fills the background. */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <div style={{ position: "absolute", left: -600, top: -100, scale: 1.1 + frame * 0.0006, filter: "blur(40px) saturate(1.2) brightness(0.55)" }}>
          <PhotoCrop width={2300} />
        </div>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(2,27,23,0.85) 0%, rgba(5,68,59,0.45) 45%, rgba(2,27,23,0.9) 100%)` }} />
      </AbsoluteFill>
      <Line text="من جرابلس…" at={10} top={220} size={96} color={C.paper} />
      <Line text="لجرابلس وريفها" at={32} top={350} size={110} color={C.mint} glow="rgba(18,201,178,0.5)" />
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 560,
          borderRadius: 40,
          overflow: "hidden",
          boxShadow: "0 50px 100px rgba(0,0,0,0.55), 0 0 0 2px rgba(255,255,255,0.18)",
          opacity: card,
          scale: interpolate(card, [0, 1], [1.06, 1]),
          filter: `blur(${phone * 2}px) saturate(1.15) contrast(1.06)`,
        }}
      >
        <PhotoCrop width={900} zoom={1 + frame * 0.0009} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 50%, rgba(2,27,23,0.55) 100%)", mixBlendMode: "multiply" }} />
        <LightSweep at={20} duration={40} strength={0.15} />
      </div>
      <Phone cx={320} top={interpolate(phone, [0, 1], [1200, 930])} scale={0.78} opacity={phone} turn={9}>
        <Shot src="screen-home.jpg" />
      </Phone>
      <AbsoluteFill style={{ background: C.paper, opacity: out }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 06 Call to action

const LOGO_W = 500;
const LOGO_H = (LOGO_W * 733) / 1205;

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = ease(frame, 6, 28);
  const phone = ease(frame, 40, 34);
  const button = ease(frame, 80, 22);
  const link = ease(frame, 100, 22);
  const glow = (Math.sin(frame / 12) + 1) / 2;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 60% at 50% 45%, #FFFFFF 0%, ${C.paper} 55%, #D9E9E3 100%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 540 - LOGO_W / 2, top: 130, width: LOGO_W, height: LOGO_H, opacity: logo, translate: `0 ${(1 - logo) * 20}px`, clipPath: `inset(-10% 0 -10% ${(1 - logo) * 100}%)` }}>
        <Img src={staticFile("logo.png")} style={{ width: LOGO_W, maxWidth: "none" }} />
        {/* The light sweep is masked to the logo's own shape. */}
        <AbsoluteFill style={{ WebkitMaskImage: `url(${staticFile("logo.png")})`, WebkitMaskSize: "100% 100%", maskImage: `url(${staticFile("logo.png")})`, maskSize: "100% 100%" }}>
          <LightSweep at={34} duration={30} strength={0.7} />
        </AbsoluteFill>
      </div>
      <Line text="حمّل تطبيق سوق جرابلس" at={24} top={450} size={66} color={C.deep} style={{ textShadow: "none" }} />
      <Line text="وريفها الآن" at={40} top={540} size={84} color={C.brand} style={{ textShadow: "none" }} />
      <Phone cx={540} top={interpolate(phone, [0, 1], [900, 700])} scale={0.72} opacity={phone} turn={-5}>
        <Shot src="screen-home.jpg" />
      </Phone>
      <div style={{ position: "absolute", top: 1330, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: button, translate: `0 ${(1 - button) * 24}px` }}>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            direction: "rtl",
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: `linear-gradient(180deg, ${C.brand} 0%, ${C.deep} 100%)`,
            color: "white",
            borderRadius: 70,
            padding: "18px 60px 28px",
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontSize: 62,
            boxShadow: `0 20px 50px rgba(0,125,107,${0.3 + glow * 0.2}), 0 0 ${20 + glow * 30}px rgba(18,201,178,${0.25 + glow * 0.25})`,
          }}
        >
          <Icon path={mdiDownload} size={64} color="white" />
          حمّل التطبيق الآن
          <LightSweep at={110} duration={30} strength={0.35} />
        </div>
      </div>
      <div style={{ position: "absolute", top: 1480, left: 0, right: 0, textAlign: "center", fontFamily: TEXT, fontWeight: 700, fontSize: 56, color: C.deep, direction: "ltr", opacity: link, translate: `0 ${(1 - link) * 16}px` }}>
        jarablus.store/app
      </div>
      <AbsoluteFill style={{ background: C.paper, opacity: interpolate(frame, [0, 12], [1, 0], CLAMP) }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- sound

// Sound effects from public/sfx, kept sparse and quiet under the music. `at` is when the file starts, shifted by
// the time its hit takes to arrive (a negative `at` starts the file part-way through).
const SFX = [
  { name: "sparkle", at: 34 - 16, volume: 0.25 },
  { name: "whoosh-fast", at: 60 - 32, volume: 0.22 },
  ...CATEGORIES.map((_, i) => ({ name: "pop", at: FIND + 20 + i * 16, volume: 0.16 })),
  { name: "whoosh-fast", at: POST - 32, volume: 0.2 },
  ...TAPS.map((t) => ({ name: "tap", at: t.at, volume: 0.35 })),
  { name: "notify", at: 466 - 4, volume: 0.35 },
  { name: "whoosh-fast", at: DIRECT - 32 + 10, volume: 0.2 },
  { name: "impact-deep", at: DIRECT + 84 - 16, volume: 0.22 },
  { name: "impact-deep", at: DIRECT + 108 - 16, volume: 0.3 },
  { name: "whoosh-fast", at: LOCAL - 32, volume: 0.2 },
  { name: "whoosh-fast", at: CTA - 32, volume: 0.22 },
  { name: "sparkle", at: CTA + 34 - 16, volume: 0.35 },
  { name: "pop", at: CTA + 80, volume: 0.2 },
];

const MIX = 0.708;
const musicVolume = (frame: number) => MIX * 0.85 * interpolate(frame, [0, 45, PREMIUM_DURATION - 50, PREMIUM_DURATION - 1], [0, 1, 1, 0], { ...CLAMP, easing: EASE_IN_OUT });

export const JarablusPremium: React.FC = () => (
  <AbsoluteFill style={{ background: C.ink }}>
    <Sequence name="Backdrop" durationInFrames={CTA}>
      <Backdrop />
    </Sequence>
    <Sequence name="Hook, categories, posting, benefit" durationInFrames={LOCAL}>
      <Stage />
    </Sequence>
    <Sequence name="Jarablus" from={LOCAL} durationInFrames={CTA - LOCAL}>
      <Local />
    </Sequence>
    <Sequence name="Call to action" from={CTA}>
      <Cta />
    </Sequence>
    <Audio src={staticFile("music/motivating-mornings.mp3")} trimBefore={MUSIC_TRIM} volume={musicVolume} />
    {SFX.map((sfx, i) => (
      <Sequence key={i} name={`Sound ${sfx.name}`} from={Math.max(0, sfx.at)} layout="none">
        <Audio src={staticFile(`sfx/${sfx.name}.mp3`)} trimBefore={Math.max(0, -sfx.at)} volume={() => MIX * sfx.volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

