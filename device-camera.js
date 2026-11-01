/* The camera moves the complete CSS phone, including its frame and native video. */
(() => {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const manifest = fetch(
    "assets/motion/v3/device-camera.json?v=20261101-device",
  )
    .then((response) => {
      if (!response.ok) throw new Error("Camera unavailable");
      return response.json();
    })
    .catch(() => ({}));
  const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
  const ease = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  document
    .querySelectorAll(".feature-panel .feature-movie")
    .forEach((video) => {
      const phone = video.closest(".motion-film");
      const stage = video.closest(".motion-demo");
      const key = video.closest(".feature-panel").dataset.current;
      let plan,
        raf = 0,
        geometry;
      function updateGeometry() {
        geometry = {
          width: phone.clientWidth,
          height: phone.clientHeight,
          stageWidth: stage.clientWidth,
        };
        render();
      }
      function render() {
        if (!plan || !geometry || reduce.matches || video.error) {
          phone.style.removeProperty("transform");
          return;
        }
        const frame = video.currentTime * plan.fps;
        const points = plan.points;
        let i = 0;
        while (i < points.length - 2 && frame > points[i + 1][0]) i++;
        const a = points[i],
          b = points[i + 1];
        const t = ease(clamp((frame - a[0]) / (b[0] - a[0]), 0, 1));
        const { width, height, stageWidth } = geometry;
        // Keep the entire phone width visible, and avoid magnifying past source detail.
        const widthLimit = (stageWidth - 32) / (width + 12);
        const pixelLimit = video.videoWidth
          ? video.videoWidth / (width * devicePixelRatio)
          : Infinity;
        function pose([, zoom, centerX, centerY]) {
          const scale = Math.max(1, Math.min(zoom, widthLimit, pixelLimit));
          const roomX = Math.max(
            0,
            (stageWidth - (width + 12) * scale) / 2 - 16,
          );
          return {
            scale,
            x: clamp((((300 - centerX) * width) / 600) * scale, -roomX, roomX),
            y: (((652 - centerY) * height) / 1304) * scale,
          };
        }
        // Ease between safe poses, so width limits never introduce a sudden stop or sway.
        const start = pose(a),
          end = pose(b);
        const scale = start.scale + (end.scale - start.scale) * t;
        const x = start.x + (end.x - start.x) * t;
        const y = start.y + (end.y - start.y) * t;
        phone.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      }
      function tick() {
        raf = 0;
        render();
        if (!video.paused && !document.hidden && !reduce.matches)
          raf = requestAnimationFrame(tick);
      }
      function sync() {
        cancelAnimationFrame(raf);
        raf = 0;
        render();
        if (!video.paused && !document.hidden && !reduce.matches)
          raf = requestAnimationFrame(tick);
      }
      new ResizeObserver(updateGeometry).observe(stage);
      for (const event of [
        "play",
        "pause",
        "seeked",
        "loadedmetadata",
        "emptied",
        "error",
      ])
        video.addEventListener(event, sync);
      reduce.addEventListener("change", sync);
      document.addEventListener("visibilitychange", sync);
      manifest.then((plans) => {
        plan = plans[key];
        updateGeometry();
        sync();
      });
    });
})();
