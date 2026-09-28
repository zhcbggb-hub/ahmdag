import { mdiMagnify } from "@mdi/js";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { Icon, Words } from "../components";
import { PinIcon } from "../short/AppShowcase";
import { C, CLAMP, DISPLAY, TEXT } from "../theme";
import { Phone3D, Tap } from "./parts";
import { b, END_START, TUTORIAL_START } from "./timing";

export const TUTORIAL_DURATION = END_START - TUTORIAL_START;

const at = (n: number) => b(n) - TUTORIAL_START;

// How to get the app, one step every few beats, at a pace that can be followed.
const STEPS = [
  { at: at(54), text: "افتح متصفح *جوجل *كروم" },
  { at: at(59), text: "اكتب: *تطبيق *سوق *جرابلس" },
  { at: at(65), text: "اضغط على رابط *jarablus.store" },
  { at: at(70), text: "اضغط *«حمّل *التطبيق» وثبّته" },
];

const W = 470;
const H = (W * 1280) / 627;
const QUERY = "تطبيق سوق جرابلس";
const TYPE_START = at(60);
const SEARCH_TAP = at(63.5);
const RESULT_TAP = at(68.5);
const DOWNLOAD_TAP = at(71.5);
const INSTALL_TAP = at(74);

// Dock crop from a real home screen (545 x 142), with Chrome's icon at (65, 68).
const DOCK_K = (W * 0.94) / 545;
const CHROME = { x: W * 0.03 + 65 * DOCK_K, y: H - 170 + 68 * DOCK_K };
// Keyboard crop (644 x 437) with the ✓ key at (592, 384).
const KB_K = W / 644;
const KB_TOP = H - 437 * KB_K;

const HomeScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = (Math.sin(frame / 5) + 1) / 2;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(170deg, #5E8F3F 0%, #2F5B2A 55%, #16351A 100%)" }}>
      <div style={{ position: "absolute", top: 90, left: 0, right: 0, textAlign: "center", fontFamily: TEXT, fontWeight: 300, fontSize: 82, color: "white" }}>10:30</div>
      <Img src={staticFile("phone-dock.png")} style={{ position: "absolute", left: W * 0.03, top: H - 170, width: W * 0.94, maxWidth: "none" }} />
      <div
        style={{
          position: "absolute",
          left: CHROME.x - 44,
          top: CHROME.y - 44,
          width: 88,
          height: 88,
          borderRadius: 26,
          border: `4px solid ${C.mint}`,
          opacity: frame > at(55) ? 0.5 + glow * 0.5 : 0,
          scale: 1 + glow * 0.08,
        }}
      />
    </AbsoluteFill>
  );
};

const SearchBox: React.FC<{ text: string; caret: boolean; top: number }> = ({ text, caret, top }) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 22,
      right: 22,
      height: 64,
      borderRadius: 32,
      background: "#F1F3F4",
      border: "2px solid #DADCE0",
      display: "flex",
      alignItems: "center",
      direction: "rtl",
      gap: 10,
      paddingInline: 18,
      fontFamily: TEXT,
      fontSize: 26,
      color: "#202124",
    }}
  >
    <Icon path={mdiMagnify} size={30} color="#5F6368" />
    {text || <span style={{ color: "#80868B" }}>ابحث أو اكتب عنوان موقع</span>}
    {caret && <span style={{ width: 2, height: 30, background: "#1A73E8" }} />}
  </div>
);

const Browser: React.FC = () => {
  const frame = useCurrentFrame();
  const typed = Array.from(QUERY).slice(0, Math.max(0, Math.floor((frame - TYPE_START) / 3) + 1)).join("");
  return (
    <AbsoluteFill style={{ background: "white" }}>
      <SearchBox text={frame >= TYPE_START ? typed : ""} caret={Math.floor(frame / 8) % 2 === 0} top={H * 0.22} />
      <Img src={staticFile("phone-keyboard.jpg")} style={{ position: "absolute", left: 0, top: KB_TOP, width: W, maxWidth: "none" }} />
    </AbsoluteFill>
  );
};

