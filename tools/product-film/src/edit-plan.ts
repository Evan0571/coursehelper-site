import { FocusPoint, Tap } from "./focus";
export type Edit = [number, number];
export type Film = {
  clip: string;
  poster: string;
  frames: number;
  edits: Edit[];
  focus: FocusPoint[];
  taps: Tap[];
  answerAt?: number;
};
export const organize: Film = {
  clip: "organize-native.mp4",
  poster: "organize-first.webp",
  frames: 351,
  edits: [
    [0, 0],
    [18, 0],
    [48, 30],
    [132, 150],
    [198, 270],
    [303, 360],
    [350, 360],
  ],
  focus: [
    [0, 1, 300, 652],
    [14, 1.32, 360, 870],
    [25, 1.32, 360, 870],
    [47, 1, 300, 652],
    [68, 1, 300, 652],
    [87, 1.42, 200, 374],
    [148, 1.42, 200, 374],
    [174, 1, 300, 652],
    [350, 1, 300, 652],
  ],
  taps: [
    [19, 370, 870],
    [87, 120, 354],
    [127, 124, 374],
  ],
};
export const capture: Film = {
  clip: "capture-complete.mp4",
  poster: "capture-first.webp",
  frames: 600,
  edits: [
    [0, 0],
    [541, 541],
    [599, 541],
  ],
  focus: [
    [0, 1, 300, 652],
    [13, 1.36, 300, 910],
    [25, 1.36, 300, 910],
    [47, 1, 300, 652],
    [85, 1, 300, 652],
    [108, 1.28, 300, 650],
    [192, 1.28, 300, 650],
    [218, 1, 300, 652],
    [333, 1, 300, 652],
    [356, 1.4, 440, 835],
    [388, 1.4, 440, 835],
    [410, 1.4, 300, 660],
    [470, 1.4, 300, 660],
    [504, 1, 300, 652],
    [569, 1, 300, 652],
  ],
  taps: [
    [22, 300, 912],
    [379, 448, 834],
    [463, 300, 660],
  ],
};
export const ask: Film = {
  clip: "ask-typing.mp4",
  poster: "ask-first.webp",
  frames: 320,
  answerAt: 126,
  // Preserve native character changes; retime the 8.1s source to 3.2s, with brief endpoint pauses.
  edits: [
    [0, 0],
    [10, 0],
    [105, 242],
    [125, 242],
  ],
  focus: [
    [0, 1, 300, 652],
    [22, 1.55, 300, 1170],
    [105, 1.55, 300, 1170],
    [124, 1, 300, 652],
    [157, 1, 300, 652],
    [180, 1.4, 300, 958],
    [212, 1.4, 300, 958],
    [240, 1.4, 300, 830],
    [270, 1, 300, 652],
    [319, 1, 300, 652],
  ],
  taps: [[202, 120, 958]],
};
export const review: Film = {
  clip: "review-native.mp4",
  poster: "review-first.webp",
  frames: 213,
  edits: [
    [0, 0],
    [78, 78],
    [96, 78],
    [138, 120],
    [212, 120],
  ],
  focus: [
    [0, 1, 300, 652],
    [40, 1, 300, 652],
    [64, 1.38, 300, 1184],
    [78, 1.38, 300, 1184],
    [99, 1, 300, 652],
    [134, 1, 300, 652],
    [156, 1.22, 300, 580],
    [177, 1.22, 300, 580],
    [194, 1, 300, 652],
    [212, 1, 300, 652],
  ],
  taps: [[78, 300, 1184]],
};
export const reviewOverview: Film = {
  ...review,
  frames: 195,
  edits: [
    [0, 0],
    [120, 120],
    [194, 120],
  ],
};
