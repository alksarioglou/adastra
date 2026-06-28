"use client";

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import type { Building } from "@/lib/preview/cityPresets";
import { SF_ESRI_COLORS } from "@/lib/preview/sfSkyline";

const _obj = new THREE.Object3D();
const _color = new THREE.Color();

export function EsriBuildingInstances({
  buildings,
  isNight,
}: {
  buildings: Building[];
  isNight: boolean;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const boxes = buildings.filter((b) => b.style !== "pyramid");
  const baseColor = isNight ? "#6a6458" : SF_ESRI_COLORS.building;

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    boxes.forEach((b, i) => {
      _obj.position.set(b.x, b.height / 2, b.z);
      _obj.scale.set(b.width, b.height, b.depth);
      _obj.updateMatrix();
      meshRef.current!.setMatrixAt(i, _obj.matrix);

      const shade = 0.92 + ((Math.abs(b.x * 7 + b.z * 13) % 20) / 100);
      _color.set(baseColor).multiplyScalar(shade);
      meshRef.current!.setColorAt(i, _color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [boxes, baseColor]);

  if (boxes.length === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, boxes.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshLambertMaterial vertexColors flatShading />
    </instancedMesh>
  );
}