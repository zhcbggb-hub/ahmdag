import { mdiMapMarker, mdiPhone, mdiWhatsapp } from "@mdi/js";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Icon, Words } from "../jarablus/components";
import { CLAMP, DISPLAY, TEXT } from "../jarablus/theme";
import { LogoIcon } from "./LogoIcon";
import { A, PHONE_CALL, PHONE_WHATSAPP } from "./theme";

// Short clips for the office to drop into its own edits. Everything sits on a white card so it reads over any
// footage. `bg` picks the background: the office's colours, a green screen for chroma keying, or none
// (rendered with transparency).
export type StingBackground = "brand" | "green" | "none";
export type StingProps = { bg: StingBackground };

export const LOGO_STING_DURATION = 120;
export const CONTACT_STING_DURATION = 150;

const MIX = 0.708;

const Background: React.FC<{ bg: StingBackground }> = ({ bg }) =>
  bg === "none" ? null : (
    <AbsoluteFill style={{ background: bg === "green" ? "#00FF00" : `radial-gradient(circle at 50% 45%, ${A.royal} 0%, ${A.navy} 55%, ${A.night} 100%)` }} />
  );

// The card pops in, holds, and shrinks away at the end so the clip starts and ends clean.
const useCard = (duration: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 13, stiffness: 180 } });
  const exit = interpolate(frame, [duration - 14, duration - 1], [0, 1], { ...CLAMP, easing: (t) => t * t });
  return { scale: interpolate(enter, [0, 1], [0.6, 1]) * (1 - exit * 0.35), opacity: Math.min(1, enter * 2) * (1 - exit) };
};

const cardStyle = (bg: StingBackground): React.CSSProperties => ({
  position: "absolute",
  left: 90,
  right: 90,
  borderRadius: 48,
  background: `linear-gradient(180deg, #FFFFFF 0%, ${A.ice} 100%)`,
  // A green screen keys best without soft shadows around the card.
  boxShadow: bg === "green" ? "none" : "0 40px 90px rgba(0, 17, 47, 0.45)",
  border: `6px solid ${A.royal}`,
  overflow: "hidden",
});

const Sfx: React.FC<{ list: { name: string; at: number; volume: number }[] }> = ({ list }) => (
  <>
    {list.map((s, i) => (
      <Sequence key={i} from={Math.max(0, s.at)} layout="none">
        <Audio src={staticFile(`sfx/${s.name}.mp3`)} trimBefore={Math.max(0, -s.at)} volume={() => MIX * s.volume} />
      </Sequence>
    ))}
  </>
);

export const LogoSting: React.FC<StingProps> = ({ bg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = useCard(LOGO_STING_DURATION);
  const ribbon = spring({ frame: frame - 44, fps, config: { damping: 14, stiffness: 180 } });
  const shine = interpolate(frame, [62, 84], [-30, 130], CLAMP);
  return (
    <AbsoluteFill>
      <Background bg={bg} />
      <div style={{ ...cardStyle(bg), top: 560, height: 800, scale: card.scale, opacity: card.opacity }}>
        <div style={{ position: "absolute", top: 50, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <LogoIcon size={480} start={6} />
        </div>
        <div style={{ position: "absolute", top: 480, left: 0, right: 0 }}>
          <Words text="مكتب أبو شام" start={32} stagger={4} size={112} color={A.navy} />
        </div>
        <div style={{ position: "absolute", top: 650, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              direction: "rtl",
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: 54,
              color: "white",
              background: A.navy,
              borderRadius: 16,
              padding: "4px 56px 12px",
              letterSpacing: 4,
              clipPath: `inset(0 ${50 * (1 - Math.min(1, ribbon))}% 0 ${50 * (1 - Math.min(1, ribbon))}%)`,
            }}
          >
            العقاري
          </div>
        </div>
        {/* A band of light crossing the card once the logo is complete. */}
        <AbsoluteFill style={{ background: `linear-gradient(110deg, transparent ${shine - 10}%, rgba(255,255,255,0.75) ${shine}%, transparent ${shine + 10}%)` }} />
      </div>
      <Sfx
        list={[
          { name: "whoosh-fast", at: -26, volume: 0.4 },
          { name: "pop", at: 10, volume: 0.35 },
          { name: "pop", at: 14, volume: 0.35 },
          { name: "pop", at: 18, volume: 0.35 },
          { name: "stamp", at: 22, volume: 0.55 },
          { name: "sparkle", at: 62 - 16, volume: 0.45 },
          { name: "whoosh-fast", at: LOGO_STING_DURATION - 14 - 32, volume: 0.3 },
        ]}
      />
    </AbsoluteFill>
  );
};

const Row: React.FC<{ icon: string; color: string; number: string; at: number }> = ({ icon, color, number, at }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 10], [0, 1], { ...CLAMP, easing: (t) => 1 - Math.pow(1 - t, 3) });
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22, direction: "ltr", opacity: p, translate: `${(1 - p) * 60}px 0` }}>
      <div style={{ width: 92, height: 92, borderRadius: 46, background: color, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Icon path={icon} size={56} color="white" />
      </div>
      <span style={{ fontFamily: TEXT, fontWeight: 700, fontSize: 68, color: A.navy, letterSpacing: 1 }}>{number}</span>
    </div>
  );
};

