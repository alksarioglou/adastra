"use client";

import { useLayoutEffect, useRef, useMemo } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { TimeMode } from "@/lib/preview/timeOfDay";

type DronePoint = {
  x: number;
  y: number;
  z: number;
  phase: number;
};

const _obj = new THREE.Object3D();

export function DroneQRFormation({
  matrix,
  position,
  timeMode,
  brandColor = "#ffffff",
  message,
}: {
  matrix: boolean[][];
  position: [number, number, number];
  timeMode: TimeMode;
  brandColor?: string;
  message?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const isNight = timeMode !== "day";
  const moduleSize = 0.55;
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const offsetX = -(cols * moduleSize) / 2;
  const offsetY = (rows * moduleSize) / 2;

  const drones = useMemo(() => {
    const points: DronePoint[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!matrix[row][col]) continue;
        points.push({
          x: offsetX + col * moduleSize,
          y: offsetY - row * moduleSize,
          z: 0,
          phase: (row + col) * 0.4,
        });
      }
    }
    return points;
  }, [matrix, rows, cols, offsetX, offsetY, moduleSize]);

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    drones.forEach((d, i) => {
      _obj.position.set(d.x, d.y, d.z);
      _obj.scale.setScalar(1);
      _obj.updateMatrix();
      meshRef.current!.setMatrixAt(i, _obj.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [drones]);

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current) return;
    const t = state.clock.elapsedTime;

    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.04;
    groupRef.current.position.y = position[1] + Math.sin(t * 0.3) * 0.5;

    drones.forEach((d, i) => {
      _obj.position.set(
        d.x + Math.cos(t * 0.8 + d.phase) * 0.08,
        d.y + Math.sin(t * 1.5 + d.phase) * 0.15,
        d.z,
      );
      _obj.scale.setScalar(1);
      _obj.updateMatrix();
      meshRef.current!.setMatrixAt(i, _obj.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const glowColor = isNight ? brandColor : "#1a1a2e";

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 0, -0.5]}>
        <planeGeometry args={[cols * moduleSize + 2, rows * moduleSize + 2]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={isNight ? 0.06 : 0.02}
          toneMapped={false}
        />
      </mesh>

      {drones.length > 0 && (
        <instancedMesh ref={meshRef} args={[undefined, undefined, drones.length]}>
          <sphereGeometry args={[0.12, 6, 6]} />
          <meshBasicMaterial color={glowColor} toneMapped={false} />
        </instancedMesh>
      )}

      {message && (
        <Text
          position={[0, -rows * moduleSize * 0.55, 0.5]}
          fontSize={0.9}
          color={isNight ? "#ffffff" : "#1a1a2e"}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor="#000000"
        >
          {message}
        </Text>
      )}
    </group>
  );
}