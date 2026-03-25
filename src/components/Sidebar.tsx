import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  FileEdit,
  Image as ImageIcon,
  Ticket,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "../lib/utils";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Tour Management", path: "/tours", icon: Compass },
  { name: "Blog Manager", path: "/blog", icon: FileEdit },
  { name: "Gallery Administrator", path: "/gallery", icon: ImageIcon },
  { name: "Booking Management", path: "/bookings", icon: Ticket },
  { name: "Admin Settings", path: "/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-surface-container-lowest/80 backdrop-blur-xl border-r border-outline-variant/30 flex flex-col h-full z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary font-bold text-xl shadow-sm">
          M
        </div>
        <span className="font-headline font-bold text-lg text-on-surface tracking-tight">
          Mohkohrey
        </span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-primary-container text-on-primary-container font-medium shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm">{item.name}</span>
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
