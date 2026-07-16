/* =============================================================
   KASHI ORGANIZATION — About hero: instanced-triangle house
   The house GLB is deconstructed into thousands of small triangle
   instances sampled from its surface (denser along the hard edges:
   roofline, corners, window/door frames), tinted into a few Voronoi
   colour zones, and lit with UnrealBloom. A loose cloud of the same
   triangles drifts behind for atmosphere.
   ============================================================= */
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

const canvas = document.querySelector("[data-house-3d]");
const section = canvas && canvas.closest(".ab3d");
if (canvas && section) boot();

function boot() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- renderer / scene / camera ----
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  } catch (e) { section.classList.add("ab3d--fallback"); return; }
  if (!renderer.getContext()) { section.classList.add("ab3d--fallback"); return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x0c0b0a, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;

  const scene = new THREE.Scene();
  const group = new THREE.Group();      // the house
  const bgGroup = new THREE.Group();    // atmosphere
  scene.add(group, bgGroup);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
  camera.position.set(0, 0.6, 9.2);
  camera.lookAt(0, 0, 0);

  // ---- post: bloom ----
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.36, 0.4, 0.22);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // ---- palette (earthy + a cool spruce pop, glows under bloom) ----
  const PAL = [
    new THREE.Color(0xe0a63a), // amber gold
    new THREE.Color(0xe6d29e), // warm cream (window highlights)
    new THREE.Color(0x9c5f28), // bronze
    new THREE.Color(0x3f8f7e), // teal spruce
  ];
  // Voronoi colour seeds (model space, Y up, extent ~ ±2): roof=bright, walls=bronze, base=spruce
  const SEEDS = [
    { p: new THREE.Vector3(0.0,  1.9,  0.2), c: 0 },
    { p: new THREE.Vector3(1.1,  1.3,  1.1), c: 1 },
    { p: new THREE.Vector3(-1.3, 0.3,  0.9), c: 2 },
    { p: new THREE.Vector3(1.2, -0.1, -0.9), c: 2 },
    { p: new THREE.Vector3(0.0,  0.5,  1.7), c: 1 },
    { p: new THREE.Vector3(-0.9, 0.9, -1.3), c: 3 },
    { p: new THREE.Vector3(0.1, -1.5,  0.0), c: 3 },
  ];
  const colorAt = (v) => {
    let best = 0, bd = Infinity;
    for (let i = 0; i < SEEDS.length; i++) {
      const d = SEEDS[i].p.distanceToSquared(v);
      if (d < bd) { bd = d; best = i; }
    }
    return PAL[SEEDS[best].c];
  };

  const TARGET = 4.2; // largest model dimension after normalising
  const dummy = new THREE.Object3D();
  let house = null, houseCount = 0;

  new GLTFLoader().load(
    "assets/models/house.glb",
    (gltf) => build(gltf),
    undefined,
    () => section.classList.add("ab3d--fallback")
  );

  function build(gltf) {
    // ---- collect + world-bake the mesh geometry ----
    let mesh = null;
    gltf.scene.updateWorldMatrix(true, true);
    gltf.scene.traverse((o) => { if (o.isMesh && !mesh) mesh = o; });
    if (!mesh) { section.classList.add("ab3d--fallback"); return; }

    let geo = mesh.geometry.clone();
    if (geo.index) geo = geo.toNonIndexed();
    geo.applyMatrix4(mesh.matrixWorld);
    geo.computeBoundingBox();
    const bb = geo.boundingBox;
    const ctr = bb.getCenter(new THREE.Vector3());
    const size = bb.getSize(new THREE.Vector3());
    const s = TARGET / Math.max(size.x, size.y, size.z);
    geo.translate(-ctr.x, -ctr.y, -ctr.z);
    geo.scale(s, s, s);
    geo.computeVertexNormals();
    const solid = new THREE.Mesh(geo, new THREE.MeshBasicMaterial());

    // ---- surface samples (area-weighted base density) ----
    const N_SURF = 5200;
    const sampler = new MeshSurfaceSampler(solid).build();
    const pos = [];
    const pv = new THREE.Vector3();
    for (let i = 0; i < N_SURF; i++) { sampler.sample(pv); pos.push(pv.x, pv.y, pv.z); }

    // ---- edge samples: dense on hard edges (roofline / corners / window+door frames) ----
    const edges = new THREE.EdgesGeometry(geo, 20); // 20° threshold
    const ep = edges.attributes.position;
    const a = new THREE.Vector3(), b = new THREE.Vector3(), p = new THREE.Vector3();
    const EDGE_DENSITY = 26, JIT = 0.012;
    for (let i = 0; i < ep.count; i += 2) {
      a.fromBufferAttribute(ep, i); b.fromBufferAttribute(ep, i + 1);
      const n = Math.max(2, Math.round(a.distanceTo(b) * EDGE_DENSITY));
      for (let j = 0; j < n; j++) {
        p.lerpVectors(a, b, j / (n - 1));
        pos.push(p.x + (Math.random() - 0.5) * JIT, p.y + (Math.random() - 0.5) * JIT, p.z + (Math.random() - 0.5) * JIT);
      }
    }

    houseCount = pos.length / 3;

    // ---- instanced triangle (3-sided cone = little pyramid) ----
    const tri = new THREE.ConeGeometry(0.5, 0.9, 3);
    const mat = new THREE.MeshBasicMaterial({ toneMapped: true });
    house = new THREE.InstancedMesh(tri, mat, houseCount);
    house.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const v = new THREE.Vector3();
    for (let i = 0; i < houseCount; i++) {
      v.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
      const sc = 0.019 + Math.random() * 0.02;
      dummy.position.copy(v);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.scale.setScalar(sc);
      dummy.updateMatrix();
      house.setMatrixAt(i, dummy.matrix);
      house.setColorAt(i, colorAt(v));
    }
    house.instanceMatrix.needsUpdate = true;
    if (house.instanceColor) house.instanceColor.needsUpdate = true;
    group.add(house);

    // ---- background atmosphere: same triangles, loose + low opacity ----
    const N_BG = 380;
    const bgMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.22, toneMapped: true });
    const bg = new THREE.InstancedMesh(tri, bgMat, N_BG);
    for (let i = 0; i < N_BG; i++) {
      const r = 7 + Math.random() * 12;
      const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      dummy.position.set(r * Math.sin(ph) * Math.cos(th), (Math.random() - 0.5) * 12, r * Math.cos(ph));
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.scale.setScalar(0.03 + Math.random() * 0.05);
      dummy.updateMatrix();
      bg.setMatrixAt(i, dummy.matrix);
      bg.setColorAt(i, PAL[(Math.random() * PAL.length) | 0]);
    }
    bg.instanceColor && (bg.instanceColor.needsUpdate = true);
    bgGroup.add(bg);

    section.classList.add("ab3d--ready");
    resize();
    if (reduce) { group.rotation.y = -0.35; render(); }  // one static frame
    else start();
  }

  // ---- interaction: subtle pointer parallax ----
  const target = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
  window.addEventListener("pointermove", (e) => {
    target.x = (e.clientX / window.innerWidth - 0.5);
    target.y = (e.clientY / window.innerHeight - 0.5);
  }, { passive: true });

  // ---- sizing (shift the house left on wide screens, centre on narrow) ----
  function resize() {
    const w = section.clientWidth, h = section.clientHeight;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloom.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const wide = w / h > 1.1;
    group.position.x = wide ? -2.1 : 0;
    bgGroup.position.x = group.position.x * 0.4;
    group.scale.setScalar(wide ? 1 : 0.82);
  }
  window.addEventListener("resize", resize);

  // ---- loop ----
  let raf = 0, t0 = performance.now(), running = false;
  function render() { composer.render(); }
  function tick(now) {
    raf = requestAnimationFrame(tick);
    const t = (now - t0) / 1000;
    cur.x += (target.x - cur.x) * 0.04;
    cur.y += (target.y - cur.y) * 0.04;
    if (house) {
      group.rotation.y = -0.35 + t * 0.06 + cur.x * 0.5;
      group.rotation.x = cur.y * 0.28;
      group.position.y = Math.sin(t * 0.5) * 0.12;
      bgGroup.rotation.y = -t * 0.015;
    }
    render();
  }
  function start() { if (!running) { running = true; t0 = performance.now(); raf = requestAnimationFrame(tick); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  // pause when the hero is off-screen
  if ("IntersectionObserver" in window && !reduce) {
    new IntersectionObserver((ents) => {
      ents.forEach((en) => { if (!house) return; en.isIntersecting ? start() : stop(); });
    }, { threshold: 0.01 }).observe(section);
  }
}
