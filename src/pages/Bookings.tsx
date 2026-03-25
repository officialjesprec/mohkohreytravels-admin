import { useState, useEffect } from "react";
import { Search, Filter, Eye, Edit2, MoreVertical, ChevronDown, Plus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Modal } from "../components/Modal";

export function Bookings() {
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [reservationType, setReservationType] = useState("Flight Bookings");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-headline font-bold text-on-surface tracking-tight">
            Booking Management
          </h1>
          <p className="text-on-surface-variant mt-1">
            Track and manage customer reservations and payments.
          </p>
        </div>
        <button 
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Reservation
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
            <button className="px-4 py-2 rounded-full bg-primary-container text-on-primary-container font-medium text-sm whitespace-nowrap">
              All Bookings
            </button>
            <button className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-medium text-sm transition-colors whitespace-nowrap">
              Pending
            </button>
            <button className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-medium text-sm transition-colors whitespace-nowrap">
              Confirmed
            </button>
            <button className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-medium text-sm transition-colors whitespace-nowrap">
              Cancelled
            </button>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input
                type="text"
                placeholder="Search ID, Name..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary text-sm text-on-surface"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-full border transition-colors flex items-center gap-2 px-4 ${
                showFilters 
                  ? "bg-primary text-on-primary border-primary" 
                  : "bg-surface-container-low border-outline-variant/50 hover:bg-surface-container-high text-on-surface-variant"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence initial={false}>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: "auto", opacity: 1, marginBottom: 24 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-surface-container-low/50 rounded-2xl border border-outline-variant/30">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-on-surface-variant">Date Range</label>
                  <div className="flex items-center gap-2">
                    <input type="date" className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/50 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                    <span className="text-on-surface-variant">-</span>
                    <input type="date" className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/50 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-on-surface-variant">Booking Status</label>
                  <select className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/50 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                    <option>All Statuses</option>
                    <option>Confirmed</option>
                    <option>Pending</option>
                    <option>Cancelled</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-on-surface-variant">Tour Package</label>
                  <select className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/50 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                    <option>All Packages</option>
                    <option>Bali Paradise Escape</option>
                    <option>Swiss Alps Adventure</option>
                    <option>Kyoto Cultural Tour</option>
                    <option>Safari Explorer</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
              <p>Loading bookings...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 text-sm font-medium text-on-surface-variant">
                  <th className="pb-4 pl-4 font-medium">Booking ID</th>
                  <th className="pb-4 font-medium">Customer</th>
                  <th className="pb-4 font-medium">Tour Package</th>
                  <th className="pb-4 font-medium">Date</th>
                  <th className="pb-4 font-medium">Amount</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 pr-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  {
                    id: "#BK-7829",
                    customer: "Sarah Jenkins",
                    email: "sarah.j@example.com",
                    tour: "Bali Paradise Escape",
                    date: "Oct 24, 2023",
                    amount: "$2,598",
                    status: "Confirmed",
                  },
                  {
                    id: "#BK-7830",
                    customer: "Michael Chen",
                    email: "m.chen@example.com",
                    tour: "Swiss Alps Adventure",
                    date: "Nov 12, 2023",
                    amount: "$5,798",
                    status: "Pending",
                  },
                  {
                    id: "#BK-7831",
                    customer: "Emma Watson",
                    email: "emma.w@example.com",
                    tour: "Kyoto Cultural Tour",
                    date: "Oct 18, 2023",
                    amount: "$1,599",
                    status: "Confirmed",
                  },
                  {
                    id: "#BK-7832",
                    customer: "David Miller",
                    email: "david.m@example.com",
                    tour: "Safari Explorer",
                    date: "Dec 05, 2023",
                    amount: "$6,400",
                    status: "Cancelled",
                  },
                  {
                    id: "#BK-7833",
                    customer: "Jessica Taylor",
                    email: "jess.t@example.com",
                    tour: "Bali Paradise Escape",
                    date: "Oct 28, 2023",
                    amount: "$1,299",
                    status: "Pending",
                  },
                ].map((booking, i) => (
                  <tr
                    key={i}
                    className="border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-colors group"
                  >
                    <td className="py-4 pl-4 font-medium text-primary">
                      {booking.id}
                    </td>
                    <td className="py-4">
                      <p className="font-medium text-on-surface">
                        {booking.customer}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {booking.email}
                      </p>
                    </td>
                    <td className="py-4 text-on-surface-variant">
                      {booking.tour}
                    </td>
                    <td className="py-4 text-on-surface-variant">
                      {booking.date}
                    </td>
                    <td className="py-4 font-medium text-on-surface">
                      {booking.amount}
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === "Confirmed"
                            ? "bg-primary-container text-on-primary-container"
                            : booking.status === "Pending"
                            ? "bg-secondary-container text-on-secondary-container"
                            : "bg-error-container text-on-error-container"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => toast.info("Viewing booking details...")}
                          className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => toast.info("Editing booking...")}
                          className="p-2 rounded-full hover:bg-surface-container-high text-primary transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => toast.info("More options...")}
                          className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Reservation"
        maxWidth="max-w-3xl"
      >
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-on-surface">Reservation Category</label>
            <select 
              value={reservationType}
              onChange={(e) => setReservationType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-medium"
            >
              <option value="Flight Bookings">Flight Bookings</option>
              <option value="Visa Processing">Visa Processing</option>
              <option value="Study Visa Processing">Study Visa Processing</option>
              <option value="International Passport">International Passport</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-on-surface">Customer Name</label>
              <input type="text" placeholder="Full Name" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-on-surface">Email Address</label>
              <input type="email" placeholder="Email" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-on-surface">Phone Number</label>
              <input type="tel" placeholder="Phone" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-on-surface">Date</label>
              <input type="date" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
            </div>
          </div>

          {reservationType === "Flight Bookings" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-on-surface">Departure City</label>
                <input type="text" placeholder="e.g. New York (JFK)" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-on-surface">Destination City</label>
                <input type="text" placeholder="e.g. London (LHR)" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
            </div>
          )}

          {(reservationType === "Visa Processing" || reservationType === "Study Visa Processing") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-on-surface">Destination Country</label>
                <input type="text" placeholder="e.g. Canada" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-on-surface">Passport Number</label>
                <input type="text" placeholder="Passport No." className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
            </div>
          )}

          {reservationType === "International Passport" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-on-surface">Application Type</label>
                <select className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                  <option>New Application</option>
                  <option>Renewal</option>
                  <option>Replacement</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-on-surface">NIN (National Identity Number)</label>
                <input type="text" placeholder="NIN" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-on-surface">Additional Notes</label>
            <textarea rows={3} className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none" placeholder="Any special requests or details..."></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/20">
            <button 
              onClick={() => setCreateModalOpen(false)}
              className="px-5 py-2.5 rounded-full font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                setCreateModalOpen(false);
                toast.success("Reservation created successfully");
              }}
              className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors"
            >
              Create Reservation
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
