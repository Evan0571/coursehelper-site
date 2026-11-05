# CourseHelper website

The static marketing site for CourseHelper, hosted on GitHub Pages at [coursehelper.app](https://coursehelper.app/).

## Preview

No build step is required to serve the static site:

```sh
python3 preview.py
```

Open `http://127.0.0.1:4173/`. Use `?lang=en` or `?lang=zh` to select a language. An explicit URL parameter takes priority over the saved language, then the browser language is used as the fallback.

The preview server supports byte-range requests so video scrubbing behaves like production hosting.

## October 2026 redesign

The landing page follows the gallery-white, monochrome direction of the [provided Mobbin reference](https://getdesign.md/mobbin/design-md): generous space, large sans-serif headings, pill controls, understated surfaces, and actual product screenshots.

- `index.html`: English baseline copy, screenshot gallery, feature explorer, interactive flashcards, FAQ, and contact links.
- `site.js`: Chinese copy, bilingual feature descriptions and sample flashcards, language persistence, feature links, and gallery controls. Existing legal/support pages retain their own copy dictionaries.
- `styles.css`: responsive site styling, reduced-motion support, and shared support/legal page presentation.
- `assets/app-icon.png`: optimized current black-and-white iOS icon.
- `assets/screens/v3/`: compressed current sample screenshots. `PROVENANCE.txt` records source build, capture origin, and limitations. Screenshot UI language follows the original capture; switching website copy does not translate image pixels.

The flashcard widget uses explicitly illustrative biology questions and does not call an AI service. Product capabilities are described from the current app. The access CTA points to the existing support page until a verified public download or invitation URL is supplied.

## Product films — October 31 refresh

The feature explorer contains four silent product films: course organization, lecture capture, contextual questions, and active recall. Each film shows a complete native interaction: entering a class and reading its summary, recording and saving audio, asking a question and opening its source, or revealing a flashcard answer. The current November 1 camera moves the entire phone and its frame to center the active controls, then restores the full view. The complete screen width stays visible. Scale is limited by the presentation width and available source pixels, including display density. Native footage and posters have been recovered from the original captures at 1200 × 2608. Native question entry takes about 3.2 seconds, with brief reading pauses. There are no playback controls, progress bars, or chapter selectors; visible films loop automatically. Offscreen/hidden videos pause, and reduced-motion or Save-Data preferences retain still posters.

- `assets/screens/v3/`: current native sample UI, including a populated answer with a source reference, a rich biology summary, complete question/answer states, and a live recording view. The empty AI home, old screenshots, and fixed two-second recording clip are retired from the landing page. See `PROVENANCE.json` for the source of each capture.
- `assets/motion/v3/`: Remotion-rendered films and posters. The recording interface was re-captured with a real elapsed clock and volume measurements from a synthesized example lecture. This is an isolated sample capture, not real-account, physical microphone, or cloud-service verification. `PROVENANCE.md` records this boundary and the selection audit.
- `tools/product-film/`: editable Remotion project, source, dependency lock, and reproducible rendering instructions.
- `device-camera.js`: smooth whole-device camera synchronized to each visible film's media clock; reads the exported `assets/motion/v3/device-camera.json` focus targets.
- `assets/vendor/`: self-hosted GSAP and ScrollTrigger. Entrance sequences, section reveals, feature transitions and context connections respect reduced motion. No external script CDN is required.

The mobile SVG icon and Safari flashcard fixes remain in place. Validate both WebKit and Chromium whenever changing card geometry or media behavior.

## Interactive opening preview — November 4

Open `/?lang=zh&experience=spatial` (or `lang=en`) for the opt-in spatial opening. The default URL continues to display the existing homepage. `experience.js` clones an inert HTML template only for the explicit query value; no experiment state is persisted. The preview includes an Original site link that removes this parameter. Its CSS and selectors are isolated in `experience.css`.

The complete phone and native screen rotate together with pointer drag or left/right arrow keys, returning on release or Escape. Ordinary vertical scrolling opens the surrounding course cards, straightens the phone, and advances through the four native feature films. Card selection also switches the film directly. There is no wheel interception, playback chrome, fake live recording or backend connection. Source UI remains English and the example identity is labeled. The existing native feature films below the opening are retained.

The opening uses the self-hosted GSAP/ScrollTrigger distribution. Its November 4 phone revision replaces the stacked CSS shell with an original Three.js mesh: a bevelled metal sidewall, glass bezel, physical side buttons, rear panel and lens barrels. A native 1200 × 2608 VideoTexture is rendered on the display in the same camera as the body. Studio environment lighting changes across the metal as it turns; DOM transforms do not rasterize the display. `tools/spatial-phone/` contains the editable model and pinned build dependencies; `assets/experiences/phone3d.js` is the self-hosted bundle and `assets/vendor/three.LICENSE.txt` records the MIT license. The 3D bundle loads only for the explicit preview and not on an initial reduced-motion or Save-Data visit. The renderer draws on video frames, pose changes, or resizing, and stops drawing offscreen. If WebGL or the module is unavailable, a simple native poster/video frame remains. Reduced motion keeps a still poster and removes scrolling/drag motion; Save-Data avoids video loading. Short windows and missing GSAP retain a normal-flow scene, and JavaScript disabled retains the original page. Hidden and offscreen video pauses. The baseline before this preview is commit `f9250571d4772e1825fcc1a61fd8ea3e3169b73b`, also locally tagged `preview-baseline-20261104-f925057`; remove the preview references and template from `index.html` plus `experience.js`/`experience.css` to retire the experiment without touching the original design.

## Scroll-through features — November 1

The four features are independent articles in the page, replacing the tab switcher. On viewports at least 960px wide and 740px tall, GSAP ScrollTrigger pins the feature stage below the navigation and maps ordinary vertical scrolling to horizontal travel through all four articles. Scrolling past the fourth continues down the page; scrolling back reverses the sequence. There is no wheel-event interception. Each scene fits the viewport and retains its silent native-operation loop; only the current scene's video plays.

Phones, shorter windows, reduced-motion preferences, and browsers without GSAP use four vertically stacked articles. All descriptions and posters are in the HTML, so they remain available without JavaScript. Keyboard focus, gallery links, `#feature-ask` style anchors, and the existing `?feature=ask` query navigate to the corresponding article. Language changes update all four articles together.

References: [Remotion official skills](https://github.com/remotion-dev/skills), [GSAP official skills](https://github.com/greensock/gsap-skills), and the previous [Framer](https://mobbin.com/sites/sections/16fc8417-50fc-445e-8cca-e87fc08073ce)/[Airtable](https://mobbin.com/sites/sections/167edd07-5357-4149-ad18-b42cfd3fddeb) Mobbin composition references. No third-party screenshots or videos are redistributed.

## Supporting pages

- [Support](https://coursehelper.app/support.html)
- [Privacy](https://coursehelper.app/privacy.html)
- [Terms](https://coursehelper.app/terms.html)

The legal text and OAuth consent implementation are retained. Publishing continues to use the existing GitHub Pages repository and `CNAME`; this redesign does not add another hosting service.

## Admin entry

`/admin` (normalized by Pages to `/admin/`) is an unlinked redirect to the independently hosted, protected CourseHelper admin workspace at `https://admin.coursehelper.app/`. The custom hostname is bound to the existing private Site; its CNAME is DNS-only and ownership/SSL validation records are retained. The landing, support and legal pages do not show an admin link. The entry page requests no indexing and forwards only a validated `lang=zh` or `lang=en`; its destination is fixed. Without JavaScript it provides a manual continuation link.

The redirect contains no application credentials or user data. It does not grant access: the destination retains its private-site gate and the administrator account checks. Keeping the address bar on the marketing domain would require an application host or reverse proxy rather than GitHub Pages' static hosting.

## Missing pages

`404.html` uses the shared CourseHelper navigation, type and buttons with bilingual recovery links. Its assets and links use root paths so nested missing URLs work. GitHub Pages serves it with HTTP 404; the local preview server mirrors that behavior. The error page does not expose an admin entry.

## Web icon assets

All page icons and visible brand marks use `/assets/coursehelper-icon-87df7b088471.png`, a content-versioned copy of the current black-and-white artwork. Root `favicon.ico`, `favicon.svg` and `apple-touch-icon.png` cover browser fallback requests. The ICO contains the exact canonical PNG pixels, and legacy icon paths remain available. When artwork changes, publish a new hashed filename and update the page references together.
