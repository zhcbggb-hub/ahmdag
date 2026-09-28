import { mdiDownload } from "@mdi/js";
import { lightLeak } from "@remotion/effects/light-leak";
import { AbsoluteFill, Img, interpolate, Solid, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Burst, Icon, Rings, Words } from "../components";
import { C, CLAMP, DISPLAY, TEXT } from "../theme";
import { beat, FINALE_START, SHORT_DURATION } from "./timing";

export const FINALE_DURATION = SHORT_DURATION - FINALE_START;

// Beat n of the music, counted from the start of this scene.
const at = (n: number) => beat(n) - FINALE_START;

const WORD_GAP = 7;
const CTA_AT = at(24);
const LOGO_AT = at(28);
const CTA_Y = 1150;
const LOGO_W = 440;
const LOGO_H = (LOGO_W * 733) / 1205;
const LOGO_TOP = 255;

// A band of light crossing the download button.
const ButtonShine: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [start, start + 16], [-40, 140], CLAMP);
  return <AbsoluteFill style={{ background: `linear-gradient(110deg, transparent ${x - 12}%, rgba(255,255,255,0.75) ${x}%, transparent ${x + 12}%)` }} />;
};

export const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // The phrase starts moving up a little before the button pops, so they never overlap.
  const rise = spring({ frame: frame - (CTA_AT - 8), fps, config: { damping: 16, stiffness: 120 } });
  const cta = spring({ frame: frame - CTA_AT, fps, config: { damping: 10, stiffness: 200 } });
  const url = spring({ frame: frame - (CTA_AT + 14), fps, config: { damping: 18 } });
  const logo = spring({ frame: frame - LOGO_AT, fps, config: { damping: 11, stiffness: 170 } });
  const pulse = frame < CTA_AT ? 0 : (Math.sin((frame - CTA_AT) / 5) + 1) / 2;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, #0B5E52 0%, ${C.deep} 45%, ${C.ink} 100%)`, overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: interpolate(frame, [0, FINALE_DURATION], [1.04, 1], CLAMP) }}>
        {/* Soft glow that makes room for the logo at the top. */}
        <div
          style={{
            position: "absolute",
            left: 540 - 420,
            top: LOGO_TOP + LOGO_H / 2 - 240,
            width: 840,
            height: 480,
            background: "radial-gradient(ellipse at center, rgba(248,245,216,0.95) 0%, rgba(248,245,216,0.75) 38%, rgba(248,245,216,0) 70%)",
            opacity: frame < LOGO_AT ? 0 : Math.min(1, logo),
          }}
        />
        <Img
          src={staticFile("logo.png")}
          style={{
            position: "absolute",
            left: 540 - LOGO_W / 2,
            top: LOGO_TOP,
            width: LOGO_W,
            height: LOGO_H,
            opacity: frame < LOGO_AT ? 0 : Math.min(1, logo * 2),
            scale: interpolate(logo, [0, 1], [0.6, 1]),
            translate: `0 ${(1 - logo) * -80}px`,
          }}
        />
        {/* The phrase: first centred, then it moves up to make room for the button. */}
        <AbsoluteFill style={{ translate: `0 ${interpolate(rise, [0, 1], [150, 0])}px` }}>
          <Rings x={540} y={790} color={C.mint} start={3 * WORD_GAP + 3} every={12} count={4} total={6} maxRadius={700} strokeWidth={3} />
          <div style={{ position: "absolute", top: 560, left: 0, right: 0 }}>
            <Words text="خلّي كل أهل" start={3} stagger={WORD_GAP} size={104} color={C.paper} lineHeight={1.35} />
            <Words text="*جرابلس *وريفها" start={3 + 3 * WORD_GAP} stagger={WORD_GAP} size={118} color={C.paper} accent={C.mint} lineHeight={1.35} />
            <Words text="يشوفوا إعلانك" start={3 + 5 * WORD_GAP} stagger={WORD_GAP} size={104} color={C.paper} lineHeight={1.35} />
          </div>
        </AbsoluteFill>
        <div style={{ position: "absolute", top: CTA_Y - 80, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              position: "relative",
              direction: "rtl",
              display: "flex",
              alignItems: "center",
              gap: 22,
              background: C.mint,
              color: C.deep,
              fontFamily: DISPLAY,
              fontWeight: 900,
              fontSize: 76,
              borderRadius: 100,
              padding: "26px 64px 36px",
              overflow: "hidden",
              boxShadow: `0 0 ${50 + pulse * 40}px rgba(18, 201, 178, ${0.45 + pulse * 0.3})`,
              opacity: frame < CTA_AT ? 0 : Math.min(1, cta * 2),
              scale: interpolate(cta, [0, 1], [0.4, 1]),
            }}
          >
            <Icon path={mdiDownload} size={84} color={C.deep} style={{ translate: `0 ${Math.abs(Math.sin((frame - CTA_AT) / 6)) * -8}px` }} />
            حمّل التطبيق
            <ButtonShine start={CTA_AT + 28} />
            <ButtonShine start={CTA_AT + 70} />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: CTA_Y + 110,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: TEXT,
            fontWeight: 600,
            fontSize: 54,
            letterSpacing: 1,
            color: C.cream,
            opacity: frame < CTA_AT + 14 ? 0 : url,
            translate: `0 ${(1 - url) * 30}px`,
          }}
        >
          jarablus.store/app
        </div>
        <Burst x={540} y={CTA_Y} start={CTA_AT} seed="cta" colors={[C.mint, C.cream, C.paper]} count={44} power={1.2} />
        <Rings x={540 - LOGO_W / 2 + 0.7295 * LOGO_W} y={LOGO_TOP + 0.506 * LOGO_H} color={C.brand} start={LOGO_AT} every={7} count={3} total={2} maxRadius={420} strokeWidth={3} />
      </AbsoluteFill>
      {/* Opening flash and a light leak washing over the cut. */}
      <Solid
        width={1080}
        height={1920}
        effects={[lightLeak({ seed: 4, hueShift: 0, progress: interpolate(frame, [0, 44], [0, 1], CLAMP) })]}
        style={{ position: "absolute", mixBlendMode: "screen", opacity: 0.85 }}
      />
      <AbsoluteFill style={{ background: "white", opacity: interpolate(frame, [0, 7], [0.95, 0], CLAMP) }} />
    </AbsoluteFill>
  );
};
