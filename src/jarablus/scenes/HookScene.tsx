import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Center, Hud, Rings, Words } from "../components";
import { C, CLAMP } from "../theme";

export const HOOK_DURATION = 72;

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 48%, #0B5E52 0%, ${C.deep} 45%, ${C.ink} 100%)` }}>
      <Rings x={540} y={930} color={C.mint} start={14} every={12} maxRadius={1000} strokeWidth={3} />
      <Center style={{ scale: interpolate(frame, [0, HOOK_DURATION], [1, 1.1], CLAMP) }}>
        <Words text={"عم تدوّر\nعلى *شي؟"} size={230} color={C.paper} stagger={6} lineHeight={1.35} />
      </Center>
      <Hud index={1} total={6} label="كل السوق بمكان واحد" color={C.cream} />
    </AbsoluteFill>
  );
};
