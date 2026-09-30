import { mdiMapMarker } from "@mdi/js";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Icon } from "../components";
import { C, CLAMP, DISPLAY, EASE_IN_OUT, EASE_OUT } from "../theme";
import data from "./map-data.json";
import { camera, DISTRICT_AT, DIVE_AT, GROW_AT, NETWORK_AT, PEOPLE_ALL_AT, PEOPLE_AT, REGIONS_AT, sec, toPx, VILLAGES_AT } from "./timing";

export const RIVER = "#5BC8F5";
export const VILLAGES = data.villages;
const JARABLUS = VILLAGES.find((v) => v.name === "جرابلس")!;

const fade = (frame: number, from: number, duration = 20) => interpolate(frame, [from, from + duration], [0, 1], { ...CLAMP, easing: EASE_OUT });

// Villages light up spreading out from Jarablus.
const byDistance = [...VILLAGES].sort((a, b) => Math.hypot(a.x, a.y) - Math.hypot(b.x, b.y));
const lightAt = (name: string) => VILLAGES_AT + Math.round((byDistance.findIndex((v) => v.name === name) / byDistance.length) * sec(3.2));

// Each village linked to its two nearest neighbours: the "digital market" network.
export const LINKS = (() => {
  const seen = new Set<string>();
  const out: { a: (typeof VILLAGES)[number]; b: (typeof VILLAGES)[number] }[] = [];
  for (const a of VILLAGES) {
    const near = VILLAGES.filter((b) => b !== a)
      .sort((p, q) => Math.hypot(p.x - a.x, p.y - a.y) - Math.hypot(q.x - a.x, q.y - a.y))
      .slice(0, 2);
    for (const b of near) {
      const key = [a.name, b.name].sort().join("|");
      if (!seen.has(key)) {
        seen.add(key);
        out.push({ a, b });
      }
    }
  }
  return out;
})();

// Only the places named in the brief are labelled, plus the two sub-districts.
const LABELS = [
  { name: "الغندورة", at: GROW_AT + 8, dy: -1 },
  { name: "العمارنة", at: GROW_AT + 16, dy: 1 },
];
const SUBDISTRICTS = [
  { key: "Jarablus" as const, label: "ناحية جرابلس", x: -6, y: 13, at: REGIONS_AT },
  { key: "Ghandorah" as const, label: "ناحية الغندورة", x: -27, y: 22, at: REGIONS_AT + 24 },
];

