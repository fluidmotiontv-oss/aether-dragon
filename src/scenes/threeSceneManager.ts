import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LightingConfig, PerformanceStats, CameraPreset, SceneId } from '../types';
import { AudioSynthesizer } from '../audio/AudioSynthesizer';

export class ThreeSceneManager {
  private container: HTMLDivElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;

  private currentSceneId: SceneId = 'cyberpunk';
  private config: LightingConfig;
  private audioSynth: AudioSynthesizer;

  // Lights & Fog
  private dirLight: THREE.DirectionalLight;
  private ambientLight: THREE.AmbientLight;
  private fog: THREE.FogExp2;

  // Animation & Objects
  private animFrameId: number | null = null;
  private clock = new THREE.Clock();
  private sceneGroup = new THREE.Group();
  private particleSystem: THREE.Points | null = null;
  private particlePositions: Float32Array | null = null;
  private animatedObjects: Array<{ obj: THREE.Object3D; update: (time: number, audioBass: number, audioTreble: number) => void }> = [];

  // Interactive mouse tracking
  private mouse = new THREE.Vector2();
  private raycaster = new THREE.Raycaster();
  private mouseTargetLight: THREE.PointLight | null = null;

  // Telemetry
  private frameCount = 0;
  private lastFpsUpdate = 0;
  private stats: PerformanceStats = {
    fps: 60,
    frameTimeMs: 16.6,
    triangles: 0,
    drawCalls: 0,
    geometries: 0,
    textures: 0
  };
  private onStatsUpdate?: (stats: PerformanceStats) => void;

  constructor(
    container: HTMLDivElement,
    config: LightingConfig,
    audioSynth: AudioSynthesizer,
    onStatsUpdate?: (stats: PerformanceStats) => void
  ) {
    this.container = container;
    this.config = { ...config };
    this.audioSynth = audioSynth;
    this.onStatsUpdate = onStatsUpdate;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.add(this.sceneGroup);

    // 2. Camera
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    this.camera = new THREE.PerspectiveCamera(config.fov, width / height, 0.1, 1000);
    this.camera.position.set(0, 15, 35);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true, // Required for taking screenshot snapshots
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.container.appendChild(this.renderer.domElement);

    // 4. Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxDistance = 250;
    this.controls.minDistance = 2;

    // 5. Lighting Setup
    this.ambientLight = new THREE.AmbientLight(this.config.ambientColor, this.config.ambientIntensity);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(this.config.dirLightColor, this.config.dirLightIntensity);
    this.dirLight.position.set(this.config.dirLightX, this.config.dirLightY, this.config.dirLightZ);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.scene.add(this.dirLight);

    this.fog = new THREE.FogExp2(this.config.fogColor, this.config.fogDensity);
    this.scene.fog = this.fog;

    // Mouse listener
    window.addEventListener('mousemove', this.handleMouseMove);

    // Load initial scene
    this.buildScene(this.currentSceneId);

    // Start loop
    this.animate();
  }

  private handleMouseMove = (e: MouseEvent) => {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  };

