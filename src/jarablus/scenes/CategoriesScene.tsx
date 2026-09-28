import { mdiCar, mdiHomeCity, mdiLaptop, mdiMotorbike, mdiCellphone, mdiSofa, mdiTelevision, mdiShapeOutline } from "@mdi/js";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Hud, Icon, OrbitDots, Words } from "../components";
import { C, CLAMP, DISPLAY } from "../theme";

export const CATEGORIES_DURATION = 150;

// The app's own categories.
const CATEGORIES = [
  { name: "سيارات", icon: mdiCar },
  { name: "عقارات", icon: mdiHomeCity },
  { name: "هواتف", icon: mdiCellphone },
  { name: "موتورات", icon: mdiMotorbike },
  { name: "لابتوبات", icon: mdiLaptop },
  { name: "إلكترونيات", icon: mdiTelevision },
  { name: "أثاث", icon: mdiSofa },
  { name: "مفقودات", icon: mdiShapeOutline },
];
const START = 8;
const SLOT = 14;
const END = START + CATEGORIES.length * SLOT;
const CX = 540;
const CY = 820;

export const CategoriesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const index = Math.max(0, Math.min(CATEGORIES.length - 1, Math.floor((frame - START) / SLOT)));
  const local = frame - START - index * SLOT;
  const pop = spring({ frame: local, fps, config: { damping: 11, stiffness: 220, mass: 0.6 } });
  const disc = spring({ frame, fps, config: { damping: 14 } });
  const finale = spring({ frame: frame - END, fps, config: { damping: 14 } });
  const category = CATEGORIES[index];

  return (
    <AbsoluteFill style={{ background: C.brand }}>
      <OrbitDots x={CX} y={CY} radius={340} count={18} color={C.cream} size={18} />
      <OrbitDots x={CX} y={CY} radius={430} count={30} color={C.mint} size={8} start={6} />
      <div
        style={{
          position: "absolute",
          left: CX - 250,
          top: CY - 250,
          width: 500,
          height: 500,
          borderRadius: 250,
          background: C.cream,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          scale: disc * interpolate(finale, [0, 1], [1, 0.9]),
          boxShadow: "0 40px 90px rgba(2, 27, 23, 0.35)",
        }}
      >
        <Icon
          path={category.icon}
          size={270}
          color={C.deep}
          style={{ scale: interpolate(pop, [0, 1], [0.2, 1]), rotate: `${interpolate(pop, [0, 1], [-70, 0])}deg`, opacity: frame < START ? 0 : 1 }}
        />
      </div>
      <div style={{ position: "absolute", top: CY + 360, left: 0, right: 0, height: 230, overflow: "hidden", textAlign: "center", opacity: 1 - finale }}>
        <div
          style={{
            direction: "rtl",
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontSize: 150,
            lineHeight: "230px",
            color: C.paper,
            translate: `0 ${interpolate(pop, [0, 1], [120, 0])}px`,
            opacity: frame < START ? 0 : interpolate(pop, [0, 0.4], [0, 1], CLAMP),
          }}
        >
          {category.name}
        </div>
      </div>
      <AbsoluteFill style={{ top: CY + 360, height: 230, justifyContent: "center" }}>
        <Words text={"وغيرها *كتير"} start={END + 2} size={130} color={C.paper} accent={C.cream} />
      </AbsoluteFill>
      <Hud index={3} total={6} label="الأقسام" color={C.cream} />
    </AbsoluteFill>
  );
};
