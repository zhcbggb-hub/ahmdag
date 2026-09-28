import { AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { Burst, Rings, Words } from "../components";
import { C, CLAMP, DISPLAY, TEXT } from "../theme";
import { MotoCard } from "./parts";
import { b, BUYER_START, MAP_DROP, MAP_START } from "./timing";

export const MAP_DURATION = BUYER_START - MAP_START;

const at = (n: number) => b(n) - MAP_START;
const DROP = MAP_DROP - MAP_START;

// A drawn, not surveyed, map: the Euphrates runs down the east side, Jarablus sits on its west bank
// in the north, al-Amarneh just south of it and al-Ghandoura further south-west.
const RIVER = "M 905 430 C 860 560, 900 650, 830 760 S 760 960, 815 1080 S 900 1260, 800 1400 S 700 1560, 760 1700";
const PLACES = [
  { name: "مدينة جرابلس", x: 690, y: 700, at: at(26), big: true },
  { name: "العمارنة", x: 610, y: 960, at: DROP, big: true },
  { name: "الغندورة", x: 330, y: 1210, at: DROP + 7, big: true },
];
// Smaller dots for the countryside around them.
const VILLAGES = new Array(12).fill(0).map((_, i) => ({
  x: 150 + random(`village-x-${i}`) * 600,
  y: 780 + random(`village-y-${i}`) * 680,
  at: DROP + 10 + i * 2,
}));

// The pin from the logo, used as a map marker.
const MapPin: React.FC<{ x: number; y: number; at: number; size: number }> = ({ x, y, at: start, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - start, fps, config: { damping: 9, stiffness: 220 } });
  const k = size / 220;
  if (frame < start) return null;
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size, width: size, height: size, overflow: "visible", scale: `${p} ${p}`, transformOrigin: "50% 100%", translate: `0 ${(1 - Math.min(1, p)) * -60}px` }}>
      <Img src={staticFile("logo-parts/pin.png")} style={{ position: "absolute", width: 1205 * k, height: 733 * k, maxWidth: "none", left: size / 2 - 880 * k, top: size - 516 * k }} />
    </div>
  );
};

export const MapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = interpolate(frame, [at(21), at(25)], [1, 0], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
  // The ad card flies from the centre into Jarablus, then melts into its pin.
  const fly = interpolate(frame, [at(24), at(26)], [0, 1], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
  const card = spring({ frame, fps, config: { damping: 14, stiffness: 150 } });
  // During the music's break the camera leans in; on the drop it pulls back to show everything.
  const lean = interpolate(frame, [at(27), DROP], [1, 1.12], CLAMP);
  const pull = spring({ frame: frame - DROP, fps, config: { damping: 16, stiffness: 90 } });
  const cam = frame < DROP ? lean : interpolate(pull, [0, 1], [1.12, 1]);
  const jarablus = PLACES[0];

  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 55% 55%, #0B5E52 0%, ${C.deep} 55%, ${C.ink} 100%)`, overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: cam, transformOrigin: `${jarablus.x}px ${jarablus.y}px` }}>
        {/* A faint grid of dots, like a map's paper. */}
        <AbsoluteFill style={{ backgroundImage: `radial-gradient(${C.mint}33 2px, transparent 2px)`, backgroundSize: "54px 54px", opacity: interpolate(frame, [0, 12], [0, 1], CLAMP) }} />
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          <path d={RIVER} fill="none" stroke="#3FA7C9" strokeWidth={34} strokeLinecap="round" opacity={0.85} pathLength={1} strokeDasharray={1} strokeDashoffset={draw} />
          <path d={RIVER} fill="none" stroke="#9BE3F5" strokeWidth={8} strokeLinecap="round" opacity={0.6} pathLength={1} strokeDasharray={1} strokeDashoffset={draw} />
        </svg>
        <div style={{ position: "absolute", left: 870, top: 1120, rotate: "78deg", fontFamily: TEXT, fontWeight: 600, fontSize: 34, color: "#9BE3F5", opacity: interpolate(frame, [at(24), at(25)], [0, 0.9], CLAMP) }}>نهر الفرات</div>
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 880,
            direction: "rtl",
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontSize: 96,
            color: C.paper,
            opacity: interpolate(frame, [DROP + 18, DROP + 30], [0, 0.12], CLAMP),
            rotate: "-8deg",
          }}
        >
          ريف جرابلس
        </div>
        {VILLAGES.map((v, i) => (
          <div key={i}>
            <Rings x={v.x} y={v.y} color={C.mint} start={v.at} every={10} count={3} total={1} maxRadius={120} strokeWidth={2} />
            <MapPin x={v.x} y={v.y} at={v.at} size={46} />
          </div>
        ))}
        {PLACES.map((p) => (
          <div key={p.name}>
            <Rings x={p.x} y={p.y - 30} color={C.mint} start={p.at} every={9} count={3} total={3} maxRadius={420} strokeWidth={3} />
            <MapPin x={p.x} y={p.y} at={p.at} size={96} />
            <div
              style={{
                position: "absolute",
                left: p.x - 250,
                width: 500,
                top: p.y + 8,
                textAlign: "center",
                direction: "rtl",
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: 44,
                color: C.paper,
                textShadow: "0 4px 18px rgba(2,27,23,0.8)",
                opacity: interpolate(frame, [p.at + 3, p.at + 10], [0, 1], CLAMP),
              }}
            >
              {p.name}
            </div>
          </div>
        ))}
        <Burst x={jarablus.x} y={jarablus.y - 40} start={DROP} seed="map-drop" colors={[C.mint, C.cream]} count={50} power={1.4} life={40} />
      </AbsoluteFill>
      {frame < at(26) + 4 && (
        <div
          style={{
            position: "absolute",
            left: interpolate(fly, [0, 1], [540 - 180, jarablus.x - 18]),
            top: interpolate(fly, [0, 1], [720, jarablus.y - 60]),
            width: 360,
            transformOrigin: "0 0",
            scale: interpolate(fly, [0, 1], [interpolate(card, [0, 1], [0.3, 1]), 0.1]),
            rotate: `${interpolate(fly, [0, 1], [-4, 20])}deg`,
            opacity: interpolate(frame, [at(26), at(26) + 4], [1, 0], CLAMP),
          }}
        >
          <MotoCard width={360} />
        </div>
      )}
      <div style={{ position: "absolute", top: 250, left: 0, right: 0 }}>
        <Words text="إعلانك بيوصل" start={at(27)} stagger={6} size={96} color={C.paper} />
        <Words text={"لكل أهل *جرابلس *وريفها"} start={DROP + 2} stagger={5} size={80} color={C.paper} accent={C.mint} />
      </div>
    </AbsoluteFill>
  );
};
