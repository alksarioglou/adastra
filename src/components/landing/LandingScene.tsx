"use client";

import { Suspense, useRef } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { CitySkyline } from "@/components/preview/CitySkyline";
import { DroneQRFormation } from "@/components/preview/DroneQRFormation";
import { SkyEnvironment } from "@/components/preview/SkyEnvironment";
import { CITY_PRESETS } from "@/lib/preview/cityPresets";

const city = CITY_PRESETS[0];

export function LandingScene({
  qrMatrix,
}: {
  qrMatrix: boolean[][];
}) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const target = useRef(new THREE.Vector3(...city.cameraTarget));

  useFrame((state) => {
    const cam = cameraRef.current;
    if (!cam) return;
    const t = state.clock.elapsedTime;
    cam.position.x = 38 + Math.sin(t * 0.14) * 10;
    cam.position.y = 48 + Math.sin(t * 0.22) * 3;
    cam.position.z = 54 + Math.cos(t * 0.11) * 8;
    cam.lookAt(target.current);
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={city.cameraPosition}
        fov={48}
        near={0.1}
        far={500}
      />

      <SkyEnvironment timeMode="night" hour={21} visualStyle={city.visualStyle} />

      <Suspense fallback={null}>
        <CitySkyline city={city} timeMode="night" />
        {qrMatrix.length > 0 && (
          <DroneQRFormation
            matrix={qrMatrix}
            position={city.qrPosition}
            timeMode="night"
            brandColor="#22d3ee"
            message="Ad Astra"
          />
        )}
      </Suspense>

      <EffectComposer>
        <Bloom
          intensity={1.8}
          luminanceThreshold={0.12}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
        <Vignette eskil offset={0.12} darkness={0.55} />
      </EffectComposer>
    </>
  );
}