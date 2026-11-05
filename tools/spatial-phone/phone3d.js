import {
  ACESFilmicToneMapping,
  AmbientLight,
  BoxGeometry,
  CylinderGeometry,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  Shape,
  ShapeGeometry,
  SRGBColorSpace,
  Texture,
  TorusGeometry,
  VideoTexture,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";

const W = 2.2;
const H = 4.7;
const DEG = Math.PI / 180;
function roundedShape(w, h, r) {
  const x = -w / 2,
    y = -h / 2;
  const s = new Shape();
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
function solid(w, h, r, depth, bevel = 0.018) {
  const g = new ExtrudeGeometry(roundedShape(w - bevel * 2, h - bevel * 2, r), {
    depth,
    steps: 1,
    curveSegments: 16,
    bevelEnabled: true,
    bevelSegments: 4,
    bevelSize: bevel,
    bevelThickness: bevel,
  });
  g.translate(0, 0, -depth / 2);
  g.deleteAttribute("uv");
  g.deleteAttribute("normal");
  const smooth = mergeVertices(g, 0.00001);
  smooth.computeVertexNormals();
  g.dispose();
  return smooth;
}
function surface(w, h, r) {
  const g = new ShapeGeometry(roundedShape(w, h, r), 24);
  const positions = g.getAttribute("position"),
    uv = g.getAttribute("uv");
  for (let i = 0; i < positions.count; i++) {
    uv.setXY(i, positions.getX(i) / w + 0.5, positions.getY(i) / h + 0.5);
  }
  return g;
}

/** Geometry, lights and media stay in WebGL; DOM transforms never rasterize the screen. */
export function mountPhone({ host, stage, video, poster, pose, onFallback }) {
  let renderer;
  try {
    renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "low-power",
    });
  } catch {
    return null;
  }
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.domElement.className = "spatial-phone-canvas";
  renderer.domElement.setAttribute("aria-hidden", "true");
  const scene = new Scene();
  const camera = new PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.z = (H * 1.3) / (2 * Math.tan(14 * DEG));
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.035);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();
  scene.add(new AmbientLight(0xffffff, 0.65));
  const key = new DirectionalLight(0xfffaf1, 3);
  key.position.set(-3, 5, 7);
  scene.add(key);
  const rim = new DirectionalLight(0xdde6f0, 2);
  rim.position.set(5, 1, -3);
  scene.add(rim);

  const model = new Group();
  scene.add(model);
  const metal = new MeshPhysicalMaterial({
    color: 0x7e8386,
    metalness: 0.96,
    roughness: 0.26,
    clearcoat: 0.35,
    clearcoatRoughness: 0.2,
  });
  const edge = new MeshStandardMaterial({
    color: 0x343839,
    metalness: 0.86,
    roughness: 0.3,
  });
  const black = new MeshStandardMaterial({
    color: 0x080a0c,
    metalness: 0.1,
    roughness: 0.23,
  });
  const back = new MeshPhysicalMaterial({
    color: 0x9aa09e,
    metalness: 0.32,
    roughness: 0.48,
    clearcoat: 0.25,
  });
  const glass = new MeshPhysicalMaterial({
    color: 0x101a25,
    metalness: 0.3,
    roughness: 0.08,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
  });
  function add(name, geometry, material, x = 0, y = 0, z = 0) {
    const mesh = new Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(x, y, z);
    model.add(mesh);
    return mesh;
  }
  add("machined titanium sidewall", solid(W, H, 0.33, 0.18, 0.024), metal);
  add(
    "front glass bezel",
    solid(W - 0.035, H - 0.035, 0.315, 0.014, 0.009),
    black,
    0,
    0,
    0.117,
  );
  add(
    "matte rear glass",
    solid(W - 0.045, H - 0.045, 0.31, 0.013, 0.008),
    back,
    0,
    0,
    -0.12,
  );

  const screenMaterial = new MeshBasicMaterial({
    color: 0xffffff,
    toneMapped: false,
  });
  const screenWidth = W - 0.08;
  const screen = add(
    "native operation display",
    surface(screenWidth, (screenWidth * 2608) / 1200, 0.265),
    screenMaterial,
    0,
    0,
    0.139,
  );
  const posterTexture = new Texture(poster);
  const filmTexture = new VideoTexture(video);
  for (const texture of [posterTexture, filmTexture]) {
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    texture.magFilter = LinearFilter;
  }
  // One video element is reused only with the site's 1200 x 2608 source films.
  filmTexture.generateMipmaps = false;
  screenMaterial.map = posterTexture;

  // Physical side controls and antenna breaks, visible when the phone is turned.
  for (const [name, x, y, height] of [
    ["action button", -W / 2 - 0.014, 1.5, 0.19],
    ["volume up", -W / 2 - 0.014, 0.93, 0.35],
    ["volume down", -W / 2 - 0.014, 0.42, 0.35],
    ["power button", W / 2 + 0.014, 0.86, 0.62],
  ])
    add(name, solid(0.033, height, 0.013, 0.075, 0.006), metal, x, y);
  const antenna = new MeshStandardMaterial({ color: 0x6e7474, roughness: 0.8 });
  for (const x of [-W / 2 - 0.001, W / 2 + 0.001]) {
    for (const y of [-1.7, 1.72])
      add("antenna break", new BoxGeometry(0.012, 0.035, 0.165), antenna, x, y);
  }
  const port = add(
    "USB-C recess",
    solid(0.32, 0.074, 0.03, 0.018, 0.005),
    black,
    0,
    -H / 2 - 0.002,
  );
  port.rotation.x = Math.PI / 2;
  for (const side of [-1, 1])
    for (let i = 0; i < 5; i++) {
      add(
        "speaker opening",
        new CylinderGeometry(0.018, 0.018, 0.008, 12),
        black,
        side * (0.38 + i * 0.075),
        -H / 2 - 0.011,
      );
    }
  // A complete rear surface and actual lens barrels, rather than a flat back image.
  add(
    "camera island",
    solid(1.02, 1.14, 0.19, 0.055, 0.018),
    back,
    0.48,
    1.62,
    -0.17,
  );
  for (const [x, y] of [
    [0.25, 1.91],
    [0.25, 1.35],
    [0.77, 1.64],
  ]) {
    const barrel = add(
      "camera barrel",
      new CylinderGeometry(0.19, 0.19, 0.055, 48),
      edge,
      x,
      y,
      -0.235,
    );
    barrel.rotation.x = Math.PI / 2;
    add(
      "lens rim",
      new TorusGeometry(0.16, 0.015, 10, 48),
      metal,
      x,
      y,
      -0.266,
    );
    const lens = add(
      "optical glass",
      new CylinderGeometry(0.145, 0.145, 0.008, 48),
      glass,
      x,
      y,
      -0.269,
    );
    lens.rotation.x = Math.PI / 2;
  }

  let disposed = false,
    visible = true,
    frame = 0,
    videoCallback = 0,
    renderCount = 0;
  function draw() {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    model.rotation.set(
      -pose.pitch * DEG,
      (pose.yaw + pose.turn) * DEG,
      -(pose.roll + pose.lean) * DEG,
      "YXZ",
    );
    const useFilm =
      video.classList.contains("is-ready") && video.readyState >= 2;
    if (!useFilm && (!poster.complete || !poster.naturalWidth)) return;
    const map = useFilm ? filmTexture : posterTexture;
    if (screenMaterial.map !== map) {
      screenMaterial.map = map;
      screenMaterial.needsUpdate = true;
    }
    renderer.render(scene, camera);
    if (!host.classList.contains("has-webgl-phone"))
      host.classList.add("has-webgl-phone");
    renderCount++;
    host.dataset.phoneFrame = String(renderCount);
  }
  function requestDraw() {
    if (!frame && !disposed) frame = requestAnimationFrame(draw);
  }
  function resize() {
    if (disposed) return;
    const width = host.clientWidth * 2,
      height = host.clientHeight * 1.3;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 3));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    requestDraw();
  }
  function posterLoaded() {
    if (poster.complete && poster.naturalWidth) {
      posterTexture.needsUpdate = true;
      requestDraw();
    }
  }
  const videoFrame = () => {
    if (disposed) return;
    requestDraw();
    videoCallback = video.requestVideoFrameCallback?.(videoFrame) || 0;
  };
  if (video.requestVideoFrameCallback)
    videoCallback = video.requestVideoFrameCallback(videoFrame);
  else video.addEventListener("timeupdate", requestDraw);
  const mediaEvents = [
    "playing",
    "pause",
    "seeked",
    "loadeddata",
    "emptied",
    "error",
  ];
  mediaEvents.forEach((name) => video.addEventListener(name, requestDraw));
  const screenState = new MutationObserver(requestDraw);
  screenState.observe(video, { attributes: true, attributeFilter: ["class"] });
  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) requestDraw();
    },
    { threshold: 0 },
  );
  observer.observe(stage);
  const sizeObserver = new ResizeObserver(resize);
  sizeObserver.observe(host);
  poster.addEventListener("load", posterLoaded);
  document.addEventListener("visibilitychange", requestDraw);
  host.append(renderer.domElement);
  host.dataset.phoneRenderer = "webgl";
  host.dataset.phoneMeshes = String(model.children.length);
  posterLoaded();
  resize();
  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    if (videoCallback) video.cancelVideoFrameCallback?.(videoCallback);
    observer.disconnect();
    sizeObserver.disconnect();
    screenState.disconnect();
    poster.removeEventListener("load", posterLoaded);
    document.removeEventListener("visibilitychange", requestDraw);
    mediaEvents.forEach((name) => video.removeEventListener(name, requestDraw));
    video.removeEventListener("timeupdate", requestDraw);
    model.traverse((object) => {
      object.geometry?.dispose();
    });
    new Set([metal, edge, black, back, glass, antenna, screenMaterial]).forEach(
      (material) => material.dispose(),
    );
    posterTexture.dispose();
    filmTexture.dispose();
    environment.dispose();
    renderer.dispose();
    renderer.domElement.remove();
    host.classList.remove("has-webgl-phone");
    delete host.dataset.phoneRenderer;
  }
  renderer.domElement.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    dispose();
    onFallback?.();
  });
  window.addEventListener("pagehide", (event) => {
    if (!event.persisted) dispose();
  });
  return { requestDraw, dispose, canvas: renderer.domElement, model, screen };
}
