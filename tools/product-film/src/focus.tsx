import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
// Exported for the website's whole-device camera. The native video stays uncropped.
// [output frame, scale, source focus x, source focus y], in 600 × 1304 coordinates.
export type FocusPoint = [number, number, number, number];
export type Tap = [number, number, number];
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
