import "./index.css";
import { AbuShamPromo } from "./abusham/AbuShamPromo";
import { PROMO_DURATION as ABUSHAM_DURATION } from "./abusham/theme";
import { CONTACT_STING_DURATION, ContactSting, LOGO_STING_DURATION, LogoSting } from "./abusham/Stings";
import { Composition, Folder, Still } from "remotion";
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
import { JarablusStory } from "./jarablus/story/JarablusStory";
import { STORY_DURATION } from "./jarablus/story/timing";
import { GROUP_DURATION, GroupStory } from "./jarablus/group/GroupStory";
import { JarablusOrigin } from "./jarablus/origin/Origin";
import { ORIGIN_DURATION } from "./jarablus/origin/timing";
import { VillagesPoster } from "./jarablus/premium/Poster";
import { JarablusPremium, PREMIUM_DURATION } from "./jarablus/premium/Premium";
import { JarablusVersus } from "./jarablus/versus/JarablusVersus";
import { VERSUS_DURATION } from "./jarablus/versus/timing";
import { FPS, HEIGHT, WIDTH } from "./jarablus/theme";

const vertical = { fps: FPS, width: WIDTH, height: HEIGHT };

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Abu Sham real estate office ad: npx remotion render AbuShamPromo */}
      <Composition id="AbuShamPromo" component={AbuShamPromo} durationInFrames={ABUSHAM_DURATION} {...vertical} />
      {/* Short clips for the office's own edits; pass --props='{"bg":"green"}' or '{"bg":"none"}' for other backgrounds. */}
      <Composition id="AbuShamLogoSting" component={LogoSting} durationInFrames={LOGO_STING_DURATION} defaultProps={{ bg: "brand" as const }} {...vertical} />
      <Composition id="AbuShamContactSting" component={ContactSting} durationInFrames={CONTACT_STING_DURATION} defaultProps={{ bg: "brand" as const }} {...vertical} />

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

      {/* 21-second story: a post lost in a buy-and-sell group, then sold through the app. */}
      <Composition id="JarablusGroupStory" component={GroupStory} durationInFrames={GROUP_DURATION} {...vertical} />

      {/* 39-second origin story on the real map of Jarablus District, told by the app's narration. */}
      <Composition id="JarablusOrigin" component={JarablusOrigin} durationInFrames={ORIGIN_DURATION} defaultProps={{ music: true }} {...vertical} />
      <Composition id="JarablusOriginNoMusic" component={JarablusOrigin} durationInFrames={ORIGIN_DURATION} defaultProps={{ music: false }} {...vertical} />

      {/* 35-second calm app commercial: npx remotion render JarablusPremium */}
      <Composition id="JarablusPremium" component={JarablusPremium} durationInFrames={PREMIUM_DURATION} {...vertical} />
      <Still id="JarablusVillagesPoster" component={VillagesPoster} width={WIDTH} height={HEIGHT} />

      {/* 17-second "old way versus the app" split screen: npx remotion render JarablusVersus */}
      <Composition id="JarablusVersus" component={JarablusVersus} durationInFrames={VERSUS_DURATION} defaultProps={{ music: true }} {...vertical} />
      <Composition id="JarablusVersusNoMusic" component={JarablusVersus} durationInFrames={VERSUS_DURATION} defaultProps={{ music: false }} {...vertical} />

      {/* 30-second seller-and-buyer story, cut to the music: npx remotion render JarablusStory */}
      <Composition id="JarablusStory" component={JarablusStory} durationInFrames={STORY_DURATION} defaultProps={{ hook: "questions", voice: false }} {...vertical} />
      <Composition id="JarablusStoryCommission" component={JarablusStory} durationInFrames={STORY_DURATION} defaultProps={{ hook: "commission", voice: false }} {...vertical} />
      <Composition id="JarablusStoryItems" component={JarablusStory} durationInFrames={STORY_DURATION} defaultProps={{ hook: "items", voice: false }} {...vertical} />
      <Composition id="JarablusStoryVoice" component={JarablusStory} durationInFrames={STORY_DURATION} defaultProps={{ hook: "questions", voice: true }} {...vertical} />

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
