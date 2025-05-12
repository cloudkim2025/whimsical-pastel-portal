
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Cloud } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import VisionCard from '@/components/company/VisionCard';
import FeatureCards from '@/components/company/FeatureCards';
import PhilosophyCard from '@/components/company/PhilosophyCard';
import TestimonialsSection from '@/components/company/TestimonialsSection';
import * as THREE from 'three';

const CompanyInfo: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const handleStartFree = () => {
    if (isAuthenticated) {
      navigate('/');
    } else {
      navigate('/login');
    }
  };
  
  // 3D Typography effect
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 280, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true
    });
    
    renderer.setSize(window.innerWidth, 280);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const textMaterial = new THREE.MeshNormalMaterial();
    
    // Create 3D text
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
      const textGeometry = new THREE.TextGeometry('Aigongbu', {
        font: font,
        size: 0.5,
        height: 0.2,
      });
      
      textGeometry.center();
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      scene.add(textMesh);
      
      camera.position.z = 2;
      
      const clock = new THREE.Clock();
      
      // Animation
      const animate = () => {
        const elapsedTime = clock.getElapsedTime();
        
        textMesh.rotation.y = Math.sin(elapsedTime * 0.5) * 0.3;
        textMesh.rotation.z = Math.sin(elapsedTime * 0.2) * 0.1;
        
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };
      
      animate();
    });
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / 280;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, 280);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\" fill=\"%2394B49F\" fill-opacity=\"0.1\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')] opacity-50 z-0"></div>
      
      <Header />
      
      <main className="container mx-auto pt-32 px-4 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          {/* 3D Kinetic Typography Canvas */}
          <div className="mb-8 h-[280px] w-full flex items-center justify-center">
            <canvas ref={canvasRef} className="max-w-full" />
          </div>
          
          {/* Company Introduction - Glassmorphism Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 shadow-xl mb-12 p-6"
          >
            <div className="text-center">
              <Cloud className="h-16 w-16 text-ghibli-meadow mx-auto mb-4 animate-float" />
              <h1 className="text-4xl font-handwritten text-ghibli-forest mb-4 text-shadow">Aigongbu</h1>
              <p className="text-xl text-ghibli-stone italic">
                "인터넷 강의 및 AI와 함께 공부"
              </p>
              <div className="mt-8 max-w-2xl mx-auto text-ghibli-midnight">
                <p className="mb-4">
                  Aigongbu는 혁신적인 교육 플랫폼으로, 전통적인 강의와 최첨단 AI 기술을 결합하여 
                  학습자들에게 개인 맞춤형 학습 경험을 제공합니다.
                </p>
                <p>
                  우리는 모든 사람이 자신의 잠재력을 최대한 발휘할 수 있도록 지원하는 
                  교육 생태계를 구축하기 위해 노력하고 있습니다.
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Vision Card */}
          <VisionCard />
          
          {/* Features Cards */}
          <FeatureCards />
          
          {/* Educational Philosophy */}
          <PhilosophyCard />
          
          {/* Customer Testimonials */}
          <TestimonialsSection />
          
          {/* Join Us - Glassmorphism Button Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center pt-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg p-8 mt-12"
          >
            <h2 className="text-2xl font-handwritten text-ghibli-forest mb-4">함께 성장해요</h2>
            <p className="text-ghibli-midnight mb-6 max-w-2xl mx-auto">
              Aigongbu와 함께 당신의 기술 여정을 시작하세요. 
              우리는 당신이 꿈꾸는 미래로 가는 길을 밝혀줄 준비가 되어 있습니다.
            </p>
            <Button 
              onClick={handleStartFree}
              className="py-2.5 px-5 bg-ghibli-meadow hover:bg-ghibli-forest text-white rounded-full transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1"
            >
              무료로 시작하기
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default CompanyInfo;
