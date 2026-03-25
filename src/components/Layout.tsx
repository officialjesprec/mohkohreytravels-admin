import { useEffect, useCallback, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function Layout() {
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes

  const handleLogout = useCallback(() => {
    toast.error("Session expired due to inactivity.");
    // In a real app, you would clear auth tokens here
    // navigate("/login"); 
  }, [navigate]);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(handleLogout, INACTIVITY_LIMIT);
  }, [handleLogout]);

  useEffect(() => {
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];

    events.forEach(event => document.addEventListener(event, resetTimer));
    resetTimer(); // Initialize timer

    return () => {
      events.forEach(event => document.removeEventListener(event, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [resetTimer]);

  return (
    <div className="flex h-screen bg-background text-on-background font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Subtle background gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>

        <Header />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
