# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Souq Jarablus TikTok promo

A 29-second vertical (1080×1920) promo for the Souq Jarablus app, in Syrian Arabic.

- Render: `npx remotion render JarablusPromo out/jarablus-tiktok.mp4`
- Each scene is in `src/jarablus/scenes/` and also shows up on its own in the Studio under "JarablusPromo-Scenes".
- Fonts (Alexandria, Readex Pro) and the app screenshots are bundled in `public/`, so rendering needs no network.

### Seller and buyer story

`npx remotion render JarablusStory out/jarablus-story.mp4` renders a 27-second story cut to "Arab Nights" (Arabic trap, 120 BPM,
15 frames a beat): a hook of real listings on the beat builds to the drop, where the logo slams in; a seller posts an ad in the app's four steps, it flies onto a drawn map of Jarablus and its countryside
whose villages light up on the music's drop, a buyer finds it and messages on WhatsApp, and it ends on the download button.

### Calm app commercial

`npx remotion render JarablusPremium out/souq-jarablus-premium.mp4` renders a 35-second commercial in six calm scenes,
to "Motivating Mornings" (Mixkit): the hook "كل سوق جرابلس وريفها… صار بمكان واحد", the categories around the phone,
posting an ad on the app's real screens, "بدون وسيط • بدون عمولة", a pin over Jarablus and its villages, and the download call with jarablus.store/app. Text is revealed with a mask and stays at least two seconds.

### Old way versus the app

`npx remotion render JarablusVersus out/souq-jarablus-versus.mp4` renders a 17-second split screen cut to "Arab Nights":
the hook asks "لسا عم تبيع غراضك هيك؟ ولّا هيك؟", then four comparisons on the beat (a paper flyer against posting in
three taps, walking the market against reaching every village, the middleman's cut against 0%, days of waiting
against WhatsApp messages and "انباع!"). On the drop the app pushes the old way off the screen and the logo slams in;
it ends on the download steps and a question for the comments. `JarablusVersusNoMusic` keeps only the sound effects,
so a trending TikTok sound can be added in the app.

### Logo and app short

`npx remotion render JarablusShort out/jarablus-short.mp4` renders a 16-second short cut to the music: the logo builds
piece by piece, the camera dives through the pin into the app, and it ends on "خلّي كل أهل جرابلس وريفها يشوفوا إعلانك"
and a download button. The logo layers come from `python3 scripts/split-logo.py` (run it again after replacing
`public/logo.png`). The light leak needs WebGL, which `remotion.config.ts` provides through SwiftShader.

### Voiceover (ElevenLabs)

Needs `ELEVENLABS_API_KEY` set in the cloud environment's settings (a new session picks it up).

1. `node scripts/generate-voiceover.mjs --list-voices` and pick an Arabic voice (Levantine if available).
2. `node scripts/generate-voiceover.mjs --voice <voice_id>` writes `public/voiceover/*.mp3` and `src/jarablus/voiceover.generated.json`, and warns if a line runs into the next one.
3. Render again; the video plays every clip listed in `voiceover.generated.json` at its start frame.

The narration and the frame each line starts on are in `src/jarablus/voiceover.json`. "جرابلس" is written with
diacritics (جَرَابْلُس) so it is pronounced the local way, "Jarablus".

ElevenLabs' free plan cannot use Voice Library voices, voice design or music through the API; those need a paid plan.

### Music

"What About Action?" from Mixkit (Mixkit License: free for commercial projects, not to be redistributed on its own).
It is not committed; run `sh scripts/fetch-music.sh` before rendering. The music fades in and out and dips under the voiceover.

## Abu Sham real estate ad

`npx remotion render AbuShamPromo out/abusham.mp4` renders a 25-second vertical ad for Abu Sham real estate office
(Jarablus, Station Road), cut to "Golden Storm" (Mixkit, about 128 BPM). It opens on the Earth (NASA Blue Marble, public
domain, projected onto a turning globe in `src/abusham/Hook.tsx`), dives through clouds onto a stylised night view of
Jarablus and drops a pin on the office; on the music's drop the office's mark (redrawn as vector shapes in
`src/abusham/LogoIcon.tsx`) builds. Then three services, a call to list a property for sale, the real storefront,
"مكتب أبو شام للثقة عنوان" and both phone numbers.

## Commands

**Install Dependencies**

```console
npm i
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
