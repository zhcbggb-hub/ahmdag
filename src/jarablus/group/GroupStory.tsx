import { mdiAccountGroup, mdiBellRing, mdiCheckDecagram, mdiClockOutline, mdiCommentOutline, mdiDotsHorizontal, mdiEarth, mdiFlash, mdiImageOutline, mdiShareOutline, mdiThumbUpOutline, mdiWhatsapp } from "@mdi/js";
import { AbsoluteFill, Img, interpolate, random, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Burst, Icon } from "../components";
import { Phone, PHONE_H, PHONE_W, Shot } from "../premium/parts";
import { Tap } from "../story/parts";
import { C, CLAMP, DISPLAY, EASE_IN_OUT, EASE_OUT, TEXT } from "../theme";
import { Character } from "./Character";

// A seller posts his motorcycle in a Facebook-style buy-and-sell group, the post sinks under dozens of others and
// nobody replies; then he posts it on Souq Jarablus and buyers message him. The group is drawn generically, with no
// real network's name or logo. Backgrounds are real photos of Jarablus (public/city, not committed).
export const SHOOT = 0;
export const POST = 90;
export const SINK = 180;
export const TURN = 330;
export const SOLD = 390;
export const END = 510;
export const GROUP_DURATION = 630;

const ease = (frame: number, from: number, duration = 18, easing = EASE_OUT) => interpolate(frame, [from, from + duration], [0, 1], { ...CLAMP, easing });

// The motorcycle photo from the real ad in the app.
const MOTO = { src: "screen-ad-moto.jpg", w: 618, h: 460 };
const MotoPhoto: React.FC<{ width: number; height: number; style?: React.CSSProperties }> = ({ width, height, style }) => {
  const k = Math.max(width / MOTO.w, height / MOTO.h);
  return (
    <div style={{ position: "relative", width, height, overflow: "hidden", ...style }}>
      <Img src={staticFile(MOTO.src)} style={{ position: "absolute", width: MOTO.w * k, maxWidth: "none", left: (width - MOTO.w * k) / 2, top: (height - MOTO.h * k) / 2 }} />
    </div>
  );
};

// A real photo of Jarablus, filling the frame, graded and slowly pushed in.
const City: React.FC<{ src: string; tint: string; blur?: number; brightness?: number }> = ({ src, tint, blur = 0, brightness = 0.6 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", scale: 1.08 + frame * 0.0004, filter: `blur(${blur}px) brightness(${brightness}) saturate(1.1) contrast(1.05)` }} />
      <AbsoluteFill style={{ background: tint }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

const Title: React.FC<{ text: string; at: number; out?: number; top?: number; size?: number; color?: string }> = ({ text, at, out, top = 190, size = 84, color = "white" }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, at, 16) * (out === undefined ? 1 : 1 - ease(frame, out, 10, EASE_IN_OUT));
  if (p === 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 50,
        right: 50,
        direction: "rtl",
        textAlign: "center",
        fontFamily: DISPLAY,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.3,
        color,
        opacity: p,
        clipPath: `inset(-20% 0 -20% ${(1 - ease(frame, at, 20)) * 100}%)`,
        translate: `0 ${(1 - p) * 20}px`,
        textShadow: "0 6px 30px rgba(0,0,0,0.7)",
      }}
    >
      {text}
    </div>
  );
};

// ---------------------------------------------------------------- 1. taking the photo

