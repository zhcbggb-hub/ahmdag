import { mdiDownload } from "@mdi/js";
import QRCode from "qrcode";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Icon, Rings } from "../components";
import { C, CLAMP, DISPLAY, TEXT } from "../theme";

export const OUTRO_DURATION = 165;

const APP_URL = "https://jarablus.store/app";
const LOGO_W = 780;
const LOGO_H = (LOGO_W * 733) / 1205;
const LOGO_TOP = 300;
// Where the location pin sits inside the cropped logo image.
const PIN_X = (1080 - LOGO_W) / 2 + 0.703 * LOGO_W;
const PIN_Y = LOGO_TOP + 0.503 * LOGO_H;

const QrCode: React.FC<{ size: number; color: string }> = ({ size, color }) => {
  const qr = QRCode.create(APP_URL, { errorCorrectionLevel: "M" });
  const n = qr.modules.size;
  let d = "";
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (qr.modules.get(y, x)) d += `M${x} ${y}h1v1h-1z`;
    }
  }
  return (
    <svg viewBox={`0 0 ${n} ${n}`} width={size} height={size} shapeRendering="crispEdges">
      <path d={d} fill={color} />
    </svg>
  );
};

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame, fps, config: { damping: 13, stiffness: 120 } });
  const cta = spring({ frame: frame - 34, fps, config: { damping: 14, stiffness: 170 } });
  const url = spring({ frame: frame - 44, fps, config: { damping: 18 } });
  const qr = spring({ frame: frame - 54, fps, config: { damping: 15, stiffness: 150 } });

  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 30%, white 0%, ${C.paper} 55%, #EDE9DC 100%)` }}>
      <Rings x={PIN_X} y={PIN_Y} color={C.brand} start={10} every={16} maxRadius={800} strokeWidth={3} />
      <AbsoluteFill style={{ scale: interpolate(frame, [0, OUTRO_DURATION], [1, 1.04], CLAMP) }}>
        <Img
          src={staticFile("logo.png")}
          style={{
            position: "absolute",
            top: LOGO_TOP,
            left: (1080 - LOGO_W) / 2,
            width: LOGO_W,
            height: LOGO_H,
            scale: interpolate(logo, [0, 1], [0.5, 1]),
            opacity: interpolate(logo, [0, 0.3], [0, 1], CLAMP),
            filter: `blur(${interpolate(logo, [0, 0.7], [20, 0], CLAMP)}px)`,
          }}
        />
        <div style={{ position: "absolute", top: 860, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              direction: "rtl",
              display: "flex",
              alignItems: "center",
              gap: 24,
              background: C.brand,
              color: C.paper,
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: 60,
              borderRadius: 90,
              padding: "30px 64px 38px",
              boxShadow: "0 30px 70px rgba(0, 125, 107, 0.35)",
              scale: interpolate(cta, [0, 1], [0.6, 1]),
              opacity: interpolate(cta, [0, 0.3], [0, 1], CLAMP),
            }}
          >
            <Icon path={mdiDownload} size={70} color={C.paper} />
            حمّل التطبيق لأندرويد
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: 1060,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: TEXT,
            fontWeight: 600,
            fontSize: 58,
            letterSpacing: 1,
            color: C.deep,
            opacity: url,
            translate: `0 ${interpolate(url, [0, 1], [30, 0])}px`,
          }}
        >
          jarablus.store/app
        </div>
        <div
          style={{
            position: "absolute",
            top: 1170,
            left: 540 - 150,
            width: 300,
            height: 300,
            padding: 22,
            borderRadius: 36,
            background: "white",
            boxShadow: "0 20px 60px rgba(5, 68, 59, 0.18)",
            scale: qr,
            rotate: `${interpolate(qr, [0, 1], [-20, 0])}deg`,
          }}
        >
          <QrCode size={256} color={C.deep} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
