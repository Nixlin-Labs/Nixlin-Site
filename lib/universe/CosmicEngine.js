/**
 * NIXLIN Cosmic Universe — Core WebGL Engine
 * GPU-accelerated Three.js rendering engine managing:
 * - Intelligent Particle System with 5 metamorphic states
 * - Deep-space procedural atmosphere
 * - Distant celestial veil
 * - Physics-driven cursor influence fields & click shockwaves
 * - State interpolation & camera choreography
 * - Performance-tier adaptation and graceful WebGL lifecycle
 */

import * as THREE from 'three';
import {
  generateEmergence,
  generateExpansion,
  generateConvergence,
  generateHourglass,
  generateReorganization,
  generateParticleAttributes,
} from './formations';
import {
  particleVertexShader,
  particleFragmentShader,
  atmosphereVertexShader,
  atmosphereFragmentShader,
} from './particleShaders';

export class CosmicEngine {
  constructor(options = {}) {
    this.container = null;
    this.canvas = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.rafId = null;

    // Simulation state
    this.state = 0.0;
    this.targetState = 0.0;
    this.stateNames = ['Emergence', 'Expansion', 'Convergence', 'Hourglass', 'Reorganization'];

    // Performance & Device Tier
    this.tier = 'high'; // 'high' | 'medium' | 'low'
    this.particleCount = 24000;
    this.pixelRatio = 1.0;
    this.reducedMotion = options.reducedMotion ? 1.0 : 0.0;

    // Interaction coordinates
    this.mouseNDC = new THREE.Vector2(0, 0);
    this.targetMouseWorld = new THREE.Vector3(0, 0, 0);
    this.currentMouseWorld = new THREE.Vector3(0, 0, 0);
    this.mouseVelocity = new THREE.Vector3(0, 0, 0);
    this.lastMouseWorld = new THREE.Vector3(0, 0, 0);
    this.mouseRadius = 3.2;
    this.isPointerActive = false;

    // Shockwave pulse state
    this.pulseOrigin = new THREE.Vector3(0, 0, 0);
    this.pulseRadius = 0.0;
    this.pulseStrength = 0.0;

    // Camera choreography targets
    this.cameraBasePos = new THREE.Vector3(0, 0, 11.5);
    this.cameraTargetPos = new THREE.Vector3(0, 0, 11.5);
    this.cameraCurrentPos = new THREE.Vector3(0, 0, 11.5);

    // Objects
    this.particleGeometry = null;
    this.particleMaterial = null;
    this.particlePoints = null;

    this.atmosphereMesh = null;
    this.atmosphereMaterial = null;

    this.veilGeometry = null;
    this.veilMaterial = null;
    this.veilPoints = null;

    this.clock = new THREE.Timer();
    if (typeof document !== 'undefined') this.clock.connect(document);
    this.isPaused = false;
    this.disposed = false;

    // Bound listeners for clean disposal
    this.onResize = this.handleResize.bind(this);
    this.onPointerMove = this.handlePointerMove.bind(this);
    this.onPointerLeave = this.handlePointerLeave.bind(this);
    this.onPointerDown = this.handlePointerDown.bind(this);
    this.onVisibilityChange = this.handleVisibilityChange.bind(this);
    this.onContextLost = this.handleContextLost.bind(this);
    this.onContextRestored = this.handleContextRestored.bind(this);

    // Callbacks
    this.onStateChange = options.onStateChange || null;
  }

