import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  FileEdit,
  Image as ImageIcon,
  Ticket,
  Settings,
  LogOut,
  ShieldCheck,
  FileText,
  GraduationCap,
  MessageSquare,
  User as UserIcon
} from "lucide-react";
import { cn } from "../lib/utils";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard, color: "#005EB8" },
  { name: "Tour Management", path: "/tours", icon: Compass, color: "#F59E0B" },
  { name: "Monitoring Requests", path: "/leads", icon: MessageSquare, color: "#6366F1" },
  { name: "Visa Services", path: "/visas", icon: ShieldCheck, color: "#10B981" },
  { name: "Passport Service", path: "/passports", icon: FileText, color: "#1E293B" },
  { name: "Study Abroad", path: "/study", icon: GraduationCap, color: "#0EA5E9" },
  { name: "Blog Manager", path: "/blog", icon: FileEdit, color: "#F43F5E" },
  { name: "Gallery Admin", path: "/gallery", icon: ImageIcon, color: "#8B5CF6" },
  { name: "Bookings", path: "/bookings", icon: Ticket, color: "#D97706" },
  { name: "Admin Settings", path: "/settings", icon: Settings, color: "#64748B" },
];


export function Sidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ full_name?: string; email?: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single();

        setUser({
          full_name: profile?.full_name || session.user.email?.split('@')[0],
          email: session.user.email
        });
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col h-full z-20">
      <div className="p-6 flex items-center gap-3">
        <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
        <div className="flex flex-col">
          <span className="font-heading font-bold text-lg text-[#005EB8] leading-tight lowercase">
            mohkohrey
          </span>
          <span className="font-heading font-medium text-[0.45rem] text-slate-500 uppercase tracking-widest leading-none">
            Travels and Tours
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              color: isActive ? item.color : '',
              backgroundColor: isActive ? `${item.color}10` : ''
            })}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                !isActive && "text-slate-600 hover:bg-slate-100/50 hover:text-slate-900"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110")}
                  style={{ color: isActive ? item.color : undefined }}
                />
                <span className={cn("text-sm tracking-wide", isActive ? "font-bold" : "font-medium")}>
                  {item.name}
                </span>
                <div
                  className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r-full transition-all duration-500 transform",
                    isActive ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
                  )}
                  style={{ backgroundColor: item.color }}
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>


      <div className="p-4 mt-auto border-t border-slate-200 flex flex-col gap-2">
        <div className="flex items-center gap-3 p-2 px-3 rounded-2xl bg-white border border-slate-100 mb-2">
          <div className="w-8 h-8 rounded-full bg-[#005EB8] text-white flex items-center justify-center font-bold text-xs">
            {user?.full_name?.charAt(0) || <UserIcon size={14} />}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold text-slate-900 truncate">{user?.full_name || 'Administrator'}</span>
            <span className="text-[10px] text-slate-500 truncate">{user?.email}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

