import { mdiCrane, mdiDoorClosed, mdiDoorOpen, mdiHandshake, mdiKeyVariant } from "@mdi/js";
import { AbsoluteFill, Img, interpolate, Series, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { Burst, Icon, Rings, Words } from "../jarablus/components";
import { CLAMP, DISPLAY, TEXT } from "../jarablus/theme";
import { A, beat, SERVICE_BEATS } from "./theme";

export const SERVICE_DURATION = beat(SERVICE_BEATS);
export const SERVICES_DURATION = SERVICE_DURATION * 5;

const CX = 540;
const CY = 960;

// بيع: a photo of a building gets a "sold" stamp slammed on it.
const Sell: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stamp = spring({ frame: frame - 14, fps, config: { damping: 12, stiffness: 320 } });
  const shake = frame >= 14 && frame < 22 ? 10 * (1 - (frame - 14) / 8) : 0;
  return (
    <>
      <div style={{ position: "absolute", left: CX - 240, top: CY - 330, width: 480, height: 620, borderRadius: 30, overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,0.45)", border: "8px solid white", rotate: "-3deg", translate: `${Math.sin(frame * 3) * shake}px 0` }}>
        {/* Only the towers from the office's design, without its text. */}
        <Img src={staticFile("abusham/banner.jpg")} style={{ position: "absolute", width: 1280 * 1.514, maxWidth: "none", left: -360 * 1.514, top: -330 * 1.514 }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: CX - 230,
          top: CY - 60,
          width: 460,
          textAlign: "center",
          direction: "rtl",
          fontFamily: DISPLAY,
          fontWeight: 900,
          fontSize: 92,
          color: A.stamp,
          border: `10px solid ${A.stamp}`,
          borderRadius: 24,
          padding: "0 10px 12px",
          background: "rgba(255,255,255,0.85)",
          rotate: "-14deg",
          scale: interpolate(stamp, [0, 1], [2.4, 1]),
          opacity: frame < 14 ? 0 : Math.min(1, stamp * 1.5),
        }}
      >
        تم البيع
      </div>
      <Burst x={CX} y={CY + 10} start={15} seed="sell" colors={["#FFFFFF", A.sky]} count={26} power={0.8} life={24} />
    </>
  );
};

// شراء: a handshake, and gold coins thrown out as the deal closes.
const Buy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 4, fps, config: { damping: 10, stiffness: 200 } });
  return (
    <>
      <Rings x={CX} y={CY} color={A.sky} start={8} every={8} count={3} total={3} maxRadius={600} strokeWidth={4} />
      <div style={{ position: "absolute", left: CX - 230, top: CY - 230, width: 460, height: 460, borderRadius: 230, background: "white", display: "flex", justifyContent: "center", alignItems: "center", scale: pop, boxShadow: "0 40px 90px rgba(0,0,0,0.4)" }}>
        <Icon path={mdiHandshake} size={300} color={A.royal} style={{ rotate: `${Math.sin(frame / 3) * 4 * Math.max(0, 1 - frame / 30)}deg` }} />
      </div>
      <Burst x={CX} y={CY} start={12} seed="buy-coins" colors={[A.gold, "#FFD978", "#E0A21C"]} count={34} power={1.2} life={34} />
    </>
  );
};

// آجار: a golden key flies to a door, turns, and the door opens.
const Rent: React.FC = () => {
  const frame = useCurrentFrame();
  const fly = interpolate(frame, [4, 18], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const turn = interpolate(frame, [20, 28], [0, -90], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
  const open = frame >= 30;
  return (
    <>
      <div style={{ position: "absolute", left: CX - 260, top: CY - 300, width: 520, height: 600, borderRadius: 40, background: open ? `radial-gradient(circle at 50% 55%, ${A.gold}66, transparent 70%)` : "transparent" }} />
      <div style={{ position: "absolute", left: CX - 210, top: CY - 230, display: "flex", justifyContent: "center" }}>
        <Icon path={open ? mdiDoorOpen : mdiDoorClosed} size={420} color="white" />
      </div>
      <div style={{ position: "absolute", left: interpolate(fly, [0, 1], [1100, CX + 20]), top: interpolate(fly, [0, 1], [CY - 500, CY - 20]), rotate: `${turn}deg`, transformOrigin: "20% 50%" }}>
        <Icon path={mdiKeyVariant} size={170} color={A.gold} style={{ filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.4))", rotate: "180deg" }} />
      </div>
      {open && <Burst x={CX} y={CY} start={30} seed="rent" colors={[A.gold, "#FFFFFF"]} count={24} life={24} />}
    </>
  );
};

// بناء: floors dropping onto each other while a crane swings.
const Build: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const floors = 7;
  return (
    <>
      <div style={{ position: "absolute", left: 120, top: CY - 420, rotate: `${Math.sin(frame / 10) * 4}deg`, transformOrigin: "30% 100%" }}>
        <Icon path={mdiCrane} size={360} color={A.gold} />
      </div>
      <div style={{ position: "absolute", left: CX - 230, top: CY + 330, width: 520, height: 10, borderRadius: 5, background: "white", opacity: 0.8 }} />
      {new Array(floors).fill(0).map((_, i) => {
        const p = spring({ frame: frame - (3 + i * 5), fps, config: { damping: 11, stiffness: 260 } });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: CX - 150,
              top: CY + 270 - i * 66,
              width: 360,
              height: 60,
              borderRadius: 6,
              background: `linear-gradient(90deg, ${A.royal}, ${A.sky})`,
              border: "3px solid white",
              opacity: frame < 3 + i * 5 ? 0 : 1,
              translate: `0 ${(1 - p) * -500}px`,
              backgroundImage: `repeating-linear-gradient(90deg, transparent 0 34px, rgba(255,255,255,0.85) 34px 50px), linear-gradient(90deg, ${A.royal}, ${A.sky})`,
            }}
          />
        );
      })}
    </>
  );
};

