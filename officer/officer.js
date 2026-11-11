/**
 * Stylized procedural bust of the white-haired officer.
 * Three.js r169 — no external paid assets.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const qs = new URLSearchParams(location.search);
const SHOT = qs.has('shot');
const VIEW = qs.get('view') || 'front';
if (SHOT) {
  const hint = document.getElementById('hint');
  if (hint) hint.style.display = 'none';
}

const COL = {
  backdrop: 0xb3a8c2,
  skin: 0xf1c8bc,
  hair: 0xe4dee8,
  hairMid: 0xc8c2d2,
  eyeWhite: 0xf4eeec,
  lip: 0xc7847c,
  lipDeep: 0xb06460,
  brow: 0x5a4e58,
  coat: 0xf1f0f4,
  navy: 0x14161f,
  gold: 0xc9a24c,
  cravat: 0x8a1b32,
  cravatLite: 0xa8243c,
  cap: 0x10121a,
  capRed: 0x9a1c2c,
  vest: 0x7a1828,
};

const scene = new THREE.Scene();
scene.background = new THREE.Color(COL.backdrop);
scene.fog = new THREE.Fog(COL.backdrop, 3.4, 7.0);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance',
  preserveDrawingBuffer: SHOT,
});
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.98;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(26, innerWidth / innerHeight, 0.05, 20);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.minDistance = 0.55;
controls.maxDistance = 3.6;
controls.minPolarAngle = 0.35;
controls.maxPolarAngle = Math.PI * 0.82;
controls.target.set(0, 1.455, 0);
controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.48;

const hemi = new THREE.HemisphereLight(0xfff2ea, 0x8a7aa0, 0.5);
scene.add(hemi);

const key = new THREE.DirectionalLight(0xfff5ee, 1.75);
key.position.set(0.7, 2.2, 1.7);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
Object.assign(key.shadow.camera, { left: -0.7, right: 0.7, top: 0.9, bottom: -0.5, near: 0.5, far: 5 });
key.shadow.bias = -0.0004;
key.shadow.normalBias = 0.018;
scene.add(key);

const fill = new THREE.DirectionalLight(0xd8d2ea, 0.55);
fill.position.set(-1.6, 1.4, 1.2);
scene.add(fill);

const rim = new THREE.DirectionalLight(0xe8e4ff, 1.15);
rim.position.set(-1.0, 1.9, -1.7);
scene.add(rim);

const hairLight = new THREE.DirectionalLight(0xfff8ff, 0.4);
hairLight.position.set(0.25, 2.6, 0.5);
scene.add(hairLight);

(function backdrop() {
  const mat = new THREE.MeshStandardMaterial({ color: COL.backdrop, roughness: 0.94, metalness: 0 });
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), mat);
  wall.position.set(0, 1.45, -1.2);
  wall.receiveShadow = true;
  scene.add(wall);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(2.2, 48), mat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.7;
  floor.receiveShadow = true;
  scene.add(floor);
  const frame = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 2.2),
    new THREE.MeshBasicMaterial({ color: 0xe6e0ee, transparent: true, opacity: 0.28, depthWrite: false }),
  );
  frame.position.set(-0.42, 1.72, -1.19);
  scene.add(frame);
})();

function srgbTex(tex) {
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}
function canvasTex(w, h, draw, flipY = true) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.flipY = flipY;
  t.anisotropy = 8;
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return srgbTex(t);
}

const skinMat = new THREE.MeshPhysicalMaterial({
  color: COL.skin, roughness: 0.44, metalness: 0,
  sheen: 0.45, sheenColor: new THREE.Color(0xe8a090), sheenRoughness: 0.55,
  clearcoat: 0.07, clearcoatRoughness: 0.5, envMapIntensity: 0.22,
});
const hairStrandMap = canvasTex(128, 512, (ctx, w, h) => {
  ctx.fillStyle = '#e6e0ea';
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 36; i++) {
    ctx.strokeStyle = i % 2 ? 'rgba(255,255,255,0.28)' : 'rgba(150,146,165,0.28)';
    ctx.lineWidth = 1 + (i % 3) * 0.4;
    ctx.beginPath();
    const x = ((i + 0.4) / 36) * w;
    ctx.moveTo(x, 0);
    ctx.lineTo(x + (i % 5 - 2) * 0.8, h);
    ctx.stroke();
  }
}, false);
hairStrandMap.wrapT = THREE.RepeatWrapping;
hairStrandMap.wrapS = THREE.RepeatWrapping;

const hairMat = new THREE.MeshPhysicalMaterial({
  color: COL.hair, map: hairStrandMap, roughness: 0.34, metalness: 0.03,
  sheen: 1, sheenColor: new THREE.Color(0xffffff), sheenRoughness: 0.22,
  clearcoat: 0.15, clearcoatRoughness: 0.35,
  anisotropy: 0.65, envMapIntensity: 0.4, side: THREE.DoubleSide,
});
const hairDarkMat = hairMat.clone();
hairDarkMat.color = new THREE.Color(COL.hairMid);
const coatMat = new THREE.MeshPhysicalMaterial({
  color: COL.coat, roughness: 0.6, metalness: 0.02,
  sheen: 0.2, sheenColor: new THREE.Color(0xffffff), sheenRoughness: 0.7, envMapIntensity: 0.28,
});
const navyMat = new THREE.MeshPhysicalMaterial({
  color: COL.navy, roughness: 0.55, metalness: 0.08, envMapIntensity: 0.35, side: THREE.DoubleSide,
});
const goldMat = new THREE.MeshPhysicalMaterial({
  color: COL.gold, roughness: 0.28, metalness: 1, envMapIntensity: 1.05,
});
const goldSoftMat = goldMat.clone(); goldSoftMat.roughness = 0.4;
const cravatMat = new THREE.MeshPhysicalMaterial({
  color: COL.cravat, roughness: 0.52, metalness: 0,
  sheen: 0.55, sheenColor: new THREE.Color(0xd05060), sheenRoughness: 0.45,
  side: THREE.DoubleSide, envMapIntensity: 0.3,
});
const cravatLiteMat = cravatMat.clone();
cravatLiteMat.color = new THREE.Color(COL.cravatLite);
const capMat = new THREE.MeshPhysicalMaterial({
  color: COL.cap, roughness: 0.48, metalness: 0.12, envMapIntensity: 0.4,
});
const vestMat = new THREE.MeshPhysicalMaterial({
  color: COL.vest, roughness: 0.55, metalness: 0,
  sheen: 0.3, sheenColor: new THREE.Color(0xc04050), sheenRoughness: 0.5,
});

function smooth(t) { t = THREE.MathUtils.clamp(t, 0, 1); return t * t * (3 - 2 * t); }
function lerp(a, b, t) { return a + (b - a) * t; }

function add(parent, geo, mat, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  m.scale.set(sx, sy, sz);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

function v3(x, y, z) { return new THREE.Vector3(x, y, z); }
function asCurve(pts) {
  return new THREE.CatmullRomCurve3(pts[0].isVector3 ? pts : pts.map((p) => v3(...p)));
}

function ribbonGeo(pts, widthA, widthB, segs = 20, endTaper = 1, widthDir = null) {
  const curve = asCurve(pts);
  const pos = [], nrm = [], uv = [], idx = [];
  const upHint = new THREE.Vector3(0, 0, 1);
  const t = new THREE.Vector3(), side = new THREE.Vector3(), p = new THREE.Vector3(), n = new THREE.Vector3();
  const forced = widthDir ? widthDir.clone().normalize() : null;
  for (let i = 0; i <= segs; i++) {
    const u = i / segs;
    curve.getPointAt(u, p);
    curve.getTangentAt(u, t).normalize();
    if (forced) {
      side.copy(forced).addScaledVector(t, -forced.dot(t));
      if (side.lengthSq() < 1e-8) side.crossVectors(upHint, t);
      side.normalize();
    } else {
      side.crossVectors(upHint, t);
      if (side.lengthSq() < 1e-8) side.crossVectors(new THREE.Vector3(0, 1, 0), t);
      side.normalize();
    }
    n.crossVectors(t, side).normalize();
    const w = lerp(widthA, widthB, u) * (u > 0.85 ? lerp(1, endTaper, (u - 0.85) / 0.15) : 1);
    for (const s of [-1, 1]) {
      pos.push(p.x + side.x * w * s, p.y + side.y * w * s, p.z + side.z * w * s);
      nrm.push(n.x, n.y, n.z);
      uv.push(s < 0 ? 0 : 1, u);
    }
    if (i < segs) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function taperedTube(pts, rA, rB, segs = 16, radial = 6) {
  const curve = asCurve(pts);
  const tmp = new THREE.TubeGeometry(curve, segs, 1, radial, false);
  const pos = tmp.attributes.position;
  const v = new THREE.Vector3(), c = new THREE.Vector3();
  for (let i = 0; i <= segs; i++) {
    const u = i / segs;
    curve.getPointAt(u, c);
    const r = lerp(rA, rB, u);
    for (let j = 0; j <= radial; j++) {
      const k = i * (radial + 1) + j;
      v.fromBufferAttribute(pos, k);
      v.sub(c).multiplyScalar(r).add(c);
      pos.setXYZ(k, v.x, v.y, v.z);
    }
  }
  tmp.computeVertexNormals();
  return tmp;
}

function lathe(pts, seg, mat, parent, yOff = 0) {
  const g = new THREE.LatheGeometry(pts.map((p) => new THREE.Vector2(p[0], p[1])), seg);
  g.computeVertexNormals();
  return add(parent, g, mat, 0, yOff, 0);
}

function deformShell(geo, fn) {
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    fn(v, i);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

/* -------------------- head -------------------- */
function sculptHead(radius = 0.122) {
  const geo = new THREE.SphereGeometry(radius, 64, 48);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const len = v.length() || 1;
    let nx = v.x / len, ny = v.y / len, nz = v.z / len;
    let rx = 0.98, ry = 1.15, rz = 0.91;
    if (ny > 0.12 && nz > 0) {
      const f = smooth((ny - 0.12) / 0.55) * smooth(nz / 0.8);
      rz *= 1 - 0.06 * f;
      rx *= 1 + 0.045 * f;
    }
    if (nz < 0) rz *= 1.06;
    if (ny < 0.12) {
      const j = smooth((-ny + 0.12) / 1.05);
      rx *= 1 - 0.42 * j;
      rz *= 1 - 0.18 * j;
    }
    {
      const cx = Math.abs(nx) - 0.45;
      const cheek = Math.exp(-(cx * cx) / 0.05) * Math.exp(-((ny + 0.05) ** 2) / 0.045) * Math.max(0, nz + 0.15);
      rx *= 1 + 0.07 * cheek;
      rz *= 1 + 0.04 * cheek;
    }
    for (const s of [-1, 1]) {
      const dx = nx - s * 0.33, dy = ny - 0.10;
      const d = dx * dx * 3.4 + dy * dy * 6.0 + Math.max(0, 0.35 - nz) * 1.6;
      const sock = Math.exp(-d / 0.07) * Math.max(0, nz);
      rz *= 1 - 0.10 * sock;
    }
    {
      const brow = Math.exp(-((ny - 0.22) ** 2) / 0.018) * Math.exp(-(nx * nx) / 0.28) * Math.max(0, nz);
      rz *= 1 + 0.03 * brow;
    }
    let px = nx * radius * rx;
    let py = ny * radius * ry;
    let pz = nz * radius * rz;
    if (ny < -0.28) {
      const c = smooth((-ny - 0.28) / 0.7);
      pz += 0.012 * c;
      py -= 0.005 * c;
      px *= 1 - 0.12 * c;
    }
    pos.setXYZ(i, px, py, pz);
  }
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setX(i, (uv.getX(i) + 0.25) % 1);
  geo.computeVertexNormals();
  return geo;
}

