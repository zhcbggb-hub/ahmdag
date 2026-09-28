import { mdiMapMarker, mdiPhone, mdiShieldCheck, mdiWhatsapp } from "@mdi/js";
import { lightLeak } from "@remotion/effects/light-leak";
import { AbsoluteFill, Img, interpolate, Solid, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { Burst, Icon, Rings, Words } from "../jarablus/components";
import { CLAMP, DISPLAY, TEXT } from "../jarablus/theme";
import { LogoIcon } from "./LogoIcon";
import { A, beat, END_START, OFFICE_START, PHONE_CALL, PHONE_WHATSAPP, PROMO_DURATION, TRUST_START } from "./theme";

export const OFFICE_DURATION = TRUST_START - OFFICE_START;
export const TRUST_DURATION = END_START - TRUST_START;
export const END_DURATION = PROMO_DURATION - END_START;

// The real storefront, with a slow push in, and where to find it.
export const Office: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pin = spring({ frame: frame - 18, fps, config: { damping: 9, stiffness: 220 } });
  const push = interpolate(frame, [0, OFFICE_DURATION], [1.02, 1.14], CLAMP);
  return (
    <AbsoluteFill style={{ background: A.night, overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(40px) brightness(0.45)", scale: 1.4 }}>
        <Img src={staticFile("abusham/office.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ top: 250, height: 280, justifyContent: "center" }}>
        <Words text={"مكتبنا *بجرابلس"} start={2} stagger={5} size={112} color="white" accent={A.sky} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 40, top: 600, width: 1000, height: 750, borderRadius: 36, overflow: "hidden", border: "8px solid white", boxShadow: "0 50px 100px rgba(0,0,0,0.55)" }}>
        <Img src={staticFile("abusham/office.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", scale: push }} />
      </div>
      <div style={{ position: "absolute", left: 540 - 70, top: 520, width: 140, height: 140, scale: pin, transformOrigin: "50% 100%", translate: `0 ${(1 - Math.min(1, pin)) * -80}px`, opacity: frame < 18 ? 0 : 1 }}>
        <Icon path={mdiMapMarker} size={140} color={A.gold} style={{ filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.5))" }} />
      </div>
      <div style={{ position: "absolute", top: 1400, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ direction: "rtl", display: "flex", alignItems: "center", gap: 14, background: "white", borderRadius: 60, padding: "12px 40px 18px", opacity: interpolate(frame, [26, 34], [0, 1], CLAMP), translate: `0 ${interpolate(frame, [26, 34], [30, 0], CLAMP)}px` }}>
          <Icon path={mdiMapMarker} size={48} color={A.royal} />
          <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 50, color: A.navy }}>طريق المحطة</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// The promise: "مكتب أبو شام للثقة عنوان" (Abu Sham office, an address for trust), in gold behind a shield, with a light sweeping across.
export const Trust: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shield = spring({ frame: frame - 2, fps, config: { damping: 10, stiffness: 220 } });
  const shine = interpolate(frame, [26, 44], [-30, 130], CLAMP);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${A.deep} 0%, ${A.navy} 50%, ${A.night} 100%)`, overflow: "hidden" }}>
      {/* Slow rays of light behind the shield. */}
      <AbsoluteFill style={{ background: `repeating-conic-gradient(from ${frame * 0.6}deg at 540px 720px, rgba(245,185,66,0.10) 0deg 8deg, transparent 8deg 20deg)`, WebkitMaskImage: "radial-gradient(circle at 540px 720px, black 0%, transparent 60%)", maskImage: "radial-gradient(circle at 540px 720px, black 0%, transparent 60%)" }} />
      <Rings x={540} y={720} color={A.gold} start={4} every={7} count={4} total={3} maxRadius={800} strokeWidth={4} />
      <div style={{ position: "absolute", left: 540 - 160, top: 560, scale: shield, opacity: Math.min(1, shield * 2) }}>
        <Icon path={mdiShieldCheck} size={320} color={A.gold} style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.5))" }} />
      </div>
      <Burst x={540} y={720} start={6} seed="trust" colors={[A.gold, "#FFE3A0", "white"]} count={34} />
      <div style={{ position: "absolute", top: 940, left: 0, right: 0 }}>
        <Words text="مكتب أبو شام" start={8} stagger={4} size={104} color="white" />
        <div style={{ position: "relative", overflow: "hidden" }}>
          <Words text={"*للثقة *عنوان"} start={16} stagger={5} size={150} color="white" accent={A.gold} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, transparent ${shine - 10}%, rgba(255,255,255,0.7) ${shine}%, transparent ${shine + 10}%)`, mixBlendMode: "overlay" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Contact: React.FC<{ icon: string; bg: string; number: string; at: number }> = ({ icon, bg, number, at }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 10], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, direction: "ltr", opacity: p, translate: `${(1 - p) * 60}px 0` }}>
      <div style={{ width: 84, height: 84, borderRadius: 42, background: bg, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Icon path={icon} size={52} color="white" />
      </div>
      <span style={{ fontFamily: TEXT, fontWeight: 700, fontSize: 64, color: A.navy, letterSpacing: 1 }}>{number}</span>
    </div>
  );
};

