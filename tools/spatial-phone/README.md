# Spatial phone

Original procedural phone geometry for the opt-in homepage preview. The sidewall, bevels, buttons, rear panel, camera island and lenses are meshes; the native film is a VideoTexture on the display. No phone model, environment image, or media from the Genius reference is redistributed.

```sh
cd tools/spatial-phone
npm ci
npm run build
```

This writes `assets/experiences/phone3d.js`. Commit the generated module with its source. Three.js is pinned at 0.187.0, esbuild at 0.28.1; the distribution license is `assets/vendor/three.LICENSE.txt`.

The renderer uses a small procedural studio environment and caps the drawing density at 3. It redraws on native video frames, pose changes and resizing; offscreen and hidden stages do not draw. Native films share the same 1200 × 2608 dimensions. Fresh reduced-motion/Save-Data visits skip the module; WebGL/module failures retain the native poster/video frame.