function skinTexture() {
  return canvasTex(1024, 1024, (ctx, w, h) => {
    ctx.fillStyle = '#f1c8bc';
    ctx.fillRect(0, 0, w, h);
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * 8;
      d[i] = Math.min(255, Math.max(0, d[i] + n));
      d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + n * 0.8));
      d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + n * 0.6));
    }
    ctx.putImageData(img, 0, 0);
    function blush(u, v, rx, ry, a) {
      const x = u * w, y = (1 - v) * h;
      const g = ctx.createRadialGradient(x, y, 0, x, y, rx);
      g.addColorStop(0, `rgba(230,120,120,${a})`);
      g.addColorStop(0.55, `rgba(220,130,130,${a * 0.35})`);
      g.addColorStop(1, 'rgba(230,150,140,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
    }
    blush(0.36, 0.46, 100, 78, 0.32);
    blush(0.64, 0.46, 100, 78, 0.32);
    blush(0.5, 0.50, 28, 40, 0.08);
    blush(0.5, 0.38, 60, 40, 0.08);
    blush(0.405, 0.575, 50, 28, 0.10);
    blush(0.595, 0.575, 50, 28, 0.10);
  });
}

function irisTex() {
  return canvasTex(512, 512, (ctx, w) => {
    const cx = w / 2, cy = w / 2;
    ctx.fillStyle = '#e8e0dc';
    ctx.beginPath(); ctx.arc(cx, cy, w / 2, 0, Math.PI * 2); ctx.fill();
    const g = ctx.createRadialGradient(cx, cy, 8, cx, cy, w * 0.42);
    g.addColorStop(0, '#0c1c28');
    g.addColorStop(0.16, '#0c1c28');
    g.addColorStop(0.2, '#1a4a78');
    g.addColorStop(0.38, '#3a88c8');
    g.addColorStop(0.55, '#8ec4ea');
    g.addColorStop(0.7, '#4a96d0');
    g.addColorStop(0.86, '#1a4060');
    g.addColorStop(1, '#0a1824');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, w * 0.42, 0, Math.PI * 2); ctx.fill();
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = 'rgba(20,40,70,0.28)';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 18, Math.sin(a) * 18);
      ctx.lineTo(Math.cos(a) * w * 0.4, Math.sin(a) * w * 0.4);
      ctx.stroke();
    }
    ctx.restore();
    ctx.strokeStyle = 'rgba(8,16,28,0.7)';
    ctx.lineWidth = 10;
    ctx.beginPath(); ctx.arc(cx, cy, w * 0.40, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#07090c';
    ctx.beginPath(); ctx.arc(cx, cy, w * 0.13, 0, Math.PI * 2); ctx.fill();
  });
}

