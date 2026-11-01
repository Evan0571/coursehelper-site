# Product films

These are edited feature demonstrations using current native App captures with safe sample data. They are silent by design. The source remains editable in Remotion Studio.

    npm ci
    node prepare.mjs
    npm run studio
    npm run render

Render outputs go to ../../assets/motion/v3/. Convert the PNG posters to WebP after rendering. Films use native operation footage with original iOS transitions, natural reading pauses and an 18-frame loop dissolve. Browser page animation is handled separately by self-hosted GSAP/ScrollTrigger.

The November 1 edit adds action-linked camera focus and restrained tap hints to the native footage. `src/edit-plan.ts` contains source-frame timing, camera keyframes and tap locations. `src/focus.tsx` keeps the camera crop inside the source, eases each move, and draws brief neutral tap rings in the same coordinates as the footage. Each loop returns to its full view before the dissolve. Native typing now runs through its character changes in about 3.2 seconds, with short pauses around the completed question; the recording clock and audio meter retain their original speed. These are edits to real operation footage, with no recreated app UI or floating screenshot cards. Run `npm run check` before rendering.

The capture input uses a freshly recorded native simulator interface. Its live timer and meter are driven by a synthesized sample lecture's measured RMS trace in an isolated capture build. This is sample UI/audio, not physical-microphone, real-account, or cloud-service acceptance. See ../../assets/screens/v3/PROVENANCE.json and ../../assets/motion/v3/PROVENANCE.md.
