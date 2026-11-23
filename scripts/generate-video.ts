/**
 * Regenerates the gym promo video with a complete, professional
 * deadlift action — no static repeats, no odd splash artifacts.
 *
 * Two kill-resistant steps (sandbox may terminate long processes):
 *   bun run scripts/generate-video.ts create  -> starts task, saves its id
 *   bun run scripts/generate-video.ts poll    -> one status query; downloads on SUCCESS
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync, renameSync } from "node:fs";
import path from "node:path";
import ZAI from "z-ai-web-dev-sdk";

const OUT_DIR = path.join(process.cwd(), "tool-results");
const OUT_FILE = path.join(OUT_DIR, "gym-promo-new.mp4");
const ID_FILE = path.join(OUT_DIR, "video-task-id.txt");
const POSTER = path.join(process.cwd(), "public", "videos", "gym-promo-poster.jpg");

const PROMPT = [
  "Cinematic fitness commercial, single continuous shot.",
  "The athlete steps to the barbell, grips it with both hands,",
  "and performs one powerful deadlift: pulling the bar from the",
  "floor up to a tall standing lockout at his waist, shoulders back,",
  "strong and confident, holding the top position.",
  "Realistic anatomy, consistent proportions, plates stay intact.",
  "Slow-motion energy, camera slowly pushes in. No text, no logos.",
].join(" ");

async function create() {
  mkdirSync(OUT_DIR, { recursive: true });
  console.log("Creating video generation task (image-to-video from poster)...");
  const posterB64 = readFileSync(POSTER).toString("base64");
  const zai = await ZAI.create();
  const task = await zai.video.generations.create({
    prompt: PROMPT,
    image_url: `data:image/jpeg;base64,${posterB64}`,
    quality: "quality",
    with_audio: false,
    watermark_enabled: false,
    size: "1920x1080",
    fps: 30,
    duration: 10,
  });
  writeFileSync(ID_FILE, task.id);
  console.log("Task created:", task.id, task.task_status);
}

async function poll() {
  if (!existsSync(ID_FILE)) {
    console.error("No task id file. Run 'create' first.");
    process.exit(1);
  }
  const id = readFileSync(ID_FILE, "utf8").trim();
  const zai = await ZAI.create();
  const result = await zai.async.result.query(id);
  console.log("status:", result.task_status);
  if (result.task_status !== "SUCCESS") process.exit(0);

  const url = result.video_result?.[0]?.url ?? result.video_url ?? result.url;
  if (!url) {
    console.error("No video URL in result:", JSON.stringify(result));
    process.exit(1);
  }
  console.log("Downloading...");
  const res = await fetch(url);
  if (!res.ok) {
    console.error("Download failed:", res.status);
    process.exit(1);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(OUT_FILE, buf);
  console.log("Saved:", OUT_FILE, `${(buf.length / 1024 / 1024).toFixed(1)} MB`);
}

const step = process.argv[2];
if (step === "create") await create();
else if (step === "poll") await poll();
else {
  console.error("Usage: bun run scripts/generate-video.ts create|poll");
  process.exit(1);
}
