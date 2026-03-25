import { Search, Bell, HelpCircle } from "lucide-react";
import { toast } from "sonner";

export function Header() {
  return (
    <header className="h-20 px-8 flex items-center justify-between bg-surface-container-lowest/50 backdrop-blur-md sticky top-0 z-10">
      <div className="relative w-96">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
        <input
          type="text"
          placeholder="Search tours, bookings, or blogs..."
          className="w-full pl-12 pr-4 py-3 rounded-full bg-surface-container-high/50 border-none focus:ring-2 focus:ring-primary/20 text-sm text-on-surface placeholder:text-outline transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => toast.info("No new notifications")}
          className="p-2.5 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface-container-lowest"></span>
        </button>
        <button 
          onClick={() => toast.info("Help center opening...")}
          className="p-2.5 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        <div className="h-8 w-px bg-outline-variant/30 mx-2"></div>
        <div className="flex items-center gap-3 cursor-pointer hover:bg-surface-container-high/50 p-1.5 pr-4 rounded-full transition-colors">
          <img
            src="https://picsum.photos/seed/admin/100/100"
            alt="Admin Profile"
            className="w-9 h-9 rounded-full object-cover border border-outline-variant/30"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-on-surface leading-tight">
              Admin User
            </span>
            <span className="text-xs text-on-surface-variant">
              Super Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
