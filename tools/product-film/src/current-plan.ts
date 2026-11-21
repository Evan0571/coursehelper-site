import type { Film } from "./edit-plan";
import type { FocusPoint, Tap } from "./focus";

type Chapter = "organize" | "capture" | "ask" | "review";
type Locale = "en" | "zh";
const frameCounts = {
  en: { organize: 199, capture: 274, ask: 356, review: 203 },
  zh: { organize: 200, capture: 290, ask: 360, review: 225 },
};

// Times are measured from the first frame of each localized simulator take.
export function currentFilm(lang: Locale, chapter: Chapter): Film {
  const frames = frameCounts[lang][chapter];
  const wide = (frame: number): FocusPoint => [frame, 1, 300, 652];
  let focus: FocusPoint[], taps: Tap[];
  switch (chapter) {
    case "organize":
      focus = [wide(0), wide(16), [46,1.52,322,859], [61,1.52,322,859],
        [94,1.37,290,573], [121,1.49,264,593], [155,1.49,264,593], wide(181)];
      taps = [[52,300,856]];
      break;
    case "capture":
      focus = [wide(0), wide(20), [57,1.48,224,651], [82,1.48,224,651],
        [112,1.46,243,519], [151,1.46,243,519], [177,1.52,307,848],
        [205,1.48,280,655], [229,1.48,280,655], wide(frames-19)];
      taps = [[74,336,1030], [169,336,1043]];
      break;
    case "ask": {
      const send = lang === "zh" ? 54 : 51;
      const source = lang === "zh" ? 162 : 159;
      const original = lang === "zh" ? 270 : 265;
      const x = lang === "zh" ? 117 : 149, y = lang === "zh" ? 675 : 716;
      focus = [wide(0), [30,1.53,391,748], [send+4,1.53,391,748], wide(85),
        [source-11,1.56,x+40,y-15], [source+4,1.56,x+40,y-15],
        [source+32,1.44,248,891], [original-15,1.51,195,947],
        [original+4,1.51,195,947], [original+30,1.44,242,532],
        [frames-42,1.44,242,532], wide(frames-19)];
      taps = [[send,519,750], [source,x,y], [original,140,947]];
      break;
    }
    case "review": {
      const next = lang === "zh" ? 174 : 153;
      focus = [wide(0), wide(30), [68,1.55,300,1182], [83,1.55,300,1182],
        [104,1.43,272,788], [next-30,1.43,272,788],
        [next-6,1.47,300,1180], [next+3,1.47,300,1180], wide(frames-19)];
      taps = [[78,300,1184], [next,300,1184]];
    }
  }
  return { clip: `current/${lang}/${chapter}.mp4`, poster: `current/${lang}/${chapter}.webp`,
    frames, edits: [[0,0],[frames-1,frames-1]], focus: [...focus,wide(frames-1)], taps };
}
export const locales = ["en", "zh"] as const;
export const chapters = ["organize", "capture", "ask", "review"] as const;
