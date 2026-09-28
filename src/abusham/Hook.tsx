import { mdiMapMarker } from "@mdi/js";
import { useLayoutEffect, useRef, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Easing, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Icon, Rings } from "../jarablus/components";
import { CLAMP, DISPLAY, TEXT } from "../jarablus/theme";
import { A, LOGO_START } from "./theme";

export const HOOK_DURATION = LOGO_START;

// Jarablus, where the camera ends up.
const LAT = (36.82 * Math.PI) / 180;
const LON = (38.01 * Math.PI) / 180;

// The globe is drawn at half resolution and scaled up; it is always moving, so this is not visible.
const GW = 540;
const GH = 960;

// NASA Blue Marble (public domain), read once per render tab.
let texture: Promise<ImageData> | null = null;
const loadTexture = () => {
  texture ??= new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      resolve(ctx.getImageData(0, 0, img.width, img.height));
    };
    img.onerror = reject;
    img.src = staticFile("abusham/earth.jpg");
  });
  return texture;
};

// Orthographic projection of the texture: each screen pixel is traced back to a latitude and longitude.
const drawGlobe = (ctx: CanvasRenderingContext2D, tex: ImageData, R: number, lat0: number, lon0: number) => {
  const img = ctx.createImageData(GW, GH);
  const d = img.data;
  const td = tex.data;
  const tw = tex.width;
  const th = tex.height;
  const s = Math.sin(lat0);
  const c = Math.cos(lat0);
  for (let py = 0; py < GH; py++) {
    const y = (GH / 2 - py) / R;
    for (let px = 0; px < GW; px++) {
      const x = (px - GW / 2) / R;
      const r2 = x * x + y * y;
      if (r2 > 1) continue;
      const z = Math.sqrt(1 - r2);
      const lat = Math.asin(y * c + z * s);
      const lon = lon0 + Math.atan2(x, z * c - y * s);
      let u = (lon / Math.PI + 1) / 2;
      u -= Math.floor(u);
      const ti = (Math.min(th - 1, Math.floor((0.5 - lat / Math.PI) * th)) * tw + Math.floor(u * tw)) * 4;
      const shade = 0.3 + 0.7 * z;
      const i = (py * GW + px) * 4;
      d[i] = td[ti] * shade;
      d[i + 1] = td[ti + 1] * shade;
      d[i + 2] = Math.min(255, td[ti + 2] * shade + (1 - z) * 60);
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
};

const Globe: React.FC<{ R: number; lat: number; lon: number }> = ({ R, lat, lon }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [tex, setTex] = useState<ImageData | null>(null);
  const [handle] = useState(() => delayRender("Loading the Earth texture"));
  useLayoutEffect(() => {
    loadTexture().then((t) => {
      setTex(t);
      continueRender(handle);
    });
  }, [handle]);
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (ctx && tex) drawGlobe(ctx, tex, R, lat, lon);
  }, [tex, R, lat, lon]);
  return <canvas ref={ref} width={GW} height={GH} style={{ position: "absolute", width: 1080, height: 1920 }} />;
};

