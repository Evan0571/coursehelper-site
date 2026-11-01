# Product films

These are edited feature demonstrations using current native App captures with safe sample data. They are silent by design. The source remains editable in Remotion Studio.

    npm ci
    node prepare.mjs
    npm run studio
    npm run render

Render outputs go to ../../assets/motion/v3/. Convert the PNG posters to WebP after rendering. Films use native operation footage with original iOS transitions, natural reading pauses and an 18-frame loop dissolve. Browser page animation is handled separately by self-hosted GSAP/ScrollTrigger.

The current export preserves the entire native screen at 1200 × 2608. The inputs in `assets/motion/v3/inputs/hd/` were recovered from the original 1206 × 2622 captures; they are not enlarged 600px exports. PNG intermediate frames and H.264 CRF18 protect text detail. The input manifest records trims, source hashes and timestamp normalization. The capture input needs broken DTS values ignored; its presentation timestamps retain the original clock and meter speed.

`src/edit-plan.ts` contains source-frame timing, focus targets and tap locations. `src/focus.tsx` draws brief neutral tap hints, while the exported MP4s retain the full screen. `render.mjs` also writes `assets/motion/v3/device-camera.json` from the same composition props. The website's `device-camera.js` uses the media clock to move and scale the complete CSS phone, including its frame. It centers the active region within the surrounding presentation stage, limits scale to the available width and source pixel budget, and smoothly restores the full view. The website preview at port 4173 shows the combined camera treatment; Studio shows the native film edit.

Native question entry still takes about 3.2 seconds, with short pauses. The complete review flip retains native speed, with a brief hold before it so the camera can restore the full view. Each loop returns to 1x before the dissolve. These are edits to native operation footage, with no recreated app UI or floating screenshot cards. Run `npm run check` before rendering.

The capture input uses a freshly recorded native simulator interface. Its live timer and meter are driven by a synthesized sample lecture's measured RMS trace in an isolated capture build. This is sample UI/audio, not physical-microphone, real-account, or cloud-service acceptance. See ../../assets/screens/v3/PROVENANCE.json and ../../assets/motion/v3/PROVENANCE.md.
