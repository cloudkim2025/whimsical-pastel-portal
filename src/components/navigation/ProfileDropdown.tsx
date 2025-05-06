import React, { useState, useRef, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

const ProfileDropdown: React.FC = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null; // 혹시 몰라서 안전장치

    return (
        <div className="relative" ref={profileRef}>
            <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center"
            >
                <Avatar className="h-10 w-10 border-2 border-ghibli-meadow hover:border-ghibli-forest transition-all duration-300">
                    {user.profileImage ? (
                        <AvatarImage src={user.profileImage} alt={user.nickname} />
                    ) : (
                        <AvatarFallback className="bg-ghibli-earth text-ghibli-forest">
                            {user.nickname.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    )}
                </Avatar>
            </button>

            <AnimatePresence>
                {isProfileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-ghibli-meadow/20 overflow-hidden z-50"
                    >
                        <div className="p-4 border-b border-ghibli-earth/10">
                            <p className="text-ghibli-forest font-medium">{user.nickname}</p>
                            {/* 이메일은 더 이상 프론트에서 제공하지 않음 */}
                        </div>
                        <div className="p-2">
                            <Link to="/profile"
                                  className="block px-4 py-2 text-sm text-ghibli-forest hover:bg-ghibli-cloud rounded-md"
                                  onClick={() => setIsProfileOpen(false)}
                            >
                                내 프로필
                            </Link>
                            <Link to="/settings"
                                  className="block px-4 py-2 text-sm text-ghibli-forest hover:bg-ghibli-cloud rounded-md"
                                  onClick={() => setIsProfileOpen(false)}
                            >
                                설정
                            </Link>
                            <button
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                                onClick={() => {
                                    logout();
                                    setIsProfileOpen(false);
                                    navigate('/');
                                }}
                            >
                                로그아웃
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileDropdown;
