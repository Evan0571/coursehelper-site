# Product films, 2026-10-31

## November 1 focus edit

The current MP4s retain the native sources below. The new Remotion edit uses smooth, action-linked camera crops (1.22–1.62x), then restores the full view after each operation. Brief neutral tap rings mark the class row, Summary selector, Start/Finish/Save controls, Sources disclosure, and Reveal answer. Camera movement and tap hints share source coordinates. The crop is constrained to the captured image so it never reveals an empty edge.

The question's original 243-frame native typing sequence is retimed to 95 output frames (3.17s), with short initial and completion pauses. No letters or app UI are recreated. The answer/source sequence stays at native speed, as do the capture timer/audio meter and the complete card flip. The organization edit shortens idle reading time. Every camera returns to 1x before the loop dissolve. Final durations at 30fps: organize 351 frames (11.7s), capture 600 (20s), ask 320 (10.67s), review and hero 195 (6.5s).

These remain edited simulator/sample demonstrations within the source boundary below.

## Original source collection

The five videos are authored in the Remotion project at `tools/product-film/`.
The October 31 revision followed preview feedback to show native actions and remove screenshot camera moves and floating callouts. At that stage the camera stayed stationary. All four feature clips use native operation footage; a short reading hold and an 18-frame dissolve return each loop to its start. The hero uses the complete native card flip. The November 1 edit above adds focus moves to this footage.

Sources are in `assets/screens/v3/PROVENANCE.json`. Native captures were collected on 2026-10-31 from an isolated copy of the current iPhone source. No production App source or user data was changed.

The recording interface was recaptured with a real elapsed clock. Meter input comes from measured 50ms RMS windows of a local synthesized biology lecture (`lesson.aiff`), with 377 distinct rounded dBFS values across 445 windows. This replaces the former fixed 2-second clock and six repeating test levels. It is an example-audio-driven native interface recording, not a physical microphone recording or service validation. The site labels all these films as sample content.

Native input clips under `inputs/`, all 600x1304, 30fps, silent:

- organize-native.mp4: `summary-actions-final.mp4`, 375 frames / 12.5s; course list → class → Summary menu → rich summary → native reading scroll. Final source decoded interval is native-summary-actions.mp4 34.5–47.4s, verified against decoded frames (not metadata creation timestamps).
- ask-typing.mp4 and ask-answer.mp4: `ai-typing-clean.mp4` (243 frames) + `ai-answer-sources-clean.mp4` (105 frames). English question appears character by character, then cuts to the answer and native Sources expansion. All keyboard appearances and the intervening send moment were removed. This is an edited, keyboard-free walkthrough, not an uncut on-screen-keyboard recording. The English capture uses an ASCII-capable composer and en-US; source files were checked every 7 frames and at their endpoints.
- capture-complete.mp4: 19s from native-capture.mp4 175–194s; Start → advancing timer/audio meter → Finish → Save confirmation → saved recording.
- review-native.mp4: 121 frames / 4.033s from review-actions-final.mp4, verified against decoded native-capture frames; question → complete native turn → stable answer.

All source originals and capture markers are retained in `outputs/site-showcase-20261031/`. The first-frame WebP files are derived from each final clip for reproducible loop dissolves.

Selection audit:

- Retire the empty AI home: replace with a populated native answer and a Sources entry.
- Retire the old generic course image: show three current sample classes.
- Retire short/placeholder summaries: show a complete, internally consistent enzyme summary with concepts and emphasis.
- Retire the old review test clip: use the new complete native flip, including stable answer time.
- Retire “Legacy” review names: show a normal study guide, quiz and flashcard library.
- Retire the fixed timer/waveform recording: use new sampled-speech meter footage.
- Remove player bars, elapsed time, replay controls and chapters. Native videos loop while visible; reduced-motion and data-saving visitors receive posters.

Rendered MP4s are H.264, 8-bit 4:2:0, 30fps, CRF21, silent. UI pixels are English; surrounding website copy is bilingual. No third-party UI media is redistributed.
