
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface InteractiveBackgroundProps {
  scrollY: number;
}

const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({ scrollY }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      // Position (xyz)
      posArray[i] = (Math.random() - 0.5) * 50;
      
      // Colors (rgb)
      if (i % 3 === 0) {
        // R value - ghibli meadow/forest tones
        colorsArray[i] = 0.4 + Math.random() * 0.2;
      } else if (i % 3 === 1) {
        // G value - ghibli meadow/forest tones
        colorsArray[i] = 0.65 + Math.random() * 0.2;
      } else {
        // B value - ghibli meadow/forest tones
        colorsArray[i] = 0.5 + Math.random() * 0.2;
      }
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    
    // Material with custom vertex and fragment shaders for more interesting visuals
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.12,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    });
    
    // Points
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Mouse movement effect
    const mousePosition = {
      x: 0,
      y: 0
    };
    
    window.addEventListener('mousemove', (event) => {
      mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Rotate based on mouse position with limited effect
      particlesMesh.rotation.x = mousePosition.y * 0.3;
      particlesMesh.rotation.y = mousePosition.x * 0.3;
      
      // Slow continuous rotation for ambient movement
      particlesMesh.rotation.z = elapsedTime * 0.05;
      
      // Respond to scroll position
      const scrollEffect = scrollY * 0.0015;
      particlesMesh.rotation.y += scrollEffect * 0.1;
      particlesMesh.position.z = -scrollEffect * 2;
      
      // Wave effect
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const x = particlesGeometry.attributes.position.array[i3];
        const y = particlesGeometry.attributes.position.array[i3 + 1];
        
        // Apply sine wave effect based on time and position
        const z = Math.sin(elapsedTime + x * 0.5) * 0.5;
        
        particlesGeometry.attributes.position.array[i3 + 2] = z;
      }
      
      particlesGeometry.attributes.position.needsUpdate = true;
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', () => {});
      scene.remove(particlesMesh);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, [scrollY]);
  
  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 -z-10 bg-gradient-to-b from-background/80 to-background"
    />
  );
};

export default InteractiveBackground;
