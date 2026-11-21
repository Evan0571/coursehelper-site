import {bundle} from "@remotion/bundler";
import {renderMedia, selectComposition} from "@remotion/renderer";
import fs from "node:fs/promises";
import path from "node:path";

const root = import.meta.dirname;
const output = path.resolve(process.argv[2] || path.join(root, "../../assets/experiences/media-20261121"));
const serveUrl = await bundle({entryPoint: path.join(root, "src/index.tsx"), publicDir: path.join(root,"public")});
const camera = {};
for (const lang of ["en", "zh"]) {
  camera[lang] = {};
  await fs.mkdir(path.join(output,lang), {recursive:true});
  for (const chapter of ["organize", "capture", "ask", "review"]) {
    const id = `Current-${lang}-${chapter}`;
    const composition = await selectComposition({serveUrl, id});
    await renderMedia({serveUrl, composition, codec:"h264", crf:18, pixelFormat:"yuv420p",
      imageFormat:"png", concurrency:4, outputLocation:path.join(output,lang,chapter+".mp4")});
    camera[lang][chapter] = { fps:composition.fps, points:composition.props.focus };
    console.log("Rendered",id);
  }
}
await fs.writeFile(path.join(output,"device-camera.json"), JSON.stringify(camera)+"\n");
