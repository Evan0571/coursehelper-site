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
import { TapHints } from "./focus";
import {
  organize,
  capture,
  ask,
  review,
  reviewOverview,
  Film,
  Edit,
} from "./edit-plan";
const mediaStyle = {
  width: "100%",
  height: "100%",
  objectFit: "contain" as const,
};
function NativeFootage({ clip, edits }: { clip: string; edits: Edit[] }) {
  const frame = useCurrentFrame();
  return (
    <Freeze
      frame={Math.round(
        interpolate(
          frame,
          edits.map((e) => e[0]),
          edits.map((e) => e[1]),
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        ),
      )}
    >
      <OffthreadVideo src={staticFile(clip)} muted style={mediaStyle} />
    </Freeze>
  );
}
function LoopReturn({ poster, frames }: { poster: string; frames: number }) {
  const frame = useCurrentFrame();
  return (
    <Img
      src={staticFile(poster)}
      style={{
        ...mediaStyle,
        position: "absolute",
        inset: 0,
        opacity: interpolate(frame, [frames - 18, frames - 1], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    />
  );
}
function ProductFilm({ clip, poster, frames, edits, taps, answerAt }: Film) {
  return (
    <AbsoluteFill style={{ background: "#f6f6f5", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          width: 600,
          height: 1304,
          scale: 2,
          transformOrigin: "top left",
        }}
      >
        {answerAt ? (
          <>
            <Sequence
              durationInFrames={answerAt}
              name="Question — natural typing"
            >
              <NativeFootage clip={clip} edits={edits} />
            </Sequence>
            <Sequence from={answerAt} name="Answer — open source">
              <NativeFootage
                clip="ask-answer.mp4"
                edits={[
                  [0, 0],
                  [104, 104],
                ]}
              />
            </Sequence>
          </>
        ) : (
          <NativeFootage clip={clip} edits={edits} />
        )}
        <TapHints taps={taps} />
        <LoopReturn poster={poster} frames={frames} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
const Root = () => (
  <>
    <Composition
      id="Organize"
      component={ProductFilm}
      width={1200}
      height={2608}
      fps={30}
      durationInFrames={organize.frames}
      defaultProps={organize}
    />
    <Composition
      id="Capture"
      component={ProductFilm}
      width={1200}
      height={2608}
      fps={30}
      durationInFrames={capture.frames}
      defaultProps={capture}
    />
    <Composition
      id="Ask"
      component={ProductFilm}
      width={1200}
      height={2608}
      fps={30}
      durationInFrames={ask.frames}
      defaultProps={ask}
    />
    <Composition
      id="Review"
      component={ProductFilm}
      width={1200}
      height={2608}
      fps={30}
      durationInFrames={review.frames}
      defaultProps={review}
    />
    <Composition
      id="ReviewPortrait"
      component={ProductFilm}
      width={1200}
      height={2608}
      fps={30}
      durationInFrames={reviewOverview.frames}
      defaultProps={reviewOverview}
    />
  </>
);
registerRoot(Root);
