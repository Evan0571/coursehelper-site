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
    [303, 374],
    [350, 374],
  ],
  focus: [
    [0, 1, 300, 652],
    [14, 1.32, 320, 850],
    [25, 1.32, 320, 850],
    [47, 1, 300, 652],
    [68, 1, 300, 652],
    [87, 1.42, 180, 420],
    [148, 1.42, 180, 420],
    [174, 1, 300, 652],
    [350, 1, 300, 652],
  ],
  taps: [
    [19, 370, 870],
    [87, 120, 354],
    [127, 124, 458],
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
    [356, 1.4, 390, 835],
    [388, 1.4, 390, 835],
    [410, 1.4, 300, 720],
    [470, 1.4, 300, 720],
    [504, 1, 300, 652],
    [569, 1, 300, 652],
  ],
  taps: [
    [22, 300, 912],
    [379, 448, 834],
    [463, 300, 716],
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
    [17, 1.62, 270, 1125],
    [98, 1.62, 270, 1125],
    [124, 1, 300, 652],
    [157, 1, 300, 652],
    [180, 1.28, 235, 830],
    [212, 1.28, 235, 830],
    [240, 1.28, 235, 770],
    [270, 1, 300, 652],
    [319, 1, 300, 652],
  ],
  taps: [[202, 120, 1042]],
};
export const review: Film = {
  clip: "review-native.mp4",
  poster: "review-first.webp",
  frames: 195,
  edits: [
    [0, 0],
    [120, 120],
    [194, 120],
  ],
  focus: [
    [0, 1, 300, 652],
    [40, 1, 300, 652],
    [64, 1.38, 300, 950],
    [86, 1.38, 300, 950],
    [108, 1, 300, 652],
    [116, 1, 300, 652],
    [135, 1.22, 300, 580],
    [156, 1.22, 300, 580],
    [175, 1, 300, 652],
    [194, 1, 300, 652],
  ],
  taps: [[78, 300, 1184]],
};
