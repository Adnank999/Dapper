"use client";

import React, { useRef, useEffect, useState, useCallback, ReactNode } from "react";
import { cn } from "@/lib/utils"; // Adjust import path as needed
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface SphereIcon {
  x: number;
  y: number;
  z: number;
  scale: number;
  opacity: number;
  id: number;
}

export interface TechIcon {
  icon: string | StaticImport;
  name: string;
}

export interface IconCloudProps {
  className?: string;
  techIcons?: TechIcon[];
}





const IconCloud: React.FC<IconCloudProps> = ({ className, techIcons = [] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  
  const imageCanvasesRef = useRef<HTMLCanvasElement[]>([]);
  const imagesLoadedRef = useRef<boolean[]>([]);
  
  const [imagePositions, setImagePositions] = useState<SphereIcon[]>([]);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetRotation, setTargetRotation] = useState<{
    x: number;
    y: number;
    startX: number;
    startY: number;
    distance: number;
    startTime: number;
    duration: number;
  } | null>(null);

  const easeOutCubic = (t: number): number => {
    return 1 - (1 - t) ** 3;
  };

  // Load images effect
  useEffect(() => {
    if (!techIcons.length) return;
    
    imagesLoadedRef.current = new Array(techIcons.length).fill(false);

    const newImageCanvases = techIcons.map((techIcon, idx) => {
      const offscreen = document.createElement('canvas');
      offscreen.width = 40;
      offscreen.height = 40;
      const offCtx = offscreen.getContext('2d');
      if (!offCtx) return offscreen;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = techIcon.icon;
      img.onload = () => {
        offCtx.clearRect(0, 0, offscreen.width, offscreen.height);

        // circular clipping
        offCtx.beginPath();
        offCtx.arc(20, 20, 20, 0, Math.PI * 2);
        offCtx.closePath();
        offCtx.clip();

        // draw the image
        offCtx.drawImage(img, 0, 0, 40, 40);
        imagesLoadedRef.current[idx] = true;
      };

      return offscreen;
    });

    imageCanvasesRef.current = newImageCanvases;
  }, [techIcons]);

  // Generate sphere positions effect
  useEffect(() => {
    const count = techIcons.length;
    if (count === 0) {
      setImagePositions([]);
      return;
    }

    const newPositions: SphereIcon[] = [];
    const offset = 2 / count;
    const increment = Math.PI * (3 - Math.sqrt(5)); // ~2.3999632

    for (let i = 0; i < count; i++) {
      const y = i * offset - 1 + offset / 2;
      // const y = i * (offset * 1.1) - 1 + (offset / 2);
      const r = Math.sqrt(1 - y * y);
      const phi = i * increment;
      const x = Math.cos(phi) * r;
      const z = Math.sin(phi) * r;

      newPositions.push({
        x: x * 130,
        y: y * 130,
        z: z * 130,
        scale: 1,
        opacity: 1,
        id: i,
      });
    }
    setImagePositions(newPositions);
  }, [techIcons.length]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check if clicking on an icon
    for (const icon of imagePositions) {
      const cosX = Math.cos(rotation.x);
      const sinX = Math.sin(rotation.x);
      const cosY = Math.cos(rotation.y);
      const sinY = Math.sin(rotation.y);

      const rotatedX = icon.x * cosY - icon.z * sinY;
      const rotatedZ = icon.x * sinY + icon.z * cosY;
      const rotatedY = icon.y * cosX + rotatedZ * sinX;

      const screenX = canvas.width / 2 + rotatedX;
      const screenY = canvas.height / 2 + rotatedY;

      const scale = ((rotatedZ + 200) / 300) * 0.8;
      const radius = 20 * scale;
      const dx = x - screenX;
      const dy = y - screenY;

      if (dx * dx + dy * dy < radius * radius) {
        // Optional: Log which tech icon was clicked
        console.log(`Clicked on: ${techIcons[icon.id]?.name}`);
        
        const targetX = -Math.atan2(icon.y, Math.sqrt(icon.x * icon.x + icon.z * icon.z));
        const targetY = Math.atan2(icon.x, icon.z);
        const currentX = rotation.x;
        const currentY = rotation.y;
        const distance = Math.sqrt((targetX - currentX) ** 2 + (targetY - currentY) ** 2);

        const duration = Math.min(2000, Math.max(800, distance * 1000));
        setTargetRotation({
          x: targetX,
          y: targetY,
          startX: currentX,
          startY: currentY,
          distance,
          startTime: performance.now(),
          duration,
        });
        return;
      }
    }

    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  }, [imagePositions, rotation, techIcons]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    if (isDragging) {
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;

      setRotation(prev => ({
        x: prev.x + deltaY * 0.002,
        y: prev.y + deltaX * 0.002,
      }));

      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, lastMousePos]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const dx = mousePos.x - centerX;
      const dy = mousePos.y - centerY;
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
      const distance = Math.sqrt(dx * dx + dy * dy);

      const speed = 0.003 + (distance / maxDistance) * 0.01;

      if (targetRotation) {
        const { startX, startY, x: tx, y: ty, startTime, duration } = targetRotation;
        const elapsed = performance.now() - startTime;
        const progress = Math.min(1, elapsed / duration);
        const eased = easeOutCubic(progress);

        setRotation({
          x: startX + (tx - startX) * eased,
          y: startY + (ty - startY) * eased,
        });

        if (progress >= 1) {
          setTargetRotation(null);
        }
      } else if (!isDragging) {
        setRotation(prev => ({
          x: prev.x + (dy / canvas.height) * speed,
          y: prev.y + (dx / canvas.width) * speed,
        }));
      }

      imagePositions.forEach((icon, index) => {
        const cosX = Math.cos(rotation.x);
        const sinX = Math.sin(rotation.x);
        const cosY = Math.cos(rotation.y);
        const sinY = Math.sin(rotation.y);

        const rotatedX = icon.x * cosY - icon.z * sinY;
        const rotatedZ = icon.x * sinY + icon.z * cosY;
        const rotatedY = icon.y * cosX + rotatedZ * sinX;

        const scale = (rotatedZ + 200) / 300;
        const opacity = Math.max(0.2, Math.min(1, (rotatedZ + 150) / 200));

        ctx.save();
        ctx.translate(centerX + rotatedX, centerY + rotatedY);
        ctx.scale(scale, scale);
        ctx.globalAlpha = opacity;

        if (imageCanvasesRef.current[index] && imagesLoadedRef.current[index]) {
          ctx.drawImage(imageCanvasesRef.current[index], -18, -18, 36, 36);
        }
        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [imagePositions, rotation, mousePos, targetRotation, isDragging]);

  return (
    <canvas
      ref={canvasRef}
      // width="300"
      height="300"
      className={cn('w-full', className)}
      role="img"
      aria-label="Interactive 3D Tech Icons Cloud"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
};

export default IconCloud;


