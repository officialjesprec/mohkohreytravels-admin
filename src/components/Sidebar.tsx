import { NavLink } from "react-router-dom";
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
  GraduationCap
} from "lucide-react";
import { cn } from "../lib/utils";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Tour Management", path: "/tours", icon: Compass },
  { name: "Visa Services", path: "/visas", icon: ShieldCheck },
  { name: "Passport Service", path: "/passports", icon: FileText },
  { name: "Study Abroad", path: "/study", icon: GraduationCap },
  { name: "Blog Manager", path: "/blog", icon: FileEdit },
  { name: "Gallery Admin", path: "/gallery", icon: ImageIcon },
  { name: "Bookings", path: "/bookings", icon: Ticket },
  { name: "Admin Settings", path: "/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-surface-container-lowest/80 backdrop-blur-xl border-r border-outline-variant/30 flex flex-col h-full z-20">
      <div className="p-6 flex items-center gap-3">
        <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
        <div className="flex flex-col">
          <span className="font-heading font-bold text-lg text-primary leading-tight lowercase">
            mohkohrey
          </span>
          <span className="font-heading font-medium text-[0.45rem] text-primary/70 uppercase tracking-widest leading-none">
            Travels and Tours
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                isActive
                  ? "bg-primary/5 text-secondary font-bold"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110")} />
                <span className="text-sm tracking-wide">{item.name}</span>
                <div className={cn("absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-secondary rounded-r-full transition-all duration-300 transform",
                  isActive ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0")}
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-outline-variant/30">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error-container/50 transition-colors w-full">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
