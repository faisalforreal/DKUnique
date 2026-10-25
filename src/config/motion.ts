/**
 * Central motion parameters for 3D fan animations and scroll-driven storytelling.
 * All ranges, easing curves, spin speeds, camera setups, and hologram configurations
 * live here so external references can be fine-tuned purely through configuration.
 */

export interface MotionConfig {
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
  sizes: {
    minScaleCm: number; // 14 cm
    maxScaleCm: number; // 100 cm
    scaleCurvePower: number;
    cameraZOffset: number;
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
}

export const motionConfig: MotionConfig = {
  hero: {
    idleSpinSpeed: 8.0,
    tiltSensitivity: 0.35,
    lerpFactor: 0.08,
    camera: {
      // Three-quarter side view: ~30 degrees off Z-axis, ~18 degrees above horizontal
      // Shows motor housing and wall-mount plate clearly; never a top-down view
      angleDegrees: 30,
      elevationDegrees: 18,
      distance: 2.15,
      position: [1.02, 0.62, 1.76],
      target: [0, 0, -0.04],
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
      dotOpacityMin: 0.1,
      dotOpacityMax: 1.0,
      emissiveMin: 0.5,
      emissiveMax: 3.5,
    },
    hologramOpacity: {
      min: 0.0,
      max: 1.0,
    },
    mobileScrollLengthMultiplier: 0.7,
  },
  sizes: {
    minScaleCm: 14,
    maxScaleCm: 100,
    scaleCurvePower: 1.0,
    cameraZOffset: 2.5,
    mobileScrollLengthMultiplier: 0.65,
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
};
