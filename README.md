# CourseHelper website

The static marketing site for CourseHelper, hosted on GitHub Pages at [coursehelper.app](https://coursehelper.app/).

## Preview

No build step is required to serve the static site:

```sh
python3 preview.py
```

Open `http://127.0.0.1:4173/`. Use `?lang=en` or `?lang=zh` to select a language. An explicit URL parameter takes priority over the saved language, then the browser language is used as the fallback.

The preview server supports byte-range requests so video scrubbing behaves like production hosting.

## iPhone launch landing page

The homepage shows an email signup, one localized three-scene app demo, a lecture-source example, and launch FAQs. `launch.css` and `launch.js` drive the homepage. `site.js` handles language selection across the public pages. The older gallery, spatial prototype, and film tooling are not loaded by this page.

The six silent H.264 videos and corresponding WebP posters in `assets/launch-demo/` were recorded on November 19, 2026 from the current local SwiftUI sources (based on App commit `4dc812e`) in an iPhone 18 Pro simulator running iOS 27. Both languages use the app’s built-in sample courses. The three scenes open the calendar, switch a class summary to its timestamped transcript, and reveal and advance a flashcard. The desk background is a generated image. The social card combines this background and an actual lecture screenshot.

The visible scene plays once. People can switch scenes, pause, replay, or enlarge the same screen. Reduced-motion and data-saver visits start with a still poster. Offscreen videos pause. The sample Q&A uses a static illustrative transcript.

The form submits to the public `coursehelper_waitlist` Edge Function in the CourseHelper Supabase project. It records email, language, source, and consent. An Instagram bio link can use `https://coursehelper.app/?utm_source=instagram`. Launch mailing is a separate operation. The function and migration are versioned in the App repository.

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
