import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  useAnimations,
  useGLTF,
} from "@react-three/drei";
import { Group } from "three";
import { useFrame, useThree, useGraph } from "@react-three/fiber";
import * as THREE from "three";
import { SkeletonUtils } from 'three-stdlib';
import useIsMobile from "@/hooks/useIsMobile";

// Type definitions from gltfjsx
type ActionName =
  | 'hero_spiderman209901_S02|hero_spiderman209901_S02|hero_spiderman209901_S02@atk-01|Base L'
  | 'hero_spiderman209901_S02|hero_spiderman209901_S02|hero_spiderman209901_S02@atk-02|Base L'
  | 'hero_spiderman209901_S02|hero_spiderman209901_S02|hero_spiderman209901_S02@dash|Base Lay'
  | 'hero_spiderman209901_S02|hero_spiderman209901_S02|hero_spiderman209901_S02@die|Base Laye'
  | 'hero_spiderman209901_S02|hero_spiderman209901_S02|hero_spiderman209901_S02@hit|Base Laye'
  | 'hero_spiderman209901_S02|hero_spiderman209901_S02|hero_spiderman209901_S02@idle|Base Lay'
  | 'hero_spiderman209901_S02|hero_spiderman209901_S02|hero_spiderman209901_S02@skill01|Base '
  | 'hero_spiderman209901_S02|hero_spiderman209901_S02|hero_spiderman209901_S02@skill02-01|Ba'
  | 'hero_spiderman209901_S02|hero_spiderman209901_S02|hero_spiderman209901_S02@skill02-02|Ba'
  | 'hero_spiderman209901_S02|hero_spiderman209901_S02|hero_spiderman209901_S02@skill03|Base '
  | 'hero_spiderman209901_S02|hero_spiderman209901_S02|hero_spiderman209901_S02@skill04|Base '
  | 'hero_spiderman209901_S02|hero_spiderman209901_S02|hero_spiderman209901_S02@skill05-01|Ba'
  | 'hero_spiderman209901_S02|hero_spiderman209901_S02|hero_spiderman209901_S02@skill05-02|Ba'
  | 'hero_spiderman209901_S02|hero_spiderman209901_S02|hero_spiderman209901_S02@skill05-03|Ba'
  | 'hero_spiderman209901_S02|hero_spiderman209901_S02|hero_spiderman209901_S02@skill06-01_ca'
  | 'hero_spiderman209901_S02|hero_spiderman209901_S02|hero_spiderman209901_S02@skill06-01|Ba'
  | 'hero_spiderman209901_S02|hero_spiderman209901_S02|hero_spiderman209901_S02@skill06-02|Ba'
  | 'hero_spiderman209901_S02|hero_spiderman209901_S02|hero_spiderman209901_S02@skill06-03_ca'
  | 'hero_spiderman209901_S02|hero_spiderman209901_S02|hero_spiderman209901_S02@skill06-03|Ba'
  | 'hero_spiderman209901_S02|hero_spiderman209901_S02|hero_spiderman209901_S02@skill06-04|Ba'
  | 'hero_spiderman209901_S02|hero_spiderman209901_S02|hero_spiderman209901_S02@stun|Base Lay'
  | 'hero_spiderman209901_S02|hero_spiderman209901_S02|hero_spiderman209901_S02@succ_cam|Base'
  | 'hero_spiderman209901_S02|hero_spiderman209901_S02|hero_spiderman209901_S02@wait|Base Lay'
  | 'hero_spiderman209901_S02|hero_spiderman209901_S02|hero_spiderman209901_S02@walk|Base Lay';

interface GLTFResult {
  nodes: {
    Object_96: THREE.SkinnedMesh;
    Object_98: THREE.SkinnedMesh;
    Object_100: THREE.SkinnedMesh;
    Object_102: THREE.SkinnedMesh;
    Object_104: THREE.SkinnedMesh;
    Object_106: THREE.SkinnedMesh;
    Object_108: THREE.SkinnedMesh;
    _rootJoint: THREE.Bone;
  };
  materials: {
    hero_spiderman209901_S02_03: THREE.MeshStandardMaterial;
    hero_spiderman209901_S02_04: THREE.MeshStandardMaterial;
    hero_spiderman209901_S02_02: THREE.MeshStandardMaterial;
    hero_spiderman209901_S02_01: THREE.MeshStandardMaterial;
    SpiderMan_web02: THREE.MeshStandardMaterial;
  };
}

