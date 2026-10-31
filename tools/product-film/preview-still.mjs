import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const root = import.meta.dirname;
const serveUrl = await bundle({
  entryPoint: path.join(root, "src/index.tsx"),
  publicDir: path.join(root, "public"),
});
const composition = await selectComposition({
  serveUrl,
  id: "Ask",
  browserExecutable:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
await renderStill({
  serveUrl,
  composition,
  output:
    process.argv[2] || path.join(root, "preview.png"),
  frame: 75,
  browserExecutable:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
