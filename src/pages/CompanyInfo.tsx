import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Cloud, RotateCw, Sparkles, MousePointerClick } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import VisionCard from '@/components/company/VisionCard';
import FeatureCards from '@/components/company/FeatureCards';
import PhilosophyCard from '@/components/company/PhilosophyCard';
import TestimonialsSection from '@/components/company/TestimonialsSection';
import * as THREE from 'three';

const CompanyInfo: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  // Scroll progress for animations
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.2]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const handleStartFree = () => {
    if (user) {
      navigate('/');
    } else {
      navigate('/login');
    }
  };


  // Enhanced 3D Typography effect with scroll and mouse interactions
  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 280, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer with improved settings
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });

    renderer.setSize(window.innerWidth, 280);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create a more sophisticated cube array for "Aigongbu" text
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    // Enhanced color palette with glassmorphism-friendly colors
    const colors = [
      0x94B49F, // ghibli-meadow
      0x789395, // ghibli-stone
      0x61A3BA, // ghibli-sky-blue
      0x5E454B  // ghibli-forest
    ];

    // Create cube pattern resembling text - same positions as original
    const positions = [
      // A
      [-3.2, 0.5, 0], [-3.2, 0, 0], [-3.2, -0.5, 0],
      [-2.7, 1, 0], [-2.2, 0.5, 0], [-2.2, 0, 0], [-2.2, -0.5, 0],
      [-2.7, 0, 0],
      // i
      [-1.7, 0.5, 0], [-1.7, 0, 0], [-1.7, -0.5, 0], [-1.7, 1, 0],
      // g
      [-1.0, 0.5, 0], [-1.0, 0, 0], [-1.0, -0.5, 0], [-1.0, -1.0, 0],
      [-0.5, 0.5, 0], [0, 0.5, 0], [0, 0, 0], [0, -0.5, 0], [-0.5, -0.5, 0],
      [0, -1.0, 0], [-0.5, -1.0, 0],
      // o
      [0.5, 0.5, 0], [0.5, 0, 0], [0.5, -0.5, 0],
      [1.0, 0.5, 0], [1.5, 0.5, 0], [1.5, 0, 0], [1.5, -0.5, 0],
      [1.0, -0.5, 0],
      // n
      [2.0, 0.5, 0], [2.0, 0, 0], [2.0, -0.5, 0],
      [2.5, 0.5, 0], [3.0, 0.5, 0], [3.0, 0, 0], [3.0, -0.5, 0]
    ];

    // Create enhanced cubes with better materials and effects
    positions.forEach((position, i) => {
      const cubeSize = 0.2;
      const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

      // Create a more sophisticated material with glassmorphism-like effect
      const material = new THREE.MeshPhysicalMaterial({
        color: colors[i % colors.length],
        metalness: 0.2,
        roughness: 0.1,
        transmission: 0.9, // Transparency
        thickness: 0.5,    // Glass thickness
        clearcoat: 1,      // Clear coat layer
        clearcoatRoughness: 0.1
      });

      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(position[0], position[1], position[2]);
      cube.castShadow = true;
      cube.receiveShadow = true;
      cubeGroup.add(cube);
    });

    // Center the group
    cubeGroup.position.x = 0.5;

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 2, 3);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Add a point light for more dynamic lighting
    const pointLight = new THREE.PointLight(0x94B49F, 1, 10);
    pointLight.position.set(2, 0, 2);
    scene.add(pointLight);

    const clock = new THREE.Clock();

    // Mouse position tracking for interactive effects
    const mouse = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    // Enhanced scroll handler for 3D effect
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrollY(scrollPosition);

      // Update 3D effect based on scroll
      if (cubeGroup) {
        // Rotate based on scroll position
        cubeGroup.rotation.y = scrollPosition * 0.001;
        cubeGroup.rotation.x = scrollPosition * 0.0005;

        // Scale slightly based on scroll
        const scale = 1 - Math.min(0.2, scrollPosition * 0.0002);
        cubeGroup.scale.set(scale, scale, scale);
      }
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // Enhanced animation loop with mouse and scroll interactions
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Animate the entire group with mouse influence
      cubeGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.3 + (mouse.x * 0.5);
      cubeGroup.rotation.z = Math.sin(elapsedTime * 0.2) * 0.1 + (mouse.y * 0.1);

      // Individual cube animations with more complexity
      cubeGroup.children.forEach((cube, i) => {
        cube.rotation.x = Math.sin(elapsedTime + i * 0.1) * 0.2;
        cube.position.y += Math.sin(elapsedTime * 2 + i) * 0.002;

        // Subtle scale pulsing effect
        const scaleOffset = Math.sin(elapsedTime * 1.5 + i * 0.5) * 0.05;
        cube.scale.set(
          1 + scaleOffset,
          1 + scaleOffset,
          1 + scaleOffset
        );
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / 280;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, 280);
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      // Clean up Three.js resources
      cubeGroup.children.forEach(cube => {
        (cube as THREE.Mesh).geometry.dispose();
        ((cube as THREE.Mesh).material as THREE.Material).dispose();
      });

      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-background/90 to-background/70 overflow-x-hidden">
      {/* Enhanced background with glassmorphism particles */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-ghibli-cloud/20 via-transparent to-transparent opacity-70"></div>
        <div className="absolute inset-0 bg-pattern mix-blend-soft-light opacity-30"></div>

        {/* Decorative floating elements */}
        {Array.from({ length: 20 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-white/5 backdrop-blur-md border border-white/10"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              zIndex: -5,
            }}
            animate={{
              x: [0, Math.random() * 30 - 15],
              y: [0, Math.random() * 30 - 15],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: Math.random() * 10 + 10,
            }}
          />
        ))}
      </div>

      <Header />

      <main className="container mx-auto pt-32 px-4 pb-16 relative z-10">
        <motion.div
          style={{ opacity, scale }}
          className="max-w-4xl mx-auto"
        >
          {/* 3D Kinetic Typography Canvas */}
          <div className="mb-8 h-[280px] w-full flex items-center justify-center relative">
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <MousePointerClick className="h-10 w-10 text-ghibli-meadow/50 animate-pulse absolute" />
              <span className="text-xs text-ghibli-stone mt-16 animate-pulse">
                Scroll & Move Mouse to Interact
              </span>
            </motion.div>
            <canvas ref={canvasRef} className="max-w-full relative z-10" />
          </div>

          {/* Company Introduction - Enhanced Glassmorphism Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl mb-12 p-8 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-ghibli-meadow/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-ghibli-sky-blue/10 rounded-full blur-3xl"></div>

            <div className="text-center relative z-10">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotateZ: [0, 2, -2, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut"
                }}
              >
                <Cloud className="h-16 w-16 text-ghibli-meadow mx-auto mb-4" />
              </motion.div>

              <motion.h1
                className="text-4xl font-handwritten text-ghibli-forest mb-4 drop-shadow-lg"
                animate={{
                  scale: [1, 1.03, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  ease: "easeInOut"
                }}
              >
                Aigongbu
              </motion.h1>

              <p className="text-xl text-ghibli-stone italic mb-6 backdrop-blur">
                "인터넷 강의 및 AI와 함께 공부"
              </p>

              <motion.div
                className="mt-8 max-w-2xl mx-auto text-ghibli-midnight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                <p className="mb-4 leading-relaxed">
                  Aigongbu는 혁신적인 교육 플랫폼으로, 전통적인 강의와 최첨단 AI 기술을 결합하여
                  학습자들에게 개인 맞춤형 학습 경험을 제공합니다.
                </p>
                <p className="leading-relaxed">
                  우리는 모든 사람이 자신의 잠재력을 최대한 발휘할 수 있도록 지원하는
                  교육 생태계를 구축하기 위해 노력하고 있습니다.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Vision Card with 3D rotation effect */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg overflow-hidden p-6">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <motion.div
                  className="w-full md:w-1/2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h2 className="text-3xl font-handwritten text-ghibli-forest mb-4">우리의 비전</h2>
                  <p className="text-ghibli-midnight mb-4">
                    Aigongbu는 전통적인 교육 방식과 최신 AI 기술을 융합하여, 모든 학습자에게
                    개인화된 학습 경험을 제공하는 혁신적인 플랫폼입니다.
                  </p>
                  <div className="flex gap-3 mt-4">
                    {['창의적', '혁신적', '개인화된'].map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs rounded-full bg-ghibli-meadow/20 text-ghibli-forest border border-ghibli-meadow/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  className="w-full md:w-1/2 perspective-1000"
                  whileHover={{ rotateY: 5, rotateX: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="relative h-60 w-full rounded-xl overflow-hidden shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-ghibli-sky-blue/30 to-ghibli-meadow/30 mix-blend-overlay"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-20 w-20 text-white/70" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/30 to-transparent">
                      <p className="text-white text-center font-medium">미래를 향한 교육 혁신</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </Card>
          </motion.div>

          {/* Feature Cards with enhanced glassmorphism */}
          <FeatureCards />

          {/* Philosophy Card with parallax effect */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="my-16"
          >
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg overflow-hidden">
              <div className="relative h-64 overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-ghibli-forest/20 to-ghibli-meadow/30"
                  style={{
                    y: useTransform(scrollYProgress, [0, 1], [0, -50]),
                    scale: useTransform(scrollYProgress, [0, 1], [1, 1.2])
                  }}
                ></motion.div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
                  <RotateCw className="h-12 w-12 mb-4 text-white/80" />
                  <h2 className="text-3xl font-handwritten mb-2 drop-shadow-lg">교육 철학</h2>
                  <p className="text-center max-w-md mx-auto px-4">
                    우리는 모든 사람이 자신만의 속도와 방식으로 배울 권리가 있다고 믿습니다.
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: "개인화된 학습",
                      desc: "각 학습자의 필요, 관심사, 학습 스타일에 맞춘 교육을 제공합니다."
                    },
                    {
                      title: "지속적인 성장",
                      desc: "끊임없는 학습과 자기 개발을 통해 진정한 성장을 이룰 수 있도록 돕습니다."
                    },
                    {
                      title: "창의적 혁신",
                      desc: "전통적인 교육 방식을 넘어, 혁신적인 기술과 방법론을 적극 활용합니다."
                    }
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20"
                      whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.2)' }}
                    >
                      <h3 className="text-xl font-medium mb-2 text-ghibli-forest">{item.title}</h3>
                      <p className="text-ghibli-midnight/90">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.section>

          {/* Enhanced Testimonials Section */}
          <TestimonialsSection />

          {/* Join Us - Enhanced Glassmorphism Button Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center pt-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-8 mt-12 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-ghibli-sunset/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-ghibli-forest/20 rounded-full blur-3xl"></div>

            <motion.h2
              className="text-2xl font-handwritten text-ghibli-forest mb-4 relative z-10"
              animate={{
                y: [0, -5, 0],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              함께 성장해요
            </motion.h2>

            <p className="text-ghibli-midnight mb-6 max-w-2xl mx-auto relative z-10">
              Aigongbu와 함께 당신의 기술 여정을 시작하세요.
              우리는 당신이 꿈꾸는 미래로 가는 길을 밝혀줄 준비가 되어 있습니다.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block"
            >
              <Button
                onClick={handleStartFree}
                className="py-3 px-8 bg-ghibli-meadow hover:bg-ghibli-forest text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group"
              >
                <span className="relative z-10">무료로 시작하기</span>
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-ghibli-forest to-ghibli-stone opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default CompanyInfo;