// The real map of Jarablus District, drawn through a moving camera. `dim` darkens it under overlays.
export const MapView: React.FC<{ dim?: number }> = ({ dim = 0 }) => {
  const frame = useCurrentFrame();
  const cam = camera(frame);
  const px = (p: number) => p / cam.s; // a width in pixels, in map units
  const vb = `${cam.cx - 540 / cam.s} ${cam.cy - 960 / cam.s} ${1080 / cam.s} ${1920 / cam.s}`;

  const syriaDraw = interpolate(frame, [-15, 35], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const districtDraw = interpolate(frame, [DISTRICT_AT - 10, DISTRICT_AT + 40], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const detail = fade(frame, DISTRICT_AT, 40);
  const riverDraw = interpolate(frame, [DISTRICT_AT + 20, DISTRICT_AT + 80], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const zoomedIn = interpolate(cam.s, [3, 12], [0, 1], CLAMP);
  const network = interpolate(frame, [NETWORK_AT, NETWORK_AT + 40], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const networkOut = fade(frame, sec(34.8), 30);
  const flare = interpolate(frame, [PEOPLE_ALL_AT, PEOPLE_ALL_AT + 12, PEOPLE_ALL_AT + 50], [0, 1, 0.35], CLAMP);

  return (
    <AbsoluteFill style={{ filter: dim ? `brightness(${1 - dim * 0.55}) blur(${dim * 4}px)` : undefined }}>
      <svg width="1080" height="1920" viewBox={vb} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="districtFill" cx="70%" cy="20%" r="90%">
            <stop offset="0%" stopColor={C.mint} stopOpacity={0.2} />
            <stop offset="100%" stopColor={C.brand} stopOpacity={0.05} />
          </radialGradient>
        </defs>

        {/* Syria and its governorates, for the opening. */}
        <g opacity={1 - zoomedIn * 0.75}>
          <path d={data.syria} fill={C.mint} fillOpacity={0.05 * syriaDraw} stroke={C.mint} strokeOpacity={0.35} strokeWidth={px(14)} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - syriaDraw} />
          <path d={data.syria} fill="none" stroke={C.mint} strokeWidth={px(3)} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - syriaDraw} />
          {data.governorates.map((d, i) => (
            <path key={i} d={d} fill="none" stroke={C.paper} strokeOpacity={0.14 * syriaDraw * (1 - zoomedIn)} strokeWidth={px(1.2)} />
          ))}
        </g>

        {/* Neighbouring districts and the roads. */}
        <g opacity={detail}>
          {data.neighbours.map((d, i) => (
            <path key={i} d={d} fill="none" stroke={C.paper} strokeOpacity={0.12} strokeWidth={px(1.5)} />
          ))}
          {data.roads.map((r, i) => (
            <path key={i} d={r.d} fill="none" stroke={C.paper} strokeOpacity={r.major ? 0.2 : 0.09} strokeWidth={px(r.major ? 2.2 : 1.2)} strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </g>

        {/* The district: a soft fill, the two sub-districts, and a glowing border. */}
        <path d={data.district} fill="url(#districtFill)" fillOpacity={districtDraw} stroke="none" />
        {SUBDISTRICTS.map((s) => {
          const on = interpolate(frame, [s.at, s.at + 16, REGIONS_AT + 70, REGIONS_AT + 90], [0, 1, 1, 0.3], CLAMP) + flare * 0.6;
          return <path key={s.key} d={data.subdistricts[s.key]} fill={C.mint} fillOpacity={0.16 * on} stroke={C.cream} strokeOpacity={0.35 * detail} strokeWidth={px(1.6)} strokeDasharray={`${px(8)} ${px(8)}`} />;
        })}

        {/* The Euphrates. */}
        <g opacity={detail}>
          {data.water.map((d, i) => (
            <path key={i} d={d} fill={RIVER} fillOpacity={0.45 * riverDraw} stroke="none" />
          ))}
          {data.rivers.map((r, i) => (
            <g key={i}>
              <path d={r.d} fill="none" stroke={RIVER} strokeOpacity={0.25} strokeWidth={px(r.euphrates ? 14 : 6)} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - riverDraw} />
              <path d={r.d} fill="none" stroke={RIVER} strokeWidth={px(r.euphrates ? 3.5 : 1.8)} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - riverDraw} />
            </g>
          ))}
        </g>

        <path d={data.district} fill="none" stroke={C.mint} strokeOpacity={0.3} strokeWidth={px(18)} strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - districtDraw} />
        <path d={data.district} fill="none" stroke={C.mint} strokeWidth={px(4)} strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - districtDraw} />

        {/* The network of villages. */}
        <g opacity={1 - networkOut}>
          {LINKS.map(({ a, b }, i) => {
            const k = interpolate(network, [i / LINKS.length / 1.6, i / LINKS.length / 1.6 + 0.35], [0, 1], CLAMP);
            if (k === 0) return null;
            const t = ((frame - NETWORK_AT) / 40 + i * 0.37) % 1;
            return (
              <g key={i}>
                <line x1={a.x} y1={a.y} x2={a.x + (b.x - a.x) * k} y2={a.y + (b.y - a.y) * k} stroke={C.mint} strokeOpacity={0.55} strokeWidth={px(2)} />
                {k === 1 && <circle cx={a.x + (b.x - a.x) * t} cy={a.y + (b.y - a.y) * t} r={px(4)} fill="white" opacity={0.9} />}
              </g>
            );
          })}
        </g>

        {/* The villages. */}
        {VILLAGES.map((v) => {
          const on = fade(frame, lightAt(v.name), 14);
          const big = v.town ? 1.8 : 1;
          const pulse = 1 + flare * 0.8 + Math.sin(frame / 9 + v.x) * 0.08;
          return (
            <g key={v.name + v.x} opacity={on}>
              <circle cx={v.x} cy={v.y} r={px(13 * big * pulse)} fill={C.mint} opacity={0.22 + flare * 0.2} />
              <circle cx={v.x} cy={v.y} r={px(4.5 * big)} fill={C.cream} />
            </g>
          );
        })}
      </svg>

      {/* Names, drawn as HTML so the Arabic stays crisp at any zoom. */}
      {/* Hidden while the buyer marker sits on the town. */}
      <Label at={DISTRICT_AT + 20} {...toPx(cam, JARABLUS.x, JARABLUS.y)} text="جرابلس" size={Math.min(64, 30 + cam.s * 0.9)} main hide={[PEOPLE_AT - 4, DIVE_AT]} />
      {LABELS.map((l) => {
        const v = VILLAGES.find((x) => x.name === l.name)!;
        const p = toPx(cam, v.x, v.y);
        return <Label key={l.name} at={l.at} x={p.x} y={p.y + l.dy * 40} text={l.name} size={34} />;
      })}
      {SUBDISTRICTS.map((s) => {
        const p = toPx(cam, s.x, s.y);
        return <Label key={s.key} at={s.at} x={p.x} y={p.y} text={s.label} size={36} tone="cream" until={REGIONS_AT + 110} />;
      })}
    </AbsoluteFill>
  );
};

const Label: React.FC<{ at: number; x: number; y: number; text: string; size: number; main?: boolean; tone?: "cream"; until?: number; hide?: [number, number] }> = ({ at, x, y, text, size, main, tone, until, hide }) => {
  const frame = useCurrentFrame();
  const hidden = hide ? fade(frame, hide[0], 8) * (1 - fade(frame, hide[1], 12)) : 0;
  const p = fade(frame, at, 16) * (until === undefined ? 1 : 1 - fade(frame, until, 16)) * (1 - hidden);
  if (p === 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 300,
        width: 600,
        top: y - (main ? size * 2.3 : size * 0.7),
        textAlign: "center",
        direction: "rtl",
        fontFamily: DISPLAY,
        fontWeight: main ? 900 : 700,
        fontSize: size,
        color: tone === "cream" ? C.cream : "white",
        opacity: p,
        translate: `0 ${(1 - p) * 12}px`,
        textShadow: "0 0 18px rgba(2,27,23,0.95), 0 0 6px rgba(2,27,23,0.9)",
        whiteSpace: "nowrap",
      }}
    >
      {main && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: -size * 0.1 }}>
          <Icon path={mdiMapMarker} size={size * 1.1} color={C.mint} style={{ filter: "drop-shadow(0 0 12px rgba(18,201,178,0.8))" }} />
        </div>
      )}
      {text}
    </div>
  );
};
