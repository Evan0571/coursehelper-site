import { bundle } from "@remotion/bundler";
import {
  renderMedia,
  renderStill,
  selectComposition,
} from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs/promises";
const root = import.meta.dirname;
const output = path.resolve(root, "../../assets/motion/v3");
await fs.mkdir(output, { recursive: true });
const url = await bundle({
  entryPoint: path.join(root, "src/index.tsx"),
  publicDir: path.join(root, "public"),
});
for (const [id, name] of [
  ["Organize", "organize"],
  ["Capture", "capture"],
  ["Ask", "ask"],
  ["Review", "review"],
  ["ReviewPortrait", "review-portrait"],
]) {
  if (process.env.FILMS && !process.env.FILMS.split(",").includes(id)) continue;
  const composition = await selectComposition({
    serveUrl: url,
    id,
    browserExecutable:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  await renderMedia({
    serveUrl: url,
    composition,
    outputLocation: path.join(output, name + ".mp4"),
    codec: "h264",
    crf: 21,
    pixelFormat: "yuv420p",
    concurrency: 4,
    browserExecutable:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    chromiumOptions: { gl: "angle" },
  });
  await renderStill({
    serveUrl: url,
    composition,
    output: path.join(output, name + "-poster.png"),
    frame: 0,
    browserExecutable:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  console.log("Rendered", name);
}
