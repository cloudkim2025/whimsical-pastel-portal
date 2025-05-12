
import React from "react";
import { motion } from "framer-motion";

const colors = [
    "bg-purple-300", 
    "bg-indigo-300", 
    "bg-blue-300", 
    "bg-teal-300", 
    "bg-green-300", 
    "bg-amber-300",
];

const SessionLoading: React.FC = () => {
    return (
        <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 to-teal-50 relative overflow-hidden">
            {/* Background particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-white/20 backdrop-blur-sm"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            scale: Math.random() * 0.5 + 0.5,
                        }}
                        animate={{
                            y: [null, Math.random() * -200, null],
                            x: [null, Math.random() * 100 - 50, null],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 15,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        style={{
                            width: Math.random() * 100 + 20,
                            height: Math.random() * 100 + 20,
                            opacity: Math.random() * 0.3 + 0.1,
                        }}
                    />
                ))}
            </div>

            {/* Logo animation */}
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
            >
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-600">
                    <motion.path 
                        d="M12 3v3m0 12v3m-9-9H6m12 0h3m-2.5-6.5L17 7M7 17l1.5-1.5M7 7l1.5 1.5M17 17l-1.5-1.5M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.2 }}
                    />
                </svg>
            </motion.div>

            {/* 로딩 텍스트 */}
            <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-medium text-indigo-900 mb-6 font-korean tracking-wide"
            >
                세션을 불러오는 중입니다...
            </motion.h1>

            {/* 회전 애니메이션 */}
            <motion.div
                className="w-16 h-16 relative"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            >
                {colors.map((color, index) => (
                    <motion.span
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.15, duration: 0.5 }}
                        className={`absolute w-3 h-3 rounded-full ${color} shadow-lg`}
                        style={{
                            top: "50%",
                            left: "50%",
                            transform: `rotate(${(360 / colors.length) * index}deg) translate(6rem)`,
                            transformOrigin: "center",
                        }}
                    />
                ))}
            </motion.div>
        </div>
    );
};

export default SessionLoading;
