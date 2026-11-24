/**
 * NIXLIN Cosmic Universe — Shaders
 * GPU-accelerated GLSL shaders for:
 * 1. Intelligent Particle System (Morphing formations, Hourglass stream, Force fields, Shockwaves)
 * 2. Deep-Space Celestial Nebula Atmosphere (Domain-warped procedural cosmic dust in brand emerald)
 */

export const particleVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uState;
  uniform vec3 uMouseWorld;
  uniform float uMouseRadius;
  uniform vec3 uPulseOrigin;
  uniform float uPulseRadius;
  uniform float uPulseStrength;
  uniform float uPixelRatio;
  uniform float uReducedMotion;

  attribute vec3 aTargetExpansion;
  attribute vec3 aTargetConvergence;
  attribute vec3 aTargetHourglass;
  attribute vec3 aTargetReorganize;
  attribute vec3 aFlowData; // [speed, offset, isCoreStream]
  attribute vec3 aRandom;
  attribute float aSize;
  attribute float aColorType;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vEnergy;

  // Hermite smooth interpolation between states
  vec3 interpolateFormations(float state, vec3 p0, vec3 p1, vec3 p2, vec3 p3, vec3 p4) {
    if (state <= 1.0) {
      float t = smoothstep(0.0, 1.0, state);
      return mix(p0, p1, t);
    } else if (state <= 2.0) {
      float t = smoothstep(1.0, 2.0, state);
      return mix(p1, p2, t);
    } else if (state <= 3.0) {
      float t = smoothstep(2.0, 3.0, state);
      return mix(p2, p3, t);
    } else {
      float t = smoothstep(3.0, 4.0, state);
      return mix(p3, p4, t);
    }
  }

  void main() {
    float motionScale = mix(1.0, 0.12, uReducedMotion);

    // 1. Base morphological state interpolation
    vec3 basePos = interpolateFormations(
      uState,
      position,
      aTargetExpansion,
      aTargetConvergence,
      aTargetHourglass,
      aTargetReorganize
    );

    // 2. State 4 (Hourglass) Kinetic Streaming Sand/Energy Physics
    // When in or transitioning near Hourglass (State ~ 3.0), stream particles downward through neck
    float hourglassFactor = smoothstep(2.2, 3.0, uState) * (1.0 - smoothstep(3.0, 3.8, uState));
    if (hourglassFactor > 0.01 && aFlowData.z > 0.5) {
      float speed = aFlowData.x * motionScale;
      float offset = aFlowData.y;
      // Cycle downward between +4.5 and -4.5
      float flowY = 4.5 - mod((uTime * 1.8 * speed + offset), 9.0);
      
      // Funnel constriction towards the central neck at y = 0
      float constriction = 0.22 + 0.78 * smoothstep(0.0, 2.2, abs(flowY));
      vec3 flowPos = vec3(basePos.x * constriction, flowY, basePos.z * constriction);
      basePos = mix(basePos, flowPos, hourglassFactor);
    }

    // 3. Organic harmonic drift & micro-vibration
    float driftSpeed = 0.35 * motionScale;
    vec3 drift = vec3(
      sin(uTime * driftSpeed + aRandom.x) * 0.18,
      cos(uTime * (driftSpeed * 0.8) + aRandom.y) * 0.18,
      sin(uTime * (driftSpeed * 0.6) + aRandom.z) * 0.22
    );
    vec3 animatedPos = basePos + drift;

    // 4. Cursor Force Field (Repulsion + tangential cosmic swirl)
    float energy = 0.0;
    vec2 toMouse = animatedPos.xy - uMouseWorld.xy;
    float distMouse = length(toMouse);

    if (distMouse < uMouseRadius && uMouseRadius > 0.0) {
      float influence = 1.0 - smoothstep(0.0, uMouseRadius, distMouse);
      vec2 normalDir = normalize(toMouse + vec2(0.0001, 0.0001));
      vec2 swirl = vec2(-normalDir.y, normalDir.x) * 0.35;
      
      // Elastic displacement
      animatedPos.xy += (normalDir * 1.35 + swirl) * influence * motionScale;
      animatedPos.z += influence * 0.45 * motionScale;
      energy += influence * 0.85;
    }

    // 5. Click Energy Shockwave (Expanding radial pulse)
    if (uPulseStrength > 0.01) {
      float distPulse = length(animatedPos.xy - uPulseOrigin.xy);
      float pulseWidth = 1.6;
      float waveDist = abs(distPulse - uPulseRadius);
      
      if (waveDist < pulseWidth) {
        float waveIntensity = (1.0 - waveDist / pulseWidth) * uPulseStrength;
        vec2 pulseDir = normalize(animatedPos.xy - uPulseOrigin.xy + vec2(0.0001, 0.0001));
        animatedPos.xy += pulseDir * waveIntensity * 1.6 * motionScale;
        animatedPos.z += waveIntensity * 0.7 * motionScale;
        energy += waveIntensity * 1.4;
      }
    }

    // 6. Camera projection
    vec4 mvPosition = modelViewMatrix * vec4(animatedPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // 7. Fine point sizing with perspective scaling.
    float perspectiveSize = aSize * (uPixelRatio * 22.0 / -mvPosition.z);
    // Modest boost when excited by cursor or pulse — still feels physical, not explosive
    float excitedSize = perspectiveSize * (1.0 + energy * 0.45);
    gl_PointSize = clamp(excitedSize, 0.75, 4.5);

    // 8. Color calculation based on NIXLIN Palette
    // Palette definitions
    vec3 cAccent = vec3(0.000, 0.988, 0.537);        // #00FC89 (Electric Green)
    vec3 cAccentMuted = vec3(0.000, 0.792, 0.416);   // #00CA6A (Muted Green)
    vec3 cPrimary = vec3(0.969, 0.976, 0.973);       // #F7F9F8 (Metallic White)
    vec3 cSecondary = vec3(0.667, 0.722, 0.698);     // #AAB8B2 (Secondary Silver)
    vec3 cSurface = vec3(0.027, 0.090, 0.067);       // #071711 (Dark Surface)

    vec3 baseColor;
    if (aColorType < 0.5) {
      baseColor = cAccent;
    } else if (aColorType < 1.5) {
      baseColor = cAccentMuted;
    } else if (aColorType < 2.5) {
      baseColor = cPrimary;
    } else if (aColorType < 3.5) {
      baseColor = cSecondary;
    } else {
      baseColor = cSurface;
    }

    // High energy turns particles luminous mint/white
    vColor = mix(baseColor, cPrimary, clamp(energy * 0.9, 0.0, 1.0));
    vEnergy = energy;

    // Depth attenuation and state fade-in
    float depthAlpha = 1.0 - smoothstep(4.0, 30.0, -mvPosition.z);
    float stateAlpha = smoothstep(-0.5, 0.3, uState);
    vAlpha = clamp(depthAlpha * (0.8 + energy * 0.48) * stateAlpha, 0.0, 0.85);
  }
`;

export const particleFragmentShader = /* glsl */ `
  precision highp float;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vEnergy;

  void main() {
    // Distance from center of the point sprite: [0.0, 0.5]
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);

    if (dist > 0.5) {
      discard;
    }

    // Refined celestial point rendering
    // Sharp quantum core: precise, not bloated
    float core = exp(-dist * dist * 48.0);
    // Very soft outer halo — just enough to establish depth
    float halo = pow(1.0 - dist * 2.0, 3.0);

    // Restrained intensity: core carries the presence; halo stays subtle
    float intensity = core * 0.9 + halo * 0.18 + vEnergy * halo * 0.4;
    float finalAlpha = vAlpha * intensity;

    if (finalAlpha < 0.01) {
      discard;
    }

    // Controlled emerald aura with luminous center
    vec3 finalColor = vColor * (1.0 + vEnergy * 0.4);

    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

/**
 * Procedural Celestial Deep-Space Atmosphere Shader
 * Generates an ethereal volumetric nebula backdrop adhering strictly to NIXLIN's green/black tokens:
 * #000000, #000805, #071711.
 */
export const atmosphereVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`;

export const atmosphereFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uState;
  uniform float uReducedMotion;

  varying vec2 vUv;

  // Simplex-inspired 2D hash
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  // 2D Perlin gradient noise
  float gnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
          dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // 3-Octave fractional Brownian motion
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 3; ++i) {
      v += a * gnoise(p);
      p = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    float motion = mix(1.0, 0.1, uReducedMotion);
    float t = uTime * 0.04 * motion;

    // Aspect ratio corrected coordinates
    vec2 st = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);

    // Parallax displacement from normalized cursor
    st += uMouse * 0.04 * motion;

    // Domain warping for celestial fluid tendrils
    vec2 q = vec2(
      fbm(st * 1.4 + vec2(t * 0.5, -t * 0.3)),
      fbm(st * 1.4 + vec2(-t * 0.4, t * 0.6))
    );

    vec2 r = vec2(
      fbm(st * 2.0 + 2.0 * q + vec2(1.7, 9.2) + 0.15 * t),
      fbm(st * 2.0 + 2.0 * q + vec2(8.3, 2.8) + 0.126 * t)
    );

    float f = fbm(st * 1.8 + 2.0 * r);

    // Radial vignette to keep center focused and outer atmosphere deep
    float vignette = 1.0 - smoothstep(0.2, 1.4, length(st));

    // NIXLIN Official Color Tokens
    vec3 cBgDeep = vec3(0.0000, 0.0000, 0.0000);  // #000000
    vec3 cBg = vec3(0.0000, 0.0314, 0.0196);      // #000805
    vec3 cSurface = vec3(0.0275, 0.0902, 0.0667); // #071711
    vec3 cAccentMuted = vec3(0.0000, 0.7922, 0.4157);// #00CA6A

    // Color gradient mixing
    vec3 color = mix(cBgDeep, cBg, clamp(f * 1.5 + 0.2, 0.0, 1.0));
    color = mix(color, cSurface, clamp(length(q) * 0.6, 0.0, 1.0));
    
    // Very subtle luminous dust tendrils
    float tendril = smoothstep(0.35, 0.75, f);
    color += cAccentMuted * tendril * 0.06 * vignette;

    // Subtly pulse when in Hourglass state
    float hourglassEnergy = smoothstep(2.5, 3.0, uState) * (1.0 - smoothstep(3.0, 3.5, uState));
    color += cAccentMuted * hourglassEnergy * 0.04 * (1.0 - length(st));

    gl_FragColor = vec4(color, 1.0);
  }
`;