// تعهدات: a contract is written and signed, then sealed.
const Contract: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seal = spring({ frame: frame - 40, fps, config: { damping: 10, stiffness: 260 } });
  const lines = [0.9, 0.75, 0.85, 0.6, 0.8];
  return (
    <>
      <div style={{ position: "absolute", left: CX - 250, top: CY - 330, width: 500, height: 640, borderRadius: 24, background: "white", boxShadow: "0 40px 90px rgba(0,0,0,0.45)", rotate: "2deg", direction: "rtl", padding: "46px 50px" }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 48, color: A.navy, textAlign: "center" }}>عقد تعهّد</div>
        {lines.map((w, i) => (
          <div key={i} style={{ height: 14, borderRadius: 7, background: "#D6DEEA", marginTop: 30, width: `${w * 100 * interpolate(frame, [4 + i * 3, 12 + i * 3], [0, 1], CLAMP)}%` }} />
        ))}
        <svg width={400} height={150} style={{ position: "absolute", left: 50, bottom: 50 }}>
          <path d="M 330 90 C 300 20, 270 130, 240 70 S 190 40, 170 95 S 120 60, 90 80 L 40 85" fill="none" stroke={A.navy} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={interpolate(frame, [20, 38], [1, 0], CLAMP)} />
          <path d="M 20 125 L 380 125" stroke="#B8C3D4" strokeWidth={3} />
        </svg>
      </div>
      <div
        style={{
          position: "absolute",
          left: CX + 90,
          top: CY + 140,
          width: 170,
          height: 170,
          borderRadius: 85,
          border: `8px solid ${A.gold}`,
          background: "rgba(245,185,66,0.15)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: DISPLAY,
          fontWeight: 900,
          fontSize: 40,
          color: A.gold,
          rotate: "-12deg",
          scale: interpolate(seal, [0, 1], [2.2, 1]),
          opacity: frame < 40 ? 0 : Math.min(1, seal * 1.5),
        }}
      >
        معتمد
      </div>
    </>
  );
};

const ITEMS = [
  { title: "بيع", sub: "بيوت، أراضي، ومحلات", Visual: Sell },
  { title: "شراء", sub: "نلاقيلك اللي بيناسبك", Visual: Buy },
  { title: "آجار", sub: "بيوت ومحلات للآجار", Visual: Rent },
  { title: "بناء", sub: "من الأساس للتسليم", Visual: Build },
  { title: "تعهدات", sub: "تعهدات بناء", Visual: Contract },
];

const Service: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const { title, sub, Visual } = ITEMS[index];
  // Each service slides in from the right, the way Arabic reads.
  const enter = interpolate(frame, [0, 8], [1, 0], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 50%, ${A.deep} 0%, ${A.navy} 55%, ${A.night} 100%)`,
        backgroundImage: `linear-gradient(rgba(79,163,247,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(79,163,247,0.08) 1px, transparent 1px), radial-gradient(circle at 50% 50%, ${A.deep} 0%, ${A.navy} 55%, ${A.night} 100%)`,
        backgroundSize: "60px 60px, 60px 60px, 100% 100%",
        translate: `${enter * 1080}px 0`,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 250, left: 80, right: 80, display: "flex", justifyContent: "space-between", direction: "rtl", fontFamily: TEXT, fontWeight: 600, fontSize: 30, color: A.sky }}>
        <span>خدماتنا</span>
        <span>{`${"٠١٢٣٤٥"[index + 1]} / ٥`}</span>
      </div>
      <AbsoluteFill style={{ top: 300, height: 260, justifyContent: "center" }}>
        <Words text={title} start={2} size={170} color="white" />
      </AbsoluteFill>
      <Visual />
      <div style={{ position: "absolute", top: 1360, left: 0, right: 0, textAlign: "center", direction: "rtl", fontFamily: TEXT, fontWeight: 600, fontSize: 52, color: A.ice, opacity: interpolate(frame, [10, 18], [0, 1], CLAMP) }}>{sub}</div>
    </AbsoluteFill>
  );
};

export const Services: React.FC = () => (
  <Series>
    {ITEMS.map((item, i) => (
      <Series.Sequence key={item.title} name={item.title} durationInFrames={SERVICE_DURATION}>
        <Service index={i} />
      </Series.Sequence>
    ))}
  </Series>
);
