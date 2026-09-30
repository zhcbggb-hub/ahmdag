import { mdiMapMarker } from "@mdi/js";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Icon } from "../components";
import { C, DISPLAY } from "../theme";
import { Backdrop, glass, Phone, Shot } from "./parts";

// A still poster: the logo, what the app is for, the town and its villages around a pin, and the app's home screen.
const PIN = { x: 540, y: 930 };
const PLACES = [
  { name: "جرابلس", x: 290, y: 790 },
  { name: "العمارنة", x: 790, y: 790 },
  { name: "الغندورة", x: 290, y: 1080 },
  { name: "ريف جرابلس", x: 790, y: 1080 },
];
const LOGO_W = 560;

export const VillagesPoster: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    {/* A soft light behind the logo so its dark outline reads on the dark background. */}
    <div style={{ position: "absolute", left: 540 - 380, top: 30, width: 760, height: 440, borderRadius: 380, background: "rgba(246,247,242,0.16)", filter: "blur(80px)" }} />
    <Img src={staticFile("logo.png")} style={{ position: "absolute", left: 540 - LOGO_W / 2, top: 70, width: LOGO_W, maxWidth: "none", filter: "drop-shadow(0 0 30px rgba(18,201,178,0.35))" }} />
    <div style={{ position: "absolute", top: 440, left: 50, right: 50, direction: "rtl", textAlign: "center", fontFamily: DISPLAY, lineHeight: 1.35 }}>
      <div style={{ fontWeight: 900, fontSize: 76, color: C.paper }}>تطبيق سوق جرابلس</div>
      <div style={{ fontWeight: 800, fontSize: 52, color: C.mint, textShadow: "0 0 30px rgba(18,201,178,0.45)" }}>تلاقي عليه أي شي جديد أو مستعمل</div>
    </div>
    <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
      {[130, 300, 470].map((r) => (
        <circle key={r} cx={PIN.x} cy={PIN.y} r={r} fill="none" stroke={C.mint} strokeWidth={3} opacity={0.5 - r / 1400} />
      ))}
      {PLACES.map((p) => (
        <line key={p.name} x1={PIN.x} y1={PIN.y} x2={p.x} y2={p.y} stroke={C.mint} strokeWidth={3} strokeDasharray="10 10" opacity={0.6} />
      ))}
    </svg>
    <div style={{ position: "absolute", left: PIN.x - 70, top: PIN.y - 128, filter: "drop-shadow(0 0 30px rgba(18,201,178,0.6))" }}>
      <Icon path={mdiMapMarker} size={140} color={C.mint} />
    </div>
    {PLACES.map((p) => (
      <div key={p.name} style={{ position: "absolute", left: p.x - 170, width: 340, top: p.y - 50, display: "flex", justifyContent: "center" }}>
        <div style={{ ...glass(50), padding: "12px 34px 18px", whiteSpace: "nowrap", direction: "rtl", fontFamily: DISPLAY, fontWeight: 800, fontSize: 46, color: "white" }}>{p.name}</div>
      </div>
    ))}
    <Phone cx={540} top={1210} scale={0.56} turn={-4}>
      <Shot src="screen-home.jpg" />
    </Phone>
    <div style={{ position: "absolute", top: 1720, left: 50, right: 50, direction: "rtl", textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 38, color: C.cream, opacity: 0.9 }}>
      سوق جرابلس وريفها… كلّو بمكان واحد
    </div>
  </AbsoluteFill>
);