  detectDeviceTier() {
    if (typeof window === 'undefined') return;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    const width = window.innerWidth;
    const concurrency = navigator.hardwareConcurrency || 4;

    if (isMobile || width < 640 || concurrency < 4) {
      this.tier = 'low';
      this.particleCount = 5200;
      this.pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25);
      this.mouseRadius = 2.4;
    } else if (width < 1024 || concurrency < 8) {
      this.tier = 'medium';
      this.particleCount = 10500;
      this.pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      this.mouseRadius = 2.8;
    } else {
      this.tier = 'high';
      this.particleCount = 18000;
      this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2.0);
      this.mouseRadius = 3.4;
    }
  }

  init(container) {
    if (!container || typeof window === 'undefined') return;
    this.container = container;
    this.detectDeviceTier();

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 100);
    this.camera.position.copy(this.cameraBasePos);

    // 2. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: false,
      alpha: true,
      stencil: false,
      depth: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.canvas = this.renderer.domElement;
    this.canvas.className = 'absolute inset-0 w-full h-full pointer-events-none';
    this.canvas.setAttribute('aria-hidden', 'true');
    this.container.appendChild(this.canvas);

    // 3. Build Scene Elements
    this.buildAtmosphere(width, height);
    this.buildDistantVeil();
    this.buildParticleSystem();

    // 4. Attach Listeners
    window.addEventListener('resize', this.onResize);
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
    window.addEventListener('pointerdown', this.onPointerDown, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    this.canvas.addEventListener('webglcontextlost', this.onContextLost, false);
    this.canvas.addEventListener('webglcontextrestored', this.onContextRestored, false);

    // 5. Start Animation Loop
    this.clock.reset();
    this.animate();
  }

  buildAtmosphere(width, height) {
    const geo = new THREE.PlaneGeometry(2, 2);
    this.atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uState: { value: 0 },
        uReducedMotion: { value: this.reducedMotion },
      },
      depthWrite: false,
      depthTest: false,
    });

    this.atmosphereMesh = new THREE.Mesh(geo, this.atmosphereMaterial);
    this.atmosphereMesh.frustumCulled = false;
    this.scene.add(this.atmosphereMesh);
  }

  buildDistantVeil() {
    const count = this.tier === 'low' ? 600 : 1500;
    const positions = new Float32Array(count * 3);
    const rng = (seed) => {
      let s = seed;
      return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
      };
    };
    const r = rng(12345);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (r() - 0.5) * 36;
      positions[i3 + 1] = (r() - 0.5) * 30;
      positions[i3 + 2] = -5.0 - r() * 22.0; // Deep in the background
    }

    this.veilGeometry = new THREE.BufferGeometry();
    this.veilGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Refined distant veil: very subtle starfield for depth, not foreground texture
    this.veilMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying float vDepthAlpha;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = clamp(2.2 * (24.0 / -mvPosition.z), 0.8, 2.2);
          vDepthAlpha = 1.0 - smoothstep(5.0, 30.0, -mvPosition.z);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying float vDepthAlpha;
        void main() {
          float radius = length(gl_PointCoord - vec2(0.5));
          float alpha = (1.0 - smoothstep(0.22, 0.5, radius)) * vDepthAlpha * 0.12;
          if (alpha < 0.005) discard;
          gl_FragColor = vec4(vec3(0.31, 0.68, 0.41), alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.veilPoints = new THREE.Points(this.veilGeometry, this.veilMaterial);
    this.scene.add(this.veilPoints);
  }

  buildParticleSystem() {
    const N = this.particleCount;

    // 1. Generate formations for all 5 states
    const posEmergence = generateEmergence(N);
    const posExpansion = generateExpansion(N);
    const posConvergence = generateConvergence(N);
    const { positions: posHourglass, flowData } = generateHourglass(N);
    const posReorganize = generateReorganization(N);
    const { randoms, sizes, colorTypes } = generateParticleAttributes(N);

    // 2. Buffer Geometry
    this.particleGeometry = new THREE.BufferGeometry();
    this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(posEmergence, 3));
    this.particleGeometry.setAttribute('aTargetExpansion', new THREE.BufferAttribute(posExpansion, 3));
    this.particleGeometry.setAttribute('aTargetConvergence', new THREE.BufferAttribute(posConvergence, 3));
    this.particleGeometry.setAttribute('aTargetHourglass', new THREE.BufferAttribute(posHourglass, 3));
    this.particleGeometry.setAttribute('aTargetReorganize', new THREE.BufferAttribute(posReorganize, 3));
    this.particleGeometry.setAttribute('aFlowData', new THREE.BufferAttribute(flowData, 3));
    this.particleGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));
    this.particleGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    this.particleGeometry.setAttribute('aColorType', new THREE.BufferAttribute(colorTypes, 1));

    // 3. Custom Shader Material
    this.particleMaterial = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uState: { value: 0 },
        uMouseWorld: { value: new THREE.Vector3(0, 0, 0) },
        uMouseRadius: { value: this.mouseRadius },
        uPulseOrigin: { value: new THREE.Vector3(0, 0, 0) },
        uPulseRadius: { value: 0 },
        uPulseStrength: { value: 0 },
        uPixelRatio: { value: this.pixelRatio },
        uReducedMotion: { value: this.reducedMotion },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.particlePoints = new THREE.Points(this.particleGeometry, this.particleMaterial);
    this.scene.add(this.particlePoints);
  }

  setVisualState(targetIndex) {
    const clamped = Math.max(0, Math.min(4, targetIndex));
    this.targetState = clamped;
    if (this.onStateChange) {
      this.onStateChange(Math.round(clamped), this.stateNames[Math.round(clamped)]);
    }
  }

  setScrollProgress(progress) {
    // Maps scroll progression 0.0 (top) to 1.0 (bottom) across states:
    // 0.0 - 0.18: Emergence (0) -> Expansion (1)
    // 0.18 - 0.42: Expansion (1) -> Convergence (2)
    // 0.42 - 0.75: Convergence (2) -> Hourglass (3)
    // 0.75 - 1.00: Hourglass (3) -> Reorganization (4)
    let computedState = 0;
    if (progress < 0.2) {
      computedState = (progress / 0.2) * 1.0;
    } else if (progress < 0.45) {
      computedState = 1.0 + ((progress - 0.2) / 0.25) * 1.0;
    } else if (progress < 0.72) {
      computedState = 2.0 + ((progress - 0.45) / 0.27) * 1.0;
    } else {
      computedState = 3.0 + Math.min(1.0, (progress - 0.72) / 0.28) * 1.0;
    }

    this.targetState = computedState;
  }

  setReducedMotion(enabled) {
    this.reducedMotion = enabled ? 1.0 : 0.0;
    if (this.particleMaterial) {
      this.particleMaterial.uniforms.uReducedMotion.value = this.reducedMotion;
    }
    if (this.atmosphereMaterial) {
      this.atmosphereMaterial.uniforms.uReducedMotion.value = this.reducedMotion;
    }
  }

  handlePointerMove(event) {
    this.isPointerActive = true;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.mouseNDC.x = (event.clientX / width) * 2 - 1;
    this.mouseNDC.y = -(event.clientY / height) * 2 + 1;

    // Project NDC to z=0 world plane
    if (this.camera) {
      const vector = new THREE.Vector3(this.mouseNDC.x, this.mouseNDC.y, 0.5);
      vector.unproject(this.camera);
      const dir = vector.sub(this.camera.position).normalize();
      const distance = -this.camera.position.z / dir.z;
      this.targetMouseWorld.copy(this.camera.position).add(dir.multiplyScalar(distance));
    }
  }

  handlePointerLeave() {
    this.isPointerActive = false;
    this.targetMouseWorld.set(9999, 9999, 0); // Move out of range
  }

  handlePointerDown(event) {
    // Only trigger pulse if click didn't land on an interactive button/input/link
    const targetTag = event.target?.tagName?.toLowerCase();
    if (targetTag === 'button' || targetTag === 'a' || targetTag === 'input' || targetTag === 'textarea') {
      return;
    }

    // Trigger shockwave at pointer world location
    this.pulseOrigin.copy(this.currentMouseWorld);
    this.pulseRadius = 0.0;
    this.pulseStrength = 1.0;
  }

  handleResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    if (this.atmosphereMaterial) {
      this.atmosphereMaterial.uniforms.uResolution.value.set(width, height);
    }
  }

  handleVisibilityChange() {
    this.isPaused = document.hidden;
    if (!this.isPaused && !this.disposed) {
      this.clock.reset();
      this.animate();
    }
  }

  handleContextLost(event) {
    event.preventDefault();
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  handleContextRestored() {
    this.init(this.container);
  }

  animate() {
    if (this.disposed || this.isPaused) return;

    this.rafId = requestAnimationFrame(() => this.animate());

    this.clock.update();
    const delta = Math.min(this.clock.getDelta(), 0.06); // Prevent huge jumps
    const elapsed = this.clock.getElapsed();

    // 1. Smooth state interpolation
    const stateSpeed = this.reducedMotion > 0.5 ? 0.9 : 3.2;
    const stateBlend = 1.0 - Math.exp(-stateSpeed * delta);
    this.state += (this.targetState - this.state) * stateBlend;

    // 2. Cursor physics lerping & velocity
    this.lastMouseWorld.copy(this.currentMouseWorld);
    this.currentMouseWorld.lerp(this.targetMouseWorld, 0.12);
    this.mouseVelocity.subVectors(this.currentMouseWorld, this.lastMouseWorld);

    // 3. Shockwave propagation
    if (this.pulseStrength > 0.005) {
      const speed = this.reducedMotion > 0.5 ? 4.0 : 8.5;
      this.pulseRadius += speed * delta;
      this.pulseStrength *= Math.max(0.0, 1.0 - delta * 1.8);
    } else {
      this.pulseStrength = 0.0;
    }

    // 4. Update Particle Material Uniforms
    if (this.particleMaterial) {
      const u = this.particleMaterial.uniforms;
      u.uTime.value = elapsed;
      u.uState.value = this.state;
      u.uMouseWorld.value.copy(this.currentMouseWorld);
      u.uPulseOrigin.value.copy(this.pulseOrigin);
      u.uPulseRadius.value = this.pulseRadius;
      u.uPulseStrength.value = this.pulseStrength;
    }

    // 5. Update Atmosphere Uniforms
    if (this.atmosphereMaterial) {
      const u = this.atmosphereMaterial.uniforms;
      u.uTime.value = elapsed;
      u.uState.value = this.state;
      u.uMouse.value.set(this.mouseNDC.x, this.mouseNDC.y);
    }

    // 6. Slowly rotate Distant Veil for celestial parallax
    if (this.veilPoints) {
      const veilSpeed = this.reducedMotion > 0.5 ? 0.008 : 0.025;
      this.veilPoints.rotation.z = elapsed * veilSpeed;
      this.veilPoints.rotation.y = Math.sin(elapsed * 0.015) * 0.08;
    }

    // 7. Dynamic Camera Choreography based on state
    // State 0 (Emergence): z = 12.0
    // State 1 (Expansion): z = 11.2, slight tilt
    // State 2 (Convergence): z = 10.0, rotation
    // State 3 (Hourglass): z = 11.5, vertical composition
    // State 4 (Reorganization): z = 12.2
    const s = this.state;
    let targetZ = 11.5;
    let targetY = 0.0;

    if (s <= 1.0) {
      targetZ = THREE.MathUtils.lerp(12.2, 11.4, s);
    } else if (s <= 2.0) {
      targetZ = THREE.MathUtils.lerp(11.4, 10.2, s - 1.0);
    } else if (s <= 3.0) {
      targetZ = THREE.MathUtils.lerp(10.2, 11.5, s - 2.0);
      targetY = THREE.MathUtils.lerp(0.0, 0.2, s - 2.0);
    } else {
      targetZ = THREE.MathUtils.lerp(11.5, 12.4, s - 3.0);
      targetY = THREE.MathUtils.lerp(0.2, 0.0, s - 3.0);
    }

    // Add subtle mouse parallax to camera (damped)
    const parallaxFactor = this.reducedMotion > 0.5 ? 0.1 : 0.45;
    this.cameraTargetPos.set(
      this.mouseNDC.x * parallaxFactor,
      targetY + this.mouseNDC.y * (parallaxFactor * 0.6),
      targetZ
    );
    this.camera.position.lerp(this.cameraTargetPos, 0.04);
    this.camera.lookAt(0, targetY * 0.5, 0);

    // 8. Render
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    this.disposed = true;

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerleave', this.onPointerLeave);
    window.removeEventListener('pointerdown', this.onPointerDown);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);

    if (this.canvas) {
      this.canvas.removeEventListener('webglcontextlost', this.onContextLost);
      this.canvas.removeEventListener('webglcontextrestored', this.onContextRestored);
    }

    // Dispose Geometries & Materials
    if (this.particleGeometry) this.particleGeometry.dispose();
    if (this.particleMaterial) this.particleMaterial.dispose();
    if (this.atmosphereMesh) {
      this.atmosphereMesh.geometry.dispose();
      this.atmosphereMaterial.dispose();
    }
    if (this.veilGeometry) this.veilGeometry.dispose();
    if (this.veilMaterial) this.veilMaterial.dispose();

    if (this.renderer) {
      this.renderer.dispose();
      if (this.canvas && this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
    }

    this.clock.dispose();

    this.scene = null;
    this.camera = null;
    this.renderer = null;
  }
}

