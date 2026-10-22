# CourseHelper website

The static marketing site for CourseHelper, hosted on GitHub Pages at [coursehelper.app](https://coursehelper.app/).

## Preview

No build step or third-party browser scripts are required:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/`. Use `?lang=en` or `?lang=zh` to select a language. An explicit URL parameter takes priority over the saved language, then the browser language is used as the fallback.

## October 2026 redesign

The landing page follows the gallery-white, monochrome direction of the [provided Mobbin reference](https://getdesign.md/mobbin/design-md): generous space, large sans-serif headings, pill controls, understated surfaces, and actual product screenshots.

- `index.html`: English baseline copy, screenshot gallery, feature explorer, interactive flashcards, FAQ, and contact links.
- `site.js`: Chinese copy, bilingual feature descriptions and sample flashcards, language persistence, keyboard-accessible tabs, and gallery controls. Existing legal/support pages retain their own copy dictionaries.
- `styles.css`: responsive site styling, reduced-motion support, and shared support/legal page presentation.
- `assets/app-icon.png`: optimized current black-and-white iOS icon.
- `assets/screens/v2/`: compressed current Example/demo screenshots. `PROVENANCE.txt` records source build, capture origin, and limitations. Screenshot UI language follows the original capture; switching website copy does not translate image pixels.

The flashcard widget uses explicitly illustrative biology questions and does not call an AI service. Product capabilities are described from the current app. The access CTA points to the existing support page until a verified public download or invitation URL is supplied.

## Supporting pages

- [Support](https://coursehelper.app/support.html)
- [Privacy](https://coursehelper.app/privacy.html)
- [Terms](https://coursehelper.app/terms.html)

The legal text and OAuth consent implementation are retained. Publishing continues to use the existing GitHub Pages repository and `CNAME`; this redesign does not add another hosting service.
