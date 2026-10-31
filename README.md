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
- `site.js`: Chinese copy, bilingual feature descriptions and sample flashcards, language persistence, keyboard-accessible tabs, and gallery controls. Existing legal/support pages retain their own copy dictionaries.
- `styles.css`: responsive site styling, reduced-motion support, and shared support/legal page presentation.
- `assets/app-icon.png`: optimized current black-and-white iOS icon.
- `assets/screens/v3/`: compressed current sample screenshots. `PROVENANCE.txt` records source build, capture origin, and limitations. Screenshot UI language follows the original capture; switching website copy does not translate image pixels.

The flashcard widget uses explicitly illustrative biology questions and does not call an AI service. Product capabilities are described from the current app. The access CTA points to the existing support page until a verified public download or invitation URL is supplied.

## Product films — October 31 refresh

The feature explorer contains four silent product films: course organization, lecture capture, contextual questions, and active recall. Each film shows a complete native interaction: entering a class and reading its summary, recording and saving audio, asking a question and opening its source, or revealing a flashcard answer. The screen stays steady; a short dissolve returns the loop to its start. There are no playback controls, progress bars, or chapter selectors; visible films loop automatically. Offscreen/hidden videos pause, and reduced-motion or Save-Data preferences retain still posters.

- `assets/screens/v3/`: current native sample UI, including a populated answer with a source reference, a rich biology summary, complete question/answer states, and a live recording view. The empty AI home, old screenshots, and fixed two-second recording clip are retired from the landing page. See `PROVENANCE.json` for the source of each capture.
- `assets/motion/v3/`: Remotion-rendered films and posters. The recording interface was re-captured with a real elapsed clock and volume measurements from a synthesized example lecture. This is an isolated sample capture, not real-account, physical microphone, or cloud-service verification. `PROVENANCE.md` records this boundary and the selection audit.
- `tools/product-film/`: editable Remotion project, source, dependency lock, and reproducible rendering instructions.
- `assets/vendor/`: self-hosted GSAP and ScrollTrigger. Entrance sequences, section reveals, feature transitions and context connections respect reduced motion. No external script CDN is required.

The mobile SVG icon and Safari flashcard fixes remain in place. Validate both WebKit and Chromium whenever changing card geometry or media behavior.

References: [Remotion official skills](https://github.com/remotion-dev/skills), [GSAP official skills](https://github.com/greensock/gsap-skills), and the previous [Framer](https://mobbin.com/sites/sections/16fc8417-50fc-445e-8cca-e87fc08073ce)/[Airtable](https://mobbin.com/sites/sections/167edd07-5357-4149-ad18-b42cfd3fddeb) Mobbin composition references. No third-party screenshots or videos are redistributed.

## Supporting pages

- [Support](https://coursehelper.app/support.html)
- [Privacy](https://coursehelper.app/privacy.html)
- [Terms](https://coursehelper.app/terms.html)

The legal text and OAuth consent implementation are retained. Publishing continues to use the existing GitHub Pages repository and `CNAME`; this redesign does not add another hosting service.
