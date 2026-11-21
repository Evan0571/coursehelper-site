/* The camera moves the complete CSS phone, including its frame and native video. */
(() => {
  "use strict";
  const handheld = () => document.documentElement.classList.contains("handheld");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const manifest = fetch(
    "assets/experiences/media-20261121/device-camera.json?v=focus-2",
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
      let plans,
        raf = 0,
        geometry;
      function updateGeometry() {
        geometry = {
          width: phone.clientWidth,
          height: phone.clientHeight,
          stageWidth: stage.clientWidth,
          stageHeight: stage.clientHeight,
        };
        render();
      }
      function render() {
        const locale = document.documentElement.lang.startsWith("zh") ? "zh" : "en";
        const plan = plans?.[locale]?.[key];
        if (handheld() || !plan || !geometry || reduce.matches || navigator.connection?.saveData || video.error) {
          phone.style.removeProperty("transform");
          return;
        }
        const progress = video.currentTime * plan.fps;
        const points = plan.points;
        let i = 0;
        while (i < points.length - 2 && progress > points[i + 1][0]) i++;
        const a = points[i],
          b = points[i + 1];
        const t = ease(clamp((progress - a[0]) / (b[0] - a[0]), 0, 1));
        const { width, height, stageWidth, stageHeight } = geometry;
        function pose([, scale, centerX, centerY]) {
          // Cropping the outer bezel is intentional. Keep the control in the frame even on a narrow phone.
          const roomX = Math.max(16, Math.abs(stageWidth - (width + 12) * scale) / 2 - 10);
          const roomY = Math.max(0, (height * scale - height) / 2 + stageHeight * 0.16);
          return {
            scale,
            x: clamp((((300 - centerX) * width) / 600) * scale, -roomX, roomX),
            y: clamp((((652 - centerY) * height) / 1304) * scale, -roomY, roomY),
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
        if (!handheld() && !video.paused && !document.hidden && !reduce.matches)
          raf = requestAnimationFrame(tick);
      }
      function sync() {
        cancelAnimationFrame(raf);
        raf = 0;
        render();
        if (!handheld() && !video.paused && !document.hidden && !reduce.matches)
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
      document.addEventListener("coursehelper:layout", sync);
      document.addEventListener("coursehelper:language", sync);
      manifest.then((localizedPlans) => {
        plans = localizedPlans;
        updateGeometry();
        sync();
      });
    });
})();