function lashTex() {
  return canvasTex(256, 64, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#1a1216';
    ctx.lineCap = 'round';
    for (let i = 0; i < 22; i++) {
      const x = 8 + (i / 21) * (w - 16);
      const len = 18 + Math.sin((i / 21) * Math.PI) * 22 + (i % 3) * 2;
      const lean = (i / 21 - 0.5) * 0.6;
      ctx.lineWidth = 1.6 + Math.sin((i / 21) * Math.PI) * 1.1;
      ctx.beginPath();
      ctx.moveTo(x, h - 6);
      ctx.quadraticCurveTo(x + lean * 10, h - len * 0.55, x + lean * 22, h - len);
      ctx.stroke();
    }
  }, true);
}

const SKIN_MAP = skinTexture();
const IRIS_MAP = irisTex();
const LASH_MAP = lashTex();
skinMat.map = SKIN_MAP;

function makeEar(side) {
  const g = new THREE.SphereGeometry(0.028, 16, 12);
  deformShell(g, (v) => { v.z *= 0.45; v.x *= 0.7; v.y *= v.y < 0 ? 1.3 : 1.15; });
  const m = new THREE.Mesh(g, skinMat);
  m.position.set(side * 0.116, -0.01, -0.012);
  m.rotation.set(0.15, side * 0.35, side * 0.15);
  m.castShadow = true;
  return m;
}

