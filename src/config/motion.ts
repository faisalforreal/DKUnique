/**
 * Central motion parameters for 3D fan animations and scroll-driven storytelling.
 * All ranges, easing curves, spin speeds, camera setups, and hologram configurations
 * live here so external references can be fine-tuned purely through configuration.
 */

export interface MotionConfig {
  models: {
    hero: {
      fanScale: number; // Overall fan assembly size in hero section
      hologramScale: number; // 3D hologram size mounted on hero fan
    };
    howItWorks: {
      fanScale: number; // Overall fan size in scroll section
      hologramScale: number; // 3D hologram size in scroll section
    };
    studio: {
      fanScale: number; // Fan size in 3D studio when fan toggle is visible
      hologramScaleWithFan: number; // Hologram size when mounted on fan in studio
      hologramScaleSolo: number; // Hologram size when floating solo in studio
    };
  };
  hero: {
    idleSpinSpeed: number; // Rad/sec in idle state
    tiltSensitivity: number; // Pointer tracking factor
    lerpFactor: number; // Smooth rotation lerp speed
    camera: {
      angleDegrees: number; // 25-35 degrees off the fan axis
      elevationDegrees: number; // Slightly above horizontal
      distance: number; // Distance in meters from fan hub
      position: [number, number, number]; // Three-quarter side view
      target: [number, number, number]; // Focus target on fan hub
      fov: number;
    };
    // Startup sequence when website loads
    startup: {
      stillDuration: number; // Seconds fan stays still after website loads (tweak this value)
      spinUpDuration: number; // Seconds to accelerate from still to full speed (tweak this value)
      maxSpinSpeed: number; // Full rotation speed in rad/sec (tweak this value)
      fanMinOpacity: number; // Fan visibility at full speed (0.05 = 5% visibility)
      fanMaxOpacity: number; // Fan visibility when still (1.0 = 100% visibility)
      hologramOnsetThreshold: number; // Progress ratio where hologram onset begins (e.g. 0.60)
      hologramInitialOpacity: number; // Initial visibility at onset (0.05 = 5% visibility)
      hologramRampDuration: number; // Seconds to gradually ramp from 5% to 100%
      hologramMinOpacity: number; // Hologram visibility initially (0.0 = 0% visibility)
      hologramMaxOpacity: number; // Hologram visibility at full speed (1.0 = 100% visibility)
    };
  };
  howItWorks: {
    ranges: {
      decelerateEnd: number; // 0.0 to 0.3: fan slows, blades & LED dots resolve
      textStepsStart: number; // 0.3: step 1 enters
      textStep1End: number; // 0.43: step 1 active
      textStep2End: number; // 0.57: step 2 active
      textStepsEnd: number; // 0.7: step 3 active
      accelerateEnd: number; // 0.7 to 1.0: spin accelerates & central hologram forms
    };
    spinSpeeds: {
      maxSpin: number;
      minSpin: number;
      finalSpin: number;
    };
    ledVisibility: {
      dotOpacityMin: number;
      dotOpacityMax: number;
      emissiveMin: number;
      emissiveMax: number;
    };
    hologramOpacity: {
      min: number;
      max: number;
    };
    mobileScrollLengthMultiplier: number;
  };
  hologram: {
    videoSrcMp4: string;
    videoSrcWebm: string;
    posterSrc: string;
    mode: "in-plane" | "above"; // "in-plane" (default) or "above"
    scaleRatio: number; // 80% of blade diameter (0.65m * 0.8 = 0.52m)
    zOffsetInPlane: number; // In-plane Z position slightly in front of blades
    zOffsetAbove: number; // Lifted above the fan face
    riseDistance: number; // Distance it rises as scroll passes 0.7
    fadeStartProgress: number; // Scroll progress threshold where fade-in begins
  };
  productDetail: {
    scrollRotationFactor: number;
    autoRotateSpeed: number;
  };
  showroom: ShowroomConfig;
}

