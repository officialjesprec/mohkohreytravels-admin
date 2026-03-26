import { Search, Bell, HelpCircle } from "lucide-react";
import { toast } from "sonner";

export function Header() {
  return (
    <header className="h-20 px-8 flex items-center justify-between bg-white/70 backdrop-blur-xl sticky top-0 z-10 border-b border-primary/5">
      <div className="relative w-96">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
        <input
          type="text"
          placeholder="Search bookings or reports..."
          className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-primary/5 border-none focus:ring-2 focus:ring-secondary/20 text-sm text-primary placeholder:text-primary/30 transition-all font-sans"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => toast.info("No new notifications")}
          className="p-2.5 rounded-xl hover:bg-primary/5 transition-colors text-primary/60 relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-secondary rounded-full border-2 border-white"></span>
        </button>
        <button
          onClick={() => toast.info("Help center opening...")}
          className="p-2.5 rounded-xl hover:bg-primary/5 transition-colors text-primary/60"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
