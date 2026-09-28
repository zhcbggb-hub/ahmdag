import { mdiDoorClosed, mdiDoorOpen, mdiHandshake, mdiKeyVariant } from "@mdi/js";
import { AbsoluteFill, Img, interpolate, Series, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { Burst, Icon, Rings, Words } from "../jarablus/components";
import { CLAMP, DISPLAY, TEXT } from "../jarablus/theme";
import { A, beat, SERVICE_BEATS } from "./theme";

export const SERVICE_DURATION = beat(SERVICE_BEATS);
export const SERVICES_DURATION = SERVICE_DURATION * 3;

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

const ITEMS = [
  { title: "بيع", sub: "بيوت، أراضي، ومحلات", Visual: Sell },
  { title: "شراء", sub: "نلاقيلك اللي بيناسبك", Visual: Buy },
  { title: "آجار", sub: "بيوت ومحلات للآجار", Visual: Rent },
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
        <span>{`${"١٢٣"[index]} / ٣`}</span>
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