// A drawn night view of the town from above: the Euphrates to the east, glowing main roads and streets
// lit by warm lights. It is stylised, not surveyed. Units are kilometres around the town centre.
const RIVER = "M 3.2 -40 C 2.6 -24, 3.6 -14, 2.2 -8 S 1.2 -3, 1.6 0 S 2.6 4, 2.0 8 S 0.8 16, 1.8 24 S 3.0 34, 1.2 42";
const MAIN_ROADS = [
  "M -0.2 -7 C -0.1 -3, -0.3 -1, -0.1 0 S 0 3, -0.3 7",
  "M -9 0.4 C -5 0.3, -2 0.2, 0 0.2 S 1.2 0.1, 1.6 0.2",
  "M 0 0.2 C -2 1.8, -5 4, -10 8",
  "M 0.1 -0.6 C 0.4 -3, 0.9 -6, 1.5 -9",
];
const inTown = (x: number, y: number) => ((x + 0.25) / 1.6) ** 2 + (y / 1.75) ** 2 < 1 && x < 1.3;
// Neighbourhoods laid out at different angles, so the streets do not form one grid.
const DISTRICTS = [
  { x: -0.7, y: -0.7, a: 0.08 },
  { x: 0.55, y: 0.1, a: -0.22 },
  { x: -0.9, y: 0.9, a: 0.38 },
  { x: 0.3, y: 1.1, a: 0.15 },
];
const STREETS: string[] = [];
const LIGHTS: { x: number; y: number; r: number; c: string; o: number }[] = [];
{
  const step = 0.12;
  const colors = ["#FFC46B", "#FFD99A", "#FF9F43", "#FFF1D6"];
  for (let gx = -2.1; gx <= 1.5; gx += step) {
    for (let gy = -2.0; gy <= 2.0; gy += step) {
      const key = `${gx.toFixed(2)},${gy.toFixed(2)}`;
      const x = gx + (random(`jx-${key}`) - 0.5) * 0.05;
      const y = gy + (random(`jy-${key}`) - 0.5) * 0.05;
      if (!inTown(x, y)) continue;
      const d = DISTRICTS.reduce((best, cur) => (Math.hypot(cur.x - x, cur.y - y) < Math.hypot(best.x - x, best.y - y) ? cur : best));
      const r = random(`st-${key}`);
      const len = step * (0.8 + random(`len-${key}`) * 0.5);
      const [c, s] = [Math.cos(d.a), Math.sin(d.a)];
      if (r > 0.2) STREETS.push(`M ${x} ${y} L ${x + c * len} ${y + s * len}`);
      if (r < 0.8) STREETS.push(`M ${x} ${y} L ${x - s * len} ${y + c * len}`);
      for (let k = 0; k < 3; k++) {
        const t = random(`lt-${key}-${k}`);
        const along = random(`la-${key}-${k}`) > 0.5;
        LIGHTS.push({
          x: x + (along ? c * t * len : -s * t * len) + (random(`lx-${key}-${k}`) - 0.5) * 0.02,
          y: y + (along ? s * t * len : c * t * len) + (random(`ly-${key}-${k}`) - 0.5) * 0.02,
          r: 0.004 + random(`lr-${key}-${k}`) * 0.009,
          c: colors[Math.floor(random(`lc-${key}-${k}`) * colors.length)],
          o: 0.45 + random(`lo-${key}-${k}`) * 0.55,
        });
      }
    }
  }
}

