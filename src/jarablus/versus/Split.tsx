import { mdiAccountTie, mdiArrowDownBold, mdiArrowUpBold, mdiCash, mdiCheckBold, mdiCloseThick, mdiEmoticonSadOutline, mdiLightningBolt, mdiMapMarker, mdiWalk, mdiWater, mdiWeatherSunny, mdiWhatsapp } from "@mdi/js";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Burst, Icon, Rings, Words } from "../components";
import { Screen, Tap } from "../story/parts";
import { C, CLAMP, DISPLAY, TEXT } from "../theme";
import { b, DROP_AT, HOOK_END, rowStart, ROWS } from "./timing";

export const SPLIT_DURATION = DROP_AT;

// The divider between the old way (top) and the app (bottom). The app gets the bigger half.
const SPLIT = 820;
const OLD = { bg: "#2A2521", card: "#4A4038", text: "#EFE7DC", red: "#FF4D4D" };

const digits = (n: number) => String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);

// A solid outline around thick text, so it reads over anything, plus a soft drop shadow.
export const outline = (color: string, width: number) =>
  [
    ...new Array(16).fill(0).map((_, i) => {
      const a = (i / 16) * Math.PI * 2;
      return `${(Math.cos(a) * width).toFixed(1)}px ${(Math.sin(a) * width).toFixed(1)}px 0 ${color}`;
    }),
    `0 ${width * 2}px ${width * 3}px rgba(0,0,0,0.35)`,
  ].join(", ");

const pop = (frame: number, at: number, fps: number, damping = 12) => spring({ frame: frame - at, fps, config: { damping, stiffness: 200 } });

// ---------------------------------------------------------------- the old way, top half

// A rounded panel the old-way pictures sit on.
const OldCard: React.FC<{ children: React.ReactNode; background?: string }> = ({ children, background = `linear-gradient(180deg, #6F6358 0%, #4D433B 100%)` }) => (
  <div style={{ position: "absolute", left: 120, right: 120, top: 270, height: 400, borderRadius: 36, overflow: "hidden", background, boxShadow: "inset 0 0 80px rgba(0,0,0,0.45)" }}>{children}</div>
);

// A paper ad taped to a wall, blown away by the wind.
const OldFlyer: React.FC<{ t: number }> = ({ t }) => {
  const fly = interpolate(t, [18, 50], [0, 1], { ...CLAMP, easing: (x) => x * x });
  const flutter = interpolate(t, [0, 18], [0, 1], CLAMP) * (1 - fly);
  return (
    <OldCard>
      {/* Scraps of older ads on the plaster. */}
      {[
        [60, 40, 90, 70, 8],
        [620, 250, 110, 80, -10],
        [80, 280, 70, 60, 14],
      ].map(([x, y, w, h, r], i) => (
        <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: h, background: "#9C8E80", opacity: 0.5, rotate: `${r}deg` }} />
      ))}
      <div
        style={{
          position: "absolute",
          left: 420 - 140,
          top: 30,
          width: 280,
          height: 340,
          background: "#F2EBDD",
          boxShadow: "0 14px 30px rgba(0,0,0,0.4)",
          transformOrigin: "50% 0%",
          direction: "rtl",
          textAlign: "center",
          translate: `${-fly * 900}px ${-fly * 260 + Math.sin(t / 3) * 20 * fly}px`,
          rotate: `${-3 + Math.sin(t * 1.3) * 7 * flutter - fly * 220}deg`,
          transform: `skewY(${Math.sin(t * 1.7) * 6 * flutter}deg)`,
        }}
      >
        <div style={{ position: "absolute", left: -20, top: -12, width: 90, height: 34, background: "rgba(255,245,200,0.6)", rotate: "-20deg" }} />
        <div style={{ position: "absolute", right: -20, top: -12, width: 90, height: 34, background: "rgba(255,245,200,0.6)", rotate: "20deg" }} />
        <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 84, color: "#C9302C", marginTop: 30 }}>للبيع</div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 46, color: "#3A322C" }}>موتور</div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 42, color: "#3A322C" }}>570 $</div>
        {/* Tear-off phone number strips. */}
        <div style={{ position: "absolute", bottom: 0, left: 10, right: 10, height: 80, display: "flex", gap: 6 }}>
          {new Array(7).fill(0).map((_, i) => (
            <div key={i} style={{ flex: 1, borderLeft: "2px dashed #B8AD9E", position: "relative" }}>
              <div style={{ position: "absolute", left: 8, top: 10, width: 4, height: 56, background: "#6B6056", opacity: 0.6 }} />
            </div>
          ))}
        </div>
      </div>
      {/* Rain. */}
      <svg width="840" height="400" style={{ position: "absolute", inset: 0, opacity: interpolate(t, [0, 6], [0, 0.45], CLAMP) }}>
        {new Array(40).fill(0).map((_, i) => {
          const x = random(`rx${i}`) * 900;
          const y = ((random(`ry${i}`) * 500 + t * 34) % 500) - 60;
          return <line key={i} x1={x} y1={y} x2={x - 14} y2={y + 44} stroke="#D6E4F0" strokeWidth={3} />;
        })}
      </svg>
    </OldCard>
  );
};

