import {
  mdiAccount,
  mdiAccountCancel,
  mdiAccountGroup,
  mdiAccountTie,
  mdiBookOpenPageVariant,
  mdiBullhorn,
  mdiCashRemove,
  mdiCellphone,
  mdiClose,
  mdiFlag,
  mdiHandHeart,
  mdiHandshake,
  mdiLightbulbOn,
  mdiMagnify,
  mdiMapMarker,
  mdiMapMarkerMultiple,
  mdiPercent,
  mdiStorefront,
  mdiTrendingUp,
} from "@mdi/js";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, interpolate, random, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Burst, Icon, Rings } from "../components";
import { Phone, Shot } from "../premium/parts";
import { C, CLAMP, DISPLAY, EASE_IN_OUT, EASE_OUT } from "../theme";
import { MapView, VILLAGES } from "./MapView";
import {
  APP_AT,
  BACK_AT,
  camera,
  COMMISSION_AT,
  DISTRICT_AT,
  DIVE_AT,
  END_AT,
  FINAL_LOGO_AT,
  GROW_AT,
  LOGO_AT,
  MIDDLEMAN_AT,
  MUSIC_TRIM,
  NETWORK_AT,
  ORIGIN_DURATION,
  PEOPLE_AT,
  REACH_AT,
  SEARCH_AT,
  sec,
  toPx,
} from "./timing";

export type OriginProps = { music: boolean };

const ease = (frame: number, from: number, duration = 18, easing = EASE_OUT) => interpolate(frame, [from, from + duration], [0, 1], { ...CLAMP, easing });

// ---------------------------------------------------------------- the seller and the buyer on the map

const SELLER = VILLAGES.find((v) => v.name === "الغندورة")!;
const BUYER = VILLAGES.find((v) => v.name === "جرابلس")!;
const MID = { x: (SELLER.x + BUYER.x) / 2, y: (SELLER.y + BUYER.y) / 2 };
const REACHED = [...VILLAGES]
  .filter((v) => v !== SELLER)
  .sort((a, b) => Math.hypot(a.x - SELLER.x, a.y - SELLER.y) - Math.hypot(b.x - SELLER.x, b.y - SELLER.y))
  .slice(0, 22);
const STORY_OUT = DIVE_AT - 4;

const Marker: React.FC<{ x: number; y: number; icon: string; bg: string; fg: string; at: number; tag?: string; crossed?: number; out?: number }> = ({ x, y, icon, bg, fg, at, tag, crossed, out = STORY_OUT }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, at, 16) * (1 - ease(frame, out, 10));
  if (p === 0) return null;
  const size = 96;
  const cross = crossed === undefined ? 0 : ease(frame, crossed, 10);
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, opacity: p * (1 - cross * 0.55), scale: interpolate(p, [0, 1], [0.7, 1]) }}>
      <div style={{ width: size, height: size, borderRadius: size / 2, background: bg, display: "flex", justifyContent: "center", alignItems: "center", boxShadow: `0 0 0 5px rgba(2,27,23,0.6), 0 0 40px ${bg}` }}>
        <Icon path={icon} size={58} color={fg} />
      </div>
      {tag && (
        <div style={{ position: "absolute", top: size + 8, left: -60, width: size + 120, textAlign: "center", direction: "rtl", fontFamily: DISPLAY, fontWeight: 800, fontSize: 32, color: "white", textShadow: "0 0 14px rgba(2,27,23,1)" }}>{tag}</div>
      )}
      {cross > 0 && (
        <div style={{ position: "absolute", inset: -14, display: "flex", justifyContent: "center", alignItems: "center", scale: interpolate(cross, [0, 1], [1.6, 1]), opacity: cross }}>
          <Icon path={mdiClose} size={size + 40} color="#FF5A5A" style={{ filter: "drop-shadow(0 0 10px rgba(0,0,0,0.6))" }} />
        </div>
      )}
    </div>
  );
};

