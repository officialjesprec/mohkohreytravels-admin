import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ShieldAlert, Loader2 } from 'lucide-react';

export function ProtectedRoute() {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (session && session.user) {
                    const user = session.user;
                    const domain = user?.email?.split('@')[1];

                    // Check for domain-level exclusion (domain restricted users)
                    if (domain === 'mohkohreytravels.com') {
                        setAuthenticated(true);
                        return;
                    }

                    // Fallback to manual admin check (id based)
                    const { data: adminData } = await supabase
                        .from('admins')
                        .select('id')
                        .eq('id', user.id)
                        .single();

                    if (adminData) {
                        setAuthenticated(true);
                    } else {
                        // Not an admin, sign out
                        await supabase.auth.signOut();
                        setAuthenticated(false);
                    }
                } else {
                    setAuthenticated(false);
                }
            } catch (err) {
                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-slate-500 animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 ring-1 ring-slate-100">
                    <Loader2 className="animate-spin text-[#005EB8]" size={32} />
                </div>
                <h3 className="text-xl font-bold font-heading text-slate-800 mb-2">Verifying Security</h3>
                <p className="text-sm font-medium">Please wait while we establish your session.</p>
            </div>
        );
    }

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
