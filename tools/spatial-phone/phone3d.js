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
  Vector3,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";

const W = 2.2;
const H = 4.7;
const BACK_Z = -0.197;
const SCREEN_Z = 0.139;
const DEG = Math.PI / 180;
function roundedShape(w, h, r, cx = 0, cy = 0) {
  const x = cx - w / 2,
    y = cy - h / 2;
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

/** Render the rotating handset. The front-facing close-up uses the native image over the bezel. */
export function mountPhone({ host, stage, poster, overlay, pose, onFallback }) {
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
  const rim = new DirectionalLight(0xf5f5f5, 1.35);
  rim.position.set(5, 1, -3);
  scene.add(rim);

  const model = new Group();
  scene.add(model);
  const chassis = new Group();
  model.add(chassis);
  const metal = new MeshPhysicalMaterial({
    color: 0x323130, metalness: 0.91, roughness: 0.3,
    clearcoat: 0.12, clearcoatRoughness: 0.25, envMapIntensity: 0.72,
  });
  const edge = new MeshStandardMaterial({
    color: 0x393939, metalness: 0.88, roughness: 0.27, envMapIntensity: 0.75,
  });
  const black = new MeshPhysicalMaterial({
    color: 0x090909, metalness: 0.08, roughness: 0.16,
    specularIntensity: 0.24, envMapIntensity: 0.48,
  });
  const back = new MeshPhysicalMaterial({
    color: 0x373737, metalness: 0.18, roughness: 0.49,
    clearcoat: 0.12, envMapIntensity: 0.65,
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
    chassis.add(mesh);
    return mesh;
  }
  // The glass meets the rounded shoulder of the integral metal frame.
  add("graphite frame", solid(W, H, 0.33, 0.271, 0.027), metal, 0, 0, -0.035);
  add("front glass bezel", solid(W - 0.031, H - 0.031, 0.31, 0.014, 0.009),
    black, 0, 0, 0.121);
  add("rear glass", solid(W - 0.065, H - 0.065, 0.299, 0.012, 0.007),
    back, 0, 0, BACK_Z + 0.004);
  for (const side of [-1, 1]) {
    for (const y of [-1.72, 1.82]) {
      add("antenna seam", new BoxGeometry(.002, .019, .267),
        black, side * W / 2, y, -.035);
    }
  }

  const screenMaterial = new MeshBasicMaterial({
    color: 0xffffff,
    toneMapped: false,
  });
  const glassLight = { value: new Vector3() };
  const overlayMap = { value: null };
  const screenBlend = { value: 0 };
  screenMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.glassLight = glassLight;
    shader.uniforms.overlayMap = overlayMap;
    shader.uniforms.screenBlend = screenBlend;
    shader.fragmentShader = `uniform vec3 glassLight;
      uniform sampler2D overlayMap;
      uniform float screenBlend;\n` + shader.fragmentShader.replace(
      '#include <map_fragment>',
      `#include <map_fragment>
       if (screenBlend > 0.0) {
         diffuseColor = mix(diffuseColor, texture2D(overlayMap, vMapUv), screenBlend);
       }`,
    ).replace(
      '#include <colorspace_fragment>',
      `#include <colorspace_fragment>
       // Match the two soft ellipses on .spatial-device-glint, in top-left display coordinates.
       vec2 offset = vec2(vMapUv.x, 1.0 - vMapUv.y) - glassLight.xy;
       float radius = length(offset / vec2(0.70, 0.34));
       float fade = clamp((radius - 0.4) / 0.6, 0.0, 1.0);
       float white = mix(30.0, 16.0, min(radius / 0.4, 1.0)) * (1.0 - fade) / 255.0;
       float shade = max(0.0, 1.0 - length((offset - vec2(0.71, 0.24)) / vec2(0.92, 0.46)));
       vec3 surface = mix(gl_FragColor.rgb, vec3(100.0, 113.0, 108.0) / 255.0, shade * 19.0 / 255.0);
       surface = surface * (1.0 - white - fade * 16.0 / 255.0) + white;
       gl_FragColor.rgb = mix(gl_FragColor.rgb, surface, glassLight.z);`,
    );
  };
  const screenWidth = W - 0.101;
  const screenHeight = screenWidth * 2608 / 1200;
  const projectedHeight = screenHeight / H * camera.position.z / (camera.position.z - SCREEN_Z);
  host.style.setProperty("--display-inset", (1 - projectedHeight) * 50 + "%");
  const screen = add(
    "native operation display",
    surface(screenWidth, screenHeight, 0.265),
    screenMaterial,
    0,
    0,
    SCREEN_Z,
  );
  function screenTexture() {
    const texture = new Texture(document.createElement("canvas"));
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    texture.magFilter = LinearFilter;
    return texture;
  }
  const posterTexture = screenTexture();
  const nextTexture = screenTexture();
  screenMaterial.map = posterTexture;
  overlayMap.value = posterTexture;

  for (const [name, side, y, height] of [
    ["action", -1, 1.5, .19], ["volume up", -1, .93, .35],
    ["volume down", -1, .42, .35], ["power", 1, .86, .60],
  ]) {
    const keycap = add(name + " key", solid(.10, height, .04, .017, .007),
      metal, side * (W / 2 + .010), y, -.035);
    keycap.rotation.y = side * Math.PI / 2;
  }
  const port = add(
    "USB-C recess",
    solid(0.32, 0.074, 0.03, 0.018, 0.005),
    black,
    0,
    -H / 2 - 0.002,
    -.025,
  );
  port.rotation.x = Math.PI / 2;
  for (const side of [-1, 1])
    for (let i = 0; i < 5; i++) {
      add(
        "speaker opening",
        new CylinderGeometry(0.018, 0.018, 0.008, 12),
        black,
        side * (0.38 + i * 0.075),
        -H / 2 + 0.003,
        -.025,
      );
    }
  // A complete rear surface and actual lens barrels, rather than a flat back image.
  add(
    "camera island",
    solid(1.02, 1.14, 0.19, 0.055, 0.018),
    back,
    0.48,
    1.62,
    BACK_Z - .031,
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
      BACK_Z - .096,
    );
    barrel.rotation.x = Math.PI / 2;
    add(
      "lens rim",
      new TorusGeometry(0.16, 0.015, 10, 48),
      metal,
      x,
      y,
      BACK_Z - .127,
    );
    const lens = add(
      "optical glass",
      new CylinderGeometry(0.145, 0.145, 0.008, 48),
      glass,
      x,
      y,
      BACK_Z - .130,
    );
    lens.rotation.x = Math.PI / 2;
  }

  let disposed = false,
    visible = true,
    frame = 0,
    renderCount = 0;
  function draw() {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    model.rotation.set(
      -(pose.pitch + pose.hoverPitch) * DEG,
      (pose.yaw + pose.turn + pose.hoverYaw) * DEG,
      -(pose.roll + pose.lean) * DEG,
      "YXZ",
    );
    if (!posterTexture.version) return;
    screenBlend.value = pose.screenBlend;
    glassLight.value.set(pose.lightX, pose.lightY, pose.lightStrength);
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
    // Allocate for the final framing once, capped at the native screenshot resolution.
    const density = Math.min(
      Math.min(devicePixelRatio * 1.5, 3) * Math.max(1, pose.displayScale || 1),
      (poster.naturalWidth || 1200) / Math.max(1, host.clientWidth),
    );
    renderer.setDrawingBufferSize(width, height, density);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    requestDraw();
  }
  function uploadScreen(texture, image) {
    if (!image.complete || !image.naturalWidth) return false;
    // WebKit can crop a texture uploaded from a CSS-sized img. Give WebGL a
    // full-frame bitmap whose backing dimensions are independent of layout.
    const canvas = texture.image;
    if (canvas.width !== image.naturalWidth) canvas.width = image.naturalWidth;
    if (canvas.height !== image.naturalHeight) canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d");
    context.globalCompositeOperation = "copy";
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    texture.needsUpdate = true;
    return true;
  }
  function posterLoaded() {
    if (uploadScreen(posterTexture, poster)) requestDraw();
  }
  function overlayLoaded() {
    if (uploadScreen(nextTexture, overlay)) {
      overlayMap.value = nextTexture;
      requestDraw();
    }
  }
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
  overlay.addEventListener("load", overlayLoaded);
  document.addEventListener("visibilitychange", requestDraw);
  host.append(renderer.domElement);
  host.dataset.phoneRenderer = "webgl";
  host.dataset.phoneMeshes = String(chassis.children.length);
  posterLoaded();
  overlayLoaded();
  resize();
  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    sizeObserver.disconnect();
    poster.removeEventListener("load", posterLoaded);
    overlay.removeEventListener("load", overlayLoaded);
    document.removeEventListener("visibilitychange", requestDraw);
    model.traverse((object) => {
      object.geometry?.dispose();
    });
    new Set([metal, edge, black, back, glass, screenMaterial]).forEach(
      (material) => material.dispose(),
    );
    posterTexture.dispose();
    nextTexture.dispose();
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
  return { requestDraw, resize, dispose, canvas: renderer.domElement, model, screen };
}