  public resize(width: number, height: number) {
    if (width <= 0 || height <= 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public updateConfig(newConfig: Partial<LightingConfig>) {
    this.config = { ...this.config, ...newConfig };

    this.ambientLight.color.set(this.config.ambientColor);
    this.ambientLight.intensity = this.config.ambientIntensity;

    this.dirLight.color.set(this.config.dirLightColor);
    this.dirLight.intensity = this.config.dirLightIntensity;
    this.dirLight.position.set(this.config.dirLightX, this.config.dirLightY, this.config.dirLightZ);

    this.fog.color.set(this.config.fogColor);
    this.fog.density = this.config.fogDensity;
    this.scene.background = new THREE.Color(this.config.fogColor);

    if (this.camera.fov !== this.config.fov) {
      this.camera.fov = this.config.fov;
      this.camera.updateProjectionMatrix();
    }

    this.controls.autoRotate = this.config.autoRotate;
    this.controls.autoRotateSpeed = this.config.autoRotateSpeed;

    // Update wireframes in scene
    this.sceneGroup.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => { mat.wireframe = this.config.wireframe; });
        } else {
          child.material.wireframe = this.config.wireframe;
        }
      }
    });
  }

  public setCameraPreset(preset: CameraPreset) {
    switch (preset) {
      case 'cinematic_wide':
        this.camera.position.set(0, 25, 65);
        this.controls.target.set(0, 5, 0);
        break;
      case 'isometric':
        this.camera.position.set(35, 35, 35);
        this.controls.target.set(0, 0, 0);
        break;
      case 'top_down':
        this.camera.position.set(0, 70, 0.1);
        this.controls.target.set(0, 0, 0);
        break;
      case 'first_person':
        this.camera.position.set(0, 3, 12);
        this.controls.target.set(0, 3, 0);
        break;
      case 'orbit':
      default:
        this.camera.position.set(0, 15, 35);
        this.controls.target.set(0, 0, 0);
        break;
    }
    this.controls.update();
  }

  public buildScene(sceneId: SceneId) {
    this.currentSceneId = sceneId;

    // Clear previous objects
    while (this.sceneGroup.children.length > 0) {
      const obj = this.sceneGroup.children[0];
      this.sceneGroup.remove(obj);
    }
    this.animatedObjects = [];
    this.particleSystem = null;
    this.particlePositions = null;
    this.mouseTargetLight = null;

    switch (sceneId) {
      case 'cyberpunk':
        this.buildCyberpunkScene();
        break;
      case 'quantum_blackhole':
        this.buildBlackHoleScene();
        break;
      case 'zen_crystal_island':
        this.buildZenIslandScene();
        break;
      case 'bioluminescent_forest':
        this.buildAlienForestScene();
        break;
      case 'tesseract_lattice':
        this.buildTesseractScene();
        break;
    }
  }

  // ================= SCENE 1: NEON CYBERPUNK METROPOLIS =================
  private buildCyberpunkScene() {
    this.scene.background = new THREE.Color('#050714');
    this.fog.color.set('#050714');
    this.fog.density = 0.018;

    // 1. Wet Asphalt Grid Ground
    const gridGeo = new THREE.PlaneGeometry(120, 120, 60, 60);
    const gridMat = new THREE.MeshStandardMaterial({
      color: 0x0a0e1a,
      roughness: 0.1,
      metalness: 0.9,
      wireframe: this.config.wireframe
    });
    const ground = new THREE.Mesh(gridGeo, gridMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.sceneGroup.add(ground);

    // Glowing Cyan Grid Lines
    const gridHelper = new THREE.GridHelper(120, 40, 0x00f0ff, 0xff007f);
    gridHelper.position.y = 0.05;
    this.sceneGroup.add(gridHelper);

    // 2. Skyscrapers Generation
    const buildingCount = 36;
    for (let i = 0; i < buildingCount; i++) {
      const angle = (i / buildingCount) * Math.PI * 2;
      const radius = 22 + Math.random() * 32;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const height = 15 + Math.random() * 45;
      const width = 4 + Math.random() * 8;
      const depth = 4 + Math.random() * 8;

      const geo = new THREE.BoxGeometry(width, height, depth);
      const isNeonAccent = i % 3 === 0;

      const mat = new THREE.MeshStandardMaterial({
        color: isNeonAccent ? 0x091224 : 0x0e172a,
        roughness: 0.2,
        metalness: 0.8,
        emissive: isNeonAccent ? (i % 2 === 0 ? 0x00f0ff : 0xff007f) : 0x000000,
        emissiveIntensity: isNeonAccent ? 0.35 : 0,
        wireframe: this.config.wireframe
      });

      const building = new THREE.Mesh(geo, mat);
      building.position.set(x, height / 2, z);
      building.castShadow = true;
      building.receiveShadow = true;
      this.sceneGroup.add(building);

      // Top Emissive Beacon
      const topGeo = new THREE.SphereGeometry(0.8, 8, 8);
      const topMat = new THREE.MeshBasicMaterial({ color: isNeonAccent ? 0x00f0ff : 0xff007f });
      const beacon = new THREE.Mesh(topGeo, topMat);
      beacon.position.set(x, height + 0.8, z);
      this.sceneGroup.add(beacon);
    }

    // 3. Central Holographic Pyramid
    const pyrGeo = new THREE.OctahedronGeometry(6, 0);
    const pyrMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.8,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });
    const pyramid = new THREE.Mesh(pyrGeo, pyrMat);
    pyramid.position.set(0, 14, 0);
    this.sceneGroup.add(pyramid);

    this.animatedObjects.push({
      obj: pyramid,
      update: (t, bass) => {
        pyramid.rotation.y = t * 0.8;
        pyramid.rotation.z = Math.sin(t * 0.5) * 0.2;
        const scale = 1 + bass * 0.6;
        pyramid.scale.set(scale, scale, scale);
      }
    });

    // 4. Flying Cyber-Drones with Light Trails
    for (let d = 0; d < 3; d++) {
      const droneGroup = new THREE.Group();
      const bodyGeo = new THREE.ConeGeometry(1.2, 3, 4);
      bodyGeo.rotateX(Math.PI / 2);
      const bodyMat = new THREE.MeshBasicMaterial({ color: d % 2 === 0 ? 0x00f0ff : 0xff007f });
      const droneMesh = new THREE.Mesh(bodyGeo, bodyMat);
      droneGroup.add(droneMesh);

      const pLight = new THREE.PointLight(d % 2 === 0 ? 0x00f0ff : 0xff007f, 3, 20);
      droneGroup.add(pLight);

      this.sceneGroup.add(droneGroup);

      const offsetPhase = d * (Math.PI * 2 / 3);
      this.animatedObjects.push({
        obj: droneGroup,
        update: (t) => {
          const orbitR = 18 + d * 5;
          const speed = 0.6 + d * 0.2;
          const x = Math.cos(t * speed + offsetPhase) * orbitR;
          const z = Math.sin(t * speed + offsetPhase) * orbitR;
          const y = 12 + Math.sin(t * 1.5 + d) * 4;

          droneGroup.position.set(x, y, z);
          droneGroup.lookAt(
            Math.cos((t + 0.1) * speed + offsetPhase) * orbitR,
            y,
            Math.sin((t + 0.1) * speed + offsetPhase) * orbitR
          );
        }
      });
    }

    // 5. Volumetric Rain Particles
    this.createRainParticles();
  }

  private createRainParticles() {
    const count = this.config.particleCount;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = Math.random() * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x67e8f9,
      size: 0.35,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.particlePositions = positions;
    this.sceneGroup.add(this.particleSystem);
  }

  // ================= SCENE 2: QUANTUM COSMIC BLACK HOLE =================
  private buildBlackHoleScene() {
    this.scene.background = new THREE.Color('#020208');
    this.fog.color.set('#020208');
    this.fog.density = 0.005;

    // 1. Event Horizon Black Sphere
    const horizonGeo = new THREE.SphereGeometry(7, 64, 64);
    const horizonMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const eventHorizon = new THREE.Mesh(horizonGeo, horizonMat);
    this.sceneGroup.add(eventHorizon);

    // Glowing Event Horizon Halo Ring
    const haloGeo = new THREE.RingGeometry(7.1, 7.8, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xff9900,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    this.sceneGroup.add(halo);

    // 2. Swirling Relativistic Accretion Disk Particles
    const count = this.config.particleCount;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const cInner = new THREE.Color(0xffffff);
    const cMid = new THREE.Color(0xff9900);
    const cOuter = new THREE.Color(0xb026ff);

    for (let i = 0; i < count; i++) {
      const radius = 8 + Math.random() * 28;
      const angle = Math.random() * Math.PI * 2;
      const spreadY = (Math.random() - 0.5) * (1.2 * (radius / 15));

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = spreadY;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      // Color Gradient by Radius
      const ratio = (radius - 8) / 28;
      const color = ratio < 0.3 ? cInner.clone().lerp(cMid, ratio / 0.3) : cMid.clone().lerp(cOuter, (ratio - 0.3) / 0.7);

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.particlePositions = positions;
    this.sceneGroup.add(this.particleSystem);

    // 3. Polar Relativistic Plasma Jets (Top & Bottom)
    for (let direction = -1; direction <= 1; direction += 2) {
      const jetGeo = new THREE.ConeGeometry(3, 30, 32, 1, true);
      const jetMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.35,
        wireframe: true,
        blending: THREE.AdditiveBlending
      });
      const jet = new THREE.Mesh(jetGeo, jetMat);
      jet.position.y = direction * 18;
      jet.rotation.x = direction === 1 ? 0 : Math.PI;
      this.sceneGroup.add(jet);
    }

    // 4. Orbiting Quantum Monoliths
    for (let m = 0; m < 6; m++) {
      const monGeo = new THREE.BoxGeometry(1.5, 4.5, 0.8);
      const monMat = new THREE.MeshStandardMaterial({
        color: 0x11162b,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.5,
        roughness: 0.1,
        metalness: 0.9,
        wireframe: this.config.wireframe
      });
      const monolith = new THREE.Mesh(monGeo, monMat);
      this.sceneGroup.add(monolith);

      const orbitR = 16 + m * 3;
      const speed = 0.3 + m * 0.05;
      this.animatedObjects.push({
        obj: monolith,
        update: (t, bass) => {
          const angle = t * speed + (m * Math.PI / 3);
          monolith.position.set(Math.cos(angle) * orbitR, Math.sin(t * 0.8 + m) * 2, Math.sin(angle) * orbitR);
          monolith.rotation.y = t + m;
          monolith.rotation.x = Math.sin(t) * 0.3;
          if (bass > 0.4) {
            monolith.scale.set(1.2, 1.2, 1.2);
          } else {
            monolith.scale.set(1, 1, 1);
          }
        }
      });
    }
  }

  // ================= SCENE 3: ZEN FLOATING CRYSTAL ISLAND =================
  private buildZenIslandScene() {
    this.scene.background = new THREE.Color('#040e1a');
    this.fog.color.set('#040e1a');
    this.fog.density = 0.012;

    // 1. Floating Low-Poly Rock Island Base
    const islandGeo = new THREE.CylinderGeometry(18, 4, 12, 12);
    const islandMat = new THREE.MeshStandardMaterial({
      color: 0x1a2e3b,
      roughness: 0.8,
      flatShading: true,
      wireframe: this.config.wireframe
    });
    const island = new THREE.Mesh(islandGeo, islandMat);
    island.position.y = -6;
    island.receiveShadow = true;
    island.castShadow = true;
    this.sceneGroup.add(island);

    // Grassy Top Cap
    const grassGeo = new THREE.CylinderGeometry(18.2, 18, 1.5, 16);
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x0d3b2e,
      roughness: 0.6,
      wireframe: this.config.wireframe
    });
    const grassCap = new THREE.Mesh(grassGeo, grassMat);
    grassCap.position.y = 0.2;
    this.sceneGroup.add(grassCap);

    // 2. Audio-Reactive Bioluminescent Crystal Spires
    const crystalColors = [0x00ff99, 0x00e5ff, 0xb026ff, 0xffb300, 0x00e676];
    for (let c = 0; c < 7; c++) {
      const angle = (c / 7) * Math.PI * 2;
      const radius = 6 + Math.random() * 8;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const crystalGeo = new THREE.ConeGeometry(1.8, 12, 6);
      const crystalMat = new THREE.MeshStandardMaterial({
        color: crystalColors[c % crystalColors.length],
        emissive: crystalColors[c % crystalColors.length],
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.9,
        wireframe: this.config.wireframe
      });

      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      crystal.position.set(x, 6, z);
      crystal.rotation.z = (Math.random() - 0.5) * 0.3;
      crystal.rotation.x = (Math.random() - 0.5) * 0.3;
      crystal.castShadow = true;
      this.sceneGroup.add(crystal);

      // Audio-reactive scale & glow pulsing
      this.animatedObjects.push({
        obj: crystal,
        update: (t, bass, treble) => {
          const audioEnergy = c % 2 === 0 ? bass : treble;
          const scaleY = 1.0 + audioEnergy * 1.8;
          crystal.scale.set(1 + audioEnergy * 0.4, scaleY, 1 + audioEnergy * 0.4);
          crystalMat.emissiveIntensity = 0.5 + audioEnergy * 1.2;
        }
      });
    }

    // 3. Floating Sakura Petal Particles
    const count = this.config.particleCount;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = Math.random() * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffa3d7,
      size: 0.3,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.particlePositions = positions;
    this.sceneGroup.add(this.particleSystem);

    // 4. Orbiting Aurora Ring
    const ringGeo = new THREE.TorusGeometry(26, 0.8, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00ff99,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    const auroraRing = new THREE.Mesh(ringGeo, ringMat);
    auroraRing.rotation.x = Math.PI / 3;
    this.sceneGroup.add(auroraRing);

    this.animatedObjects.push({
      obj: auroraRing,
      update: (t) => {
        auroraRing.rotation.z = t * 0.2;
      }
    });
  }

  // ================= SCENE 4: BIOLUMINESCENT ALIEN FOREST =================
  private buildAlienForestScene() {
    this.scene.background = new THREE.Color('#030b14');
    this.fog.color.set('#030b14');
    this.fog.density = 0.025;

    // 1. Dark Mossy Ground Plane
    const groundGeo = new THREE.PlaneGeometry(100, 100, 40, 40);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x05151e,
      roughness: 0.9,
      wireframe: this.config.wireframe
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.sceneGroup.add(ground);

    // 2. Bioluminescent Alien Trees with Fiber-Optic Foliage
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const radius = 12 + Math.random() * 25;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const treeGroup = new THREE.Group();

      // Trunk
      const trunkGeo = new THREE.CylinderGeometry(0.8, 2.0, 14, 8);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x0a1d28, roughness: 0.7 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 7;
      treeGroup.add(trunk);

      // Glowing Foliage Canopy Orbs
      const crownGeo = new THREE.IcosahedronGeometry(4.5, 2);
      const crownMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x39ff14 : 0x7b2cbf,
        emissive: i % 2 === 0 ? 0x39ff14 : 0x7b2cbf,
        emissiveIntensity: 0.5,
        wireframe: this.config.wireframe
      });
      const crown = new THREE.Mesh(crownGeo, crownMat);
      crown.position.y = 15;
      treeGroup.add(crown);

      treeGroup.position.set(x, 0, z);
      this.sceneGroup.add(treeGroup);

      this.animatedObjects.push({
        obj: crown,
        update: (t, bass) => {
          crown.rotation.y = t * 0.5 + i;
          crownMat.emissiveIntensity = 0.4 + Math.sin(t * 2 + i) * 0.3 + bass * 0.8;
        }
      });
    }

    // 3. Interactive Mouse-Following Light Orb
    this.mouseTargetLight = new THREE.PointLight(0x00f0ff, 4, 30);
    this.mouseTargetLight.position.set(0, 5, 0);
    this.sceneGroup.add(this.mouseTargetLight);

    const orbGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const orbMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const orbMesh = new THREE.Mesh(orbGeo, orbMat);
    this.mouseTargetLight.add(orbMesh);

    // 4. Floating Spore Particles
    const count = this.config.particleCount;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = Math.random() * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x39ff14,
      size: 0.25,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.particlePositions = positions;
    this.sceneGroup.add(this.particleSystem);
  }

  // ================= SCENE 5: HYPERCUBE QUANTUM TESSERACT =================
  private buildTesseractScene() {
    this.scene.background = new THREE.Color('#020712');
    this.fog.color.set('#020712');
    this.fog.density = 0.008;

    const tesseractGroup = new THREE.Group();

    // 1. Outer Wireframe Cube
    const outerGeo = new THREE.BoxGeometry(16, 16, 16);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    const outerCube = new THREE.Mesh(outerGeo, outerMat);
    tesseractGroup.add(outerCube);

    // 2. Inner Refracting Glass/Chrome Cube
    const innerGeo = new THREE.BoxGeometry(8, 8, 8);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xffb300,
      emissive: 0xffb300,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.9,
      wireframe: this.config.wireframe
    });
    const innerCube = new THREE.Mesh(innerGeo, innerMat);
    tesseractGroup.add(innerCube);

    // 3. Connecting Beams between vertices
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array([
      -8, -8, -8,  -4, -4, -4,
       8, -8, -8,   4, -4, -4,
       8,  8, -8,   4,  4, -4,
      -8,  8, -8,  -4,  4, -4,
      -8, -8,  8,  -4, -4,  4,
       8, -8,  8,   4, -4,  4,
       8,  8,  8,   4,  4,  4,
      -8,  8,  8,  -4,  4,  4
    ]);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0xff007f, linewidth: 2 });
    const connectingLines = new THREE.LineSegments(lineGeo, lineMat);
    tesseractGroup.add(connectingLines);

    this.sceneGroup.add(tesseractGroup);

    this.animatedObjects.push({
      obj: tesseractGroup,
      update: (t, bass) => {
        tesseractGroup.rotation.x = t * 0.4;
        tesseractGroup.rotation.y = t * 0.6;

        innerCube.rotation.x = -t * 0.8;
        innerCube.rotation.y = -t * 0.8;

        const pulseScale = 1 + bass * 0.4;
        innerCube.scale.set(pulseScale, pulseScale, pulseScale);
      }
    });

    // 4. Laser Matrix Grid Rings
    for (let r = 0; r < 3; r++) {
      const ringGeo = new THREE.TorusGeometry(22 + r * 6, 0.4, 8, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: r % 2 === 0 ? 0x00f0ff : 0xffb300,
        wireframe: true,
        transparent: true,
        opacity: 0.5
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = (r * Math.PI) / 3;
      this.sceneGroup.add(ring);

      this.animatedObjects.push({
        obj: ring,
        update: (t) => {
          ring.rotation.z = t * (0.3 + r * 0.1);
        }
      });
    }

    // 5. Floating Dust Tetrahedrons
    const count = this.config.particleCount;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 90;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.3,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.particlePositions = positions;
    this.sceneGroup.add(this.particleSystem);
  }

  // ================= MAIN ANIMATION & RENDER LOOP =================
  private animate = () => {
    this.animFrameId = requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Audio Energies
    const bass = this.audioSynth.getBassEnergy() * this.config.audioReactivity;
    const treble = this.audioSynth.getTrebleEnergy() * this.config.audioReactivity;

    // Update Controls
    this.controls.update();

    // Update Interactive Mouse Light (Bioluminescent forest)
    if (this.mouseTargetLight) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const targetZ = 5;
      const dist = (targetZ - this.camera.position.z) / this.raycaster.ray.direction.z;
      const targetPos = this.camera.position.clone().add(this.raycaster.ray.direction.clone().multiplyScalar(dist));
      this.mouseTargetLight.position.lerp(targetPos, 0.1);
    }

    // Update Animated Objects
    this.animatedObjects.forEach((item) => {
      item.update(time, bass, treble);
    });

    // Update Particles
    if (this.particleSystem && this.particlePositions) {
      const positions = this.particlePositions;
      const count = positions.length / 3;
      const pSpeed = this.config.particleSpeed;

      for (let i = 0; i < count; i++) {
        if (this.currentSceneId === 'cyberpunk') {
          // Rain falling down
          positions[i * 3 + 1] -= (1.5 + (i % 5) * 0.5) * pSpeed;
          if (positions[i * 3 + 1] < 0) {
            positions[i * 3 + 1] = 80;
          }
        } else if (this.currentSceneId === 'quantum_blackhole') {
          // Swirling orbit around black hole
          const x = positions[i * 3];
          const z = positions[i * 3 + 2];
          const r = Math.sqrt(x * x + z * z);
          const angle = Math.atan2(z, x) + (0.02 * (30 / Math.max(r, 5))) * pSpeed;
          positions[i * 3] = Math.cos(angle) * r;
          positions[i * 3 + 2] = Math.sin(angle) * r;
        } else {
          // Gentle floating wave drift
          positions[i * 3 + 1] += Math.sin(time + i) * 0.02 * pSpeed;
        }
      }

      this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    // Render Scene
    this.renderer.render(this.scene, this.camera);

    // FPS Telemetry
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFpsUpdate >= 500) {
      const fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
      const info = this.renderer.info;

      this.stats = {
        fps: Math.min(fps, 120),
        frameTimeMs: Number((delta * 1000).toFixed(1)),
        triangles: info.render.triangles,
        drawCalls: info.render.calls,
        geometries: info.memory.geometries,
        textures: info.memory.textures
      };

      if (this.onStatsUpdate) {
        this.onStatsUpdate(this.stats);
      }

      this.frameCount = 0;
      this.lastFpsUpdate = now;
    }
  };

  public captureSnapshot(): string {
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL('image/png');
  }

  public dispose() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    window.removeEventListener('mousemove', this.handleMouseMove);

    this.controls.dispose();
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
