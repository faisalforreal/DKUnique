/**
 * Central motion parameters for 3D fan animations and scroll-driven storytelling.
 * All ranges, easing curves, spin speeds, and scale thresholds live here
 * so external references can be fine-tuned purely through configuration.
 */

export interface MotionConfig {
  hero: {
    idleSpinSpeed: number; // Rad/sec in idle state
    tiltSensitivity: number; // Pointer tracking factor
    lerpFactor: number; // Smooth rotation lerp speed
  };
  howItWorks: {
    // Scroll progress thresholds [0..1]
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
    };
    hologramOpacity: {
      min: number;
      max: number;
    };
    mobileScrollLengthMultiplier: number; // Scale scroll container height on mobile
  };
  sizes: {
    minScaleCm: number; // 14 cm
    maxScaleCm: number; // 100 cm
    scaleCurvePower: number; // 1.0 for linear, 1.2 for slightly exponential visual expansion
    cameraZOffset: number; // Camera distance adjustment
    mobileScrollLengthMultiplier: number;
  };
  productDetail: {
    scrollRotationFactor: number; // Radians per scroll pixel
    autoRotateSpeed: number;
  };
}

export const motionConfig: MotionConfig = {
  hero: {
    idleSpinSpeed: 8.0,
    tiltSensitivity: 0.35,
    lerpFactor: 0.08,
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
      maxSpin: 12.0,
      minSpin: 0.6,
      finalSpin: 15.0,
    },
    ledVisibility: {
      dotOpacityMin: 0.1,
      dotOpacityMax: 1.0,
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
  productDetail: {
    scrollRotationFactor: 0.005,
    autoRotateSpeed: 1.5,
  },
};
