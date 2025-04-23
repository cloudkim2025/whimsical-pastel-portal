//utils/decodeToken.ts
import type { DecodedTokenPayload } from '@/utils/tokenManager';

export function decodeTokenPayload(token: string): DecodedTokenPayload | null {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('[decodeTokenPayload] Invalid JWT format:', error);
        return null;
    }
}