function makeEye(side) {
  const group = new THREE.Group();
  const sclera = new THREE.Mesh(
    new THREE.SphereGeometry(0.0172, 24, 16),
    new THREE.MeshPhysicalMaterial({
      color: COL.eyeWhite, roughness: 0.22, metalness: 0,
      clearcoat: 0.4, clearcoatRoughness: 0.2, envMapIntensity: 0.4,
    }),
  );
  sclera.scale.set(1.2, 0.98, 0.95);
  group.add(sclera);

  const iris = new THREE.Mesh(
    new THREE.CircleGeometry(0.0112, 32),
    new THREE.MeshPhysicalMaterial({ map: IRIS_MAP, roughness: 0.25, metalness: 0, envMapIntensity: 0.3 }),
  );
  iris.position.z = 0.0152;
  group.add(iris);

  const cornea = new THREE.Mesh(
    new THREE.SphereGeometry(0.0122, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff, roughness: 0.08, metalness: 0, transparent: true, opacity: 0.18,
      clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 0.8, depthWrite: false,
    }),
  );
  cornea.rotation.x = Math.PI;
  cornea.position.z = 0.008;
  group.add(cornea);

  const hl = new THREE.Mesh(
    new THREE.CircleGeometry(0.0034, 12),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 }),
  );
  hl.position.set(-0.0034 * side, 0.0038, 0.0162);
  group.add(hl);
  const hl2 = new THREE.Mesh(
    new THREE.CircleGeometry(0.0016, 10),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.65 }),
  );
  hl2.position.set(0.004 * side, -0.003, 0.016);
  group.add(hl2);

  const upper = new THREE.Mesh(
    new THREE.SphereGeometry(0.019, 20, 10, 0, Math.PI * 2, 0, Math.PI * 0.42),
    skinMat,
  );
  upper.rotation.x = Math.PI;
  upper.scale.set(1.25, 0.62, 1.0);
  upper.position.set(0, 0.0055, 0.0005);
  group.add(upper);

  const lower = new THREE.Mesh(
    new THREE.SphereGeometry(0.018, 20, 8, 0, Math.PI * 2, 0, Math.PI * 0.32),
    skinMat,
  );
  lower.scale.set(1.22, 0.5, 0.95);
  lower.position.set(0, -0.008, 0.0005);
  group.add(lower);

  const lash = new THREE.Mesh(
    new THREE.PlaneGeometry(0.042, 0.012),
    new THREE.MeshBasicMaterial({ map: LASH_MAP, transparent: true, depthWrite: false, side: THREE.DoubleSide }),
  );
  lash.position.set(0, 0.0095, 0.015);
  lash.rotation.x = -0.28;
  group.add(lash);

  const liner = new THREE.Mesh(
    new THREE.TorusGeometry(0.0158, 0.0007, 6, 20, Math.PI * 0.95),
    new THREE.MeshBasicMaterial({ color: 0x1a1218 }),
  );
  liner.rotation.set(1.2, 0, Math.PI);
  liner.position.set(0, 0.004, 0.013);
  liner.scale.set(1.18, 0.68, 1);
  group.add(liner);

  group.position.set(side * 0.0365, 0.010, 0.096);
  group.rotation.set(-0.04, side * 0.18, side * 0.03);
  group.scale.set(1.12, 1.08, 1.05);
  group.userData.upper = upper;
  group.userData.upperBase = upper.rotation.x;
  return group;
}

function makeBrows() {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: COL.brow, roughness: 0.65, metalness: 0, side: THREE.DoubleSide });
  for (const s of [-1, 1]) {
    const pts = [
      v3(s * 0.014, 0.032, 0.104),
      v3(s * 0.030, 0.037, 0.108),
      v3(s * 0.048, 0.035, 0.104),
      v3(s * 0.060, 0.028, 0.094),
    ];
    g.add(new THREE.Mesh(ribbonGeo(pts, 0.0046, 0.0024, 10, 0.35, v3(0, 1, 0.15)), mat));
  }
  return g;
}

function makeNose() {
  const g = new THREE.Group();
  add(g, new THREE.SphereGeometry(0.0105, 16, 12), skinMat, 0, -0.014, 0.112, 0, 0, 0, 0.85, 0.80, 0.75);
  add(g, new THREE.SphereGeometry(0.011, 12, 10), skinMat, 0, 0.002, 0.106, 0, 0, 0, 0.42, 1.2, 0.45);
  const ns = new THREE.MeshStandardMaterial({ color: 0xc89a94, roughness: 0.6, transparent: true, opacity: 0.35, depthWrite: false });
  add(g, new THREE.CircleGeometry(0.003, 10), ns, -0.0052, -0.021, 0.112, 0.9, 0.4, 0);
  add(g, new THREE.CircleGeometry(0.003, 10), ns, 0.0052, -0.021, 0.112, 0.9, -0.4, 0);
  return g;
}

function makeLips() {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhysicalMaterial({
    color: COL.lip, roughness: 0.32, metalness: 0,
    sheen: 0.4, sheenColor: new THREE.Color(0xffc0c0),
    clearcoat: 0.25, clearcoatRoughness: 0.3, envMapIntensity: 0.35,
  });
  const lowerMat = mat.clone();
  lowerMat.color = new THREE.Color(COL.lipDeep).lerp(new THREE.Color(COL.lip), 0.45);
  lowerMat.clearcoat = 0.4;
  const upper = new THREE.Mesh(new THREE.SphereGeometry(0.022, 20, 12), mat);
  upper.scale.set(0.78, 0.24, 0.30);
  upper.position.set(0, -0.040, 0.104);
  upper.rotation.x = -0.15;
  g.add(upper);
  const lower = new THREE.Mesh(new THREE.SphereGeometry(0.02, 20, 12), lowerMat);
  lower.scale.set(0.74, 0.22, 0.32);
  lower.position.set(0, -0.0475, 0.105);
  lower.rotation.x = 0.2;
  g.add(lower);
  const hl = new THREE.Mesh(
    new THREE.CircleGeometry(0.005, 10),
    new THREE.MeshBasicMaterial({ color: 0xffe8e4, transparent: true, opacity: 0.28, depthWrite: false }),
  );
  hl.position.set(-0.004, -0.046, 0.112);
  g.add(hl);
  return g;
}