const TownMap: React.FC<{ scale: number }> = ({ scale }) => {
  // Road widths are in screen pixels so they stay crisp at every zoom.
  const px = (w: number) => ({ vectorEffect: "non-scaling-stroke" as const, strokeWidth: w });
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <radialGradient id="town-glow">
          <stop offset="0%" stopColor="#FF9F43" stopOpacity={0.35} />
          <stop offset="60%" stopColor="#FF9F43" stopOpacity={0.08} />
          <stop offset="100%" stopColor="#FF9F43" stopOpacity={0} />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width={1080} height={1920} fill="#040B1C" />
      <g transform={`translate(540 960) scale(${scale})`}>
        <ellipse cx={-0.25} cy={0} rx={2.6} ry={2.8} fill="url(#town-glow)" />
        <path d={RIVER} stroke="#0B3A6E" fill="none" strokeLinecap="round" strokeWidth={0.34} />
        <path d={RIVER} stroke="#1D6FB8" fill="none" strokeLinecap="round" strokeWidth={0.22} opacity={0.8} />
        <g stroke="#FFB54D" fill="none" opacity={0.28}>
          {STREETS.map((d, i) => (
            <path key={i} d={d} {...px(Math.max(0.6, Math.min(3, scale / 140)))} />
          ))}
        </g>
        <g filter="url(#glow)">
          {LIGHTS.map((l, i) => (
            <circle key={i} cx={l.x} cy={l.y} r={l.r} fill={l.c} opacity={l.o} />
          ))}
        </g>
        <g filter="url(#glow)">
          {MAIN_ROADS.map((d) => (
            <path key={d} d={d} stroke="#FFC46B" fill="none" strokeLinecap="round" {...px(Math.min(8, 2 + scale / 70))} />
          ))}
        </g>
      </g>
    </svg>
  );
};

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // The globe turns to face Jarablus, then the camera dives.
  const turn = interpolate(frame, [0, 40], [0, 1], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
  const dive = interpolate(frame, [38, 66], [0, 1], { ...CLAMP, easing: Easing.in(Easing.cubic) });
  const R = interpolate(turn, [0, 1], [150, 185]) * Math.pow(32, dive);
  const lat = interpolate(turn, [0, 1], [0.25, LAT]);
  const lon = interpolate(turn, [0, 1], [-0.35, LON]);
  // Clouds rush past and hide the switch from the photo of the Earth to the town map.
  const clouds = interpolate(frame, [54, 64, 74], [0, 1, 0], CLAMP);
  const mapIn = interpolate(frame, [62, 70], [0, 1], CLAMP);
  const zoom = interpolate(frame, [62, 84], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const push = interpolate(frame, [88, HOOK_DURATION], [0, 1], { ...CLAMP, easing: Easing.in(Easing.cubic) });
  const scale = 18 * Math.pow(26, zoom) * Math.pow(4, push);
  const pin = spring({ frame: frame - 76, fps, config: { damping: 9, stiffness: 240 } });
  const card = spring({ frame: frame - 86, fps, config: { damping: 13, stiffness: 200 } });
  const halo = Math.max(0, 1 - dive * 1.5);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, #0A1A40 0%, ${A.night} 55%, #000814 100%)`, overflow: "hidden" }}>
      {/* Stars. */}
      <svg width={1080} height={1920} style={{ position: "absolute", opacity: 1 - dive }}>
        {new Array(160).fill(0).map((_, i) => (
          <circle key={i} cx={random(`sx-${i}`) * 1080} cy={random(`sy-${i}`) * 1920} r={0.8 + random(`sr-${i}`) * 2.2} fill="white" opacity={0.3 + 0.6 * Math.abs(Math.sin(frame / 9 + i))} />
        ))}
      </svg>
      {/* Atmosphere around the globe. */}
      <div style={{ position: "absolute", left: 540 - R * 2 - 30, top: 960 - R * 2 - 30, width: R * 4 + 60, height: R * 4 + 60, borderRadius: "50%", boxShadow: `0 0 90px 30px rgba(79,163,247,${0.55 * halo}), inset 0 0 60px 20px rgba(79,163,247,${0.35 * halo})` }} />
      {mapIn < 1 && <Globe R={R} lat={lat} lon={lon} />}
      <AbsoluteFill style={{ opacity: mapIn }}>
        <TownMap scale={scale} />
        <div style={{ position: "absolute", left: 540 - 300, width: 600, top: 300, textAlign: "center", direction: "rtl", fontFamily: DISPLAY, fontWeight: 900, fontSize: 120, color: "white", textShadow: "0 8px 30px rgba(0,0,0,0.7)", opacity: interpolate(frame, [66, 72, 84, 90], [0, 1, 1, 0], CLAMP) }}>
          جرابلس
        </div>
        <div // Just east of the river, which crosses the centre line at 1.6 km.
          style={{ position: "absolute", left: Math.min(1000, 540 + 1.6 * scale + 0.25 * scale + 30), top: 1150, rotate: "90deg", fontFamily: TEXT, fontWeight: 600, fontSize: 40, color: "#8FD3FF", opacity: interpolate(frame, [68, 74, 82, 86], [0, 0.9, 0.9, 0], CLAMP), transformOrigin: "0 0" }}>
          نهر الفرات
        </div>
        <Rings x={540} y={960} color={A.gold} start={84} every={6} count={4} total={3} maxRadius={700} strokeWidth={5} />
        <div style={{ position: "absolute", left: 540 - 90, top: 960 - 180, width: 180, height: 180, transformOrigin: "50% 100%", scale: `${frame < 84 ? 0.9 : 1 + (1 - Math.min(1, pin)) * 0.25} ${frame < 84 ? 1.1 : Math.min(1.15, pin)}`, translate: `0 ${interpolate(frame, [76, 84], [-900, 0], { ...CLAMP, easing: Easing.in(Easing.quad) })}px`, opacity: frame < 76 ? 0 : 1 }}>
          <Icon path={mdiMapMarker} size={180} color={A.gold} style={{ filter: "drop-shadow(0 16px 24px rgba(0,0,0,0.6))" }} />
        </div>
        <div style={{ position: "absolute", top: 960 + 30, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: frame < 86 ? 0 : Math.min(1, card * 2), scale: interpolate(card, [0, 1], [0.6, 1]) }}>
          <div style={{ direction: "rtl", background: "white", borderRadius: 26, padding: "16px 40px 22px", textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 64, color: A.navy }}>مكتب أبو شام</div>
            <div style={{ fontFamily: TEXT, fontWeight: 600, fontSize: 38, color: A.royal }}>جرابلس • طريق المحطة</div>
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: clouds, background: "radial-gradient(ellipse 60% 40% at 30% 40%, rgba(255,255,255,0.95), transparent 70%), radial-gradient(ellipse 55% 35% at 70% 60%, rgba(240,246,255,0.95), transparent 70%), radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255,255,255,0.8), transparent 75%)", scale: 1 + clouds * 0.6 }} />
      <AbsoluteFill style={{ background: "white", opacity: interpolate(frame, [HOOK_DURATION - 5, HOOK_DURATION], [0, 1], CLAMP) }} />
      <div style={{ position: "absolute", bottom: 20, right: 24, fontFamily: TEXT, fontSize: 18, color: "white", opacity: 0.35 * (1 - mapIn) }}>صورة الأرض: ناسا</div>
    </AbsoluteFill>
  );
};
