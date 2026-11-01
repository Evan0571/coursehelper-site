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
const cameras = {};
for (const [id, name] of [
  ["Organize", "organize"],
  ["Capture", "capture"],
  ["Ask", "ask"],
  ["Review", "review"],
  ["ReviewPortrait", "review-portrait"],
]) {
  const composition = await selectComposition({
    serveUrl: url,
    id,
    browserExecutable:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  if (id !== "ReviewPortrait") {
    cameras[name] = { fps: composition.fps, points: composition.props.focus };
  }
  if (process.env.FILMS && !process.env.FILMS.split(",").includes(id)) continue;
  await renderMedia({
    serveUrl: url,
    composition,
    outputLocation: path.join(output, name + ".mp4"),
    codec: "h264",
    crf: 18,
    pixelFormat: "yuv420p",
    imageFormat: "png",
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
await fs.writeFile(
  path.join(output, "device-camera.json"),
  JSON.stringify(cameras, null, 2),
);
