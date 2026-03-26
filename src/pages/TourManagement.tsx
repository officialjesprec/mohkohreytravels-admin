import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit2, Trash2, Eye, MoreVertical, ArrowUpDown, Loader2, Upload, X, Save } from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "../components/ConfirmModal";
import { Modal } from "../components/Modal";
import { supabase } from "../lib/supabase";
import { uploadToCloudinary } from "../lib/cloudinary";

export function TourManagement() {
  const [tours, setTours] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tourToDelete, setTourToDelete] = useState<string | null>(null);
  const [selectedTours, setSelectedTours] = useState<string[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<any>(null);

  // Image handling
  const [newTourImage, setNewTourImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    duration: "",
    price: "",
    description: "",
    start_date: "",
    end_date: "",
    is_featured: false,
  });

  const fetchTours = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .order('created_at', { ascending: sortOrder === 'asc' });

    if (error) {
      toast.error(error.message);
    } else {
      setTours(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTours();
  }, [sortOrder]);

  const sortedTours = [...tours]; // Already sorted by Supabase query

  const handleDeleteClick = (id: string) => {
    setTourToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (tourToDelete) {
      const { error } = await supabase.from('tours').delete().eq('id', tourToDelete);
      if (error) {
        toast.error(error.message);
      } else {
        setTours(tours.filter((t) => t.id !== tourToDelete));
        setSelectedTours(selectedTours.filter(id => id !== tourToDelete));
        toast.success("Tour deleted successfully");
      }
    }
    setDeleteModalOpen(false);
    setTourToDelete(null);
  };

  const toggleSelectAll = () => {
    if (selectedTours.length === sortedTours.length) {
      setSelectedTours([]);
    } else {
      setSelectedTours(sortedTours.map(t => t.id));
    }
  };

  const toggleSelectTour = (id: string) => {
    if (selectedTours.includes(id)) {
      setSelectedTours(selectedTours.filter(tId => tId !== id));
    } else {
      setSelectedTours([...selectedTours, id]);
    }
  };

  const handleBulkDelete = async () => {
    const { error } = await supabase.from('tours').delete().in('id', selectedTours);
    if (error) {
      toast.error(error.message);
    } else {
      setTours(tours.filter(t => !selectedTours.includes(t.id)));
      toast.success(`${selectedTours.length} tours deleted`);
      setSelectedTours([]);
    }
  };

  const handleBulkPublish = async () => {
    const { error } = await supabase.from('tours').update({ is_active: true }).in('id', selectedTours);
    if (error) {
      toast.error(error.message);
    } else {
      fetchTours();
      toast.success(`${selectedTours.length} tours published`);
      setSelectedTours([]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewTourImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveTour = async () => {
    if (!formData.title || !formData.price) {
      toast.error("Title and Price are required");
      return;
    }

    setIsSaving(true);
    try {
      let imageUrl = "";

      if (newTourImage) {
        const uploadResult = await uploadToCloudinary(newTourImage, 'tours');
        imageUrl = uploadResult.url;
      }

      const tourPayload = {
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        description: formData.description,
        base_price: parseFloat(formData.price.replace(/[^\d.]/g, '')),
        location: formData.location,
        duration: formData.duration,
        itinerary: [],
        images: imageUrl ? [imageUrl] : [],
        is_active: true,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        is_featured: formData.is_featured,
      };

      const { error } = await supabase.from('tours').insert([tourPayload]);
      if (error) throw error;

      toast.success("Tour package created and synced!");
      setCreateModalOpen(false);
      setFormData({ title: "", location: "", duration: "", price: "", description: "", start_date: "", end_date: "", is_featured: false });
      setNewTourImage(null);
      setImagePreview(null);
      fetchTours();
    } catch (error: any) {
      toast.error(error.message || "Failed to save tour");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (tour: any) => {
    setEditingTour(tour);
    setFormData({
      title: tour.title || "",
      location: tour.location || "",
      duration: tour.duration || "",
      price: tour.base_price?.toString() || "",
      description: tour.description || "",
      start_date: tour.start_date || "",
      end_date: tour.end_date || "",
      is_featured: tour.is_featured || false,
    });
    setImagePreview(tour.images?.[0] || null);
    setEditModalOpen(true);
  };

  const handleUpdateTour = async () => {
    if (!formData.title || !formData.price || !editingTour) {
      toast.error("Title and Price are required");
      return;
    }

    setIsSaving(true);
    try {
      let imageUrl = editingTour.images?.[0] || "";

      if (newTourImage) {
        const uploadResult = await uploadToCloudinary(newTourImage, 'tours');
        imageUrl = uploadResult.url;
      }

      const updatePayload: any = {
        title: formData.title,
        description: formData.description,
        base_price: parseFloat(formData.price.replace(/[^\d.]/g, '')),
        location: formData.location,
        duration: formData.duration,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        is_featured: formData.is_featured,
      };

      if (imageUrl) {
        updatePayload.images = [imageUrl];
      }

      const { error } = await supabase
        .from('tours')
        .update(updatePayload)
        .eq('id', editingTour.id);

      if (error) throw error;

      toast.success("Tour package updated successfully!");
      setEditModalOpen(false);
      setEditingTour(null);
      setFormData({ title: "", location: "", duration: "", price: "", description: "", start_date: "", end_date: "", is_featured: false });
      setNewTourImage(null);
      setImagePreview(null);
      fetchTours();
    } catch (error: any) {
      toast.error(error.message || "Failed to update tour");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-bold text-[#0F172A] tracking-tight">
            Tour Packages
          </h1>
          <p className="text-slate-500 mt-1">
            Manage your travel packages, pricing, and availability.
          </p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#005EB8] text-white font-bold hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Tour
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
            <button className="px-4 py-2 rounded-full bg-[#005EB8]/10 text-[#005EB8] font-bold text-sm whitespace-nowrap">
              All Tours ({tours.length})
            </button>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-4 py-2 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors text-sm font-medium flex items-center gap-2 whitespace-nowrap"
            >
              <ArrowUpDown className="w-4 h-4" />
              {sortOrder === "asc" ? "Oldest First" : "Newest First"}
            </button>
          </div>
        </div>

        {selectedTours.length > 0 && (
          <div className="mb-4 p-3 bg-[#005EB8]/5 rounded-2xl border border-[#005EB8]/10 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <span className="text-sm font-medium text-slate-700 px-2">
              {selectedTours.length} tour{selectedTours.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleBulkDelete}
                className="px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#005EB8]" />
              <p>Loading tours...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-sm font-bold text-slate-400">
                  <th className="pb-4 pl-4 font-medium w-12">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-[#005EB8] focus:ring-[#005EB8]"
                      checked={selectedTours.length === sortedTours.length && sortedTours.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="pb-4">Tour Details</th>
                  <th className="pb-4">Base Price</th>
                  <th className="pb-4">Featured</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {sortedTours.map((tour) => (
                  <tr key={tour.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 pl-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-[#005EB8] focus:ring-[#005EB8]"
                        checked={selectedTours.includes(tour.id)}
                        onChange={() => toggleSelectTour(tour.id)}
                      />
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={tour.images?.[0] || "https://via.placeholder.com/100"}
                          alt={tour.title}
                          className="w-16 h-16 rounded-2xl object-cover shadow-sm bg-slate-100"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-base">{tour.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">SLUG: {tour.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 font-bold text-slate-900">
                      {new Intl.NumberFormat('en-NG', { style: 'currency', currency: tour.currency || 'NGN' }).format(tour.base_price)}
                    </td>
                    <td className="py-4">
                      {tour.is_featured ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                          Featured
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs">-</span>
                      )}
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${tour.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                        {tour.is_active ? "Active" : "Draft"}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditClick(tour)} className="p-2 rounded-full hover:bg-[#005EB8]/10 text-[#005EB8] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteClick(tour.id)} className="p-2 rounded-full hover:bg-red-50 text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
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

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Tour Package"
        message="Are you sure you want to permanently delete this tour package? This action cannot be undone."
      />

      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Tour Package"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Tour Name</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Bali Paradise Escape"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#005EB8] outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Price (NGN)</label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g. 500000"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#005EB8] outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Indonesia"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#005EB8] outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 7 Days"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#005EB8] outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Tour Image (Optimized on Upload)</label>
            <div className="mt-2 flex justify-center rounded-2xl border border-dashed border-slate-300 px-6 py-10 bg-slate-50 relative overflow-hidden group">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => { setImagePreview(null); setNewTourImage(null); }} className="p-2 bg-red-600 text-white rounded-full">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-slate-300" />
                  <div className="mt-4 flex text-sm text-slate-500 justify-center font-bold">
                    <label htmlFor="file-upload" className="relative cursor-pointer text-[#005EB8] hover:opacity-80">
                      <span>Upload a file</span>
                      <input id="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                    </label>
                    <p className="pl-1 text-slate-400">to auto-optimize</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#005EB8] outline-none resize-none"
              placeholder="Describe the tour package..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#005EB8] outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#005EB8] outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-5 h-5 rounded border-amber-300 text-[#005EB8] focus:ring-[#005EB8]"
            />
            <label htmlFor="is_featured" className="text-sm font-bold text-slate-700 cursor-pointer">
              Feature this tour in the hero section
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button onClick={() => setCreateModalOpen(false)} className="px-5 py-2.5 font-bold text-slate-500 hover:text-slate-700">Cancel</button>
            <button
              onClick={handleSaveTour}
              disabled={isSaving}
              className="px-8 py-2.5 rounded-xl bg-[#005EB8] text-white font-bold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSaving ? "Syncing..." : "Publish Tour"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={editModalOpen}
        onClose={() => { setEditModalOpen(false); setEditingTour(null); }}
        title="Edit Tour Package"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Tour Name</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Bali Paradise Escape"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#005EB8] outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Price (NGN)</label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g. 500000"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#005EB8] outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Indonesia"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#005EB8] outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 7 Days"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#005EB8] outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Tour Image</label>
            <div className="mt-2 flex justify-center rounded-2xl border border-dashed border-slate-300 px-6 py-10 bg-slate-50 relative overflow-hidden group">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => { setImagePreview(null); setNewTourImage(null); }} className="p-2 bg-red-600 text-white rounded-full">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-slate-300" />
                  <div className="mt-4 flex text-sm text-slate-500 justify-center font-bold">
                    <label htmlFor="file-upload-edit" className="relative cursor-pointer text-[#005EB8] hover:opacity-80">
                      <span>Upload a file</span>
                      <input id="file-upload-edit" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                    </label>
                    <p className="pl-1 text-slate-400">to auto-optimize</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#005EB8] outline-none resize-none"
              placeholder="Describe the tour package..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#005EB8] outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#005EB8] outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <input
              type="checkbox"
              id="is_featured_edit"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-5 h-5 rounded border-amber-300 text-[#005EB8] focus:ring-[#005EB8]"
            />
            <label htmlFor="is_featured_edit" className="text-sm font-bold text-slate-700 cursor-pointer">
              Feature this tour in the hero section
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button onClick={() => { setEditModalOpen(false); setEditingTour(null); }} className="px-5 py-2.5 font-bold text-slate-500 hover:text-slate-700">Cancel</button>
            <button
              onClick={handleUpdateTour}
              disabled={isSaving}
              className="px-8 py-2.5 rounded-xl bg-[#005EB8] text-white font-bold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSaving ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
