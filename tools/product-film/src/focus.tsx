import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
// [output frame, scale, source focus x, source focus y]
export type FocusPoint = [number, number, number, number];
export type Tap = [number, number, number];
const smooth = {
  easing: Easing.bezier(0.65, 0, 0.35, 1),
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const clamp = (v: number, low: number, high: number) =>
  Math.max(low, Math.min(v, high));
export function FocusCamera({
  points,
  children,
}: {
  points: FocusPoint[];
  children: React.ReactNode;
}) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        scale: interpolate(
          frame,
          points.map((p) => p[0]),
          points.map((p) => p[1]),
          smooth,
        ),
        translate: `${interpolate(
          frame,
          points.map((p) => p[0]),
          points.map(
            ([, s, x]) => (300 - clamp(x, 300 / s, 600 - 300 / s)) * s,
          ),
          smooth,
        )}px ${interpolate(
          frame,
          points.map((p) => p[0]),
          points.map(
            ([, s, , y]) => (652 - clamp(y, 652 / s, 1304 - 652 / s)) * s,
          ),
          smooth,
        )}px`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
}
export function TapHints({ taps }: { taps: Tap[] }) {
  const frame = useCurrentFrame();
  return (
    <>
      {taps.map(([at, x, y]) => {
        const age = frame - at;
        if (age < 0 || age > 17) return null;
        return (
          <div
            key={at}
            style={{
              position: "absolute",
              left: x - 20,
              top: y - 20,
              width: 40,
              height: 40,
              borderRadius: "50%",
              pointerEvents: "none",
              border: "2px solid rgba(255,255,255,.95)",
              background: "rgba(255,255,255,.12)",
              boxShadow: "0 0 0 1px rgba(20,20,20,.4)",
              opacity: interpolate(age, [0, 3, 17], [0, 0.8, 0]),
              scale: interpolate(age, [0, 17], [0.4, 1.2], {
                easing: Easing.out(Easing.cubic),
              }),
            }}
          />
        );
      })}
    </>
  );
}