function buildHead() {
  const head = new THREE.Group();
  head.name = 'head';
  const skull = new THREE.Mesh(sculptHead(0.122), skinMat);
  skull.castShadow = true;
  skull.receiveShadow = true;
  head.add(skull);
  head.add(makeEar(-1), makeEar(1));
  const eyeL = makeEye(-1);
  const eyeR = makeEye(1);
  head.add(eyeL, eyeR);
  head.add(makeBrows(), makeNose(), makeLips());
  head.userData.eyes = [eyeL, eyeR];
  lathe([[0.038, 0.02], [0.041, -0.02], [0.046, -0.07], [0.052, -0.11], [0.058, -0.145]], 24, skinMat, head, -0.10);
  return head;
}

/* -------------------- hair -------------------- */
function bangPoint(u, v) {
  // u: 0 her left (+X, short, left eye visible), 1 her right (−X, long, covers eye)
  // v: 0 hairline, 1 fringe — each column follows the skull
  const phi = lerp(Math.PI - 0.55, 0.55, u); // +X, through +Z, to -X
  const thetaTop = 0.92;
  const thetaBot = lerp(1.20, 1.86, Math.pow(u, 0.65));
  const jag = 0.035 * Math.sin(u * 19.0) * v * v;
  const theta = lerp(thetaTop, thetaBot, v) + jag;
  const r = 0.130 + 0.004 * v;
  const x = -Math.cos(phi) * Math.sin(theta) * r;
  const y = Math.cos(theta) * r + 0.008;
  const z = Math.sin(phi) * Math.sin(theta) * r + 0.006;
  return [x, y, z];
}

