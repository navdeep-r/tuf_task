"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { extractDominantColor } from "@/lib/colorExtractor";

// ─────────────────────────────────────────────
// HeroParallax — Three.js parallax hero image
// Uses a perspective camera to create a subtle
// drift effect based on mouse (Desktop) or
// scroll (Mobile) position.
// ─────────────────────────────────────────────

interface HeroParallaxProps {
  /** Path to the hero image. */
  imageSrc: string;
  /** Callback with extracted dominant color from the image. */
  onColorExtracted?: (color: string) => void;
}

export function HeroParallax({ imageSrc, onColorExtracted }: HeroParallaxProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const handleColorExtraction = useCallback(
    (src: string) => {
      if (!onColorExtracted) return;
      extractDominantColor(src).then(onColorExtracted);
    },
    [onColorExtracted]
  );

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // ── Scene setup ─────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const isMobile = window.innerWidth <= 768;

    // ── Load texture ────────────────────────
    const textureLoader = new THREE.TextureLoader();
    let animationId: number;

    textureLoader.load(imageSrc, (texture) => {
      const geometry = new THREE.PlaneGeometry(16, 9);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const plane = new THREE.Mesh(geometry, material);

      // Scale up slightly to hide edges during parallax
      plane.scale.set(1.15, 1.15, 1.15);
      scene.add(plane);

      // Extract color from the image
      handleColorExtraction(imageSrc);

      // ── Parallax tracking ───────────────
      const mouse = { x: 0, y: 0 };
      const targetMouse = { x: 0, y: 0 };

      const onMouseMove = (event: MouseEvent) => {
        targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      };

      const onScroll = () => {
        targetMouse.y = window.scrollY * 0.002;
      };

      if (isMobile) {
        window.addEventListener("scroll", onScroll, { passive: true });
      } else {
        window.addEventListener("mousemove", onMouseMove);
      }

      // ── Render loop ─────────────────────
      const tick = () => {
        mouse.x += (targetMouse.x - mouse.x) * 0.05;
        mouse.y += (targetMouse.y - mouse.y) * 0.05;

        camera.position.x = mouse.x * 0.4;
        camera.position.y = mouse.y * 0.3;
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        renderer.render(scene, camera);
        animationId = requestAnimationFrame(tick);
      };

      animationId = requestAnimationFrame(tick);

      // ── Handle resize ───────────────────
      const onResize = () => {
        if (!container) return;
        width = container.clientWidth;
        height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize);

      // ── Register cleanup ────────────────
      cleanupRef.current = () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize", onResize);
        if (isMobile) {
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
      if (cleanupRef.current) cleanupRef.current();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [imageSrc, handleColorExtraction]);

  return (
    <div
      ref={mountRef}
      className="w-full relative overflow-hidden rounded-t-lg bg-[var(--paper-bg-dark)]"
      style={{ aspectRatio: "20/9" }}
      aria-hidden="true"
    />
  );
}
