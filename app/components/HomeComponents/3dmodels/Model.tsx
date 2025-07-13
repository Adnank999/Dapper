import React, { useEffect, useRef, useState } from "react";
import {
  useAnimations,
  useCamera,
  useGLTF,
  useScroll,
} from "@react-three/drei";
import { Group } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useLenis } from "lenis/react";
import ScrollReveal from "../ScrollReveal";
import useIsMobile from "@/hooks/useIsMobile";
useGLTF.preload("/model/spiderman_2099.glb");

const Model = ({ visible,scrollProgress,setAnimationCompleted }: { visible: boolean;scrollProgress: React.MutableRefObject<number>;setAnimationCompleted: any; }) => {
  const group = useRef<Group>(null);
  const { nodes, materials, animations, scene } = useGLTF(
    "/model/spiderman_2099.glb"
  );
  // console.log("nodes", nodes);
  // console.log("materials", materials);
  const { actions, clips } = useAnimations(animations, scene);


  const scroll = useScroll();
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

  const position: [number, number, number] = isMobile ? [0, -1, 0] : [-1, -1, 0]




  //   console.log("actions", actions);
  //   console.log("scroll", scroll);

  useEffect(() => {
    const bodyMat = materials.hero_spiderman209901_S02_04;
    const bodyMat2 = materials.hero_spiderman209901_S02_02;

    const color = new THREE.Color(0x800000);

    if (bodyMat) {
      // bodyMat.emissiveMap = gradientTexture;
      bodyMat.emissive = color;
      bodyMat.emissiveIntensity = 2;
    }

    actions[Object.keys(actions)[14]].play().paused = true;
  }, []);

  /* 1,8,10,14 animations are cool */
  

  useFrame(() => {
    // console.log("scrollProgress",scrollProgress)
   
     const progress = scrollProgress.current;
    
      if (!prevPosition.current.equals(camera.position)) {
      console.log("Camera Position Changed:", camera.position);
      prevPosition.current.copy(camera.position); // Update the previous position
    }

     camera.position.x =
      initialCameraPosition.x +
      (targetCameraPosition.x - initialCameraPosition.x) * progress;

    camera.position.y =
      initialCameraPosition.y +
      (targetCameraPosition.y - initialCameraPosition.y) * progress;

    camera.position.z =
      initialCameraPosition.z +
      (targetCameraPosition.z - initialCameraPosition.z) * progress;

    camera.lookAt(0, 0, 0); // Optional: Keep focus centered
    camera.updateProjectionMatrix();

  
    const action = actions[Object.keys(actions)[14]];
    if (action) {
      const clip = action.getClip();
      action.time = clip.duration * progress;
    }

    // Trigger ScrollReveal when animation is complete
    if (progress >= 1 ) {
      setAnimationCompleted(true); 
    }
   
  });



  return (
    <>
      {/* Postprocessing EffectComposer */}
    {/* position={[-1, -1, 0]} */}
    {/* mobile position={[0, -1, 0]} */}
      <group ref={group} position={position}>
        <primitive object={scene} />
      </group>

     
    </>
  );
};

export default Model;
