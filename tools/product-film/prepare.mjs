import fs from "node:fs/promises";
import path from "node:path";
const root = import.meta.dirname,
  website = path.resolve(root, "../..");
await fs.mkdir(path.join(root, "public"), { recursive: true });
for (const name of [
  "organize-native.mp4",
  "capture-complete.mp4",
  "ask-typing.mp4",
  "ask-answer.mp4",
  "review-native.mp4",
  "organize-first.webp",
  "capture-first.webp",
  "ask-first.webp",
  "review-first.webp",
])
  await fs.copyFile(
    path.join(website, "assets/motion/v3/inputs", name),
    path.join(root, "public", name),
  );