const Result: React.FC<{ highlight: boolean }> = ({ highlight }) => (
  <div style={{ direction: "rtl", margin: "0 18px", padding: 18, borderRadius: 20, border: `3px solid ${highlight ? C.mint : "transparent"}`, background: highlight ? "#F2FBF9" : "white" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <PinIcon size={40} />
      <div>
        <div style={{ fontFamily: TEXT, fontSize: 20, color: "#202124" }}>سوق جرابلس</div>
        <div style={{ fontFamily: TEXT, fontSize: 17, color: "#4D5156", direction: "ltr", textAlign: "right" }}>https://jarablus.store</div>
      </div>
    </div>
    <div style={{ fontFamily: TEXT, fontWeight: 500, fontSize: 25, color: "#1A0DAB", marginTop: 8, lineHeight: 1.4 }}>تطبيق سوق جرابلس — أول تطبيق في جرابلس وريفها</div>
    <div style={{ fontFamily: TEXT, fontSize: 19, color: "#4D5156", marginTop: 4, lineHeight: 1.5 }}>بيع واشتري داخل مدينتك بلا وسيط وبلا عمولة.</div>
  </div>
);

const Results: React.FC = () => {
  const frame = useCurrentFrame();
  const bar = (w: string) => <div style={{ height: 16, width: w, borderRadius: 8, background: "#E8EAED", marginTop: 12 }} />;
  return (
    <AbsoluteFill style={{ background: "white" }}>
      <SearchBox text={QUERY} caret={false} top={40} />
      <div style={{ position: "absolute", top: 130, left: 0, right: 0 }}>
        <Result highlight={frame > at(66.5)} />
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ direction: "rtl", margin: "22px 36px 0", opacity: 0.8 }}>
            {bar("40%")}
            {bar("85%")}
            {bar("70%")}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Landing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sheet = spring({ frame: frame - (DOWNLOAD_TAP + 6), fps, config: { damping: 16, stiffness: 140 } });
  const progress = interpolate(frame, [DOWNLOAD_TAP + 12, INSTALL_TAP - 10], [0, 1], { ...CLAMP, easing: Easing.inOut(Easing.quad) });
  const installed = frame >= INSTALL_TAP + 6;
  return (
    <AbsoluteFill>
      <Img src={staticFile("screen-landing.jpg")} style={{ position: "absolute", width: W, height: H, maxWidth: "none" }} />
      {frame >= DOWNLOAD_TAP + 6 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 300,
            background: "white",
            borderRadius: "28px 28px 0 0",
            boxShadow: "0 -20px 40px rgba(0,0,0,0.25)",
            translate: `0 ${(1 - sheet) * 320}px`,
            direction: "rtl",
            padding: 26,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <PinIcon size={60} />
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 28, color: "#202124" }}>{installed ? "تم تثبيت التطبيق ✓" : progress < 1 ? "جاري التحميل…" : "سوق جرابلس.apk"}</div>
          </div>
          <div style={{ marginTop: 22, height: 12, borderRadius: 6, background: "#E8EAED", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress * 100}%`, background: C.brand, marginInlineStart: "auto" }} />
          </div>
          <div
            style={{
              marginTop: 26,
              height: 64,
              borderRadius: 32,
              background: installed ? C.mint : C.brand,
              color: installed ? C.deep : "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: 30,
              opacity: progress < 1 ? 0.4 : 1,
            }}
          >
            {installed ? "فتح" : "تثبيت"}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export const Tutorial: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const step = Math.max(0, STEPS.filter((s) => frame >= s.at).length - 1);
  const pop = spring({ frame: frame - STEPS[step].at, fps, config: { damping: 14, stiffness: 180 } });
  // Which screen the phone shows, with a quick zoom out of the tapped icon when the browser opens.
  const open = interpolate(frame, [at(58), at(59)], [0, 1], CLAMP);
  const screen = frame < at(59) ? "home" : frame < at(64.5) ? "browser" : frame < at(69.5) ? "results" : "landing";
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 60%, #0B5E52 0%, ${C.deep} 50%, ${C.ink} 100%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 240, left: 0, right: 0, textAlign: "center", direction: "rtl", fontFamily: DISPLAY, fontWeight: 900, fontSize: 66, color: C.cream, opacity: interpolate(frame, [0, 8], [0, 1], CLAMP) }}>
        كيف تحمّل التطبيق؟
      </div>
      <div style={{ position: "absolute", top: 350, left: 40, right: 40, display: "flex", direction: "rtl", alignItems: "center", justifyContent: "center", gap: 20, opacity: Math.min(1, pop * 2), translate: `0 ${(1 - pop) * 24}px` }}>
        <div style={{ flexShrink: 0, width: 76, height: 76, borderRadius: 38, background: C.mint, color: C.deep, display: "flex", justifyContent: "center", alignItems: "center", fontFamily: DISPLAY, fontWeight: 900, fontSize: 44, lineHeight: 1 }}>
          {"١٢٣٤"[step]}
        </div>
        <Words key={step} text={STEPS[step].text} start={STEPS[step].at} stagger={3} size={54} weight={800} color={C.paper} accent={C.mint} style={{ textAlign: "right" }} />
      </div>
      <Phone3D width={W} top={520} tilt={-5}>
        {screen === "home" && <HomeScreen />}
        {screen === "browser" && (
          <AbsoluteFill style={{ transformOrigin: `${CHROME.x}px ${CHROME.y}px`, scale: interpolate(open, [0, 1], [0.1, 1]), opacity: open }}>
            <Browser />
          </AbsoluteFill>
        )}
        {screen === "results" && <Results />}
        {screen === "landing" && <Landing />}
        <Tap at={at(57.5)} x={CHROME.x} y={CHROME.y} />
        <Tap at={SEARCH_TAP} x={592 * KB_K} y={KB_TOP + 384 * KB_K} />
        <Tap at={RESULT_TAP} x={W * 0.5} y={250} />
        <Tap at={DOWNLOAD_TAP} x={W * 0.5} y={(928 / 1280) * H} />
        <Tap at={INSTALL_TAP} x={W * 0.5} y={H - 70} />
      </Phone3D>
    </AbsoluteFill>
  );
};
