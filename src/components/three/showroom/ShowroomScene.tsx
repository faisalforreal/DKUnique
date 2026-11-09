"use client";

import { motionConfig } from "@/config/motion";
import { ShowroomCamera } from "./ShowroomCamera";
import { ShowroomLights } from "./ShowroomLights";
import { HeroShowroomAssembly } from "./HeroShowroomAssembly";
import { StoryObject } from "./StoryObject";
import { LuminousPoint, LightSweep } from "./TransitionFX";
import { butterflyTransform, emblemTransform, sneakerTransform } from "./timeline";

interface ShowroomSceneProps {
  progressRef: React.MutableRefObject<number>;
}

/** Root of the storytelling scene inside View A (the shared canvas). */
export function ShowroomScene({ progressRef }: ShowroomSceneProps) {
  const S = motionConfig.showroom.segments;

  return (
    <>
      <ShowroomCamera progressRef={progressRef} />
      <ShowroomLights progressRef={progressRef} />

      {/* Fan collapse → butterfly origin luminous point */}
      <LuminousPoint
        progressRef={progressRef}
        startP={S.fanToButterfly.start}
        endP={S.butterfly.start}
        position={[1.6, 0, 0.3]}
      />

      {/* Consistent light-trail transitions between objects */}
      <LightSweep
        progressRef={progressRef}
        startP={S.butterflyToEmblem.start}
        endP={S.butterflyToEmblem.end}
        fromX={-1.1}
        toX={1.1}
      />
      <LightSweep
        progressRef={progressRef}
        startP={S.emblemToSneaker.start}
        endP={S.emblemToSneaker.end}
        fromX={1.1}
        toX={-1.1}
        color="#C58D9D"
      />

      <HeroShowroomAssembly progressRef={progressRef} />
      <StoryObject id="butterfly" progressRef={progressRef} transform={butterflyTransform} />
      <StoryObject id="emblem" progressRef={progressRef} transform={emblemTransform} />
      <StoryObject id="sneaker" progressRef={progressRef} transform={sneakerTransform} />
    </>
  );
}
