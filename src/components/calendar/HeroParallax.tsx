"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

interface HeroParallaxProps {
  imageSrc: string;
}

export function HeroParallax({ imageSrc }: HeroParallaxProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    let width = mountRef.current.clientWidth;
    let height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    
    // Orthographic or Perspective. Parallax often uses Perspective.
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const useMobileScroll = window.innerWidth <= 768;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageSrc, (texture) => {
      // Create a plane that covers the camera view
      const geometry = new THREE.PlaneGeometry(16, 9);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const plane = new THREE.Mesh(geometry, material);
      
      // Scale plane up slightly to hide edges during parallax
      plane.scale.set(1.1, 1.1, 1.1);
      scene.add(plane);

      let mouse = { x: 0, y: 0 };
      let targetMouse = { x: 0, y: 0 };

      const onMouseMove = (event: MouseEvent) => {
        // Normalize mouse to -1 to 1
        targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      };

      const onScroll = () => {
        // Simple scroll parallax for mobile
        const scrollY = window.scrollY;
        targetMouse.y = scrollY * 0.002;
      };

      if (useMobileScroll) {
        window.addEventListener("scroll", onScroll);
      } else {
        window.addEventListener("mousemove", onMouseMove);
      }

      const tick = () => {
        // Smoothly interpolate current mouse to target
        mouse.x += (targetMouse.x - mouse.x) * 0.05;
        mouse.y += (targetMouse.y - mouse.y) * 0.05;

        // Apply to camera position
        camera.position.x = mouse.x * 0.5;
        camera.position.y = mouse.y * 0.5;
        camera.lookAt(new THREE.Vector3(0,0,0));

        renderer.render(scene, camera);
        animationId = requestAnimationFrame(tick);
      };
      
      let animationId = requestAnimationFrame(tick);
      
      // Handle resize
      const onResize = () => {
        if (!mountRef.current) return;
        width = mountRef.current.clientWidth;
        height = mountRef.current.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize);

      // Cleanup function strictly appended to the element's cleanup
      (mountRef.current as any)._cleanup = () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize", onResize);
        if (useMobileScroll) {
          window.removeEventListener("scroll", onScroll);
        } else {
          window.removeEventListener("mousemove", onMouseMove);
        }
        geometry.dispose();
        material.dispose();
        texture.dispose();
        renderer.dispose();
      };
    });

    return () => {
      // Disposing three.js logic
      if (mountRef.current) {
        const cleanup = (mountRef.current as any)._cleanup;
        if (cleanup) cleanup();
        if (renderer.domElement.parentNode === mountRef.current) {
          mountRef.current.removeChild(renderer.domElement);
        }
      }
    };
  }, [imageSrc]);

  return (
    <div 
      ref={mountRef} 
      className="w-full relative overflow-hidden bg-black/10"
      style={{ aspectRatio: "16/9" }}
    />
  );
}
