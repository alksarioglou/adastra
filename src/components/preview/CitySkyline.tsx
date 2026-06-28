"use client";

import { useMemo } from "react";
import * as THREE from "three";
import type { Building, CityPreset } from "@/lib/preview/cityPresets";
import { SF_ESRI_COLORS } from "@/lib/preview/sfSkyline";
import type { TimeMode } from "@/lib/preview/timeOfDay";
import { EsriBuildingInstances } from "./EsriBuildingInstances";

function EsriLandmark({
  building,
  isNight,
}: {
  building: Building;
  isNight: boolean;
}) {
  const { x, z, width, height } = building;
  const color = isNight ? "#6a6458" : SF_ESRI_COLORS.building;

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0, width / 2, height, 4]} />
        <meshLambertMaterial color={color} flatShading />
      </mesh>
    </group>
  );
}

function StylizedBuilding({
  building,
  isNight,
}: {
  building: Building;
  isNight: boolean;
}) {
  const { x, z, width, depth, height, style, accent } = building;

  const { bodyColor, emissive, metalness, roughness } = useMemo(() => {
    switch (style) {
      case "glass":
        return {
          bodyColor: isNight ? "#1a2a3a" : "#6a8aaa",
          emissive: isNight ? "#1e3a5f" : "#000000",
          metalness: 0.85,
          roughness: 0.15,
        };
      case "spire":
        return {
          bodyColor: accent ?? (isNight ? "#2a3040" : "#8a9aaa"),
          emissive: isNight ? "#334155" : "#000000",
          metalness: 0.6,
          roughness: 0.35,
        };
      case "artdeco":
        return {
          bodyColor: accent ?? (isNight ? "#3a3540" : "#d4c8b8"),
          emissive: isNight ? "#2a2530" : "#000000",
          metalness: 0.3,
          roughness: 0.6,
        };
      default:
        return {
          bodyColor: isNight ? "#1a1a22" : "#8a8a92",
          emissive: isNight ? "#151520" : "#000000",
          metalness: 0.2,
          roughness: 0.75,
        };
    }
  }, [style, accent, isNight]);

  const windowLights = useMemo(() => {
    if (!isNight) return [];
    const lights: { x: number; y: number; z: number; intensity: number }[] =
      [];
    const rows = Math.floor(height / 3);
    const cols = Math.floor(width / 1.2);
    const seed = Math.abs(x * 13 + z * 7);
    for (let r = 1; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const hv = (seed + r * 17 + c * 31) % 100;
        if (hv < 55) continue;
        lights.push({
          x: -width / 2 + 0.6 + c * 1.2,
          y: 1.5 + r * 2.5,
          z: depth / 2 + 0.05,
          intensity: 0.3 + (hv % 70) / 100,
        });
      }
    }
    return lights;
  }, [isNight, height, width, depth, x, z]);

  return (
    <group position={[x, height / 2, z]}>
      <mesh>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={bodyColor}
          emissive={emissive}
          emissiveIntensity={isNight ? 0.08 : 0}
          metalness={metalness}
          roughness={roughness}
        />
      </mesh>

      {style === "spire" && (
        <mesh position={[0, height / 2 + 4, 0]}>
          <coneGeometry args={[width * 0.35, 8, 4]} />
          <meshStandardMaterial
            color={isNight ? "#8899aa" : "#c0d0e0"}
            emissive={isNight ? "#445566" : "#000000"}
            emissiveIntensity={isNight ? 0.15 : 0}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
      )}

      {windowLights.map((light, i) => (
        <mesh key={i} position={[light.x, light.y - height / 2, light.z]}>
          <planeGeometry args={[0.5, 0.8]} />
          <meshBasicMaterial
            color={new THREE.Color().setHSL(0.12, 0.3, 0.5 + light.intensity * 0.3)}
            transparent
            opacity={light.intensity}
          />
        </mesh>
      ))}
    </group>
  );
}

function EsriEnvironment({ isNight }: { isNight: boolean }) {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshLambertMaterial color={isNight ? "#1a1814" : SF_ESRI_COLORS.ground} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, -55]}>
        <planeGeometry args={[220, 80]} />
        <meshLambertMaterial
          color={isNight ? "#0a1828" : SF_ESRI_COLORS.bay}
          transparent
          opacity={isNight ? 0.7 : 0.85}
        />
      </mesh>

      <mesh position={[0, 8, -90]}>
        <planeGeometry args={[300, 30]} />
        <meshLambertMaterial color={SF_ESRI_COLORS.hills} transparent opacity={0.5} />
      </mesh>

      <mesh position={[-80, 6, -85]} rotation={[0, 0.3, 0]}>
        <planeGeometry args={[120, 22]} />
        <meshLambertMaterial color={SF_ESRI_COLORS.hills} transparent opacity={0.4} />
      </mesh>

      <mesh position={[70, 5, -88]} rotation={[0, -0.2, 0]}>
        <planeGeometry args={[100, 18]} />
        <meshLambertMaterial color={SF_ESRI_COLORS.hills} transparent opacity={0.35} />
      </mesh>
    </>
  );
}

export function CitySkyline({
  city,
  timeMode,
}: {
  city: CityPreset;
  timeMode: TimeMode;
}) {
  const isNight = timeMode !== "day";
  const isEsri = city.visualStyle === "esri";

  if (isEsri) {
    return (
      <group>
        <EsriEnvironment isNight={isNight} />
        <EsriBuildingInstances buildings={city.buildings} isNight={isNight} />
        {city.buildings
          .filter((b) => b.style === "pyramid")
          .map((building, i) => (
            <EsriLandmark key={i} building={building} isNight={isNight} />
          ))}
      </group>
    );
  }

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial
          color={isNight ? "#080c10" : "#2a3a2a"}
          roughness={0.9}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -30]}>
        <planeGeometry args={[80, 40]} />
        <meshStandardMaterial
          color={isNight ? "#0a1a2a" : "#3a6a8a"}
          metalness={0.8}
          roughness={0.1}
          transparent
          opacity={isNight ? 0.6 : 0.4}
        />
      </mesh>

      {city.buildings.map((building, i) => (
        <StylizedBuilding key={i} building={building} isNight={isNight} />
      ))}
    </group>
  );
}