export interface ShowroomCameraKeyframe {
  p: number; // progress 0..1
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export interface ShowroomModelMotion {
  autoRotate: boolean;
  baseRotation?: [number, number, number];
  rotationSpeed?: number;
  dwellFactor?: number; // 0..0.9 (e.g. 0.75 means drops to 25% speed at dwell angles)
  dwellFrequency?: number; // 4 for 90-degree intervals
  phaseOffset?: number; // radians offset
  dwellAngleDegrees?: number; // Angle in degrees where it slows down (e.g. 0, 45, 90)
  rotationYDegrees?: number; // Static Y rotation in degrees (e.g. 45 for butterfly)
  floatAmplitude: number;
  floatSpeed: number;
}

export interface ShowroomConfig {
  trackHeightVh: number; // desktop pinned track height in viewport heights
  trackHeightMobileVh: number; // mobile pinned track height
  segments: {
    hero: { start: number; end: number };
    fanToButterfly: { start: number; end: number };
    butterfly: { start: number; end: number };
    butterflyToEmblem: { start: number; end: number };
    emblem: { start: number; end: number };
    emblemToSneaker: { start: number; end: number };
    sneaker: { start: number; end: number };
    sneakerToShowcase: { start: number; end: number };
    showcase: { start: number; end: number };
  };
  camera: {
    keyframes: ShowroomCameraKeyframe[];
  };
  lights: {
    ambient: { intensity: number };
    key: { position: [number, number, number]; color: string; intensity: number };
    rim: { position: [number, number, number]; color: string; intensity: number };
    fill: { position: [number, number, number]; color: string; intensity: number };
  };
  particles: {
    maxCount: number;
    size: number;
  };
  idle: {
    butterflyFlapTimeScale: number;
    butterflyFloatAmplitude: number;
    fanSpinSpeed: number;
    showcaseLoopSpeed: number;
  };
  models: {
    /** Default motion profile applied to any showroom model without a dedicated override */
    default: ShowroomModelMotion;
    butterfly: ShowroomModelMotion;
    emblem: ShowroomModelMotion;
    sneaker: ShowroomModelMotion;
    heroHologram: ShowroomModelMotion;
    [key: string]: ShowroomModelMotion;
  };
}

export const motionConfig: MotionConfig = {
  models: {
    hero: {
      fanScale: 3, // Tweak overall hero fan assembly size
      hologramScale: 0.3, // Tweak hero 3D hologram size
    },
    howItWorks: {
      fanScale: 1.05, // Tweak how-it-works fan size
      hologramScale: 0.24, // Tweak how-it-works hologram size
    },
    studio: {
      fanScale: 1.1, // Tweak studio fan size when visible
      hologramScaleWithFan: 0.26, // Tweak studio hologram size with fan mounted
      hologramScaleSolo: 0.44, // Tweak studio solo floating hologram size
    },
  },
  hero: {
    idleSpinSpeed: 8.0,
    tiltSensitivity: 0.35,
    lerpFactor: 0.08,
    // Startup sequence when website loads
    startup: {
      stillDuration: 1.0, // Stays still for 1 seconds (tweak this value)
      spinUpDuration: 3.0, // Starts slow and smoothly accelerates to full speed
      maxSpinSpeed: 18.0, // High rotation speed at full velocity
      fanMinOpacity: 0.05, // Opacity drops to 5% as it reaches full speed (95% transparent)
      fanMaxOpacity: 1.0, // Initial 100% solid opacity
      hologramOnsetThreshold: 0.55, // Fan transparency/progress ratio where hologram onset begins
      hologramInitialOpacity: 0.05, // Initial visibility at onset (5% visibility, tweak this value)
      hologramRampDuration: 2.2, // Seconds to gradually ramp from 5% to 100% (tweak this value)
      hologramMinOpacity: 0.0, // Hologram begins at 0%
      hologramMaxOpacity: 1.0, // Hologram rises gradually to 100%
    },
    camera: {
      // Straight-on front view: directly centered on fan hub & hologram text along Z-axis
      angleDegrees: 0,
      elevationDegrees: 0,
      distance: 2.2,
      position: [0, 0, 2.2],
      target: [0, 0, 0],
      fov: 42,
    },
  },
  howItWorks: {
    ranges: {
      decelerateEnd: 0.3,
      textStepsStart: 0.3,
      textStep1End: 0.43,
      textStep2End: 0.57,
      textStepsEnd: 0.7,
      accelerateEnd: 1.0,
    },
    spinSpeeds: {
      maxSpin: 14.0,
      minSpin: 0.8,
      finalSpin: 16.0,
    },
    ledVisibility: {
      dotOpacityMin: 0.01,
      dotOpacityMax: 1.0,
      emissiveMin: 0.5,
      emissiveMax: 3.5,
    },
    hologramOpacity: {
      min: 0.0,
      max: 1.0,
    },
    mobileScrollLengthMultiplier: 10.0,
  },
  hologram: {
    videoSrcMp4: "/assets/demo/holo-loop.mp4",
    videoSrcWebm: "/assets/demo/holo-loop.webm",
    posterSrc: "/assets/demo/holo-poster.webp",
    mode: "in-plane", // "in-plane" (default) or "above"
    scaleRatio: 0.8, // 80% of blade diameter (0.65m * 0.8 = 0.52m)
    zOffsetInPlane: 0.035, // Just in front of blades
    zOffsetAbove: 0.12, // Lifted above the fan face
    riseDistance: 0.06, // Rises slightly as scroll advances past 0.7
    fadeStartProgress: 0.7,
  },
  productDetail: {
    scrollRotationFactor: 0.005,
    autoRotateSpeed: 1.5,
  },
  showroom: {
    trackHeightVh: 600,
    trackHeightMobileVh: 480,
    segments: {
      hero: { start: 0.0, end: 0.12 },
      fanToButterfly: { start: 0.12, end: 0.26 },
      butterfly: { start: 0.26, end: 0.4 },
      butterflyToEmblem: { start: 0.4, end: 0.54 },
      emblem: { start: 0.54, end: 0.66 },
      emblemToSneaker: { start: 0.66, end: 0.78 },
      sneaker: { start: 0.78, end: 0.86 },
      sneakerToShowcase: { start: 0.86, end: 0.94 },
      showcase: { start: 0.94, end: 1.0 },
    },
    camera: {
      keyframes: [
        { p: 0.0, position: [0, 0, 2.8], target: [0, 0, 0], fov: 45 },
        { p: 0.12, position: [0, 0, 2.8], target: [0, 0, 0], fov: 45 },
        { p: 0.26, position: [0, 0, 2.8], target: [0, 0, 0], fov: 45 },
        { p: 0.4, position: [0, 0, 2.8], target: [0, 0, 0], fov: 45 },
        { p: 0.54, position: [0, 0, 2.8], target: [0, 0, 0], fov: 45 },
        { p: 0.66, position: [0, 0, 2.8], target: [0, 0, 0], fov: 45 },
        { p: 0.78, position: [0, 0, 2.8], target: [0, 0, 0], fov: 45 },
        { p: 0.86, position: [0, 0, 3.2], target: [0, 0, 0], fov: 42 },
        { p: 1.0, position: [0, 0, 3.6], target: [0, 0, 0], fov: 40 },
      ],
    },
    lights: {
      ambient: { intensity: 0.7 },
      key: { position: [3, 4, 5], color: "#D5B77B", intensity: 1.6 },
      rim: { position: [-3, 1, -2], color: "#C58D9D", intensity: 0.9 },
      fill: { position: [0, -2, 3], color: "#F2EEE7", intensity: 0.4 },
    },
    particles: {
      maxCount: 1200,
      size: 0.035,
    },
    idle: {
      butterflyFlapTimeScale: 0.6,
      butterflyFloatAmplitude: 0.08,
      fanSpinSpeed: 14,
      showcaseLoopSpeed: 0.35,
    },
    models: {
      default: {
        autoRotate: true,
        rotationSpeed: 0.35,
        dwellFactor: 0.7,
        dwellFrequency: 4,
        phaseOffset: 0,
        floatAmplitude: 0.03,
        floatSpeed: 0.6,
      },
      butterfly: {
        autoRotate: false,
        baseRotation: [0, Math.PI * 0.25, 0],
        rotationYDegrees: 45,
        floatAmplitude: 0.04,
        floatSpeed: 0.8,
      },
      emblem: {
        autoRotate: true,
        rotationSpeed: 0.5,
        dwellFactor: 0.9,
        dwellFrequency: 2,
        phaseOffset: 0,
        dwellAngleDegrees: 150,
        floatAmplitude: 0.03,
        floatSpeed: 0.6,
      },
      sneaker: {
        autoRotate: true,
        rotationSpeed: 0.35,
        dwellFactor: 0.65,
        dwellFrequency: 4,
        phaseOffset: 0,
        floatAmplitude: 0.03,
        floatSpeed: 0.5,
      },
      heroHologram: {
        autoRotate: true,
        rotationSpeed: 0.3,
        dwellFactor: 0.75,
        dwellFrequency: 4,
        phaseOffset: 0,
        floatAmplitude: 0.02,
        floatSpeed: 0.7,
      },
    },
  },
};