// Preload the optimized model
useGLTF.preload("/model/spiderman_2099-transformed.glb");

const Model3Optimized = React.memo(({
  visible,
  scrollProgress,
  animationCompleted,
  setAnimationCompleted
}: {
  visible: boolean;
  scrollProgress: React.MutableRefObject<number>;
  animationCompleted: boolean;
  setAnimationCompleted: (completed: boolean) => void;
}) => {
  const group = useRef<Group>(null);
  
  // Load GLB and create optimized clone
  const { scene, animations, materials: originalMaterials } = useGLTF("/model/spiderman_2099-transformed.glb");
  
  // Memoize the cloned scene to prevent recreation
  const clone = useMemo(() => {
    const clonedScene = SkeletonUtils.clone(scene);
    
    // Apply optimizations to the cloned scene
    clonedScene.traverse((child: any) => {
      if (child.isMesh) {
        // Enable frustum culling
        child.frustumCulled = true;
        
        // Optimize geometry
        if (child.geometry) {
          child.geometry.computeBoundingSphere();
          child.geometry.computeBoundingBox();
        }
        
        // Enable shadows if needed
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    return clonedScene;
  }, [scene]);
  
  // Use the cloned scene for animations (this is the key difference from your original)
  const { actions } = useAnimations(animations, clone);
  
  const { camera } = useThree();
  const isMobile = useIsMobile();
  
  // Store previous camera position to track changes (exactly like your Model)
  const prevPosition = useRef(camera.position.clone());
  
  // Camera positions (exactly like your Model)
  const initialCameraPosition = {
    x: -6.782809400330284,
    y: 0.3973643603409034,
    z: 1.4024392340644003,
  };
  
  const targetCameraPosition = {
    x: -2.095299586023116,
    y: 0.16848200250957298,
    z: 2.8664879130829286,
  };

  const position: [number, number, number] = isMobile
    ? [0, -1, 0]
    : [-1, -1, 0];

  // Material setup and animation initialization (exactly like your Model)
  useEffect(() => {
    const bodyMat = originalMaterials.hero_spiderman209901_S02_04;
    const bodyMat2 = originalMaterials.hero_spiderman209901_S02_02;

    const color = new THREE.Color(0x800000);

    if (bodyMat) {
      bodyMat.emissive = color;
      bodyMat.emissiveIntensity = 2;
    }

    // Set up animation exactly like your Model
    if (actions && Object.keys(actions).length > 14) {
      actions[Object.keys(actions)[14]].play().paused = true;
    }
  }, [actions, originalMaterials]);

  // useFrame logic exactly like your Model
  useFrame(() => {
    const progress = scrollProgress.current;

    // Camera position tracking (exactly like your Model)
    if (!prevPosition.current.equals(camera.position)) {
      prevPosition.current.copy(camera.position);
    }

    // Camera animation (exactly like your Model)
    camera.position.x =
      initialCameraPosition.x +
      (targetCameraPosition.x - initialCameraPosition.x) * progress;

    camera.position.y =
      initialCameraPosition.y +
      (targetCameraPosition.y - initialCameraPosition.y) * progress;

    camera.position.z =
      initialCameraPosition.z +
      (targetCameraPosition.z - initialCameraPosition.z) * progress;

    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    // Animation control (exactly like your Model)
    const action = actions[Object.keys(actions)[14]];
    if (action) {
      const clip = action.getClip();
      action.time = clip.duration * progress;
    }

    // Trigger animation completion (exactly like your Model)
    if (progress >= 1 && !animationCompleted) {
      setAnimationCompleted(true);
    }
  });

  if (!visible) return null;

  return (
    <group ref={group} position={position} dispose={null}>
      <primitive object={clone} />
    </group>
  );
});

Model3Optimized.displayName = 'Model3Optimized';

export default Model3Optimized;
