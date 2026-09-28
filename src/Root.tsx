import "./index.css";
import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { JarablusPromo, PROMO_DURATION } from "./jarablus/JarablusPromo";
import { CATEGORIES_DURATION, CategoriesScene } from "./jarablus/scenes/CategoriesScene";
import { FEATURES_DURATION, FeaturesScene } from "./jarablus/scenes/FeaturesScene";
import { HOOK_DURATION, HookScene } from "./jarablus/scenes/HookScene";
import { NO_MIDDLEMAN_DURATION, NoMiddlemanScene } from "./jarablus/scenes/NoMiddlemanScene";
import { OUTRO_DURATION, OutroScene } from "./jarablus/scenes/OutroScene";
import { POST_AD_DURATION, PostAdScene } from "./jarablus/scenes/PostAdScene";
import { SEARCH_DURATION, SearchScene } from "./jarablus/scenes/SearchScene";
import { AppShowcase, APP_SHOWCASE_DURATION } from "./jarablus/short/AppShowcase";
import { Finale, FINALE_DURATION } from "./jarablus/short/Finale";
import { JarablusShort } from "./jarablus/short/JarablusShort";
import { LogoBuild, LOGO_BUILD_DURATION } from "./jarablus/short/LogoBuild";
import { SHORT_DURATION } from "./jarablus/short/timing";
import { FPS, HEIGHT, WIDTH } from "./jarablus/theme";

const vertical = { fps: FPS, width: WIDTH, height: HEIGHT };

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Souq Jarablus TikTok promo: npx remotion render JarablusPromo */}
      <Composition id="JarablusPromo" component={JarablusPromo} durationInFrames={PROMO_DURATION} {...vertical} />
      <Folder name="JarablusPromo-Scenes">
        <Composition id="Hook" component={HookScene} durationInFrames={HOOK_DURATION} {...vertical} />
        <Composition id="Search" component={SearchScene} durationInFrames={SEARCH_DURATION} {...vertical} />
        <Composition id="Categories" component={CategoriesScene} durationInFrames={CATEGORIES_DURATION} {...vertical} />
        <Composition id="NoMiddleman" component={NoMiddlemanScene} durationInFrames={NO_MIDDLEMAN_DURATION} {...vertical} />
        <Composition id="PostAd" component={PostAdScene} durationInFrames={POST_AD_DURATION} {...vertical} />
        <Composition id="Features" component={FeaturesScene} durationInFrames={FEATURES_DURATION} {...vertical} />
        <Composition id="Outro" component={OutroScene} durationInFrames={OUTRO_DURATION} {...vertical} />
      </Folder>

      {/* 16-second logo and app short, cut to the music: npx remotion render JarablusShort */}
      <Composition id="JarablusShort" component={JarablusShort} durationInFrames={SHORT_DURATION} {...vertical} />
      <Folder name="JarablusShort-Scenes">
        <Composition id="LogoBuild" component={LogoBuild} durationInFrames={LOGO_BUILD_DURATION} {...vertical} />
        <Composition id="AppShowcase" component={AppShowcase} durationInFrames={APP_SHOWCASE_DURATION} {...vertical} />
        <Composition id="Finale" component={Finale} durationInFrames={FINALE_DURATION} {...vertical} />
      </Folder>

      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          logoColor1: "#91dAE2",
          logoColor2: "#86A8E7",
        }}
      />
    </>
  );
};
