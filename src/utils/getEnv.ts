export const getEnv = (key: string): string | undefined => {
    // 1순위: window.__ENV__ (배포)
    if (typeof window !== "undefined" && window.__ENV__ && window.__ENV__[key]) {
        return window.__ENV__[key];
    }
    // 2순위: Vite 환경 (import.meta.env)
    if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[key]) {
        return import.meta.env[key];
    }
    // 3순위: Node 환경 (process.env)
    if (typeof process !== "undefined" && process.env && process.env[key]) {
        return process.env[key];
    }
    // 못 찾으면 undefined
    return undefined;
};
