// Generates the Arabic voiceover for the Souq Jarablus promo with ElevenLabs.
//
//   node scripts/generate-voiceover.mjs --list-voices        list Arabic voices to pick from
//   node scripts/generate-voiceover.mjs --voice <voice_id>   generate public/voiceover/*.mp3
//   node scripts/generate-voiceover.mjs --config src/jarablus/story/voiceover.json --name story
//       uses the voice and model in that file and writes public/voiceover/story/*.mp3 and
//       src/jarablus/story/voiceover.generated.json
//
// Needs ELEVENLABS_API_KEY in the environment. The narration and the frame each line starts on
// live in src/jarablus/voiceover.json. After generating, the clips are listed in
// src/jarablus/voiceover.generated.json, which the video reads, so the next render includes the voice.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const FPS = 30;
const API = "https://api.elevenlabs.io/v1";
const key = process.env.ELEVENLABS_API_KEY;
if (!key) {
  console.error("ELEVENLABS_API_KEY is not set. Add it to the cloud environment's settings, then start a new session.");
  process.exit(1);
}

const arg = (name) => {
  const i = process.argv.indexOf(name);
  return i === -1 ? undefined : process.argv[i + 1];
};

const api = async (path, init = {}) => {
  const res = await fetch(`${API}${path}`, { ...init, headers: { "xi-api-key": key, ...init.headers } });
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} failed: ${res.status} ${await res.text()}`);
  return res;
};

if (process.argv.includes("--list-voices")) {
  const mine = await (await api("/voices")).json();
  console.log("Voices in this account:");
  for (const v of mine.voices) console.log(`  ${v.voice_id}  ${v.name}  ${JSON.stringify(v.labels ?? {})}`);
  const shared = await (await api("/shared-voices?language=ar&page_size=40")).json();
  console.log("\nArabic voices in the ElevenLabs voice library (add one to the account before using it):");
  for (const v of shared.voices) console.log(`  ${v.voice_id}  owner=${v.public_owner_id}  ${v.name}  ${v.gender ?? ""} ${v.accent ?? ""} ${v.use_case ?? ""}  ${v.preview_url ?? ""}`);
  process.exit(0);
}

const configPath = arg("--config") ?? "src/jarablus/voiceover.json";
const name = arg("--name");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const voice = arg("--voice") ?? config.voice ?? process.env.ELEVENLABS_VOICE_ID;
if (!voice) {
  console.error("Pass --voice <voice_id> (see --list-voices).");
  process.exit(1);
}

const model = arg("--model") ?? config.model;
const dir = name ? `voiceover/${name}` : "voiceover";
const outJson = configPath.replace(/voiceover\.json$/, "voiceover.generated.json");
mkdirSync(`public/${dir}`, { recursive: true });

const clips = [];
for (const line of config.lines) {
  const res = await api(`/text-to-speech/${voice}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({ text: line.text, model_id: model }),
  });
  const file = `${dir}/${line.id}.mp3`;
  writeFileSync(`public/${file}`, Buffer.from(await res.arrayBuffer()));
  const seconds = Number(
    execFileSync("npx", ["remotion", "ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", `public/${file}`], { encoding: "utf8" }).trim(),
  );
  clips.push({ id: line.id, file, start: line.start, durationInFrames: Math.ceil(seconds * FPS) });
  console.log(`${line.id}: ${seconds.toFixed(2)}s`);
}

// A clip that runs into the next line's start would talk over it.
clips.forEach((clip, i) => {
  const next = clips[i + 1];
  if (next && clip.start + clip.durationInFrames > next.start) {
    console.warn(`WARNING: ${clip.id} ends at frame ${clip.start + clip.durationInFrames}, after ${next.id} starts at ${next.start}.`);
  }
});

writeFileSync(outJson, JSON.stringify(clips, null, 2) + "\n");
console.log(`Wrote ${outJson}`);
