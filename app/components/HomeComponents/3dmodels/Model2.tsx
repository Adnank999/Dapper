import React, { useEffect, useRef, useState } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { Group } from "three";
import { useFrame, useThree, useGraph } from "@react-three/fiber";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import useIsMobile from "@/hooks/useIsMobile";

useGLTF.preload("/model/spiderman_2099-transformed.glb");

const Model2 = ({
  visible,
  scrollProgress,
  animationCompleted,
  setAnimationCompleted,
}: {
  visible: boolean;
  scrollProgress: React.MutableRefObject<number>;
  animationCompleted: boolean;
  setAnimationCompleted: any;
}) => {
  const group = useRef<Group>(null);

  // Load GLB and clone scene for proper instancing
  const { scene, animations } = useGLTF(
    "/model/spiderman_2099-optimized.glb"
  );
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);

  // Apply animations to the cloned scene - this is the key fix
  const { actions } = useAnimations(animations, clone);

  console.log("animations", animations);
  console.log("actions", actions);

  const { camera } = useThree();
  const isMobile = useIsMobile();
  const prevPosition = useRef(camera.position.clone());

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

  useEffect(() => {
    const bodyMat = materials?.hero_spiderman209901_S02_04;
    const bodyMat2 = materials?.hero_spiderman209901_S02_02;

    const color = new THREE.Color(0x800000);

    if (bodyMat) {
      bodyMat.emissive = color;
      bodyMat.emissiveIntensity = 2;
    }

    // Better animation selection
    const actionKeys = Object.keys(actions);
    console.log("actionKeys", actionKeys);

    let targetAction = null;

    // Try to find a specific animation by name first
    if (actions["Animation"] || actions["mixamo.com"] || actions["Take 001"]) {
      targetAction = actions["Animation"] || actions["mixamo.com"] || actions["Take 001"];
    }
    // Fallback to index-based selection
    else if (actionKeys.length > 14 && actions[actionKeys[14]]) {
      targetAction = actions[actionKeys[14]];
    } else if (actionKeys.length > 0) {
      targetAction = actions[actionKeys[0]];
    }

    if (targetAction) {
      console.log("Playing animation:", targetAction);
      targetAction.reset().play();
      targetAction.paused = true;
    }
  }, [actions, materials]);

  useFrame(() => {
    const progress = scrollProgress.current;

    if (!prevPosition.current.equals(camera.position)) {
      prevPosition.current.copy(camera.position);
    }

    // Animate camera position
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

    // Animate the model
    const actionKeys = Object.keys(actions);
    let targetAction = null;

    // Use the same logic as in useEffect
    if (actions["Animation"] || actions["mixamo.com"] || actions["Take 001"]) {
      targetAction = actions["Animation"] || actions["mixamo.com"] || actions["Take 001"];
    }
    else if (actionKeys.length > 14 && actions[actionKeys[14]]) {
      targetAction = actions[actionKeys[14]];
    } else if (actionKeys.length > 0) {
      targetAction = actions[actionKeys[0]];
    }

    if (targetAction) {
      const clip = targetAction.getClip();
      targetAction.time = clip.duration * progress;
    }

    // Trigger animation completion
    if (progress >= 1 && !animationCompleted) {
      setAnimationCompleted(true);
    }
  });

  return (
    <>
      {visible && (
        <group ref={group} position={position} dispose={null}>
          {/* Render the cloned scene instead of the original */}
          <primitive object={clone} />
        </group>
      )}
    </>
  );
};

export default Model2;
