import React, { useState, useEffect } from "react";
import { Map, Calendar, Compass, Loader2, Users, Ticket } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";

export function Dashboard() {
  const [stats, setStats] = useState({
    totalTours: 0,
    activeBookings: 0,
    pendingBookings: 0,
    newLeads: 0
  });
  const [recentTours, setRecentTours] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const [{ count: toursCount }, { count: bookingsCount }, { count: pendingCount }, { count: leadsCount }] = await Promise.all([
        supabase.from('tours').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'CONFIRMED'),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
        supabase.from('leads').select('*', { count: 'exact', head: true })
      ]);

      const [{ data: toursData }, { data: bookingsData }, { data: leadsData }] = await Promise.all([
        supabase.from('tours').select('*').limit(5).order('created_at', { ascending: false }),
        supabase.from('bookings').select('*').limit(5).order('created_at', { ascending: false }),
        supabase.from('leads').select('*').limit(5).order('created_at', { ascending: false })
      ]);

      setStats({
        totalTours: toursCount || 0,
        activeBookings: bookingsCount || 0,
        pendingBookings: pendingCount || 0,
        newLeads: leadsCount || 0
      });

      setRecentTours(toursData || []);
      setRecentBookings(bookingsData || []);
      setRecentLeads(leadsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#005EB8]" />
        <p className="font-medium">Aggregating real-time insights...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-headline font-bold text-on-surface tracking-tight lowercase">
            Overview
          </h1>
          <p className="text-on-surface-variant mt-1">
            Welcome back, here's what's happening globally today.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => toast.info("Data auto-synced with Supabase")}
            className="px-5 py-2.5 rounded-full bg-surface-container-high text-on-surface font-medium hover:bg-surface-container-highest transition-colors flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Live Sync: Active
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Tours</p>
              <h3 className="text-3xl font-black text-on-surface">{stats.totalTours}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Confirmed</p>
              <h3 className="text-3xl font-black text-on-surface">{stats.activeBookings}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-green-500/20 text-green-600 flex items-center justify-center">
              <Ticket className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Pending</p>
              <h3 className="text-3xl font-black text-on-surface">{stats.pendingBookings}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center">
              <Loader2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-error-container/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Leads</p>
              <h3 className="text-3xl font-black text-on-surface">{stats.newLeads}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-error-container text-on-error-container flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-on-surface">Recent Bookings</h2>
            <span className="text-xs text-[#005EB8] font-bold">{recentBookings.length} entries</span>
          </div>
          <div className="space-y-3 flex-1">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#005EB8]/10 text-[#005EB8] flex items-center justify-center font-bold text-sm">
                  {booking.full_name?.charAt(0) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-on-surface text-sm truncate">{booking.full_name || 'Unknown'}</p>
                  <p className="text-xs text-on-surface-variant truncate">{booking.type || booking.email || 'General'}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                  booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                  booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {booking.status || 'PENDING'}
                </span>
              </div>
            ))}
            {recentBookings.length === 0 && (
              <div className="flex flex-col items-center justify-center opacity-30 py-8">
                <Ticket className="w-8 h-8 mb-2" />
                <p className="text-xs">No bookings yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-on-surface">Recent Leads</h2>
            <span className="text-xs text-[#005EB8] font-bold">{recentLeads.length} entries</span>
          </div>
          <div className="space-y-3 flex-1">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#FFA000]/10 text-[#FFA000] flex items-center justify-center font-bold text-sm">
                  {lead.full_name?.charAt(0) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-on-surface text-sm truncate">{lead.full_name || 'Unknown'}</p>
                  <p className="text-xs text-on-surface-variant truncate">{lead.email || lead.source || 'Contact'}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                  lead.status === 'RESPONDED' ? 'bg-green-100 text-green-700' :
                  lead.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {lead.status === 'RESPONDED' ? 'Done' : lead.status === 'IN_PROGRESS' ? 'Active' : 'New'}
                </span>
              </div>
            ))}
            {recentLeads.length === 0 && (
              <div className="flex flex-col items-center justify-center opacity-30 py-8">
                <Users className="w-8 h-8 mb-2" />
                <p className="text-xs">No leads yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-on-surface">Latest Tours</h2>
            <span className="text-xs text-[#005EB8] font-bold">{recentTours.length} entries</span>
          </div>
          <div className="space-y-3 flex-1">
            {recentTours.map((tour) => (
              <div key={tour.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors">
                <img
                  src={tour.images?.[0] || `https://picsum.photos/seed/${tour.id}/100/100`}
                  alt={tour.title}
                  className="w-10 h-10 rounded-lg object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-on-surface text-sm truncate">{tour.title}</p>
                  <p className="text-xs text-[#005EB8] font-medium">{tour.location || 'Global'}</p>
                </div>
                {tour.is_featured && (
                  <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                    Featured
                  </span>
                )}
              </div>
            ))}
            {recentTours.length === 0 && (
              <div className="flex flex-col items-center justify-center opacity-30 py-8">
                <Map className="w-8 h-8 mb-2" />
                <p className="text-xs">No tours yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

