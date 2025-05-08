
import React from "react";
import { motion } from "framer-motion";

const colors = [
    "bg-rose-300",
    "bg-orange-300",
    "bg-green-300",
    "bg-blue-300",
    "bg-indigo-300",
    "bg-pink-300",
];

const SessionLoading: React.FC = () => {
    return (
        <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-50 to-pink-50 relative overflow-hidden">
            {/* 로딩 텍스트 */}
            <h1 className="text-2xl font-bold text-gray-700 mb-6">세션을 불러오는 중입니다...</h1>

            {/* 회전 애니메이션 */}
            <motion.div
                className="w-16 h-16 relative"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            >
                {colors.map((color, index) => (
                    <span
                        key={index}
                        className={`absolute w-3 h-3 rounded-full ${color}`}
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
