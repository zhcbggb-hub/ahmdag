import { mdiAccountMultipleCheck, mdiBellRing, mdiCashRemove } from "@mdi/js";
import { AbsoluteFill, interpolate, Series, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Icon, Words } from "../components";
import { C } from "../theme";
import { FEATURES_START, FINALE_START } from "./timing";

export const FEATURES_DURATION = FINALE_START - FEATURES_START;
const SLOT = FEATURES_DURATION / 3;

// Three quick cuts, 20 frames each.
const ITEMS = [
  { text: "بلا وسيط", icon: mdiAccountMultipleCheck, bg: C.mint, fg: C.deep },
  { text: "بلا عمولة", icon: mdiCashRemove, bg: C.cream, fg: C.deep },
  { text: "إشعارات فورية", icon: mdiBellRing, bg: C.deep, fg: C.mint },
];

const Cut: React.FC<(typeof ITEMS)[number]> = ({ text, icon, bg, fg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 11, stiffness: 220 } });
  return (
    <AbsoluteFill style={{ background: bg, justifyContent: "center", alignItems: "center", gap: 40 }}>
      <div style={{ scale: interpolate(p, [0, 1], [0.3, 1]), rotate: `${(1 - p) * -30}deg` }}>
        <Icon path={icon} size={230} color={fg} />
      </div>
      <Words text={text} start={2} stagger={4} size={140} color={fg} />
    </AbsoluteFill>
  );
};

export const Features: React.FC = () => (
  <Series>
    {ITEMS.map((item) => (
      <Series.Sequence key={item.text} name={item.text} durationInFrames={SLOT}>
        <Cut {...item} />
      </Series.Sequence>
    ))}
  </Series>
);
