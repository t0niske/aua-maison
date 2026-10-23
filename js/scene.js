/* Hero 3D: procedural Nova 1000 diffuser with rising scent mist (Three.js r128) */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const fail = () => document.documentElement.classList.add('no-webgl');
  if (!window.THREE) return fail();

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) { return fail(); }

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 0.4, 9.2);

  /* lights: warm key, champagne rim, cool fill */
  scene.add(new THREE.HemisphereLight(0xdfe6ff, 0x0a0805, 0.35));
  const key = new THREE.DirectionalLight(0xfff1dc, 1.1); key.position.set(7, 4, 2.5); scene.add(key);
  const rim = new THREE.DirectionalLight(0xc9b48a, 3.6); rim.position.set(-5, 2, -4); scene.add(rim);
  const rim2 = new THREE.DirectionalLight(0xc9b48a, 1.8); rim2.position.set(5, 1, -3); scene.add(rim2);
  const fill = new THREE.PointLight(0x7f9cc4, 0.6, 20); fill.position.set(-4, -2, 5); scene.add(fill);
  const top = new THREE.PointLight(0xc9b48a, 2.4, 6); top.position.set(0, 2.6, 0.5); scene.add(top);

  /* simple studio env so metal has something to reflect */
  const envCanvas = document.createElement('canvas'); envCanvas.width = 256; envCanvas.height = 128;
  const ec = envCanvas.getContext('2d');
  const eg = ec.createLinearGradient(0, 0, 0, 128);
  eg.addColorStop(0, '#1d1d1f'); eg.addColorStop(.46, '#5a5245'); eg.addColorStop(.54, '#121316'); eg.addColorStop(1, '#030405');
  ec.fillStyle = eg; ec.fillRect(0, 0, 256, 128);
  ec.fillStyle = 'rgba(255,236,205,.55)'; ec.fillRect(30, 34, 26, 8); ec.fillRect(190, 30, 34, 6);
  const envTex = new THREE.CanvasTexture(envCanvas);
  envTex.mapping = THREE.EquirectangularReflectionMapping;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromEquirectangular(envTex).texture;

  const device = new THREE.Group();
  scene.add(device);

  /* body: rounded box 1.6 × 2.05 × 0.865 (mm/100 scale) */
  const W = 1.6, H = 2.05, D = 0.865, R = 0.12;
  const shape = new THREE.Shape();
  shape.moveTo(-W / 2 + R, -H / 2);
  shape.lineTo(W / 2 - R, -H / 2); shape.quadraticCurveTo(W / 2, -H / 2, W / 2, -H / 2 + R);
  shape.lineTo(W / 2, H / 2 - R); shape.quadraticCurveTo(W / 2, H / 2, W / 2 - R, H / 2);
  shape.lineTo(-W / 2 + R, H / 2); shape.quadraticCurveTo(-W / 2, H / 2, -W / 2, H / 2 - R);
  shape.lineTo(-W / 2, -H / 2 + R); shape.quadraticCurveTo(-W / 2, -H / 2, -W / 2 + R, -H / 2);
  const bodyGeo = new THREE.ExtrudeGeometry(shape, { depth: D - 0.08, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 6, curveSegments: 10 });
  bodyGeo.translate(0, 0, -(D - 0.08) / 2);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1c201f, metalness: 0.6, roughness: 0.42, envMapIntensity: 0.4 });
  device.add(new THREE.Mesh(bodyGeo, bodyMat));

  /* front glass panel with LED read-out */
  const led = document.createElement('canvas'); led.width = 256; led.height = 1024;
  const lc = led.getContext('2d');
  function drawLed(t) {
    lc.fillStyle = '#040506'; lc.fillRect(0, 0, 256, 1024);
    const dots = (str, x0, y0, s) => {
      const F = { '0': ['111', '101', '101', '101', '111'], '1': ['010', '110', '010', '010', '111'], '2': ['111', '001', '111', '100', '111'], '3': ['111', '001', '111', '001', '111'], '4': ['101', '101', '111', '001', '001'], '5': ['111', '100', '111', '001', '111'], '6': ['111', '100', '111', '101', '111'], '7': ['111', '001', '010', '010', '010'], '8': ['111', '101', '111', '101', '111'], '9': ['111', '101', '111', '001', '111'], ':': ['0', '1', '0', '1', '0'] };
      let x = x0;
      for (const ch of str) {
        const g = F[ch]; if (!g) { x += s * 2; continue; }
        g.forEach((row, ry) => [...row].forEach((v, rx) => {
          lc.fillStyle = v === '1' ? '#62B4FF' : 'rgba(98,180,255,.07)';
          lc.beginPath(); lc.arc(x + rx * s + s / 2, y0 + ry * s + s / 2, s * 0.36, 0, 7); lc.fill();
        }));
        x += (g[0].length + 1) * s;
      }
    };
    const pct = 72 + Math.round(Math.sin(t / 3000) * 2);
    dots(String(pct), 52, 120, 22);
    lc.fillStyle = 'rgba(98,180,255,.5)'; lc.fillRect(52, 260, 152, 4);
    lc.font = '500 30px monospace'; lc.fillStyle = '#62B4FF'; lc.textAlign = 'center';
    lc.fillText('AROMA %', 128, 320);
    lc.fillStyle = '#E24A4A'; lc.beginPath(); lc.arc(128, 470, 18, 0, 7); lc.fill();
    lc.fillStyle = '#040506'; lc.beginPath(); lc.arc(128, 470, 10, 0, 7); lc.fill();
    lc.fillStyle = '#E24A4A'; lc.fillRect(124, 444, 8, 22);
  }
  drawLed(0);
  const ledTex = new THREE.CanvasTexture(led);
  ledTex.encoding = THREE.sRGBEncoding;
  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.46, 1.8),
    new THREE.MeshStandardMaterial({ map: ledTex, emissiveMap: ledTex, emissive: 0xffffff, emissiveIntensity: 0.9, roughness: 0.12, metalness: 0.2 })
  );
  panel.position.set(0.28, -0.02, D / 2 + 0.002);
  device.add(panel);

  /* top fan grille */
  const grilleMat = new THREE.MeshStandardMaterial({ color: 0x0b0c0d, metalness: 0.4, roughness: 0.55 });
  const grille = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.62, 0.14, 48), grilleMat);
  grille.scale.set(1, 1, 0.62); grille.position.set(0, H / 2 + 0.07, 0); device.add(grille);
  for (let i = 1; i <= 4; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.13 * i, 0.012, 6, 48), new THREE.MeshStandardMaterial({ color: 0x222426, metalness: .6, roughness: .4 }));
    ring.rotation.x = Math.PI / 2; ring.scale.set(1, 0.62, 1); ring.position.set(0, H / 2 + 0.145, 0); device.add(ring);
  }

  /* side knob and feet */
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.06, 24), grilleMat);
  knob.rotation.z = Math.PI / 2; knob.position.set(-W / 2 - 0.05, 0.35, 0); device.add(knob);
  [[-0.55, 0.25], [0.55, 0.25], [-0.55, -0.25], [0.55, -0.25]].forEach(([x, z]) => {
    const f = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.1, 18), grilleMat);
    f.position.set(x, -H / 2 - 0.06, z); device.add(f);
  });

  /* scent mist: soft additive sprites rising from the grille */
  const spr = document.createElement('canvas'); spr.width = spr.height = 64;
  const sc = spr.getContext('2d');
  const rg = sc.createRadialGradient(32, 32, 0, 32, 32, 32);
  rg.addColorStop(0, 'rgba(255,245,225,1)'); rg.addColorStop(.4, 'rgba(230,210,170,.35)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
  sc.fillStyle = rg; sc.fillRect(0, 0, 64, 64);
  const N = reduce ? 0 : 260;
  const pos = new Float32Array(N * 3), seed = new Float32Array(N), vx = new Float32Array(N), vz = new Float32Array(N), sp = new Float32Array(N);
  for (let i = 0; i < N; i++) { seed[i] = Math.random(); vx[i] = (Math.random() - .5) * 3.4; vz[i] = (Math.random() - .5) * 1.4; sp[i] = .08 + Math.random() * .1; }
  const mistGeo = new THREE.BufferGeometry();
  mistGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mist = new THREE.Points(mistGeo, new THREE.PointsMaterial({
    size: 0.9, map: new THREE.CanvasTexture(spr), transparent: true, opacity: 0.09,
    depthWrite: false, blending: THREE.AdditiveBlending, color: 0xe9d9b8, sizeAttenuation: true
  }));
  scene.add(mist);

  /* sizing */
  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  }
  resize();
  addEventListener('resize', resize);

  /* interaction: pointer parallax + scroll spin */
  let mx = 0, my = 0, tx = 0, ty = 0, scrollT = 0;
  addEventListener('pointermove', e => { mx = (e.clientX / innerWidth - .5); my = (e.clientY / innerHeight - .5); }, { passive: true });
  addEventListener('scroll', () => { scrollT = Math.min(1, scrollY / innerHeight); }, { passive: true });

  let visible = true;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) loop(); }).observe(canvas);

  let last = 0, running = false;
  function frame(t) {
    running = false;
    if (!visible) return;
    const dt = Math.min(50, t - last || 16) / 1000; last = t;
    tx += (mx - tx) * 0.05; ty += (my - ty) * 0.05;
    const idle = reduce ? 0 : t / 7000;
    device.rotation.y = -0.55 + Math.sin(idle) * 0.25 + tx * 0.7 + scrollT * 1.6;
    device.rotation.x = 0.08 + ty * 0.25;
    device.position.y = (reduce ? 0 : Math.sin(t / 1600) * 0.06) - scrollT * 0.6;

    const ts = t / 1000;
    for (let i = 0; i < N; i++) {
      const s = seed[i];
      const life = (ts * sp[i] + s) % 1;          // 0 → 1 over the particle's life
      const ease = Math.pow(life, 1.4);             // slow start, then spreads out
      pos[i * 3] = vx[i] * ease + Math.sin(ts * .7 + s * 9) * .25 * life + tx * life * .8;
      pos[i * 3 + 1] = H / 2 + 0.15 + life * 3.2 + device.position.y;
      pos[i * 3 + 2] = vz[i] * ease;
    }
    mistGeo.attributes.position.needsUpdate = true;
    mist.material.opacity = 0.09 * (1 - scrollT * 0.7);

    if (!reduce && Math.floor(t / 1000) !== Math.floor((t - dt * 1000) / 1000)) { drawLed(t); ledTex.needsUpdate = true; }
    renderer.render(scene, camera);
    loop();
  }
  function loop() { if (!running) { running = true; requestAnimationFrame(frame); } }
  loop();
})();