// The last card: the mark builds again with the name, both numbers and a WhatsApp button.
export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const button = spring({ frame: frame - beat(3), fps, config: { damping: 10, stiffness: 200 } });
  const pulse = frame < beat(3) ? 0 : (Math.sin((frame - beat(3)) / 5) + 1) / 2;
  const shine = interpolate(frame, [beat(5), beat(5) + 16], [-40, 140], CLAMP);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 800px 1000px at 540px 700px, white 0%, ${A.ice} 55%, #BFDCFA 100%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 240, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <LogoIcon size={400} start={2} />
      </div>
      <AbsoluteFill style={{ top: 600, height: 180, justifyContent: "center" }}>
        <Words text="مكتب أبو شام العقاري" start={10} stagger={4} size={86} color={A.navy} />
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 820, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <Contact icon={mdiPhone} bg={A.royal} number={PHONE_CALL} at={beat(1.5)} />
        <Contact icon={mdiWhatsapp} bg="#25D366" number={PHONE_WHATSAPP} at={beat(2.2)} />
      </div>
      <div style={{ position: "absolute", top: 1110, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            direction: "rtl",
            display: "flex",
            alignItems: "center",
            gap: 20,
            background: "#25D366",
            color: "white",
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontSize: 66,
            borderRadius: 100,
            padding: "22px 60px 32px",
            overflow: "hidden",
            boxShadow: `0 0 ${40 + pulse * 30}px rgba(37, 211, 102, ${0.35 + pulse * 0.3})`,
            opacity: frame < beat(3) ? 0 : Math.min(1, button * 2),
            scale: interpolate(button, [0, 1], [0.4, 1]),
          }}
        >
          <Icon path={mdiWhatsapp} size={76} color="white" />
          تواصل معنا الآن
          <AbsoluteFill style={{ background: `linear-gradient(110deg, transparent ${shine - 12}%, rgba(255,255,255,0.6) ${shine}%, transparent ${shine + 12}%)` }} />
        </div>
      </div>
      <div style={{ position: "absolute", top: 1290, left: 0, right: 0, textAlign: "center", direction: "rtl", fontFamily: TEXT, fontWeight: 600, fontSize: 44, color: A.deep, opacity: interpolate(frame, [beat(4), beat(4) + 10], [0, 1], CLAMP) }}>
        جرابلس • طريق المحطة
      </div>
      <Burst x={540} y={1180} start={beat(3)} seed="abusham-end" colors={[A.royal, A.sky, A.gold]} count={36} />
      <Solid width={1080} height={1920} effects={[lightLeak({ seed: 11, hueShift: 180, progress: interpolate(frame, [0, 36], [0, 1], CLAMP) })]} style={{ position: "absolute", mixBlendMode: "screen", opacity: 0.6 }} />
      <AbsoluteFill style={{ background: "white", opacity: interpolate(frame, [0, 6], [0.9, 0], CLAMP) }} />
    </AbsoluteFill>
  );
};
