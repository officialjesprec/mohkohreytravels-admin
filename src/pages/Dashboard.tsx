import { TrendingUp, Users, Map, DollarSign, Calendar, MoreVertical, Compass, Star } from "lucide-react";
import { toast } from "sonner";

export function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-headline font-bold text-on-surface tracking-tight">
            Overview
          </h1>
          <p className="text-on-surface-variant mt-1">
            Welcome back, here's what's happening today.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => toast.info("Filtering by Last 30 Days")}
            className="px-5 py-2.5 rounded-full bg-surface-container-high text-on-surface font-medium hover:bg-surface-container-highest transition-colors flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </button>
          <button 
            onClick={() => toast.success("Report generated successfully")}
            className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
          >
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Card 1 */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-medium text-on-surface-variant mb-1">
                Total Revenue
              </p>
              <h3 className="text-3xl font-bold text-on-surface">$124,500</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm relative z-10">
            <span className="flex items-center text-primary font-medium bg-primary-container/50 px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.5%
            </span>
            <span className="text-on-surface-variant">vs last month</span>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-medium text-on-surface-variant mb-1">
                Active Bookings
              </p>
              <h3 className="text-3xl font-bold text-on-surface">842</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <Map className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm relative z-10">
            <span className="flex items-center text-primary font-medium bg-primary-container/50 px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5.2%
            </span>
            <span className="text-on-surface-variant">vs last month</span>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary-container/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-medium text-on-surface-variant mb-1">
                New Customers
              </p>
              <h3 className="text-3xl font-bold text-on-surface">156</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm relative z-10">
            <span className="flex items-center text-primary font-medium bg-primary-container/50 px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3 h-3 mr-1" />
              +18.1%
            </span>
            <span className="text-on-surface-variant">vs last month</span>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-error-container/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-medium text-on-surface-variant mb-1">
                Pending Reviews
              </p>
              <h3 className="text-3xl font-bold text-on-surface">24</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-error-container text-on-error-container flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm relative z-10">
            <span className="flex items-center text-error font-medium bg-error-container/50 px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3 h-3 mr-1" />
              +2.4%
            </span>
            <span className="text-on-surface-variant">vs last month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-on-surface">
              Revenue Overview
            </h2>
            <button className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="h-72 w-full bg-surface-container-low/50 rounded-2xl flex items-center justify-center border border-outline-variant/20 border-dashed">
            <span className="text-on-surface-variant font-medium">
              Chart Visualization Area
            </span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-on-surface">
              Popular Tours
            </h2>
            <button 
              onClick={() => toast.info("Navigating to all tours...")}
              className="text-primary text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-4 flex-1">
            {[
              {
                name: "Bali Paradise Escape",
                bookings: 124,
                img: "https://picsum.photos/seed/bali/100/100",
              },
              {
                name: "Swiss Alps Adventure",
                bookings: 98,
                img: "https://picsum.photos/seed/swiss/100/100",
              },
              {
                name: "Kyoto Cultural Tour",
                bookings: 85,
                img: "https://picsum.photos/seed/kyoto/100/100",
              },
              {
                name: "Safari Explorer",
                bookings: 64,
                img: "https://picsum.photos/seed/safari/100/100",
              },
            ].map((tour, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <img
                  src={tour.img}
                  alt={tour.name}
                  className="w-14 h-14 rounded-xl object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-on-surface">{tour.name}</h4>
                  <p className="text-sm text-on-surface-variant">
                    {tour.bookings} bookings
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                  <Compass className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Tours Summary */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-on-surface">Recent Tours Added</h2>
          <button 
            onClick={() => toast.info("Navigating to all tours...")}
            className="text-primary text-sm font-medium hover:underline"
          >
            View All Tours
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Maldives Honeymoon", dest: "Maldives", img: "https://picsum.photos/seed/maldives/300/200" },
            { name: "Machu Picchu Trek", dest: "Peru", img: "https://picsum.photos/seed/peru/300/200" },
            { name: "Northern Lights", dest: "Iceland", img: "https://picsum.photos/seed/iceland/300/200" },
            { name: "Great Barrier Reef", dest: "Australia", img: "https://picsum.photos/seed/australia/300/200" },
          ].map((tour, i) => (
            <div key={i} className="rounded-3xl bg-surface-container-lowest border border-outline-variant/30 overflow-hidden shadow-sm group cursor-pointer hover:shadow-md transition-all">
              <div className="h-32 overflow-hidden">
                <img src={tour.img} alt={tour.name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" referrerPolicy="no-referrer" />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-on-surface line-clamp-1">{tour.name}</h4>
                <p className="text-sm text-on-surface-variant flex items-center gap-1 mt-1">
                  <Map className="w-3.5 h-3.5" /> {tour.dest}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
