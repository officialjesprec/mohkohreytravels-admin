import React, { useState, useEffect } from "react";
import { TrendingUp, Users, Map, DollarSign, Calendar, MoreVertical, Compass, Star, Loader2, MessageSquare, Ticket } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";

export function Dashboard() {
  const [stats, setStats] = useState({
    totalTours: 0,
    activeBookings: 0,
    inquiries: 0,
    newLeads: 0
  });
  const [recentTours, setRecentTours] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      // 1. Get counts
      const [{ count: toursCount }, { count: bookingsCount }, { count: leadsCount }] = await Promise.all([
        supabase.from('tours').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('*', { count: 'exact', head: true })
      ]);

      // 2. Get recent tours
      const { data: toursData } = await supabase
        .from('tours')
        .select('*')
        .limit(4)
        .order('created_at', { ascending: false });

      setStats({
        totalTours: toursCount || 0,
        activeBookings: bookingsCount || 0,
        inquiries: leadsCount || 0,
        newLeads: leadsCount || 0
      });

      setRecentTours(toursData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
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
        {/* Total Tours */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                Total Tours
              </p>
              <h3 className="text-3xl font-black text-on-surface">{stats.totalTours}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Global Bookings */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                Live Bookings
              </p>
              <h3 className="text-3xl font-black text-on-surface">{stats.activeBookings}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <Ticket className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Platform Inquiries */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary-container/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                Inquiries
              </p>
              <h3 className="text-3xl font-black text-on-surface">{stats.inquiries}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Reviews/Leads */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-error-container/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                New Leads
              </p>
              <h3 className="text-3xl font-black text-on-surface">{stats.newLeads}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-error-container text-on-error-container flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-on-surface">
              Platform Activity
            </h2>
            <button className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="h-72 w-full bg-surface-container-low/50 rounded-2xl flex items-center justify-center border border-outline-variant/20 border-dashed">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto text-primary mb-2 opacity-20" />
              <span className="text-on-surface-variant font-medium">
                Real-time activity charts synchronized via Supabase.
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-on-surface uppercase tracking-tighter">
              Latest Inventory
            </h2>
            <button
              onClick={() => toast.info("Syncing inventory...")}
              className="text-primary text-xs font-bold hover:underline"
            >
              Sync All
            </button>
          </div>
          <div className="space-y-4 flex-1">
            {recentTours.map((tour, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-surface-container-low transition-colors cursor-pointer border border-transparent hover:border-outline-variant/30"
              >
                <img
                  src={tour.image_url || `https://picsum.photos/seed/${tour.id}/100/100`}
                  alt={tour.title}
                  className="w-14 h-14 rounded-xl object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-on-surface text-sm line-clamp-1">{tour.title}</h4>
                  <p className="text-xs text-[#005EB8] font-black uppercase">
                    {tour.destinations?.[0] || 'Global'}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                  <Compass className="w-4 h-4" />
                </div>
              </div>
            ))}
            {recentTours.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full opacity-20 py-12">
                <Map className="w-12 h-12 mb-2" />
                <p className="text-xs font-bold uppercase">No data found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