// Walking round the market in the sun.
const OldSun: React.FC<{ t: number }> = ({ t }) => {
  const walk = interpolate(t, [0, 60], [0, 1], CLAMP);
  const x = 620 - walk * 260;
  return (
    <OldCard background="linear-gradient(180deg, #8C6A45 0%, #5E4A38 70%, #4A3C31 100%)">
      <div style={{ position: "absolute", left: 40, top: 20, rotate: `${t * 2}deg`, scale: 1 + Math.sin(t / 4) * 0.05, filter: "drop-shadow(0 0 40px rgba(255,190,90,0.9))" }}>
        <Icon path={mdiWeatherSunny} size={220} color="#FFC857" />
      </div>
      {/* Heat shimmer. */}
      <svg width="840" height="400" style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M ${300 + i * 150} 300 q 20 -30 0 -60 q -20 -30 0 -60`} stroke="#FFE2B0" strokeWidth={5} fill="none" transform={`translate(0 ${-((t * 2 + i * 20) % 40)})`} />
        ))}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 350, height: 6, background: "#2E251E", opacity: 0.6 }} />
      <div style={{ position: "absolute", left: x, top: 160 + Math.abs(Math.sin(t / 3)) * -10, scale: "-1 1" }}>
        <Icon path={mdiWalk} size={190} color="#EFE7DC" />
      </div>
      {[0, 1, 2].map((i) => {
        const d = (t - i * 14) % 42;
        if (t < i * 14) return null;
        return (
          <div key={i} style={{ position: "absolute", left: x + 60 + i * 30, top: 160 + d * 3, opacity: interpolate(d, [0, 6, 30, 42], [0, 1, 1, 0], CLAMP) }}>
            <Icon path={mdiWater} size={44} color="#9FD3FF" />
          </div>
        );
      })}
    </OldCard>
  );
};

// The middleman takes his cut.
const OldBroker: React.FC<{ t: number }> = ({ t }) => {
  const { fps } = useVideoConfig();
  const bubble = pop(t, 14, fps);
  const cut = pop(t, 24, fps, 9);
  return (
    <OldCard background="linear-gradient(180deg, #4B4550 0%, #33303A 100%)">
      <div style={{ position: "absolute", left: 420 - 130, top: 90, width: 260, height: 260, borderRadius: 130, background: "#6A6270", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Icon path={mdiAccountTie} size={200} color="#EFE7DC" />
      </div>
      {/* Money flying from the seller to the middleman. */}
      {new Array(6).fill(0).map((_, i) => {
        const p = interpolate(t, [4 + i * 6, 20 + i * 6], [0, 1], CLAMP);
        if (p === 0 || p === 1) return null;
        return (
          <div key={i} style={{ position: "absolute", left: interpolate(p, [0, 1], [-60, 380]), top: interpolate(p, [0, 0.5, 1], [380, 120, 220]), rotate: `${p * 360}deg`, opacity: interpolate(p, [0.8, 1], [1, 0], CLAMP) }}>
            <Icon path={mdiCash} size={90} color="#7FB77E" />
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          right: 30,
          top: 40,
          direction: "rtl",
          fontFamily: DISPLAY,
          fontWeight: 900,
          fontSize: 48,
          color: "#2A2521",
          background: "#EFE7DC",
          borderRadius: 30,
          padding: "10px 30px 18px",
          scale: bubble,
        }}
      >
        بدّي عمولتي!
      </div>
      <div style={{ position: "absolute", left: 40, top: 60, fontFamily: DISPLAY, fontWeight: 900, fontSize: 110, color: OLD.red, scale: interpolate(cut, [0, 1], [2, 1]), opacity: Math.min(1, cut * 2), direction: "ltr" }}>
        −10%
      </div>
    </OldCard>
  );
};

// Days go by and nobody calls.
const OldCalendar: React.FC<{ t: number }> = ({ t }) => {
  const day = Math.min(14, 1 + Math.floor(Math.max(0, t) / 3));
  const flip = (Math.max(0, t) % 3) / 3;
  return (
    <OldCard background="linear-gradient(180deg, #3E3A36 0%, #2B2825 100%)">
      <div style={{ position: "absolute", left: 60, top: 110, opacity: 0.8 }}>
        <Icon path={mdiEmoticonSadOutline} size={190} color="#B9AFA4" />
      </div>
      <div style={{ position: "absolute", left: 360, top: 40, width: 320, height: 320, borderRadius: 30, background: "#EFE7DC", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
        <div style={{ height: 80, background: OLD.red, direction: "rtl", fontFamily: DISPLAY, fontWeight: 800, fontSize: 40, color: "white", textAlign: "center", lineHeight: "72px" }}>يوم</div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 170, color: "#2A2521", textAlign: "center", lineHeight: "230px", scale: `1 ${day < 14 ? 1 - Math.sin(flip * Math.PI) * 0.15 : 1}` }}>{digits(day)}</div>
      </div>
      <div style={{ position: "absolute", left: 250, top: 40, fontFamily: DISPLAY, fontWeight: 800, fontSize: 60, color: "#B9AFA4", opacity: 0.5 + 0.5 * Math.sin(t / 5), rotate: "-12deg" }}>z z</div>
    </OldCard>
  );
};

// ---------------------------------------------------------------- the app, bottom half

const PHONE_W = 270;
const PHONE_H = (PHONE_W * 1280) / 627;
const PHONE_TOP = 1040;

// Posting an ad in three taps with the real screens.
const NewPublish: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const { fps } = useVideoConfig();
  const screens = ["screen-home.jpg", "screen-category.jpg", "screen-title.jpg", "screen-photos.jpg", "screen-ad-moto.jpg"];
  const step = t < 0 ? 0 : Math.min(4, 1 + Math.floor(t / 12));
  const toast = pop(t, 37, fps, 11);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 540 - PHONE_W / 2 - 10,
          top: PHONE_TOP,
          width: PHONE_W + 20,
          height: PHONE_H + 20,
          padding: 10,
          borderRadius: 44,
          background: "#0B1110",
          boxShadow: "0 40px 80px rgba(0,0,0,0.5), inset 0 0 0 3px #2A3533",
          rotate: `${Math.sin(t / 14) * 2}deg`,
        }}
      >
        <div style={{ position: "relative", width: PHONE_W, height: PHONE_H, borderRadius: 34, overflow: "hidden", background: C.paper }}>
          <Screen src={screens[step]} width={PHONE_W} />
          {[
            { at: 10, x: 0.5, y: 0.95 },
            { at: 22, x: 0.38, y: 0.61 },
            { at: 34, x: 0.38, y: 0.94 },
          ].map((tap) => (
            <Tap key={tap.at} at={at + tap.at} x={tap.x * PHONE_W} y={tap.y * PHONE_H} />
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", top: 1110, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: t < 37 ? 0 : Math.min(1, toast * 2), scale: interpolate(toast, [0, 1], [0.4, 1]) }}>
        <div style={{ direction: "rtl", display: "flex", alignItems: "center", gap: 16, background: C.mint, color: C.ink, borderRadius: 60, padding: "14px 40px 22px", fontFamily: DISPLAY, fontWeight: 900, fontSize: 54, boxShadow: "0 20px 50px rgba(0,0,0,0.45)" }}>
          <Icon path={mdiCheckBold} size={56} color={C.ink} />
          تم نشر إعلانك
        </div>
      </div>
      <Burst x={540} y={1150} start={at + 37} seed="publish" colors={[C.mint, C.cream, "white"]} count={40} power={1.3} />
    </>
  );
};

// The ad reaching the town and its villages.
const PLACES = [
  { name: "جرابلس", x: 300, y: 1140 },
  { name: "العمارنة", x: 790, y: 1140 },
  { name: "الغندورة", x: 290, y: 1470 },
  { name: "ريف جرابلس", x: 790, y: 1470 },
];
const NewReach: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const { fps } = useVideoConfig();
  const pin = pop(t, 0, fps, 10);
  return (
    <>
      <Rings x={540} y={1300} color={C.mint} start={at + 2} every={10} count={4} total={6} maxRadius={560} strokeWidth={5} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        {PLACES.map((p, i) => {
          const k = interpolate(t, [6 + i * 7, 14 + i * 7], [0, 1], CLAMP);
          return <line key={p.name} x1={540} y1={1300} x2={540 + (p.x - 540) * k} y2={1300 + (p.y - 1300) * k} stroke={C.mint} strokeWidth={5} strokeDasharray="14 12" opacity={0.8} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: 540 - 90, top: 1300 - 150, scale: pin, transformOrigin: "50% 100%", filter: "drop-shadow(0 16px 24px rgba(0,0,0,0.4))" }}>
        <Icon path={mdiMapMarker} size={180} color={C.cream} />
      </div>
      {PLACES.map((p, i) => {
        const s = pop(t, 12 + i * 7, fps, 10);
        return (
          <div key={p.name} style={{ position: "absolute", left: p.x - 200, width: 400, top: p.y - 50, display: "flex", justifyContent: "center", scale: s, opacity: t < 12 + i * 7 ? 0 : 1 }}>
            <div style={{ direction: "rtl", fontFamily: DISPLAY, fontWeight: 900, fontSize: 50, color: C.ink, background: C.mint, borderRadius: 50, padding: "10px 34px 18px", boxShadow: "0 16px 36px rgba(0,0,0,0.35)" }}>{p.name}</div>
          </div>
        );
      })}
    </>
  );
};

// No commission, stamped big.
const NewZero: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const { fps } = useVideoConfig();
  const slam = pop(t, 3, fps, 9);
  const shake = t > 3 && t < 14 ? 16 * (1 - (t - 3) / 11) : 0;
  const tag = pop(t, 14, fps);
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 1040,
          left: 0,
          right: 0,
          textAlign: "center",
          direction: "ltr",
          fontFamily: DISPLAY,
          fontWeight: 900,
          fontSize: 330,
          lineHeight: 1.2,
          color: C.cream,
          textShadow: outline(C.ink, 10),
          scale: interpolate(slam, [0, 1], [3, 1]),
          opacity: t < 3 ? 0 : Math.min(1, slam * 2),
          translate: `${Math.sin(t * 3) * shake}px ${Math.cos(t * 2.4) * shake}px`,
        }}
      >
        0%
      </div>
      <Burst x={540} y={1260} start={at + 5} seed="zero" colors={[C.mint, C.cream, "white"]} count={60} power={1.6} />
      <div style={{ position: "absolute", top: 1470, left: 0, right: 0, display: "flex", justifyContent: "center", scale: tag, opacity: t < 14 ? 0 : 1 }}>
        <div style={{ direction: "rtl", fontFamily: DISPLAY, fontWeight: 900, fontSize: 64, color: C.ink, background: C.mint, borderRadius: 50, padding: "8px 50px 18px" }}>عمولة</div>
      </div>
    </>
  );
};

// Buyers messaging on WhatsApp, then sold.
const CHATS = ["مرحبا، الموتور لسا موجود؟", "قديش آخر سعر؟", "تمام، جاي آخدو هلّق!"];
const NewChats: React.FC<{ t: number; at: number }> = ({ t }) => {
  const { fps } = useVideoConfig();
  const stamp = pop(t, 36, fps, 9);
  return (
    <>
      <div style={{ position: "absolute", left: 110, right: 110, top: 1040, height: 530, borderRadius: 40, overflow: "hidden", background: "#ECE5DD", boxShadow: "0 40px 80px rgba(0,0,0,0.45)" }}>
        <div style={{ height: 110, background: "#075E54", direction: "rtl", display: "flex", alignItems: "center", gap: 20, padding: "0 34px" }}>
          <div style={{ width: 70, height: 70, borderRadius: 35, background: "#25D366", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Icon path={mdiWhatsapp} size={48} color="white" />
          </div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 44, color: "white" }}>مشتري من جرابلس</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22, padding: "30px 34px", direction: "rtl", alignItems: "flex-end" }}>
          {CHATS.map((text, i) => {
            const s = pop(t, 4 + i * 9, fps, 12);
            return (
              <div
                key={text}
                style={{
                  fontFamily: TEXT,
                  fontWeight: 700,
                  fontSize: 44,
                  color: "#111B21",
                  background: "white",
                  borderRadius: "28px 28px 28px 6px",
                  padding: "14px 28px 20px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
                  scale: s,
                  transformOrigin: "0% 100%",
                  opacity: t < 4 + i * 9 ? 0 : 1,
                }}
              >
                {text}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", top: 1230, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: t < 36 ? 0 : Math.min(1, stamp * 2) }}>
        <div
          style={{
            direction: "rtl",
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontSize: 110,
            color: C.brand,
            border: `12px solid ${C.brand}`,
            borderRadius: 30,
            padding: "0 50px 16px",
            background: "rgba(255,255,255,0.92)",
            rotate: "-10deg",
            scale: interpolate(stamp, [0, 1], [2.4, 1]),
          }}
        >
          <Icon path={mdiCheckBold} size={110} color={C.brand} />
          انباع!
        </div>
      </div>
    </>
  );
};

type RowView = React.FC<{ t: number; at: number }>;
const ROW_VIEWS: { Old: RowView; New: RowView; old: string; new: string }[] = [
  { Old: OldFlyer, New: NewPublish, old: "ورقة عالحيط *وطارت", new: "٣ كبسات.. *وانتشر *إعلانك" },
  { Old: OldSun, New: NewReach, old: "ولفّة بالسوق *تحت *الشمس", new: "بيوصل لكل *جرابلس *وريفها" },
  { Old: OldBroker, New: NewZero, old: "والسمسار بدّو *عمولتو", new: "بلا وسيط.. *وبلا *عمولة" },
  { Old: OldCalendar, New: NewChats, old: "وبعد أسبوعين.. *لسا *ما *انباع", new: "والمشتري بيحكيك *عالواتساب" },
];

// ---------------------------------------------------------------- layout

const Label: React.FC<{ top: number; bg: string; color: string; icon: string; text: string }> = ({ top, bg, color, icon, text }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
    <div style={{ direction: "rtl", display: "flex", alignItems: "center", gap: 12, background: bg, color, borderRadius: 40, padding: "6px 30px 12px 26px", fontFamily: DISPLAY, fontWeight: 900, fontSize: 40, boxShadow: "0 10px 24px rgba(0,0,0,0.3)" }}>
      <Icon path={icon} size={42} color={color} />
      {text}
    </div>
  </div>
);

// Which row is on screen, and how far into it we are. The first row is already on screen under the hook.
const currentRow = (frame: number) => {
  let i = 0;
  while (i < ROWS - 1 && frame >= rowStart(i + 1)) i++;
  return { i, t: frame - rowStart(i) };
};

export const Split: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { i, t } = currentRow(frame);
  const row = ROW_VIEWS[i];
  // On the drop, the app's half pushes the old way off the top of the screen.
  const collapse = interpolate(frame, [DROP_AT - 9, DROP_AT], [0, 1], { ...CLAMP, easing: (x) => x * x * x });
  const divider = SPLIT * (1 - collapse);
  // Every cut lands with a quick punch-in.
  const punch = i === 0 ? 1 : interpolate(spring({ frame: t, fps, config: { damping: 14, stiffness: 220 } }), [0, 1], [1.12, 1]);
  const cutFlash = i === 0 ? 0 : interpolate(t, [0, 5], [0.55, 0], CLAMP);
  // The hook points at one half, then the other.
  const hookTop = frame < b(2);
  const hookDim = (onTop: boolean) => (frame >= HOOK_END ? 0 : hookTop === onTop ? 0 : 0.6);
  const vs = spring({ frame: frame - 2, fps, config: { damping: 10, stiffness: 200 } });

  return (
    <AbsoluteFill style={{ background: C.ink }}>
      {/* Top: the old way. */}
      <AbsoluteFill style={{ clipPath: `inset(0 0 ${1920 - divider}px 0)` }}>
        <AbsoluteFill style={{ translate: `0 ${divider - SPLIT}px`, filter: `grayscale(${0.25 + collapse * 0.75})` }}>
          <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #3A332D 0%, ${OLD.bg} 70%)` }} />
          <AbsoluteFill style={{ scale: punch }}>
            <row.Old t={t} at={rowStart(i)} />
            <AbsoluteFill style={{ top: 668, height: 110, justifyContent: "center" }}>
              <Words key={i} text={row.old} start={i === 0 ? HOOK_END : rowStart(i) + 2} stagger={3} size={62} color={OLD.text} accent={OLD.red} style={{ textShadow: outline("#140F0C", 6) }} />
            </AbsoluteFill>
          </AbsoluteFill>
          <Label top={180} bg={OLD.red} color="white" icon={mdiCloseThick} text="الطريقة القديمة" />
          <AbsoluteFill style={{ background: "white", opacity: cutFlash }} />
          <AbsoluteFill style={{ background: "black", opacity: hookDim(true) }} />
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Bottom: the app. */}
      <AbsoluteFill style={{ clipPath: `inset(${divider}px 0 0 0)` }}>
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 70%, ${C.brand} 0%, ${C.deep} 55%, ${C.ink} 110%)` }} />
        <AbsoluteFill style={{ scale: punch }}>
          <row.New t={t} at={rowStart(i)} />
          <AbsoluteFill style={{ top: 912, height: 120, justifyContent: "center" }}>
            <Words key={i} text={row.new} start={i === 0 ? HOOK_END : rowStart(i) + 2} stagger={3} size={64} color="white" accent={C.mint} style={{ textShadow: outline(C.ink, 6) }} />
          </AbsoluteFill>
        </AbsoluteFill>
        <Label top={SPLIT + 26} bg={C.mint} color={C.ink} icon={mdiCheckBold} text="مع سوق جرابلس" />
        <AbsoluteFill style={{ background: "white", opacity: cutFlash }} />
        <AbsoluteFill style={{ background: "black", opacity: hookDim(false) }} />
      </AbsoluteFill>

      {/* The divider and its badge. */}
      <div style={{ position: "absolute", left: 0, right: 0, top: divider - 5, height: 10, background: C.cream, boxShadow: "0 0 30px rgba(246,234,211,0.7)" }} />
      <div
        style={{
          position: "absolute",
          left: 70,
          top: divider - 60,
          width: 120,
          height: 120,
          borderRadius: 60,
          background: C.cream,
          border: `8px solid ${C.ink}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          scale: vs * (1 - collapse),
          rotate: `${Math.sin(frame / 8) * 8}deg`,
        }}
      >
        <Icon path={mdiLightningBolt} size={76} color={C.ink} />
      </div>

      {/* The hook: a question pointing at the old way, then at the app. */}
      {frame < HOOK_END && <Hook />}
    </AbsoluteFill>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const top = frame < b(2);
  const bounce = Math.abs(Math.sin(frame / 4)) * 18;
  return top ? (
    <>
      <AbsoluteFill style={{ top: 1060, height: 330, justifyContent: "center" }}>
        <Words text={"لسا عم تبيع\nغراضك *هيك؟"} start={-16} stagger={2} size={116} color="white" accent={C.cream} lineHeight={1.25} style={{ textShadow: outline(C.ink, 9) }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 540 - 70, top: 900 - bounce }}>
        <Icon path={mdiArrowUpBold} size={140} color={C.cream} style={{ filter: "drop-shadow(0 6px 0 #021B17)" }} />
      </div>
    </>
  ) : (
    <>
      <AbsoluteFill style={{ top: 300, height: 260, justifyContent: "center" }}>
        <Words text={"ولّا *هيك؟"} start={b(2)} stagger={3} size={150} color="white" accent={C.mint} style={{ textShadow: outline(C.ink, 10) }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 540 - 70, top: 580 + bounce }}>
        <Icon path={mdiArrowDownBold} size={140} color={C.mint} style={{ filter: "drop-shadow(0 6px 0 #021B17)" }} />
      </div>
    </>
  );
};