export const ContactSting: React.FC<StingProps> = ({ bg }) => {
  const frame = useCurrentFrame();
  const card = useCard(CONTACT_STING_DURATION);
  const pulse = (Math.sin(frame / 5) + 1) / 2;
  return (
    <AbsoluteFill>
      <Background bg={bg} />
      <div style={{ ...cardStyle(bg), top: 470, height: 980, scale: card.scale, opacity: card.opacity }}>
        <div style={{ position: "absolute", top: 40, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <LogoIcon size={240} start={4} />
        </div>
        <div style={{ position: "absolute", top: 260, left: 0, right: 0 }}>
          <Words text="مكتب أبو شام العقاري" start={10} stagger={3} size={62} color={A.royal} weight={800} />
        </div>
        <div style={{ position: "absolute", top: 360, left: 40, right: 40, display: "flex", justifyContent: "center" }}>
          <div style={{ direction: "rtl", display: "flex", alignItems: "center", gap: 18, background: "#25D366", borderRadius: 90, padding: "16px 50px 26px", boxShadow: `0 0 ${24 + pulse * 26}px rgba(37, 211, 102, ${0.3 + pulse * 0.3})`, opacity: interpolate(frame, [18, 26], [0, 1], CLAMP), scale: interpolate(frame, [18, 26], [0.7, 1], CLAMP) }}>
            <Icon path={mdiWhatsapp} size={70} color="white" />
            <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 72, color: "white" }}>تواصل معنا الآن</span>
          </div>
        </div>
        <div style={{ position: "absolute", top: 560, left: 0, right: 0, display: "flex", flexDirection: "column", gap: 30 }}>
          <Row icon={mdiPhone} color={A.royal} number={PHONE_CALL} at={34} />
          <Row icon={mdiWhatsapp} color="#25D366" number={PHONE_WHATSAPP} at={44} />
        </div>
        <div style={{ position: "absolute", top: 830, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 10, direction: "rtl", opacity: interpolate(frame, [56, 66], [0, 1], CLAMP) }}>
          <Icon path={mdiMapMarker} size={50} color={A.royal} />
          <span style={{ fontFamily: TEXT, fontWeight: 600, fontSize: 46, color: A.deep }}>جرابلس • طريق المحطة</span>
        </div>
      </div>
      <Sfx
        list={[
          { name: "whoosh-fast", at: -26, volume: 0.4 },
          { name: "pop", at: 18, volume: 0.5 },
          { name: "tap", at: 34, volume: 0.45 },
          { name: "tap", at: 44, volume: 0.45 },
          { name: "notify", at: 56, volume: 0.45 },
          { name: "whoosh-fast", at: CONTACT_STING_DURATION - 14 - 32, volume: 0.3 },
        ]}
      />
    </AbsoluteFill>
  );
};
