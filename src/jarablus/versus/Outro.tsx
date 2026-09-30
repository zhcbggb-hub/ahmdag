import { mdiArrowDownBold, mdiCommentProcessing, mdiDownload, mdiMagnify } from "@mdi/js";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Burst, Icon, Rings, Words } from "../components";
import { Tap } from "../story/parts";
import { C, CLAMP, DISPLAY, TEXT } from "../theme";
import { outline } from "./Split";
import { ASK_START, b, BRAND_START, CTA_START, VERSUS_DURATION } from "./timing";

export const BRAND_DURATION = CTA_START - BRAND_START;
export const CTA_DURATION = ASK_START - CTA_START;
export const ASK_DURATION = VERSUS_DURATION - ASK_START;

const LOGO_W = 900;
const LOGO_H = (LOGO_W * 733) / 1205;
const LOGO_TOP = 470;
const PIN_X = 540 - LOGO_W / 2 + 0.7303 * LOGO_W;
const PIN_Y = LOGO_TOP + 0.5075 * LOGO_H;

// On the drop: the logo slams in out of a white flash.
export const Brand: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = spring({ frame, fps, config: { damping: 11, stiffness: 260, mass: 0.8 } });
  const shake = frame < 12 ? 24 * (1 - frame / 12) : 0;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 700px 620px at 540px 760px, #FFFFFF 0%, ${C.paper} 45%, #CFE3DC 80%, ${C.brand} 130%)`, overflow: "hidden" }}>
      <AbsoluteFill style={{ translate: `${Math.sin(frame * 2.7) * shake}px ${Math.cos(frame * 3.3) * shake}px`, scale: 1 + frame * 0.0015 }}>
        <Rings x={PIN_X} y={PIN_Y} color={C.brand} start={0} every={6} count={4} total={4} maxRadius={1200} strokeWidth={6} />
        <Img
          src={staticFile("logo.png")}
          style={{
            position: "absolute",
            left: 540 - LOGO_W / 2,
            top: LOGO_TOP,
            width: LOGO_W,
            height: LOGO_H,
            maxWidth: "none",
            scale: interpolate(slam, [0, 1], [3, 1]),
            filter: `blur(${(1 - Math.min(1, slam)) * 20}px) drop-shadow(0 30px 40px rgba(2,27,23,0.25))`,
          }}
        />
        <Burst x={PIN_X} y={PIN_Y} start={1} seed="versus" colors={[C.mint, C.brand, C.cream]} count={60} power={1.6} />
        <AbsoluteFill style={{ top: 1080, height: 360, justifyContent: "center" }}>
          <Words text={"كل سوق جرابلس\n*بموبايلك"} start={b(1)} stagger={4} size={122} color={C.deep} accent={C.brand} lineHeight={1.25} />
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "white", opacity: interpolate(frame, [0, 8], [1, 0], CLAMP) }} />
    </AbsoluteFill>
  );
};

const QUERY = "تطبيق سوق جرابلس";

// Where to get it: search Google, open jarablus.store, tap download.
export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bar = spring({ frame: frame - 6, fps, config: { damping: 14 } });
  const typed = Math.round(interpolate(frame, [10, 30], [0, QUERY.length], CLAMP));
  const site = spring({ frame: frame - 32, fps, config: { damping: 12 } });
  const button = spring({ frame: frame - 42, fps, config: { damping: 10, stiffness: 190 } });
  const pulse = (Math.sin(frame / 4) + 1) / 2;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 60%, ${C.brand} 0%, ${C.deep} 55%, ${C.ink} 110%)`, overflow: "hidden" }}>
      <AbsoluteFill style={{ top: 280, height: 300, justifyContent: "center" }}>
        <Words text={"حمّل التطبيق\n*هلّق"} start={0} stagger={3} size={130} color="white" accent={C.mint} lineHeight={1.2} style={{ textShadow: outline(C.ink, 8) }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 660, left: 90, right: 90, height: 130, borderRadius: 65, background: "white", display: "flex", alignItems: "center", gap: 20, padding: "0 40px", direction: "rtl", boxShadow: "0 24px 50px rgba(0,0,0,0.35)", scale: bar, opacity: Math.min(1, bar * 2) }}>
        <Icon path={mdiMagnify} size={64} color="#5F6368" />
        <span style={{ fontFamily: TEXT, fontWeight: 700, fontSize: 54, color: "#202124" }}>
          {QUERY.slice(0, typed)}
          <span style={{ opacity: frame % 16 < 8 ? 1 : 0, color: C.brand }}>|</span>
        </span>
      </div>
      <div style={{ position: "absolute", top: 850, left: 0, right: 0, display: "flex", justifyContent: "center", scale: site, opacity: frame < 32 ? 0 : 1 }}>
        <div style={{ fontFamily: TEXT, fontWeight: 700, fontSize: 60, color: C.cream, direction: "ltr", borderBottom: `5px solid ${C.cream}`, paddingBottom: 6 }}>jarablus.store</div>
      </div>
      <div style={{ position: "absolute", top: 1030, left: 0, right: 0, display: "flex", justifyContent: "center", scale: interpolate(button, [0, 1], [0.3, 1]) * (1 + pulse * 0.04), opacity: frame < 42 ? 0 : 1 }}>
        <div style={{ position: "relative", direction: "rtl", display: "flex", alignItems: "center", gap: 20, background: C.mint, color: C.ink, borderRadius: 80, padding: "22px 64px 34px", fontFamily: DISPLAY, fontWeight: 900, fontSize: 80, boxShadow: `0 0 ${30 + pulse * 40}px rgba(18,201,178,${0.4 + pulse * 0.3})` }}>
          <Icon path={mdiDownload} size={84} color={C.ink} />
          حمّل التطبيق
          <Tap at={60} x={330} y={80} />
        </div>
      </div>
      <Burst x={540} y={1110} start={61} seed="cta" colors={[C.mint, C.cream, "white"]} count={40} />
      <AbsoluteFill style={{ background: "white", opacity: interpolate(frame, [0, 5], [0.6, 0], CLAMP) }} />
    </AbsoluteFill>
  );
};

// Ends on a question that invites comments.
export const Ask: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame, fps, config: { damping: 16 } });
  const bounce = Math.abs(Math.sin(frame / 4)) * 22;
  const icon = spring({ frame: frame - 20, fps, config: { damping: 10 } });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, white 0%, ${C.paper} 50%, #DDEBE5 100%)`, overflow: "hidden" }}>
      <Img src={staticFile("logo.png")} style={{ position: "absolute", left: 540 - 240, top: 220, width: 480, maxWidth: "none", opacity: logo, translate: `0 ${(1 - logo) * -40}px` }} />
      <AbsoluteFill style={{ top: 620, height: 340, justifyContent: "center" }}>
        <Words text={"وإنت شو بدّك\n*تبيع؟"} start={2} stagger={3} size={128} color={C.deep} accent={C.brand} lineHeight={1.2} />
      </AbsoluteFill>
      <AbsoluteFill style={{ top: 990, height: 130, justifyContent: "center" }}>
        <Words text="اكتبلنا *بالتعليقات" start={12} stagger={4} size={76} color={C.deep} accent={C.brand} />
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 1150 + bounce, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 20, opacity: frame < 20 ? 0 : 1, scale: icon }}>
        <Icon path={mdiCommentProcessing} size={120} color={C.brand} />
        <Icon path={mdiArrowDownBold} size={120} color={C.brand} />
      </div>
      <AbsoluteFill style={{ background: "white", opacity: interpolate(frame, [0, 5], [0.7, 0], CLAMP) }} />
    </AbsoluteFill>
  );
};
