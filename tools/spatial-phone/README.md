# Spatial phone

Original procedural phone geometry for the homepage opening. The sidewall, bevels, buttons, rear panel, camera island and lenses are meshes; the display uses the selected app screenshot as its texture. No phone model, environment image, or media from the Genius reference is redistributed.

```sh
cd tools/spatial-phone
npm ci
npm run build
```

This writes `assets/experiences/phone3d.js`. Commit the generated module with its source. Three.js is pinned at 0.187.0, esbuild at 0.28.1; the distribution license is `assets/vendor/three.LICENSE.txt`.

The renderer uses a small procedural studio environment. Gallery drawing density is capped at 3. The close-up allocates a larger buffer when needed, up to the native screenshot resolution. Visible stages redraw on screenshot changes, pose changes and resizing. Fresh reduced-motion and Save-Data visits skip the module. The native poster also serves as the fallback when WebGL is unavailable.