function gridSurface(fn, wu, wv, mat) {
  const pos = [], uv = [], idx = [];
  for (let j = 0; j <= wv; j++) {
    const v = j / wv;
    for (let i = 0; i <= wu; i++) {
      const u = i / wu;
      const p = fn(u, v);
      pos.push(p[0], p[1], p[2]);
      uv.push(u, v);
    }
  }
  for (let j = 0; j < wv; j++) {
    for (let i = 0; i < wu; i++) {
      const a = j * (wu + 1) + i;
      idx.push(a, a + 1, a + wu + 1, a + 1, a + wu + 2, a + wu + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, mat);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function backHairPoint(u, v) {
  // u around the back: 0 her left, 1 her right. Excludes the face.
  const phi = lerp(Math.PI - 0.25, Math.PI * 2 + 0.25, u);
  const thetaTop = 0.18;
  const thetaSphere = lerp(thetaTop, 1.55, Math.min(1, v / 0.45));
  const r = 0.131;
  let x = -Math.cos(phi) * Math.sin(thetaSphere) * r;
  let y = Math.cos(thetaSphere) * r + 0.008;
  let z = Math.sin(phi) * Math.sin(thetaSphere) * r;
  if (v > 0.45) {
    const t = (v - 0.45) / 0.55;
    const fall = t * t * (3 - 2 * t);
    y = lerp(y, -0.55, fall);
    const spread = 0.13 + 0.03 * fall;
    const phi2 = phi;
    x = -Math.cos(phi2) * spread * (0.85 + 0.15 * Math.sin(phi2));
    z = Math.sin(phi2) * Math.max(0.06, spread * 0.55) * -Math.sign(Math.sin(phi2) || 1);
    // keep hanging behind the shoulders / back
    z = -0.05 - 0.07 * fall - 0.02 * Math.sin((u) * Math.PI);
    const side = (u - 0.5) * 2; // -1..1
    x = side * (0.11 + 0.03 * fall);
    // blend from sphere position
    const p0x = -Math.cos(phi) * Math.sin(1.55) * r;
    const p0y = Math.cos(1.55) * r + 0.008;
    const p0z = Math.sin(phi) * Math.sin(1.55) * r;
    x = lerp(p0x, x, fall);
    y = lerp(p0y, -0.52, fall);
    z = lerp(p0z, -0.06 - 0.05 * fall, fall);
  }
  return [x, y, z];
}

function buildHair() {
  const hair = new THREE.Group();
  hair.name = 'hair';

  // Crown only — stops well above the eyes / hairline
  const crown = new THREE.SphereGeometry(0.128, 48, 22, 0, Math.PI * 2, 0, Math.PI * 0.34);
  deformShell(crown, (v) => { if (v.z < 0) v.z *= 1.03; v.y += 0.006; });
  add(hair, crown, hairDarkMat, 0, 0.006, -0.004);

  // Back + sides, explicitly skipping the face (+Z)
  const backCap = new THREE.SphereGeometry(
    0.130, 40, 24,
    Math.PI - 0.7, Math.PI + 1.4,
    0, Math.PI * 0.74,
  );
  deformShell(backCap, (v) => { v.y += 0.004; });
  add(hair, backCap, hairDarkMat, 0, 0.004, -0.004);

  // Long back fall
  hair.add(gridSurface(backHairPoint, 20, 16, hairMat));
  hair.add(gridSurface((u, v) => {
    const p = backHairPoint(u, v);
    p[2] -= 0.012; p[1] -= 0.008;
    return p;
  }, 14, 10, hairDarkMat));

  // Long front locks — fuller, closer to the cheeks
  const frontLock = (s) => {
    const pts = [
      [s * 0.088, 0.07, 0.02],
      [s * 0.098, -0.02, 0.055],
      [s * 0.108, -0.14, 0.07],
      [s * 0.118, -0.28, 0.055],
      [s * 0.114, -0.42, 0.035],
      [s * 0.100, -0.56, 0.015],
    ];
    const m = new THREE.Mesh(taperedTube(pts, 0.020, 0.011, 20, 7), hairMat);
    m.castShadow = true;
    hair.add(m);
    for (const k of [0, 1, 2]) {
      const ox = s * (0.01 + k * 0.008);
      const oz = (k - 1) * 0.012;
      const p2 = pts.map((p, i) => [p[0] + ox, p[1] - k * 0.01, p[2] + oz]);
      const t = new THREE.Mesh(taperedTube(p2, 0.009, 0.004, 16, 5), hairMat);
      t.castShadow = true;
      hair.add(t);
    }
  };
  frontLock(-1);
  frontLock(1);

  // BANGS — smooth swept mass, diagonal fringe, left eye open
  const bangs = new THREE.Group();
  bangs.name = 'bangs';
  bangs.add(gridSurface(bangPoint, 28, 12, hairMat));
  // thickness layer
  bangs.add(gridSurface((u, v) => {
    const p = bangPoint(u, v);
    p[2] += 0.006; p[1] += 0.002;
    return p;
  }, 20, 8, hairMat));

  // Soft side coverage around the ears (flattened, blended, not "buns")
  for (const s of [-1, 1]) {
    const g = new THREE.SphereGeometry(0.07, 16, 12);
    deformShell(g, (v) => { v.x *= 0.38; v.y *= 1.15; v.z *= 0.75; });
    add(hair, g, hairMat, s * 0.108, 0.01, -0.028);
  }
  hair.add(bangs);
  hair.userData.bangs = bangs;
  return hair;
}

/* -------------------- cap (garrison / side cap) -------------------- */
function buildCap() {
  const cap = new THREE.Group();
  cap.name = 'cap';

  // Folded garrison cap: two slim curved panels + a ridge
  function panel(zSign) {
    const g = new THREE.BoxGeometry(0.078, 0.028, 0.022, 10, 3, 2);
    deformShell(g, (v) => {
      const t = v.x / 0.039;
      v.y += 0.008 * (1 - t * t);
      v.z += zSign * 0.003 * (1 - t * t);
      v.z *= 1 - 0.3 * Math.abs(t);
      v.y *= 1 - 0.2 * Math.abs(t);
      // slightly boat-tapered ends
      if (Math.abs(t) > 0.7) v.x *= 0.96;
    });
    return add(cap, g, capMat, 0, 0, zSign * 0.009);
  }
  panel(1); panel(-1);

  const ridge = [];
  for (let i = 0; i <= 14; i++) {
    const t = i / 14;
    const x = lerp(-0.038, 0.038, t);
    const y = 0.016 + 0.008 * (1 - (x / 0.038) ** 2);
    ridge.push(v3(x, y, 0));
  }
  add(cap, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ridge), 14, 0.0018, 6, false), goldMat);

  const edge = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    const x = lerp(-0.032, 0.032, t);
    edge.push(v3(x, -0.012 + 0.003 * (1 - (x / 0.032) ** 2), 0.020));
  }
  add(cap, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(edge), 10, 0.0014, 5, false), goldMat);

  // Red + gold cockade, on the side that faces the camera from the front
  add(cap, new THREE.BoxGeometry(0.008, 0.018, 0.0035), new THREE.MeshPhysicalMaterial({ color: COL.capRed, roughness: 0.4, metalness: 0.1 }), 0.008, 0.001, 0.021);
  add(cap, new THREE.BoxGeometry(0.012, 0.0032, 0.004), goldMat, 0.008, 0.010, 0.022);
  add(cap, new THREE.BoxGeometry(0.012, 0.0026, 0.004), goldMat, 0.008, -0.007, 0.022);

  // Perch on the crown, toward her left (+X), slightly back; badge readable from the front
  // Sit on the front-left of the crown; long axis left-right so the badge reads from the front
  cap.position.set(0.032, 0.112, 0.038);
  cap.rotation.set(0.28, 0.45, 0.35);
  cap.scale.set(1.08, 1.05, 1.0);
  return cap;
}

/* -------------------- body / coat -------------------- */
function orientBetween(mesh, a, b) {
  const dir = b.clone().sub(a);
  const len = dir.length();
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return len;
}

