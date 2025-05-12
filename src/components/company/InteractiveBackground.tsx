
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
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    const sizesArray = new Float32Array(particlesCount);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      // Position (xyz)
      posArray[i] = (Math.random() - 0.5) * 60;
      
      // Colors (rgb)
      if (i % 3 === 0) {
        // R value - ghibli colors
        colorsArray[i] = 0.5 + Math.random() * 0.5; // Brighter colors
      } else if (i % 3 === 1) {
        // G value - ghibli colors
        colorsArray[i] = 0.7 + Math.random() * 0.3; // Brighter colors
      } else {
        // B value - ghibli colors
        colorsArray[i] = 0.6 + Math.random() * 0.4; // Brighter colors
      }
    }
    
    // Varying sizes for particles
    for (let i = 0; i < particlesCount; i++) {
      sizesArray[i] = Math.random() * 0.3 + 0.1; // Varying sizes
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizesArray, 1));
    
    // Custom shader material for more interesting visuals
    const particlesMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pointTexture: { value: new THREE.TextureLoader().load('/placeholder.svg') }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          
          // Animated position
          vec3 pos = position;
          pos.y += sin(time * 0.2 + position.x * 0.5) * 0.5;
          pos.x += cos(time * 0.2 + position.y * 0.5) * 0.5;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        uniform sampler2D pointTexture;
        
        void main() {
          // Circular point shape
          if (length(gl_PointCoord - vec2(0.5)) > 0.5) discard;
          
          // Color with soft edges
          float alpha = 1.0 - length(gl_PointCoord - vec2(0.5)) * 2.0;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });
    
    // Points
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Add some lighting for ambience
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
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
      
      // Update shader time uniform
      if (particlesMaterial.uniforms) {
        particlesMaterial.uniforms.time.value = elapsedTime;
      }
      
      // Rotate based on mouse position with limited effect
      particlesMesh.rotation.x = mousePosition.y * 0.3;
      particlesMesh.rotation.y = mousePosition.x * 0.3;
      
      // Slow continuous rotation for ambient movement
      particlesMesh.rotation.z = elapsedTime * 0.05;
      
      // Respond to scroll position - more dramatic effect
      const scrollEffect = scrollY * 0.002;
      particlesMesh.rotation.x += scrollEffect * 0.05;
      particlesMesh.rotation.y += scrollEffect * 0.1;
      particlesMesh.position.z = -scrollEffect * 3;
      
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
      className="fixed inset-0 -z-10 bg-gradient-to-b from-ghibli-midnight/90 via-background/90 to-background"
    />
  );
};

export default InteractiveBackground;
