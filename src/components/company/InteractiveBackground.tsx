
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
    const particlesCount = 2500; // Increased particle count for more density
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    const sizesArray = new Float32Array(particlesCount);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      // Position (xyz)
      posArray[i] = (Math.random() - 0.5) * 70; // Wider distribution
      
      // Colors (rgb) - using ghibli theme colors
      if (i % 3 === 0) {
        // R value - ghibli forest
        colorsArray[i] = 0.58 + Math.random() * 0.2;
      } else if (i % 3 === 1) {
        // G value - ghibli meadow
        colorsArray[i] = 0.8 + Math.random() * 0.2;
      } else {
        // B value - ghibli sky-blue
        colorsArray[i] = 0.65 + Math.random() * 0.3;
      }
    }
    
    // Varying sizes for particles
    for (let i = 0; i < particlesCount; i++) {
      sizesArray[i] = Math.random() * 0.5 + 0.1; // More varying sizes
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizesArray, 1));
    
    // Custom shader material for more interesting visuals
    const particlesMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        scrollY: { value: 0 }, // Add scrollY uniform
        pointTexture: { value: new THREE.TextureLoader().load('/placeholder.svg') }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        uniform float scrollY;
        
        void main() {
          vColor = color;
          
          // Animated position based on time and scroll
          vec3 pos = position;
          
          // Wave effect
          pos.y += sin(time * 0.3 + position.x * 0.25 + scrollY * 0.01) * 0.8;
          pos.x += cos(time * 0.3 + position.y * 0.25 + scrollY * 0.01) * 0.8;
          
          // Scroll-based z-position for parallax
          pos.z += sin(scrollY * 0.001 + position.x * 0.01) * 5.0;
          
          // Add subtle rotation based on scroll
          float angle = scrollY * 0.0005;
          float c = cos(angle);
          float s = sin(angle);
          pos.xz = mat2(c, -s, s, c) * pos.xz;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        uniform sampler2D pointTexture;
        
        void main() {
          // Circular point shape with soft edges
          float distFromCenter = length(gl_PointCoord - vec2(0.5));
          if (distFromCenter > 0.5) discard;
          
          // Color with soft glow edges
          float alpha = smoothstep(0.5, 0.0, distFromCenter);
          gl_FragColor = vec4(vColor, alpha * 0.8);
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
        particlesMaterial.uniforms.scrollY.value = scrollY;
      }
      
      // Rotate based on mouse position with limited effect
      particlesMesh.rotation.x = mousePosition.y * 0.2;
      particlesMesh.rotation.y = mousePosition.x * 0.2;
      
      // Respond to scroll position - more dramatic effect
      const scrollEffect = scrollY * 0.003;
      camera.position.z = 15 + Math.sin(scrollEffect) * 3;
      particlesMesh.rotation.z = scrollEffect * 0.1;
      
      // Subtle camera movement
      camera.position.x = Math.sin(scrollEffect * 0.5) * 2;
      camera.position.y = Math.cos(scrollEffect * 0.3) * 1;
      
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
  }, [scrollY]); // React to scrollY changes
  
  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 -z-10 bg-gradient-to-b from-ghibli-midnight via-background/90 to-background"
    />
  );
};

export default InteractiveBackground;
