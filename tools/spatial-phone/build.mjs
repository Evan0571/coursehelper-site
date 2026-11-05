import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
const root = dirname(fileURLToPath(import.meta.url));
await build({
  absWorkingDir: root,
  entryPoints: ["phone3d.js"],
  outfile: resolve(root, "../../assets/experiences/phone3d.js"),
  bundle: true,
  format: "esm",
  target: "es2022",
  minify: true,
  legalComments: "eof",
  banner: {
    js: "/* CourseHelper procedural phone. Three.js MIT license: /assets/vendor/three.LICENSE.txt */",
  },
});
