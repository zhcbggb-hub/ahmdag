import { mdiMagnify } from "@mdi/js";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Hud, Icon, Words } from "../components";
import { C, CLAMP, DISPLAY, EASE_IN_OUT, TEXT } from "../theme";

export const SEARCH_DURATION = 125;

const QUERIES = ["سيارة", "شقة", "موبايل", "موتور"];
const TYPING_START = 14;
const SLOT = 16;
const TYPING_END = TYPING_START + QUERIES.length * SLOT;

// Types each query in, holds it, then deletes it, like someone trying the search box.
const typedText = (frame: number) => {
  const t = frame - TYPING_START;
  if (t < 0) return "";
  const slot = Math.min(Math.floor(t / SLOT), QUERIES.length - 1);
  const letters = Array.from(QUERIES[slot]);
  const local = t - slot * SLOT;
  const isLast = slot === QUERIES.length - 1;
  const typed = Math.min(letters.length, Math.floor(local / 1.4) + 1);
  const deleted = isLast ? 0 : Math.max(0, local - (SLOT - 4)) * 2;
  return letters.slice(0, Math.max(0, typed - deleted)).join("");
};

const Grid: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage: `linear-gradient(${C.brand}14 2px, transparent 2px), linear-gradient(90deg, ${C.brand}14 2px, transparent 2px)`,
      backgroundSize: "108px 108px",
      backgroundPosition: "0 0",
    }}
  />
);

export const SearchScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const open = spring({ frame, fps, config: { damping: 16, stiffness: 160 } });
  const lift = interpolate(frame, [TYPING_END, TYPING_END + 12], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const caretOn = Math.floor(frame / 8) % 2 === 0;

  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <Grid />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", translate: `0 ${interpolate(lift, [0, 1], [0, -260])}px` }}>
        <div
          style={{
            direction: "rtl",
            width: interpolate(open, [0, 1], [160, 920]),
            height: 160,
            borderRadius: 80,
            background: "white",
            border: `5px solid ${C.brand}`,
            boxShadow: "0 30px 80px rgba(5, 68, 59, 0.18)",
            display: "flex",
            alignItems: "center",
            gap: 26,
            paddingInline: 44,
            overflow: "hidden",
            scale: interpolate(open, [0, 1], [0.6, 1]),
          }}
        >
          <Icon path={mdiMagnify} size={76} color={C.brand} style={{ flexShrink: 0 }} />
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 78, color: C.deep, whiteSpace: "nowrap", display: "flex", alignItems: "center" }}>
            {typedText(frame)}
            <span style={{ width: 6, height: 84, marginInline: 8, background: C.brand, opacity: caretOn && lift < 1 ? 1 : 0 }} />
          </div>
        </div>
        <div style={{ direction: "rtl", fontFamily: TEXT, fontSize: 44, fontWeight: 500, color: C.brand, marginTop: 40, opacity: interpolate(frame, [10, 20], [0, 1], CLAMP) * (1 - lift) }}>
          ابحث عن سيارة، شقة، موبايل…
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 220 }}>
        <Words text={"*كلّو هون."} start={TYPING_END + 6} size={190} color={C.deep} accent={C.brand} />
      </AbsoluteFill>
      <Hud index={2} total={6} label="بحث عربي سريع" color={C.brand} />
    </AbsoluteFill>
  );
};
