import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

const INACTIVITY_THRESHOLD = 5 * 60 * 1000; // 5 minutes

export function useInactivityTimeout() {
    const timerRef = useRef<number | null>(null);

    const resetTimer = () => {
        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
        }

        timerRef.current = window.setTimeout(() => {
            logout();
        }, INACTIVITY_THRESHOLD);
    };

    const logout = () => {
        toast.error('Session expired due to inactivity. Logging out...');
        // In a real app, you would clear cookies/localStorage/Supabase session here
        setTimeout(() => {
            window.location.href = '/login'; // Or wherever your login page is
        }, 2000);
    };

    useEffect(() => {
        // Events to track user activity
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

        // Initial timer start
        resetTimer();

        // Add event listeners
        events.forEach(event => {
            window.addEventListener(event, resetTimer);
        });

        // Clean up
        return () => {
            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
            }
            events.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, []);

    return null;
}
