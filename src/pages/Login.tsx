import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../lib/supabase';
import { Mail, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Authenticate via Supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            const user = data.user;
            const domain = user?.email?.split('@')[1];

            // 2. Client-side Domain restriction check
            if (domain !== 'mohkohreytravels.com') {
                // If not our domain, check if they are in the admins table (optional but SQL handles it via RLS)
                // If fail, sign out
                await supabase.auth.signOut();
                toast.error("Unauthorized. Only @mohkohreytravels.com emails are permitted.");
                return;
            }

            toast.success("Welcome back, Admin!");
            navigate('/');
        } catch (error: any) {
            toast.error(error.message || "Failed to log in");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
            {/* Background Decorative */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#005EB8]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FFA000]/5 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-8 md:p-10 relative z-10 animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="w-16 h-16 bg-[#005EB8]/10 rounded-2xl flex items-center justify-center mb-6 ring-4 ring-[#005EB8]/5">
                        <ShieldCheck className="text-[#005EB8]" size={32} />
                    </div>
                    <h1 className="text-3xl font-black font-heading text-[#0F172A] mb-2 tracking-tight">Admin Portal</h1>
                    <p className="text-slate-500 font-medium">Mohkohrey Travels & Tours</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Work Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#005EB8] transition-colors" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@mohkohreytravels.com"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005EB8] focus:border-transparent transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#005EB8] transition-colors" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005EB8] focus:border-transparent transition-all"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#005EB8] text-white font-black py-4 rounded-2xl shadow-[0_10px_20px_rgba(0,94,184,0.3)] hover:shadow-none hover:translate-y-0.5 transition-all text-lg flex items-center justify-center disabled:opacity-70"
                    >
                        {loading ? (
                            <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                        ) : (
                            "Sign In"
                        )}
                    </button>

                    <div className="pt-4 flex items-center gap-2 text-xs text-slate-400 justify-center">
                        <AlertCircle size={14} />
                        Only authorized domains are permitted access.
                    </div>
                </form>
            </div>
        </div>
    );
}
