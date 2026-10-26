# CourseHelper website

The static marketing site for CourseHelper, hosted on GitHub Pages at [coursehelper.app](https://coursehelper.app/).

## Preview

No build step or third-party browser scripts are required:

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
- `assets/screens/v2/`: compressed current Example/demo screenshots. `PROVENANCE.txt` records source build, capture origin, and limitations. Screenshot UI language follows the original capture; switching website copy does not translate image pixels.

The flashcard widget uses explicitly illustrative biology questions and does not call an AI service. Product capabilities are described from the current app. The access CTA points to the existing support page until a verified public download or invitation URL is supplied.

## Product motion

The home gallery contains a short native flashcard preview. In the feature explorer, “Keep the lecture” and “Make it stick” have recorded App walkthroughs with pause/play, replay, keyboard-accessible scrubbing, and three selectable steps. The separate browser flashcard uses a two-sided 3D transition and remains operable by keyboard.

- `motion.js` and `motion.css` are homepage-only. Videos load when visible and stop offscreen or when the document is hidden. A user's pause persists across scrolling. Reduced-motion and Save-Data preferences disable automatic loading/playback; visitors can explicitly play a demo. Video failures retain a poster, and no-JavaScript visitors retain static content.
- `assets/motion/` contains silent H.264 MP4 clips and WebP posters. These are own native iOS simulator recordings with isolated example data, **not real-account, real microphone, or cloud-service verification**. The site labels them “App demo · sample data.” UI pixels remain English when page copy is Chinese. See `assets/motion/PROVENANCE.txt` for source, trims, crops, retiming and limitations.
- Motion references inspected through the connected Mobbin MCP: [Framer feature previews](https://mobbin.com/sites/sections/16fc8417-50fc-445e-8cca-e87fc08073ce), [Airtable feature walkthrough](https://mobbin.com/sites/sections/167edd07-5357-4149-ad18-b42cfd3fddeb), and [Quizlet flashcard flow](https://mobbin.com/flows/6e6d62b6-eadd-492e-86bc-8e893d074802). These informed composition and interaction patterns; no Mobbin screenshots or videos are redistributed.

## Supporting pages

- [Support](https://coursehelper.app/support.html)
- [Privacy](https://coursehelper.app/privacy.html)
- [Terms](https://coursehelper.app/terms.html)

The legal text and OAuth consent implementation are retained. Publishing continues to use the existing GitHub Pages repository and `CNAME`; this redesign does not add another hosting service.
