import { mdiWhatsapp } from "@mdi/js";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Icon, Rings, Words } from "../jarablus/components";
import { CLAMP, DISPLAY } from "../jarablus/theme";
import { A, LISTING_START, OFFICE_START } from "./theme";

export const LISTING_DURATION = OFFICE_START - LISTING_START;

const CARD = { left: 310, top: 640, w: 460, h: 560 };
const SIGN_AT = 10;
const CONTACT_AT = 40;

// "Got a property to sell? Just get in touch": a "for sale" sign drops and swings on a building,
// then a WhatsApp button pops on the corner of the photo.
export const Listing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = spring({ frame: frame - SIGN_AT, fps, config: { damping: 12, stiffness: 240 } });
  const t = Math.max(0, frame - SIGN_AT - 6);
  const swing = frame < SIGN_AT ? 0 : 14 * Math.exp(-t / 16) * Math.sin(t / 3.2);
  const wa = spring({ frame: frame - (CONTACT_AT + 6), fps, config: { damping: 9, stiffness: 240 } });
  const k = CARD.h / 460; // the tall glass tower in the office's design: x 0-360, y 280-740
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${A.royal} 0%, ${A.navy} 60%, ${A.night} 100%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0 }}>
        <Words text="عندك عقار" start={2} stagger={4} size={96} color="white" />
        <Words text={"بدك *تعرضو *للبيع؟"} start={8} stagger={4} size={94} color="white" accent={A.sky} />
      </div>
      <div style={{ position: "absolute", left: CARD.left, top: CARD.top, width: CARD.w, height: CARD.h, borderRadius: 30, overflow: "hidden", border: "8px solid white", boxShadow: "0 40px 90px rgba(0,0,0,0.45)" }}>
        <Img src={staticFile("abusham/banner.jpg")} style={{ position: "absolute", width: 1280 * k, maxWidth: "none", left: -20 * k, top: -280 * k }} />
      </div>
      {/* The sign hangs from two chains at the top of the photo and swings to rest. */}
      <div
        style={{
          position: "absolute",
          left: CARD.left + CARD.w / 2 - 200,
          top: CARD.top + 60,
          width: 400,
          transformOrigin: "50% 0%",
          rotate: `${swing}deg`,
          translate: `0 ${(1 - drop) * -700}px`,
          opacity: frame < SIGN_AT ? 0 : 1,
        }}
      >
        <svg width={400} height={90} style={{ display: "block" }}>
          <path d="M 110 0 L 110 90 M 290 0 L 290 90" stroke="#D8DEE8" strokeWidth={6} strokeDasharray="12 6" />
        </svg>
        <div style={{ height: 150, borderRadius: 18, background: A.gold, border: `6px solid ${A.navy}`, display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 24px 50px rgba(0,0,0,0.45)", direction: "rtl", fontFamily: DISPLAY, fontWeight: 900, fontSize: 96, color: A.navy, paddingBottom: 14 }}>
          للبيع
        </div>
      </div>
      <Rings x={CARD.left + 40} y={CARD.top + CARD.h - 40} color="#25D366" start={CONTACT_AT + 6} every={10} count={3} total={3} maxRadius={260} strokeWidth={4} />
      <div
        style={{
          position: "absolute",
          left: CARD.left - 30,
          top: CARD.top + CARD.h - 110,
          width: 140,
          height: 140,
          borderRadius: 70,
          background: "#25D366",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 20px 44px rgba(0,0,0,0.4)",
          scale: wa,
          opacity: frame < CONTACT_AT + 6 ? 0 : 1,
        }}
      >
        <Icon path={mdiWhatsapp} size={90} color="white" />
      </div>
      <div style={{ position: "absolute", top: 1250, left: 0, right: 0, opacity: interpolate(frame, [CONTACT_AT - 2, CONTACT_AT], [0, 1], CLAMP) }}>
        <Words text="كل ما عليك" start={CONTACT_AT} stagger={4} size={84} color="white" />
        <Words text={"*تتواصل *معنا"} start={CONTACT_AT + 6} stagger={4} size={116} color="white" accent="#3FE07F" />
      </div>
    </AbsoluteFill>
  );
};
