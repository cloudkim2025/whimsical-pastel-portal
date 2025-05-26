import React from 'react';
export const GoogleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24">
        <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
    </svg>
);
export const NaverIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24">
        <rect width="24" height="24" fill="#03C75A" rx="2"/>
        <path
            fill="white"
            d="M16.273 12.845L7.909 3.273H4.727v17.454h7.364V11.155l8.364 9.572h3.182V3.273h-7.364v9.572z"
        />
    </svg>
);
export const KakaoIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24">
        <rect width="24" height="24" fill="#FEE500" rx="2"/>
        <path
            fill="#3A1D1D"
            d="M12 4C7.664 4 4.167 6.912 4.167 10.5c0 2.298 1.518 4.312 3.834 5.436l-.787 2.857c-.075.272.089.368.297.214l3.417-2.297c.334.034.674.051 1.015.051 4.336 0 7.833-2.912 7.833-6.5S16.336 4 12 4z"
        />
    </svg>
);

