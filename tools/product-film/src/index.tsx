import React from "react";
import {
  registerRoot,
  Composition,
  Sequence,
  AbsoluteFill,
  OffthreadVideo,
  Img,
  Freeze,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
type Props = {
  clip: string;
  poster: string;
  frames: number;
  sourceFrames: number;
};
function NativeAction({ clip, poster, frames, sourceFrames }: Props) {
  const frame = useCurrentFrame();
  const returnToStart = interpolate(frame, [frames - 18, frames - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ background: "#f6f6f5" }}>
      <Freeze frame={Math.min(frame, sourceFrames - 1)}>
        <OffthreadVideo
          src={staticFile(clip)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Freeze>
      <Img
        src={staticFile(poster)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: returnToStart,
        }}
      />
    </AbsoluteFill>
  );
}
function AnswerScene() {
  const f = useCurrentFrame();
  return (
    <Freeze frame={Math.min(f, 104)}>
      <OffthreadVideo
        src={staticFile("ask-answer.mp4")}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </Freeze>
  );
}
function AskAction() {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#f6f6f5" }}>
      <Sequence durationInFrames={243}>
        <OffthreadVideo
          src={staticFile("ask-typing.mp4")}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Sequence>
      <Sequence from={243}>
        <AnswerScene />
      </Sequence>
      <Img
        src={staticFile("ask-first.webp")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: interpolate(f, [360, 377], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
}
const Root = () => (
  <>
    <Composition
      id="Organize"
      component={NativeAction}
      width={600}
      height={1304}
      fps={30}
      durationInFrames={405}
      defaultProps={{
        clip: "organize-native.mp4",
        poster: "organize-first.webp",
        frames: 405,
        sourceFrames: 375,
      }}
    />
    <Composition
      id="Capture"
      component={NativeAction}
      width={600}
      height={1304}
      fps={30}
      durationInFrames={570}
      defaultProps={{
        clip: "capture-complete.mp4",
        poster: "capture-first.webp",
        frames: 570,
        sourceFrames: 542,
      }}
    />
    <Composition
      id="Ask"
      component={AskAction}
      width={600}
      height={1304}
      fps={30}
      durationInFrames={378}
    />
    <Composition
      id="Review"
      component={NativeAction}
      width={600}
      height={1304}
      fps={30}
      durationInFrames={181}
      defaultProps={{
        clip: "review-native.mp4",
        poster: "review-first.webp",
        frames: 181,
        sourceFrames: 121,
      }}
    />
    <Composition
      id="ReviewPortrait"
      component={NativeAction}
      width={600}
      height={1304}
      fps={30}
      durationInFrames={181}
      defaultProps={{
        clip: "review-native.mp4",
        poster: "review-first.webp",
        frames: 181,
        sourceFrames: 121,
      }}
    />
  </>
);
registerRoot(Root);
