import React, { useState, useEffect } from "react";
import { Search, Filter, Eye, Edit2, MoreVertical, ChevronDown, Plus, Loader2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Modal } from "../components/Modal";
import { ConfirmModal } from "../components/ConfirmModal";
import { supabase } from "../lib/supabase";

export function Bookings() {
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [reservationType, setReservationType] = useState("Flight Bookings");
  const [bookings, setBookings] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setBookings(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast.error(error.message);
    } else {
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
      toast.success(`Status updated to ${status}`);
    }
  };

  const confirmDelete = async () => {
    if (bookingToDelete) {
      const { error } = await supabase.from('bookings').delete().eq('id', bookingToDelete);
      if (error) {
        toast.error(error.message);
      } else {
        setBookings(bookings.filter(b => b.id !== bookingToDelete));
        toast.success("Booking deleted");
      }
    }
    setDeleteModalOpen(false);
    setBookingToDelete(null);
  };

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const payload: any = {
      type: reservationType,
      status: 'PENDING',
    };

    if (reservationType === "Flight Bookings") {
      payload.departure_city = formData.get('departure');
      payload.destination_city = formData.get('destination');
    } else if (reservationType === "Visa Processing" || reservationType === "Study Visa Processing") {
      payload.destination_country = formData.get('country');
      payload.passport_number = formData.get('passport');
    } else if (reservationType === "International Passport") {
      payload.application_type = formData.get('application_type');
      payload.nin = formData.get('nin');
    }

    payload.full_name = formData.get('full_name');
    payload.email = formData.get('email');
    payload.phone = formData.get('phone');
    payload.notes = formData.get('notes');

    const { error } = await supabase.from('bookings').insert([payload]);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Reservation created successfully");
      setCreateModalOpen(false);
      fetchBookings();
    }
    setIsSaving(false);
  };

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter.toUpperCase();
    const matchesSearch = !searchQuery || 
      b.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id?.toString().includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);
  };

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
          className="px-5 py-2.5 rounded-full bg-brand-flights text-white font-medium hover:opacity-90 transition-opacity shadow-sm shadow-brand-flights/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Reservation
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
            <button 
              onClick={() => setStatusFilter('All')}
              className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${statusFilter === 'All' ? 'bg-brand-flights/10 text-brand-flights border border-brand-flights/20' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}`}
            >
              All ({bookings.length})
            </button>
            <button 
              onClick={() => setStatusFilter('PENDING')}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-colors whitespace-nowrap ${statusFilter === 'PENDING' ? 'bg-brand-flights/10 text-brand-flights border border-brand-flights/20' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}`}
            >
              Pending ({bookings.filter(b => b.status === 'PENDING').length})
            </button>
            <button 
              onClick={() => setStatusFilter('CONFIRMED')}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-colors whitespace-nowrap ${statusFilter === 'CONFIRMED' ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}`}
            >
              Confirmed ({bookings.filter(b => b.status === 'CONFIRMED').length})
            </button>
            <button 
              onClick={() => setStatusFilter('CANCELLED')}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-colors whitespace-nowrap ${statusFilter === 'CANCELLED' ? 'bg-red-500/10 text-red-600 border border-red-500/20' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}`}
            >
              Cancelled ({bookings.filter(b => b.status === 'CANCELLED').length})
            </button>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input
                type="text"
                placeholder="Search ID, Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/50 focus:border-brand-flights focus:ring-1 focus:ring-brand-flights text-sm text-on-surface"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-full border transition-colors flex items-center gap-2 px-4 ${showFilters
                ? "bg-brand-flights text-white border-brand-flights"
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
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Date Range</label>
                  <div className="flex items-center gap-2">
                    <input type="date" className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/50 text-sm focus:border-brand-flights focus:ring-1 focus:ring-brand-flights outline-none" />
                    <span className="text-on-surface-variant">-</span>
                    <input type="date" className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/50 text-sm focus:border-brand-flights focus:ring-1 focus:ring-brand-flights outline-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Booking Status</label>
                  <select className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/50 text-sm focus:border-brand-flights focus:ring-1 focus:ring-brand-flights outline-none">
                    <option>All Statuses</option>
                    <option>Confirmed</option>
                    <option>Pending</option>
                    <option>Cancelled</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tour Package</label>
                  <select className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/50 text-sm focus:border-brand-flights focus:ring-1 focus:ring-brand-flights outline-none">
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
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-flights" />
              <p>Loading bookings...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 text-sm font-medium text-on-surface-variant">
                  <th className="pb-4 pl-4 font-bold uppercase tracking-wider">Booking ID</th>
                  <th className="pb-4 font-bold uppercase tracking-wider">Customer</th>
                  <th className="pb-4 font-bold uppercase tracking-wider">Tour Package</th>
                  <th className="pb-4 font-bold uppercase tracking-wider">Date</th>
                  <th className="pb-4 font-bold uppercase tracking-wider">Amount</th>
                  <th className="pb-4 font-bold uppercase tracking-wider">Status</th>
                  <th className="pb-4 pr-4 font-bold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                      {isLoading ? 'Loading bookings...' : 'No bookings found'}
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-colors group"
                    >
                      <td className="py-4 pl-4 font-bold text-brand-flights">
                        #{booking.id?.slice(0, 8) || 'N/A'}
                      </td>
                      <td className="py-4">
                        <p className="font-bold text-on-surface italic">
                          {booking.full_name || 'N/A'}
                        </p>
                        <p className="text-xs text-on-surface-variant font-medium">
                          {booking.email || 'N/A'}
                        </p>
                      </td>
                      <td className="py-4 text-on-surface-variant font-medium">
                        {booking.type || booking.destination_country || booking.departure_city || 'General'}
                      </td>
                      <td className="py-4 text-on-surface-variant font-medium">
                        {booking.created_at ? new Date(booking.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-4 font-bold text-on-surface">
                        {booking.amount ? formatCurrency(booking.amount) : 'N/A'}
                      </td>
                      <td className="py-4">
                        <select
                          value={booking.status || 'PENDING'}
                          onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border-0 outline-none cursor-pointer ${
                            booking.status === 'CONFIRMED'
                              ? 'bg-success/10 text-success'
                              : booking.status === 'CANCELLED'
                                ? 'bg-error/10 text-error'
                                : 'bg-brand-flights/10 text-brand-flights'
                          }`}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-4 pr-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => { setBookingToDelete(booking.id); setDeleteModalOpen(true); }}
                            className="p-2 rounded-full hover:bg-error/10 text-error transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
        <form onSubmit={handleCreateReservation} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-on-surface">Reservation Category</label>
            <select
              value={reservationType}
              onChange={(e) => setReservationType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-flights focus:ring-1 focus:ring-brand-flights outline-none font-bold"
            >
              <option value="Flight Bookings">Flight Bookings</option>
              <option value="Visa Processing">Visa Processing</option>
              <option value="Study Visa Processing">Study Visa Processing</option>
              <option value="International Passport">International Passport</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-on-surface">Customer Name</label>
              <input type="text" name="full_name" required placeholder="Full Name" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-flights focus:ring-1 focus:ring-brand-flights" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-on-surface">Email Address</label>
              <input type="email" name="email" required placeholder="Email" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-flights focus:ring-1 focus:ring-brand-flights" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-on-surface">Phone Number</label>
              <input type="tel" name="phone" required placeholder="Phone" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-flights focus:ring-1 focus:ring-brand-flights" />
            </div>
          </div>

          {reservationType === "Flight Bookings" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-on-surface">Departure City</label>
                <input type="text" name="departure" placeholder="e.g. Lagos (LOS)" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-flights focus:ring-1 focus:ring-brand-flights" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-on-surface">Destination City</label>
                <input type="text" name="destination" placeholder="e.g. London (LHR)" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-flights focus:ring-1 focus:ring-brand-flights" />
              </div>
            </div>
          )}

          {(reservationType === "Visa Processing" || reservationType === "Study Visa Processing") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-on-surface">Destination Country</label>
                <input type="text" name="country" placeholder="e.g. Canada" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-flights focus:ring-1 focus:ring-brand-flights" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-on-surface">Passport Number</label>
                <input type="text" name="passport" placeholder="Passport No." className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-flights focus:ring-1 focus:ring-brand-flights" />
              </div>
            </div>
          )}

          {reservationType === "International Passport" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-on-surface">Application Type</label>
                <select name="application_type" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-flights focus:ring-1 focus:ring-brand-flights">
                  <option value="New Application">New Application</option>
                  <option value="Renewal">Renewal</option>
                  <option value="Replacement">Replacement</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-on-surface">NIN (National Identity Number)</label>
                <input type="text" name="nin" placeholder="NIN" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-flights focus:ring-1 focus:ring-brand-flights" />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-on-surface">Additional Notes</label>
            <textarea name="notes" rows={3} className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-flights focus:ring-1 focus:ring-brand-flights resize-none font-medium text-sm" placeholder="Any special requests or details..."></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-5 py-2.5 rounded-full font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-full bg-brand-flights text-white font-bold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isSaving ? "Creating..." : "Create Reservation"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Booking"
        message="Are you sure you want to permanently delete this booking? This action cannot be undone."
      />
    </div>
  );
}
