import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Words } from "../components";
import { C, CLAMP, DISPLAY, TEXT } from "../theme";
import { Phone3D, RoleTag, Screen, slideProgress, Tap } from "./parts";
import { b, BUYER_START, FEATURES_START } from "./timing";

export const BUYER_DURATION = FEATURES_START - BUYER_START;

const at = (n: number) => b(n) - BUYER_START;

const PHONE_W = 380;
const PHONE_H = (PHONE_W * 1280) / 627;
const QUERY = "موتور";
const TYPE_AT = at(35);
const OPEN_AT = at(38);
const WHATSAPP_AT = at(41);
// The home screen's search bar and the ad's WhatsApp button, as fractions of the screen.
const SEARCH = { x: 0.045, y: 0.085, w: 0.91, h: 0.06 };
const WHATSAPP = { x: 0.74, y: 0.802 };

export const Buyer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const typed = Array.from(QUERY).slice(0, Math.max(0, Math.floor((frame - TYPE_AT) / 3) + 1)).join("");
  const open = slideProgress(frame, OPEN_AT);
  const bubble = spring({ frame: frame - (WHATSAPP_AT + 8), fps, config: { damping: 12, stiffness: 170 } });
  const pulse = frame < WHATSAPP_AT ? 0 : (frame - WHATSAPP_AT) % 18;

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.cream} 0%, #EEF6F1 100%)`, overflow: "hidden" }}>
      <RoleTag label="المشتري" at={1} bg={C.deep} color={C.cream} />
      <AbsoluteFill style={{ top: 320, height: 250, justifyContent: "center" }}>
        <Words text={"لقى اللي بدو ياه\n*وتواصل *مباشرة"} start={3} stagger={5} size={84} color={C.deep} accent={C.brand} lineHeight={1.35} />
      </AbsoluteFill>
      <Phone3D width={PHONE_W} top={620} tilt={-14}>
        {open < 1 && (
          <>
            <Screen src="screen-home.jpg" width={PHONE_W} x={open * 0.35} dim={open * 0.4} />
            {frame >= TYPE_AT && (
              <div
                style={{
                  position: "absolute",
                  direction: "rtl",
                  left: SEARCH.x * PHONE_W,
                  top: SEARCH.y * PHONE_H,
                  width: SEARCH.w * PHONE_W,
                  height: SEARCH.h * PHONE_H,
                  borderRadius: 14,
                  background: "white",
                  border: `2px solid ${C.brand}`,
                  display: "flex",
                  alignItems: "center",
                  paddingInline: 16,
                  fontFamily: TEXT,
                  fontWeight: 600,
                  fontSize: 22,
                  color: C.deep,
                  translate: `${open * 0.35 * PHONE_W}px 0`,
                }}
              >
                {typed}
                <span style={{ width: 2, height: 24, marginInline: 3, background: C.brand, opacity: Math.floor(frame / 6) % 2 }} />
              </div>
            )}
          </>
        )}
        {open > 0 && <Screen src="screen-ad-moto.jpg" width={PHONE_W} x={open - 1} />}
        <Tap at={OPEN_AT - 12} x={0.5 * PHONE_W} y={0.3 * PHONE_H} />
        <Tap at={WHATSAPP_AT} x={WHATSAPP.x * PHONE_W} y={WHATSAPP.y * PHONE_H} />
        {frame >= WHATSAPP_AT && (
          <div
            style={{
              position: "absolute",
              left: WHATSAPP.x * PHONE_W - 110,
              top: WHATSAPP.y * PHONE_H - 30,
              width: 220,
              height: 60,
              borderRadius: 18,
              border: `4px solid ${C.mint}`,
              scale: interpolate(pulse, [0, 18], [1, 1.35]),
              opacity: interpolate(pulse, [0, 18], [0.9, 0]),
            }}
          />
        )}
      </Phone3D>
      {/* The buyer's first message to the seller. */}
      <div
        style={{
          position: "absolute",
          top: 1170,
          left: 90,
          direction: "rtl",
          background: "#DCF8C6",
          borderRadius: "28px 28px 28px 6px",
          padding: "18px 28px 24px",
          boxShadow: "0 24px 50px rgba(2, 27, 23, 0.25)",
          fontFamily: TEXT,
          fontWeight: 600,
          fontSize: 38,
          color: "#1F2C28",
          opacity: frame < WHATSAPP_AT + 8 ? 0 : Math.min(1, bubble * 2),
          scale: interpolate(bubble, [0, 1], [0.4, 1]),
          transformOrigin: "0% 100%",
        }}
      >
        مرحبا، الموتور لسا موجود؟
        <div style={{ fontFamily: DISPLAY, fontSize: 22, color: "#5E7A70", textAlign: "left", marginTop: 4, opacity: interpolate(bubble, [0.6, 1], [0, 1], CLAMP) }}>✓✓</div>
      </div>
    </AbsoluteFill>
  );
};
