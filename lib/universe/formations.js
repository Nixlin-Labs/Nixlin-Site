/**
 * NIXLIN Cosmic Universe — Mathematical Particle Formations
 * Generates 3D coordinate buffers for the 5 visual states:
 * 1. Emergence (Filamentary nebula cloud with abstract NIXLIN 'N' gravitational anchor)
 * 2. Expansion (Expansive logarithmic spiral disk with orbital energy streams)
 * 3. Gravitational Convergence (Accretion vortex spiraling inward toward a core)
 * 4. Hourglass Transformation (Monumental parametric hourglass with dynamic flow data)
 * 5. Reorganization (Harmonic resilient wave lattice / renewal manifold)
 */

// Deterministic pseudo-random number generator for reproducible particle distributions
function createPRNG(seed = 1337) {
  let s = seed;
  return function () {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * State 1 — Emergence
 * A deep-space assembly cloud. ~35% of particles trace an abstract, crystalline 'N'
 * filament structure, while the remaining ~65% form diffuse primordial dust arms.
 */
export function generateEmergence(count, rng = createPRNG(42)) {
  const positions = new Float32Array(count * 3);
  const nPillarCount = Math.floor(count * 0.35);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    if (i < nPillarCount) {
      // Abstract 'N' seed: Left pillar (35%), Diagonal (30%), Right pillar (35%)
      const sub = i / nPillarCount;
      let x, y, z;
      const height = 6.0;
      const width = 3.6;

      if (sub < 0.35) {
        // Left vertical pillar
        const t = sub / 0.35;
        x = -width / 2 + (rng() - 0.5) * 0.35;
        y = (t - 0.5) * height + (rng() - 0.5) * 0.2;
        z = (rng() - 0.5) * 0.6;
      } else if (sub < 0.65) {
        // Diagonal bridge from top-left to bottom-right
        const t = (sub - 0.35) / 0.3;
        x = -width / 2 + t * width + (rng() - 0.5) * 0.35;
        y = (0.5 - t) * height + (rng() - 0.5) * 0.2;
        z = (rng() - 0.5) * 0.6;
      } else {
        // Right vertical pillar
        const t = (sub - 0.65) / 0.35;
        x = width / 2 + (rng() - 0.5) * 0.35;
        y = (t - 0.5) * height + (rng() - 0.5) * 0.2;
        z = (rng() - 0.5) * 0.6;
      }

      // Add slight organic breathing jitter
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
    } else {
      // Diffuse cosmic filamentary shroud surrounding the assembly
      const theta = rng() * Math.PI * 2.0;
      const phi = (rng() - 0.5) * Math.PI;
      const radius = 2.0 + Math.pow(rng(), 1.5) * 8.5;

      positions[i3] = radius * Math.cos(phi) * Math.sin(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * 0.85;
      positions[i3 + 2] = radius * Math.cos(phi) * Math.cos(theta) * 0.6;
    }
  }

  return positions;
}

/**
 * State 2 — Expansion
 * Logarithmic spiral disk with 3 arms expanding into a wide spatial field.
 */
export function generateExpansion(count, rng = createPRNG(108)) {
  const positions = new Float32Array(count * 3);
  const arms = 3;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const armIndex = i % arms;
    const armOffset = (armIndex * 2.0 * Math.PI) / arms;

    // Distance distribution with concentration toward intermediate radii
    const t = Math.pow(rng(), 0.7);
    const radius = 1.0 + t * 9.5;
    const spiralAngle = armOffset + Math.log(radius * 1.4) * 2.2;
    const jitterAngle = (rng() - 0.5) * (0.6 / (radius * 0.3 + 0.5));

    const finalAngle = spiralAngle + jitterAngle;
    const x = Math.cos(finalAngle) * radius;
    const y = Math.sin(finalAngle) * (radius * 0.65); // Tilt composition for perspective
    // Gentle vertical undulation along arms
    const z = Math.sin(radius * 1.8 - armOffset) * 0.7 + (rng() - 0.5) * 0.8;

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
  }

  return positions;
}

/**
 * State 3 — Gravitational Convergence
 * Inward-accelerating accretion disk converging toward a tight focal vortex.
 */
export function generateConvergence(count, rng = createPRNG(256)) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    // Non-linear radius concentrating particles toward a central accretion core
    const u = rng();
    const radius = 0.3 + Math.pow(u, 2.4) * 6.0;
    const angle = rng() * Math.PI * 2.0 + (1.0 / (radius + 0.2)) * 3.5;

    // Funnel depth (vortex depression in z)
    const funnelDepth = -Math.exp(-radius * 0.8) * 2.2;
    const jitter = (rng() - 0.5) * (0.2 + radius * 0.08);

    positions[i3] = Math.cos(angle) * radius + jitter;
    positions[i3 + 1] = Math.sin(angle) * (radius * 0.75) + jitter;
    positions[i3 + 2] = funnelDepth + (rng() - 0.5) * 0.4;
  }

  return positions;
}

