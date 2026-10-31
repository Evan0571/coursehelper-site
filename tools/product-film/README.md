# Product films

These are edited feature demonstrations using current native App captures with safe sample data. They are silent by design. The source remains editable in Remotion Studio.

    npm ci
    node prepare.mjs
    npm run studio
    npm run render

Render outputs go to ../../assets/motion/v3/. Convert the PNG posters to WebP after rendering. Films use native operation footage with original iOS transitions, natural reading pauses and an 18-frame loop dissolve. Screenshot camera moves and floating excerpt cards were removed after preview feedback. Browser page animation is handled separately by self-hosted GSAP/ScrollTrigger.

The capture input uses a freshly recorded native simulator interface. Its live timer and meter are driven by a synthesized sample lecture's measured RMS trace in an isolated capture build. This is sample UI/audio, not physical-microphone, real-account, or cloud-service acceptance. See ../../assets/screens/v3/PROVENANCE.json and ../../assets/motion/v3/PROVENANCE.md.