const Story: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = camera(frame);
  const s = toPx(cam, SELLER.x, SELLER.y);
  const b = toPx(cam, BUYER.x, BUYER.y);
  const m = toPx(cam, MID.x, MID.y);
  const out = 1 - ease(frame, STORY_OUT, 10);
  const gap = ease(frame, PEOPLE_AT + 16, 16) * (1 - ease(frame, COMMISSION_AT + 6, 12));
  const direct = interpolate(frame, [COMMISSION_AT + 10, COMMISSION_AT + 34], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const search = ease(frame, SEARCH_AT, 14);
  if (frame < PEOPLE_AT || out === 0) return null;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        {/* Before: far apart, with a question between them. */}
        <line x1={s.x} y1={s.y} x2={b.x} y2={b.y} stroke={C.paper} strokeOpacity={0.45 * gap} strokeWidth={4} strokeDasharray="4 14" strokeLinecap="round" />
        {/* The seller's ad reaching the villages around. */}
        {REACHED.map((v, i) => {
          const k = interpolate(frame, [REACH_AT + i * 3, REACH_AT + i * 3 + 16], [0, 1], { ...CLAMP, easing: EASE_OUT });
          if (k === 0) return null;
          const p = toPx(cam, v.x, v.y);
          return (
            <g key={v.name} opacity={1 - ease(frame, COMMISSION_AT, 20) * 0.7}>
              <line x1={s.x} y1={s.y} x2={s.x + (p.x - s.x) * k} y2={s.y + (p.y - s.y) * k} stroke={C.mint} strokeOpacity={0.6} strokeWidth={2.5} />
              <circle cx={p.x} cy={p.y} r={10 + 10 * k} fill="none" stroke={C.mint} strokeOpacity={1 - k} strokeWidth={3} />
            </g>
          );
        })}
        {/* After: one direct, bright line. */}
        {direct > 0 && (
          <>
            <line x1={s.x} y1={s.y} x2={s.x + (b.x - s.x) * direct} y2={s.y + (b.y - s.y) * direct} stroke={C.mint} strokeOpacity={0.35} strokeWidth={18} strokeLinecap="round" />
            <line x1={s.x} y1={s.y} x2={s.x + (b.x - s.x) * direct} y2={s.y + (b.y - s.y) * direct} stroke="white" strokeWidth={5} strokeLinecap="round" />
          </>
        )}
      </svg>
      {gap > 0 && (
        <div style={{ position: "absolute", left: m.x - 40, top: m.y - 50, width: 80, textAlign: "center", fontFamily: DISPLAY, fontWeight: 900, fontSize: 84, color: C.cream, opacity: gap * (1 - ease(frame, MIDDLEMAN_AT - 8, 8)), textShadow: "0 0 20px rgba(2,27,23,1)" }}>؟</div>
      )}
      <Marker x={m.x} y={m.y} icon={mdiAccountTie} bg="#6B6F76" fg="white" at={MIDDLEMAN_AT - 4} tag="وسيط" crossed={MIDDLEMAN_AT + 10} out={COMMISSION_AT + 2} />
      <Marker x={m.x} y={m.y} icon={mdiPercent} bg="#6B6F76" fg="white" at={COMMISSION_AT - 2} tag="عمولة" crossed={COMMISSION_AT + 10} out={COMMISSION_AT + 26} />
      <Marker x={s.x} y={s.y} icon={mdiStorefront} bg={C.cream} fg={C.deep} at={PEOPLE_AT} tag="البائع" />
      <Marker x={b.x} y={b.y} icon={mdiAccount} bg={C.mint} fg={C.ink} at={PEOPLE_AT + 8} tag="المشتري" />
      {search > 0 && (
        <div style={{ position: "absolute", left: b.x + 30, top: b.y - 90, width: 64, height: 64, borderRadius: 32, background: "white", display: "flex", justifyContent: "center", alignItems: "center", opacity: search * (1 - ease(frame, STORY_OUT, 10)), scale: interpolate(search, [0, 1], [0.5, 1]) }}>
          <Icon path={mdiMagnify} size={42} color={C.deep} />
        </div>
      )}
      {search > 0 && <Rings x={b.x} y={b.y} color={C.mint} start={SEARCH_AT} every={14} count={3} total={4} maxRadius={220} strokeWidth={3} />}
      {direct === 1 && <Burst x={b.x} y={b.y} start={COMMISSION_AT + 34} seed="direct" colors={[C.mint, C.cream, "white"]} count={30} power={0.8} />}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- the logo

const LOGO_W = 1205;
const LOGO_H = 733;

// The logo assembling from its layers (made by scripts/split-logo.py), landing on `at`.
const LogoBuild: React.FC<{ at: number; width: number; top: number }> = ({ at, width, top }) => {
  const frame = useCurrentFrame();
  const k = width / LOGO_W;
  const part = (name: string, delay: number, dx: number, dy: number, rot = 0) => {
    const p = interpolate(frame, [at - 16 + delay, at + delay], [0, 1], { ...CLAMP, easing: EASE_OUT });
    return (
      <Img
        key={name}
        src={staticFile(`logo-parts/${name}.png`)}
        style={{ position: "absolute", left: 0, top: 0, width, height: LOGO_H * k, maxWidth: "none", opacity: Math.min(1, p * 2), translate: `${(1 - p) * dx}px ${(1 - p) * dy}px`, rotate: `${(1 - p) * rot}deg`, filter: `blur(${(1 - p) * 10}px)` }}
      />
    );
  };
  return (
    <div style={{ position: "absolute", left: 540 - width / 2, top, width, height: LOGO_H * k }}>
      {part("wings", -6, -260, 0, -8)}
      {part("souq", -3, 0, -220)}
      {part("jarablus", 0, 0, 220)}
      {part("ribbon", 4, 0, 120)}
      {part("pin", 2, 0, -420)}
    </div>
  );
};

// A light stage for the logo, flashing in from white.
const LogoStage: React.FC<{ from: number; to: number; top: number; width: number }> = ({ from, to, top, width }) => {
  const frame = useCurrentFrame();
  if (frame < from - 8 || frame > to) return null;
  const inP = interpolate(frame, [from - 8, from], [0, 1], CLAMP);
  const outP = interpolate(frame, [to - 12, to], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const flash = interpolate(frame, [from - 4, from, from + 14], [0, 1, 0], CLAMP);
  const k = width / LOGO_W;
  const pin = { x: 540 - width / 2 + 879 * k, y: top + 371 * k };
  return (
    <AbsoluteFill style={{ opacity: inP * (1 - outP) }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 55% at 50% 42%, #FFFFFF 0%, ${C.paper} 55%, #CFE3DC 100%)` }} />
      <Rings x={pin.x} y={pin.y} color={C.brand} start={from} every={10} count={4} total={4} maxRadius={1000} strokeWidth={4} />
      <AbsoluteFill style={{ scale: 1 + (frame - from) * 0.0012 }}>
        <LogoBuild at={from} width={width} top={top} />
      </AbsoluteFill>
      <Burst x={pin.x} y={pin.y} start={from + 1} seed={`logo${from}`} colors={[C.mint, C.brand, C.cream]} count={50} power={1.4} />
      <AbsoluteFill style={{ background: "white", opacity: flash }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- key phrases

// Only the key words of each line are shown, each on a glass card with an icon. Times are in seconds.
const KEYS = [
  { text: "من هنا تبدأ *الحكاية", icon: mdiBookOpenPageVariant, from: 0, to: 1.75 },
  { text: "*جرابلس", icon: mdiMapMarker, from: 1.75, to: 3.4 },
  { text: "فكرةٌ *بسيطة", icon: mdiLightbulbOn, from: 3.4, to: 5.3 },
  { text: "حاجةٌ *حقيقية لأهل المنطقة", icon: mdiAccountGroup, from: 5.3, to: 7.6 },
  { text: "البيع والشراء *أسهل", icon: mdiHandshake, from: 7.6, to: 10.0 },
  { text: "الوصول إلى *الناس", icon: mdiBullhorn, from: 10.0, to: 13.3 },
  { text: "يجد ما *يبحث *عنه", icon: mdiMagnify, from: 13.3, to: 15.45 },
  { text: "من دون *وسيط", icon: mdiAccountCancel, from: 15.45, to: 16.65 },
  { text: "من دون *عمولة", icon: mdiCashRemove, from: 16.65, to: 18.15 },
  { text: "بدأت من *جرابلس", icon: mdiFlag, from: 21.55, to: 23.4 },
  { text: "تكبر *الحكاية", icon: mdiTrendingUp, from: 23.4, to: 25.55 },
  { text: "ليس مجرد *تطبيق", icon: mdiCellphone, from: 25.55, to: 28.05 },
  { text: "سوقٌ *رقمي حقيقي", icon: mdiStorefront, from: 28.05, to: 30.55 },
  { text: "يخدم *كل *منطقة", icon: mdiMapMarkerMultiple, from: 30.55, to: 32.75 },
  { text: "من *أهلها، *ولأهلها", icon: mdiHandHeart, from: 32.75, to: 34.8 },
  { text: "ومن *جرابلس… كانت *البداية", icon: mdiFlag, from: 34.8, to: 38.8 },
];

const LIGHT = [
  [LOGO_AT, BACK_AT + 6],
  [FINAL_LOGO_AT, ORIGIN_DURATION],
];
const isLight = (frame: number) => LIGHT.some(([a, b]) => frame >= a && frame < b);

// A glass card rising in: the icon pops, the words are revealed right to left, and a thin bar fills while the line
// is spoken, like a progress indicator.
const KeyCard: React.FC<{ text: string; icon: string; from: number; to: number }> = ({ text, icon, from, to }) => {
  const frame = useCurrentFrame();
  const light = isLight(frame);
  const inP = ease(frame, from, 14);
  const outP = to >= ORIGIN_DURATION ? 0 : ease(frame, to - 6, 8, EASE_IN_OUT);
  if (inP === 0 || outP === 1) return null;
  const pop = interpolate(frame, [from + 2, from + 10, from + 16], [0, 1.15, 1], CLAMP);
  const reveal = ease(frame, from + 4, 16);
  const progress = interpolate(frame, [from, Math.min(to, ORIGIN_DURATION) - 4], [0, 1], CLAMP);
  const ink = light ? C.deep : "white";
  const accent = light ? C.brand : C.mint;
  return (
    <div style={{ position: "absolute", top: 1430, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: inP * (1 - outP), translate: `0 ${(1 - inP) * 40 - outP * 30}px` }}>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          direction: "rtl",
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "20px 40px 28px 44px",
          borderRadius: 36,
          background: light ? "rgba(255,255,255,0.75)" : "rgba(2,27,23,0.55)",
          border: `1.5px solid ${light ? "rgba(0,125,107,0.25)" : "rgba(18,201,178,0.35)"}`,
          backdropFilter: "blur(16px)",
          boxShadow: light ? "0 20px 50px rgba(2,27,23,0.15)" : "0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >
        <div style={{ width: 84, height: 84, borderRadius: 26, flexShrink: 0, background: `linear-gradient(145deg, ${C.mint} 0%, ${C.brand} 100%)`, display: "flex", justifyContent: "center", alignItems: "center", scale: pop, rotate: `${(1 - Math.min(1, pop)) * -30}deg`, boxShadow: "0 10px 24px rgba(18,201,178,0.35)" }}>
          <Icon path={icon} size={52} color="white" />
        </div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 58, color: ink, whiteSpace: "nowrap", clipPath: `inset(-20% 0 -20% ${(1 - reveal) * 100}%)` }}>
          {text.split(" ").map((w, j) => (
            <span key={j} style={{ color: w.startsWith("*") ? accent : undefined }}>
              {w.replace(/^\*/, "")}{" "}
            </span>
          ))}
        </div>
        <div style={{ position: "absolute", right: 0, bottom: 0, height: 5, width: `${progress * 100}%`, background: `linear-gradient(270deg, ${C.mint}, ${C.brand})` }} />
      </div>
    </div>
  );
};


// ---------------------------------------------------------------- the video

const Stars: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
      {new Array(40).fill(0).map((_, i) => (
        <circle key={i} cx={random(`sx${i}`) * 1080} cy={(random(`sy${i}`) * 1920 - frame * 0.3 * random(`sv${i}`) + 1920) % 1920} r={1 + random(`sr${i}`) * 2} fill={C.mint} opacity={0.08 + random(`so${i}`) * 0.2} />
      ))}
    </svg>
  );
};

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const phone = ease(frame, APP_AT, 26) * (1 - ease(frame, NETWORK_AT - 6, 16, EASE_IN_OUT));
  const title = ease(frame, DISTRICT_AT + 30, 20) * (1 - ease(frame, DIVE_AT - 10, 10)) + ease(frame, GROW_AT + 10, 20) * (1 - ease(frame, END_AT, 15));
  const jarablus = toPx(camera(frame), 0, 0);
  const credit = interpolate(frame, [DISTRICT_AT, DISTRICT_AT + 20, FINAL_LOGO_AT - 10, FINAL_LOGO_AT], [0, 0.55, 0.55, 0], CLAMP);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 110% 70% at 50% 40%, #063E36 0%, ${C.ink} 75%)`, overflow: "hidden" }}>
      <Stars />
      <MapView dim={phone} />
      <Story />
      {/* "Today the story grows": rings spreading from Jarablus across the district. */}
      {frame >= GROW_AT - 4 && frame < APP_AT + 30 && <Rings x={jarablus.x} y={jarablus.y} color={C.mint} start={GROW_AT - 4} every={12} count={5} total={6} maxRadius={1300} strokeWidth={4} />}
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, textAlign: "center", direction: "rtl", fontFamily: DISPLAY, opacity: Math.min(1, title) }}>
        <div style={{ fontWeight: 900, fontSize: 64, color: "white", textShadow: "0 0 30px rgba(18,201,178,0.45)" }}>منطقة جرابلس</div>
      </div>
      {phone > 0 && (
        <Phone cx={540} top={interpolate(phone, [0, 1], [900, 520])} scale={0.78} opacity={phone} turn={-6}>
          <Shot src="screen-home.jpg" />
        </Phone>
      )}
      <LogoStage from={LOGO_AT} to={BACK_AT + 6} top={560} width={900} />
      <LogoStage from={FINAL_LOGO_AT} to={ORIGIN_DURATION + 20} top={640} width={900} />
      {KEYS.map((k) => (
        <KeyCard key={k.from} text={k.text} icon={k.icon} from={sec(k.from)} to={sec(k.to)} />
      ))}
      <div style={{ position: "absolute", top: 1850, left: 0, right: 0, textAlign: "center", fontFamily: DISPLAY, fontSize: 20, color: C.paper, opacity: credit, direction: "rtl" }}>
        بيانات الخريطة: © مساهمو OpenStreetMap • OCHA
      </div>
    </AbsoluteFill>
  );
};