const Shoot: React.FC = () => {
  const frame = useCurrentFrame();
  const view = ease(frame, 6, 20);
  const focus = interpolate(frame, [14, 30], [1.25, 1], { ...CLAMP, easing: EASE_OUT });
  const flash = interpolate(frame, [48, 50, 62], [0, 1, 0], CLAMP);
  return (
    <AbsoluteFill>
      <City src="city/street.jpg" tint="linear-gradient(180deg, rgba(20,12,4,0.35), rgba(20,12,4,0.55))" brightness={0.7} />
      <Title text="بدك تبيع موتورك؟" at={0} />
      <div style={{ position: "absolute", left: 150, top: 400, width: 780, height: 580, borderRadius: 36, overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,0.6), 0 0 0 6px rgba(255,255,255,0.85)", opacity: view, scale: interpolate(view, [0, 1], [0.9, 1]) }}>
        <MotoPhoto width={780} height={580} />
        {/* The camera's focus brackets and controls. */}
        <AbsoluteFill style={{ scale: focus }}>
          {[
            [250, 150, 0],
            [530, 150, 90],
            [530, 430, 180],
            [250, 430, 270],
          ].map(([x, y, r]) => (
            <div key={r} style={{ position: "absolute", left: x - 30, top: y - 30, width: 60, height: 60, borderTop: "6px solid #FFD54A", borderLeft: "6px solid #FFD54A", rotate: `${r}deg` }} />
          ))}
        </AbsoluteFill>
        <div style={{ position: "absolute", top: 20, left: 24 }}>
          <Icon path={mdiFlash} size={48} color="#FFD54A" />
        </div>
        <div style={{ position: "absolute", bottom: 22, left: 390 - 44, width: 88, height: 88, borderRadius: 44, border: "7px solid white", background: frame > 44 && frame < 54 ? "#ddd" : "rgba(255,255,255,0.25)" }} />
        <AbsoluteFill style={{ background: "white", opacity: flash }} />
      </div>
      <Character pose="shoot" x={-40} y={1020} scale={0.95} />
      <AbsoluteFill style={{ background: "white", opacity: flash * 0.35 }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- the group feed

const SCREEN = { w: PHONE_W, h: PHONE_H };

const GroupHeader: React.FC = () => (
  <div style={{ height: 78, background: "white", display: "flex", alignItems: "center", gap: 12, padding: "0 18px", direction: "rtl", borderBottom: "1px solid #E4E6EB" }}>
    <div style={{ width: 46, height: 46, borderRadius: 12, background: "#DDE3EA", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Icon path={mdiAccountGroup} size={30} color="#5B6573" />
    </div>
    <div style={{ fontFamily: TEXT }}>
      <div style={{ fontWeight: 700, fontSize: 21, color: "#1C1E21" }}>مجموعة بيع وشراء</div>
      <div style={{ fontSize: 15, color: "#65676B", display: "flex", alignItems: "center", gap: 4 }}>
        <Icon path={mdiEarth} size={14} color="#65676B" /> مجموعة عامة
      </div>
    </div>
  </div>
);

const Bar: React.FC<{ w: number; h?: number; c?: string }> = ({ w, h = 12, c = "#D8DADF" }) => <div style={{ width: w, height: h, borderRadius: h / 2, background: c }} />;

// One post in the feed. The seller's own post has his text and photo; the others are generic.
const PostCard: React.FC<{ mine?: boolean; seed: number; reactions?: React.ReactNode }> = ({ mine, seed, reactions }) => {
  const hue = Math.floor(random(`h${seed}`) * 360);
  return (
    <div style={{ background: "white", marginBottom: 10, direction: "rtl", fontFamily: TEXT }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px 8px" }}>
        <div style={{ width: 42, height: 42, borderRadius: 21, background: mine ? "#4A6B8A" : `hsl(${hue} 25% 70%)` }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {mine ? <div style={{ fontWeight: 700, fontSize: 18, color: "#1C1E21" }}>منشورك</div> : <Bar w={90 + random(`n${seed}`) * 60} />}
          <Bar w={50} h={9} c="#E4E6EB" />
        </div>
        <div style={{ flex: 1 }} />
        <Icon path={mdiDotsHorizontal} size={24} color="#65676B" />
      </div>
      <div style={{ padding: "0 16px 10px" }}>
        {mine ? (
          <div style={{ fontSize: 20, fontWeight: 600, color: "#1C1E21", lineHeight: 1.45 }}>
            للبيع موتور 150 نكل
            <br />
            السعر 570$ للتواصل عالخاص
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Bar w={300 - random(`a${seed}`) * 80} />
            <Bar w={180 + random(`b${seed}`) * 100} />
          </div>
        )}
      </div>
      {mine ? (
        <MotoPhoto width={SCREEN.w} height={230} />
      ) : (
        <div style={{ height: 200, background: `linear-gradient(135deg, hsl(${hue} 30% 72%), hsl(${(hue + 40) % 360} 30% 58%))`, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Icon path={mdiImageOutline} size={60} color="rgba(255,255,255,0.7)" />
        </div>
      )}
      {reactions}
      <div style={{ display: "flex", justifyContent: "space-around", padding: "10px 0 12px", borderTop: "1px solid #E4E6EB", color: "#65676B", fontSize: 16 }}>
        {[mdiThumbUpOutline, mdiCommentOutline, mdiShareOutline].map((p) => (
          <Icon key={p} path={p} size={24} color="#65676B" />
        ))}
      </div>
    </div>
  );
};

const POST_H = 420;

// ---------------------------------------------------------------- 2. posting in the group

const Composer: React.FC = () => {
  const frame = useCurrentFrame();
  const text = "للبيع موتور 150 نكل\nالسعر 570$ للتواصل عالخاص";
  const typed = Math.round(interpolate(frame, [10, 50], [0, text.length], CLAMP));
  const photo = ease(frame, 52, 12);
  return (
    <AbsoluteFill style={{ background: "#F0F2F5" }}>
      <GroupHeader />
      <div style={{ background: "white", margin: "10px 0", padding: 16, direction: "rtl", fontFamily: TEXT }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 21, background: "#4A6B8A" }} />
          <div style={{ fontWeight: 700, fontSize: 18, color: "#1C1E21" }}>منشور جديد</div>
        </div>
        <div style={{ minHeight: 70, fontSize: 21, fontWeight: 600, color: "#1C1E21", whiteSpace: "pre-wrap", lineHeight: 1.45 }}>
          {text.slice(0, typed)}
          <span style={{ opacity: frame % 14 < 7 ? 1 : 0, color: "#1877F2" }}>|</span>
        </div>
        <div style={{ opacity: photo, scale: interpolate(photo, [0, 1], [0.9, 1]), marginTop: 10, borderRadius: 12, overflow: "hidden" }}>
          <MotoPhoto width={SCREEN.w - 32} height={230} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 16, right: 16, bottom: 30, height: 56, borderRadius: 12, background: "#3B82F6", color: "white", fontFamily: TEXT, fontWeight: 700, fontSize: 22, display: "flex", justifyContent: "center", alignItems: "center" }}>نشر</div>
      <Tap at={76} x={SCREEN.w / 2} y={SCREEN.h - 58} />
    </AbsoluteFill>
  );
};

const Post: React.FC = () => (
  <AbsoluteFill>
    <City src="city/street.jpg" tint="rgba(15,10,5,0.35)" blur={4} brightness={0.7} />
    <Title text="نزّلتو بمجموعة بيع وشراء…" at={2} size={70} top={170} />
    <Phone cx={540} top={330} scale={0.95} turn={-4}>
      <Composer />
    </Phone>
    <Character pose="type" x={-60} y={1180} scale={0.78} />
  </AbsoluteFill>
);

// ---------------------------------------------------------------- 3. the post sinks

const NEW_POSTS = 9;
const Feed: React.FC = () => {
  const frame = useCurrentFrame();
  // New posts keep arriving on top, pushing the seller's post down and out of sight.
  const arrived = interpolate(frame, [20, 120], [0, NEW_POSTS], { ...CLAMP, easing: (t) => t * t });
  const zero = ease(frame, 8, 10);
  return (
    <AbsoluteFill style={{ background: "#F0F2F5" }}>
      <div style={{ position: "absolute", top: 78, left: 0, right: 0, translate: `0 ${(arrived - NEW_POSTS) * POST_H}px` }}>
        {new Array(NEW_POSTS).fill(0).map((_, i) => (
          <div key={i} style={{ height: POST_H, overflow: "hidden", opacity: interpolate(arrived, [NEW_POSTS - i - 1, NEW_POSTS - i], [0, 1], CLAMP) }}>
            <PostCard seed={i + 3} />
          </div>
        ))}
        <PostCard
          mine
          seed={0}
          reactions={
            <div style={{ padding: "8px 16px", fontSize: 17, fontWeight: 700, color: "#E0453A", opacity: zero, direction: "rtl" }}>٠ إعجاب • ٠ تعليق</div>
          }
        />
      </div>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
        <GroupHeader />
      </div>
    </AbsoluteFill>
  );
};

const LATER = ["بعد ساعة…", "بعد يوم…", "بعد ٣ أيام…"];
const Sink: React.FC = () => {
  const frame = useCurrentFrame();
  const step = Math.min(2, Math.floor(Math.max(0, frame - 20) / 40));
  const grey = interpolate(frame, [0, 140], [0, 0.7], CLAMP);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: `grayscale(${grey})` }}>
        <City src="city/street.jpg" tint="rgba(15,10,5,0.4)" blur={4} brightness={0.65} />
        <Phone cx={540} top={330} scale={0.95} turn={-4}>
          <Feed />
        </Phone>
      </AbsoluteFill>
      <Title text="وضاع بين مية منشور…" at={4} out={78} size={72} top={170} />
      <Title text="وما حدا حكى معك" at={90} size={80} top={170} color="#FFB4A8" />
      <div style={{ position: "absolute", top: 1140, right: 60, direction: "rtl", display: "flex", alignItems: "center", gap: 10, padding: "12px 26px 16px", borderRadius: 40, background: "rgba(0,0,0,0.6)", border: "1.5px solid rgba(255,255,255,0.2)", fontFamily: DISPLAY, fontWeight: 800, fontSize: 40, color: "white", opacity: ease(frame, 20, 12) }}>
        <Icon path={mdiClockOutline} size={44} color="white" />
        {LATER[step]}
      </div>
      <Character pose="sad" x={-60} y={1180} scale={0.78} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 4. the turn

const Turn: React.FC = () => {
  const frame = useCurrentFrame();
  const banner = ease(frame, 4, 16);
  const glow = interpolate(frame, [30, 60], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  return (
    <AbsoluteFill>
      <City src="city/street.jpg" tint={`rgba(2,27,23,${0.3 + glow * 0.25})`} blur={4} brightness={0.7} />
      <Title text="في طريقة أسهل!" at={2} size={84} top={170} color={C.mint} />
      <Phone cx={540} top={330} scale={0.95} turn={-4}>
        <AbsoluteFill style={{ filter: `grayscale(${0.7 * (1 - glow)}) blur(${glow * 3}px)` }}>
          <Feed />
        </AbsoluteFill>
        <AbsoluteFill style={{ background: C.paper, opacity: glow }}>
          <Shot src="screen-home.jpg" />
        </AbsoluteFill>
      </Phone>
      {/* The app's notification drops in over the phone. */}
      <div style={{ position: "absolute", left: 90, right: 90, top: 300, translate: `0 ${(1 - banner) * -200}px`, opacity: banner * (1 - glow * 0.9), direction: "rtl", display: "flex", alignItems: "center", gap: 18, padding: "18px 24px", borderRadius: 30, background: "rgba(255,255,255,0.95)", boxShadow: "0 30px 70px rgba(0,0,0,0.45)" }}>
        <div style={{ width: 90, height: 90, borderRadius: 22, background: "white", boxShadow: "0 0 0 2px #E3ECE6", display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0 }}>
          <Img src={staticFile("logo.png")} style={{ width: 78, maxWidth: "none" }} />
        </div>
        <div style={{ fontFamily: DISPLAY }}>
          <div style={{ fontWeight: 900, fontSize: 38, color: C.deep, display: "flex", alignItems: "center", gap: 8 }}>
            سوق جرابلس <Icon path={mdiBellRing} size={32} color={C.brand} />
          </div>
          <div style={{ fontFamily: TEXT, fontWeight: 600, fontSize: 28, color: "#33413E" }}>انشر إعلانك… وخلّي الكل يشوفو</div>
        </div>
      </div>
      <Character pose="type" x={-60} y={1180} scale={0.78} />
      <AbsoluteFill style={{ background: "white", opacity: interpolate(frame, [52, 60], [0, 0.8], CLAMP) }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 5. buyers message him

const CHATS = ["مرحبا، الموتور لسا موجود؟", "قديش آخر سعر؟", "تمام، جاي آخدو هلّق!"];
const Sold: React.FC = () => {
  const frame = useCurrentFrame();
  const stamp = ease(frame, 76, 12);
  return (
    <AbsoluteFill>
      <City src="city/street.jpg" tint={`linear-gradient(180deg, rgba(2,27,23,0.55), rgba(5,68,59,0.65))`} blur={3} brightness={0.7} />
      <AbsoluteFill style={{ background: "white", opacity: interpolate(frame, [0, 10], [0.8, 0], CLAMP) }} />
      <Title text="والمشتري بيحكي معك مباشرة" at={4} size={60} top={175} />
      <Phone cx={380} top={340} scale={0.85} turn={8}>
        <Shot src="screen-ad-moto.jpg" />
      </Phone>
      {CHATS.map((text, i) => {
        const p = ease(frame, 20 + i * 16, 14);
        return (
          <div key={text} style={{ position: "absolute", right: 50, top: 520 + i * 150, width: 480, direction: "rtl", display: "flex", gap: 14, alignItems: "center", padding: "16px 20px", borderRadius: 26, background: "rgba(255,255,255,0.96)", boxShadow: "0 20px 50px rgba(0,0,0,0.35)", opacity: p, translate: `${(1 - p) * 80}px 0` }}>
            <div style={{ width: 60, height: 60, borderRadius: 30, background: "#25D366", display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0 }}>
              <Icon path={mdiWhatsapp} size={38} color="white" />
            </div>
            <div style={{ fontFamily: TEXT, fontWeight: 700, fontSize: 28, color: "#111B21" }}>{text}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 1020, right: 70, opacity: stamp, scale: interpolate(stamp, [0, 1], [2, 1]), rotate: "-8deg", direction: "rtl", display: "flex", alignItems: "center", gap: 10, padding: "6px 34px 16px", borderRadius: 26, border: `9px solid ${C.mint}`, background: "rgba(2,27,23,0.75)", fontFamily: DISPLAY, fontWeight: 900, fontSize: 76, color: C.mint }}>
        <Icon path={mdiCheckDecagram} size={76} color={C.mint} />
        تم البيع
      </div>
      <Burst x={800} y={1080} start={78} seed="sold" colors={[C.mint, C.cream, "white"]} count={50} power={1.3} />
      <Character pose="happy" x={-40} y={1180} scale={0.78} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 6. the logo over Jarablus

const LOGO_W = 760;
const End: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = ease(frame, 10, 28);
  return (
    <AbsoluteFill>
      <City src="city/roundabout.jpg" tint="linear-gradient(180deg, rgba(2,27,23,0.35), rgba(2,27,23,0.75))" brightness={0.75} />
      <div style={{ position: "absolute", left: 540 - 520, top: 560, width: 1040, height: 700, borderRadius: 520, background: "rgba(248,247,242,0.85)", filter: "blur(70px)", opacity: logo }} />
      <Img src={staticFile("logo.png")} style={{ position: "absolute", left: 540 - LOGO_W / 2, top: 680, width: LOGO_W, maxWidth: "none", opacity: logo, scale: interpolate(logo, [0, 1], [1.15, 1]), filter: `blur(${(1 - logo) * 12}px)` }} />
      <AbsoluteFill style={{ background: "white", opacity: interpolate(frame, [0, 12], [0.8, 0], CLAMP) }} />
    </AbsoluteFill>
  );
};

const SCENES = [
  { name: "Shoot", from: SHOOT, to: POST, Scene: Shoot },
  { name: "Post", from: POST, to: SINK, Scene: Post },
  { name: "Sink", from: SINK, to: TURN, Scene: Sink },
  { name: "Turn", from: TURN, to: SOLD, Scene: Turn },
  { name: "Sold", from: SOLD, to: END, Scene: Sold },
  { name: "End", from: END, to: GROUP_DURATION, Scene: End },
];

export const GroupStory: React.FC = () => (
  <AbsoluteFill style={{ background: C.ink }}>
    {SCENES.map(({ name, from, to, Scene }) => (
      <Sequence key={name} name={name} from={from} durationInFrames={to - from}>
        <Scene />
      </Sequence>
    ))}
  </AbsoluteFill>
);