function buildBody() {
  const body = new THREE.Group();
  body.name = 'body';

  // Modest, tailored torso
  lathe([
    [0.115, 0.00],
    [0.122, 0.05],
    [0.132, 0.12],
    [0.148, 0.20],
    [0.152, 0.26],
    [0.140, 0.32],
    [0.112, 0.37],
    [0.078, 0.405],
    [0.058, 0.43],
  ], 36, coatMat, body, 1.02);

  // Shoulders + sleeves hanging down (not toward camera)
  for (const s of [-1, 1]) {
    add(body, new THREE.SphereGeometry(0.062, 18, 14), coatMat, s * 0.148, 1.355, -0.005, 0, 0, 0, 1.2, 0.78, 1.0);
    const a = v3(s * 0.175, 1.33, 0.00);
    const b = v3(s * 0.22, 1.10, 0.03);
    const len = a.distanceTo(b);
    const sl = new THREE.Mesh(new THREE.CylinderGeometry(0.050, 0.044, len, 16, 2), coatMat);
    orientBetween(sl, a, b);
    sl.castShadow = true;
    sl.receiveShadow = true;
    body.add(sl);
    // soft sleeve end cap so we never stare down a hollow tube
    add(body, new THREE.SphereGeometry(0.044, 12, 10), coatMat, b.x, b.y, b.z);
  }

  // Standing collar immediately under the jaw, flared slightly forward so it reads in a front view
  const frontPhi = -Math.PI / 2;
  const gap = 0.85;
  const phi0 = frontPhi + gap / 2;
  const phiLen = Math.PI * 2 - gap;
  const collarOut = new THREE.Mesh(
    new THREE.CylinderGeometry(0.062, 0.055, 0.042, 32, 1, true, phi0, phiLen),
    coatMat,
  );
  collarOut.position.set(0, 1.418, 0.012);
  collarOut.castShadow = true;
  body.add(collarOut);
  const collarIn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.057, 0.050, 0.040, 32, 1, true, phi0, phiLen),
    navyMat,
  );
  collarIn.position.set(0, 1.418, 0.012);
  body.add(collarIn);
  const colPipe = [];
  for (let i = 0; i <= 28; i++) {
    const a = phi0 + (i / 28) * phiLen;
    colPipe.push(v3(Math.cos(a) * 0.062, 1.439, -Math.sin(a) * 0.062 + 0.012));
  }
  add(body, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(colPipe), 28, 0.0018, 5, false), goldMat);

  // Two front collar leaves — the visible white points with navy lining and gold edges
  for (const s of [-1, 1]) {
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.052, 0.014), coatMat);
    leaf.position.set(s * 0.030, 1.422, 0.058);
    leaf.rotation.set(-0.35, s * 0.7, s * 0.08);
    leaf.castShadow = true;
    body.add(leaf);
    const inner = new THREE.Mesh(new THREE.BoxGeometry(0.040, 0.046, 0.006), navyMat);
    inner.position.set(s * 0.028, 1.422, 0.066);
    inner.rotation.copy(leaf.rotation);
    body.add(inner);
    const we = [
      v3(s * 0.012, 1.445, 0.070),
      v3(s * 0.036, 1.425, 0.082),
      v3(s * 0.030, 1.400, 0.078),
    ];
    add(body, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(we), 8, 0.0017, 5, false), goldMat);
  }

  // Slim lapels hanging a short way down from the collar, framing the cravat
  function lapel(s) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.045);
    shape.lineTo(s * 0.022, 0.01);
    shape.lineTo(s * 0.018, -0.048);
    shape.lineTo(s * 0.004, -0.05);
    shape.lineTo(0, 0.0);
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, { depth: 0.008, bevelEnabled: true, bevelThickness: 0.0012, bevelSize: 0.0012, bevelSegments: 1 });
    const m = new THREE.Mesh(g, navyMat);
    m.position.set(s * 0.016, 1.385, 0.125);
    m.rotation.set(-0.4, s * 0.2, s * 0.03);
    m.castShadow = true;
    body.add(m);
    const edge = [
      v3(s * 0.018, 1.425, 0.130),
      v3(s * 0.036, 1.395, 0.142),
      v3(s * 0.030, 1.345, 0.138),
    ];
    add(body, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(edge), 8, 0.0017, 5, false), goldMat);
  }
  lapel(-1); lapel(1);

  // Modest red vest filling the opening
  add(body, new THREE.BoxGeometry(0.075, 0.13, 0.035), vestMat, 0, 1.24, 0.115);

  return body;
}

/* -------------------- brooch + cravat -------------------- */
function buildBrooch() {
  const g = new THREE.Group();
  g.name = 'brooch';
  const heart = new THREE.Shape();
  heart.moveTo(0, -0.022);
  heart.bezierCurveTo(0.022, -0.006, 0.026, 0.012, 0.012, 0.020);
  heart.bezierCurveTo(0.005, 0.024, 0, 0.016, 0, 0.012);
  heart.bezierCurveTo(0, 0.016, -0.005, 0.024, -0.012, 0.020);
  heart.bezierCurveTo(-0.026, 0.012, -0.022, -0.006, 0, -0.022);
  const hg = new THREE.ExtrudeGeometry(heart, { depth: 0.008, bevelEnabled: true, bevelThickness: 0.0025, bevelSize: 0.0022, bevelSegments: 2 });
  const hm = new THREE.Mesh(hg, goldMat);
  hm.position.z = -0.004;
  hm.castShadow = true;
  g.add(hm);
  add(g, new THREE.TorusGeometry(0.012, 0.0017, 8, 20), goldSoftMat, 0, 0.002, 0.008);
  add(g, new THREE.TorusGeometry(0.0075, 0.0013, 8, 16), goldMat, 0, 0.001, 0.010);
  add(g, new THREE.SphereGeometry(0.005, 12, 10), new THREE.MeshPhysicalMaterial({
    color: 0x6a1020, roughness: 0.15, metalness: 0.2, clearcoat: 0.8, clearcoatRoughness: 0.1, envMapIntensity: 1,
  }), 0, 0.001, 0.013);
  for (const s of [-1, 1]) {
    add(g, new THREE.TorusGeometry(0.009, 0.0014, 6, 14, Math.PI * 1.1), goldMat, s * 0.018, 0.0, 0.006, 0.4, s * 0.9, 0);
    add(g, new THREE.SphereGeometry(0.0028, 8, 6), goldMat, s * 0.024, -0.006, 0.008);
  }
  g.scale.setScalar(1.05);
  return g;
}