// Sound effects, sparse and quiet under the narration.
const SFX = [
  { name: "whoosh-fast", at: sec(1.9) - 32, volume: 0.25 },
  { name: "impact-deep", at: DISTRICT_AT + 10 - 16, volume: 0.3 },
  { name: "pop", at: PEOPLE_AT, volume: 0.25 },
  { name: "pop", at: PEOPLE_AT + 8, volume: 0.25 },
  { name: "notify", at: SEARCH_AT - 4, volume: 0.2 },
  { name: "stamp", at: MIDDLEMAN_AT + 10 - 5, volume: 0.3 },
  { name: "stamp", at: COMMISSION_AT + 10 - 5, volume: 0.3 },
  { name: "whoosh-fast", at: DIVE_AT + 10 - 32, volume: 0.3 },
  { name: "sparkle", at: LOGO_AT + 4 - 16, volume: 0.35 },
  { name: "whoosh-fast", at: BACK_AT + 6 - 32, volume: 0.22 },
  { name: "whoosh-fast", at: APP_AT - 24, volume: 0.2 },
  { name: "sparkle", at: FINAL_LOGO_AT + 4 - 16, volume: 0.35 },
];

const MIX = 0.708;

export const JarablusOrigin: React.FC<OriginProps> = ({ music }) => {
  // The music sits under the narration and opens up once the last word is spoken.
  const musicVolume = (f: number) =>
    MIX * interpolate(f, [0, 10, LOGO_AT - 10, LOGO_AT, sec(37.3), sec(37.8), ORIGIN_DURATION - 20, ORIGIN_DURATION - 1], [0, 0.6, 0.6, 0.3, 0.3, 0.7, 0.7, 0], CLAMP);
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Scene />
      <Audio src={staticFile("voiceover/origin/narration.mp3")} volume={() => 1} />
      {music && <Audio src={staticFile("music/a-new-life.mp3")} trimBefore={MUSIC_TRIM} volume={musicVolume} />}
      {SFX.map((sfx, i) => (
        <Sequence key={i} name={`Sound ${sfx.name}`} from={Math.max(0, sfx.at)} layout="none">
          <Audio src={staticFile(`sfx/${sfx.name}.mp3`)} trimBefore={Math.max(0, -sfx.at)} volume={() => MIX * sfx.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