/**
 * State 4 — Hourglass Transformation
 * Parametric double-cone / hyperboloid with upper bulb, narrow constriction,
 * lower basin, and dynamic flow attributes (speed, phase offset, stream status).
 */
export function generateHourglass(count, rng = createPRNG(777)) {
  const positions = new Float32Array(count * 3);
  const flowData = new Float32Array(count * 3); // [speed, offset, isCoreStream]

  const totalHeight = 9.0;
  const halfHeight = totalHeight / 2.0;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // Decide if particle is in the active central cascade stream (40%) or the envelope (60%)
    const isStream = rng() < 0.4;
    const u = rng();

    // Normalized height y from -halfHeight to +halfHeight
    // Bias toward top and center for cinematic sand-glass accumulation
    let y = (Math.pow(u, 1.1) * 2.0 - 1.0) * halfHeight;

    // Parametric waist radius: narrow neck at y=0, flared bulbs at y=±halfHeight
    const normalizedY = y / halfHeight; // -1 to 1
    const waistRadius = 0.32;
    const maxRadius = 3.4;
    const bulbProfile = Math.pow(Math.abs(normalizedY), 1.6);
    let targetRadius = waistRadius + (maxRadius - waistRadius) * bulbProfile;

    if (isStream) {
      // Core particles are tightly focused along the central vertical axis
      targetRadius *= 0.15 + 0.35 * Math.abs(normalizedY);
    } else {
      // Envelope particles fill the interior and outer mantle of the hourglass
      targetRadius *= 0.4 + rng() * 0.6;
    }

    const angle = rng() * Math.PI * 2.0;
    const x = Math.cos(angle) * targetRadius;
    const z = Math.sin(angle) * targetRadius * 0.75; // Slight depth perspective

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    // Flow physics attributes
    // Speed increases dramatically near the narrow neck (y ~ 0) to simulate gravitational acceleration
    const neckProximity = 1.0 - Math.min(1.0, Math.abs(y) / 2.0);
    const speed = 0.8 + neckProximity * 2.2 + rng() * 0.5;
    const offset = rng() * 100.0;
    const streamFlag = isStream ? 1.0 : 0.0;

    flowData[i3] = speed;
    flowData[i3 + 1] = offset;
    flowData[i3 + 2] = streamFlag;
  }

  return { positions, flowData };
}

/**
 * State 5 — Reorganization
 * A resilient, harmonious cosmic matrix / interconnected wave manifold.
 * Represents intelligence and structure emerging anew from collapse.
 */
export function generateReorganization(count, rng = createPRNG(999)) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const u = (i / count) * Math.PI * 4.0; // Two complete windings
    const ribbon = (i % 4) / 4.0;
    const ribbonAngle = ribbon * Math.PI * 2.0;

    // Intertwined toroidal trefoil wave equations
    const R = 3.6; // Major radius
    const r = 1.3 + Math.sin(u * 3.0 + ribbonAngle) * 0.35; // Modulated tube radius

    const x = (R + r * Math.cos(u * 1.5)) * Math.cos(u) + (rng() - 0.5) * 0.4;
    const y = (R + r * Math.cos(u * 1.5)) * Math.sin(u) * 0.75 + (rng() - 0.5) * 0.4;
    const z = r * Math.sin(u * 1.5) + (rng() - 0.5) * 0.5;

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
  }

  return positions;
}

/**
 * Auxiliary attributes: Random seeds, sizes, and color palettes
 */
export function generateParticleAttributes(count, rng = createPRNG(404)) {
  const randoms = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const colorTypes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // 3D noise phase offset
    randoms[i3] = rng() * 10.0;
    randoms[i3 + 1] = rng() * 10.0;
    randoms[i3 + 2] = rng() * 10.0;

    // Non-linear size distribution (most fine points, occasional brighter focal stars)
    const sizeRoll = rng();
    if (sizeRoll > 0.96) {
      sizes[i] = 2.4 + rng() * 1.6; // 4% focal energy points
    } else if (sizeRoll > 0.8) {
      sizes[i] = 1.5 + rng() * 0.8; // 16% intermediate stars
    } else {
      sizes[i] = 0.7 + rng() * 0.6; // 80% delicate celestial dust
    }

    // Color categories adhering to NIXLIN brand:
    // 0 = #7ED957 (Accent Lime)
    // 1 = #4FAE68 (Accent Muted)
    // 2 = #DCEFE3 (Primary Mint Highlight)
    // 3 = #9CB9AC (Secondary Muted Green)
    // 4 = #0A3D31 (Deep Emerald Ambient)
    const colorRoll = rng();
    if (colorRoll > 0.88) {
      colorTypes[i] = 0.0; // 12% vibrant lime energy
    } else if (colorRoll > 0.65) {
      colorTypes[i] = 1.0; // 23% emerald accent
    } else if (colorRoll > 0.45) {
      colorTypes[i] = 2.0; // 20% mint highlight
    } else if (colorRoll > 0.2) {
      colorTypes[i] = 3.0; // 25% secondary soft green
    } else {
      colorTypes[i] = 4.0; // 20% deep emerald base
    }
  }

  return { randoms, sizes, colorTypes };
}