function buildCravat() {
  const g = new THREE.Group();
  g.name = 'cravat';
  // Neat downward jabot: stacked, slightly overlapping pleated fans
  const layers = 3;
  for (let layer = 0; layer < layers; layer++) {
    const n = 11;
    const baseY = -0.002 - layer * 0.010;
    const baseZ = 0.004 + layer * 0.003;
    const len0 = 0.056 - layer * 0.004;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const ang = lerp(-0.85, 0.85, t);
      const len = len0 + Math.cos(ang) * 0.012;
      const geo = new THREE.BoxGeometry(0.012, len, 0.0035, 1, 4, 1);
      deformShell(geo, (v) => {
        const k = (v.y + len / 2) / len;
        v.z += k * k * 0.012;
      });
      const mat = (i + layer) % 2 === 0 ? cravatMat : cravatLiteMat;
      const m = new THREE.Mesh(geo, mat);
      m.position.set(Math.sin(ang) * (0.008 + layer * 0.004), baseY - len * 0.38, baseZ);
      m.rotation.set(0.55, 0, ang * 0.95);
      m.castShadow = true;
      g.add(m);
    }
  }
  return g;
}

/* -------------------- assemble -------------------- */
const officer = new THREE.Group();
officer.name = 'officer';

const body = buildBody();
officer.add(body);

const head = buildHead();
head.position.set(0, 1.555, 0);
officer.add(head);

const hair = buildHair();
head.add(hair);

const cap = buildCap();
head.add(cap);

const brooch = buildBrooch();
brooch.position.set(0, 1.408, 0.132);
officer.add(brooch);

const cravat = buildCravat();
cravat.position.set(0, 1.392, 0.128);
officer.add(cravat);

scene.add(officer);

/* -------------------- views -------------------- */
function setView(name) {
  const target = new THREE.Vector3(0, 1.455, 0.02);
  let d = 1.12;
  let y = 1.48;
  let a = 0;
  if (name === 'three_quarter' || name === 'q34') { a = 36 * Math.PI / 180; d = 1.18; }
  else if (name === 'side') { a = 90 * Math.PI / 180; d = 1.22; y = 1.47; }
  else if (name === 'q34l') { a = -36 * Math.PI / 180; d = 1.18; }
  camera.position.set(Math.sin(a) * d, y, Math.cos(a) * d);
  controls.target.copy(target);
  camera.lookAt(target);
  controls.update();
}
setView(VIEW);

/* -------------------- animation -------------------- */
const eyes = head.userData.eyes;
let nextBlink = 1.8;
let blinking = false;
let blinkPhase = 0;

function blinkValue(p) {
  if (p < 0.35) return smooth(p / 0.35);
  if (p < 0.48) return 1;
  return 1 - smooth((p - 0.48) / 0.52);
}

const clock = new THREE.Clock();
let frame = 0;

function animate() {
  const dt = Math.min(0.05, clock.getDelta() || 0.016);
  const t = clock.elapsedTime;

  if (!SHOT) {
    const br = Math.sin(t * 1.15) * 0.005;
    body.scale.set(1 + br * 0.3, 1 + br, 1 + br * 0.2);
    head.position.y = 1.555 + br * 0.035;
    head.rotation.x = Math.sin(t * 0.4) * 0.012;
    head.rotation.y = Math.sin(t * 0.27) * 0.02;
    head.rotation.z = Math.sin(t * 0.33) * 0.008;
    if (hair.userData.bangs) {
      hair.userData.bangs.rotation.z = Math.sin(t * 0.8) * 0.012;
      hair.userData.bangs.rotation.y = Math.sin(t * 0.55) * 0.01;
    }
    hair.rotation.y = Math.sin(t * 0.5) * 0.01;
    hair.rotation.z = Math.sin(t * 0.65 + 1) * 0.007;

    if (!blinking) {
      nextBlink -= dt;
      if (nextBlink <= 0) { blinking = true; blinkPhase = 0; }
    } else {
      blinkPhase += dt / 0.16;
      const v = blinkValue(Math.min(1, blinkPhase));
      for (const e of eyes) {
        const u = e.userData.upper;
        if (u) u.rotation.x = e.userData.upperBase + v * 0.85;
        e.scale.y = 1.08 - v * 0.55;
      }
      if (blinkPhase >= 1) {
        blinking = false;
        nextBlink = 2.4 + Math.random() * 3.2;
        for (const e of eyes) {
          const u = e.userData.upper;
          if (u) u.rotation.x = e.userData.upperBase;
          e.scale.y = 1.08;
        }
      }
    }
  }

  controls.update();
  renderer.render(scene, camera);
  frame++;
  if (frame === 4) {
    const tris = renderer.info.render.triangles;
    window.__tris = tris;
    window.__ready = true;
    window.__stats = { tris, view: VIEW };
    console.log('[officer] triangles', tris);
  }
  if (SHOT && frame === 8) return;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

window.__capture = () => renderer.domElement.toDataURL('image/png');
window.setView = setView;
