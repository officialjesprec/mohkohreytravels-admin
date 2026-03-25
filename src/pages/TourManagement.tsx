import { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit2, Trash2, Eye, MoreVertical, ArrowUpDown, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "../components/ConfirmModal";
import { Modal } from "../components/Modal";

const initialTours = [
  {
    id: "TR-1042",
    name: "Bali Paradise Escape",
    location: "Indonesia",
    duration: "7 Days / 6 Nights",
    price: "$1,299",
    status: "Active",
    img: "https://picsum.photos/seed/bali/100/100",
    date: "2023-10-15",
  },
  {
    id: "TR-1043",
    name: "Swiss Alps Adventure",
    location: "Switzerland",
    duration: "10 Days / 9 Nights",
    price: "$2,899",
    status: "Active",
    img: "https://picsum.photos/seed/swiss/100/100",
    date: "2023-11-02",
  },
  {
    id: "TR-1044",
    name: "Kyoto Cultural Tour",
    location: "Japan",
    duration: "5 Days / 4 Nights",
    price: "$1,599",
    status: "Draft",
    img: "https://picsum.photos/seed/kyoto/100/100",
    date: "2023-09-28",
  },
  {
    id: "TR-1045",
    name: "Safari Explorer",
    location: "Kenya",
    duration: "8 Days / 7 Nights",
    price: "$3,200",
    status: "Active",
    img: "https://picsum.photos/seed/safari/100/100",
    date: "2023-10-05",
  },
];

export function TourManagement() {
  const [tours, setTours] = useState(initialTours);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tourToDelete, setTourToDelete] = useState<string | null>(null);
  const [selectedTours, setSelectedTours] = useState<string[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTourImage, setNewTourImage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const sortedTours = [...tours].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const handleDeleteClick = (id: string) => {
    setTourToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (tourToDelete) {
      setTours(tours.filter((t) => t.id !== tourToDelete));
      setSelectedTours(selectedTours.filter(id => id !== tourToDelete));
      toast.success("Tour deleted successfully");
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

  const handleBulkDelete = () => {
    setTours(tours.filter(t => !selectedTours.includes(t.id)));
    toast.success(`${selectedTours.length} tours deleted`);
    setSelectedTours([]);
  };

  const handleBulkPublish = () => {
    setTours(tours.map(t => selectedTours.includes(t.id) ? { ...t, status: "Active" } : t));
    toast.success(`${selectedTours.length} tours published`);
    setSelectedTours([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewTourImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-headline font-bold text-on-surface tracking-tight">
            Tour Packages
          </h1>
          <p className="text-on-surface-variant mt-1">
            Manage your travel packages, pricing, and availability.
          </p>
        </div>
        <button 
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Tour
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex gap-2 w-full md:w-auto">
            <button className="px-4 py-2 rounded-full bg-primary-container text-on-primary-container font-medium text-sm">
              All Tours ({tours.length})
            </button>
            <button className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-medium text-sm transition-colors">
              Active ({tours.filter(t => t.status === "Active").length})
            </button>
            <button className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-medium text-sm transition-colors">
              Drafts ({tours.filter(t => t.status === "Draft").length})
            </button>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/50 hover:bg-surface-container-high text-on-surface-variant transition-colors text-sm font-medium flex items-center gap-2"
            >
              <ArrowUpDown className="w-4 h-4" />
              {sortOrder === "asc" ? "Oldest First" : "Newest First"}
            </button>
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input
                type="text"
                placeholder="Search tours..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary text-sm text-on-surface"
              />
            </div>
            <button 
              onClick={() => toast.info("Filter options coming soon")}
              className="p-2 rounded-full bg-surface-container-low border border-outline-variant/50 hover:bg-surface-container-high text-on-surface-variant transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {selectedTours.length > 0 && (
          <div className="mb-4 p-3 bg-primary-container/30 rounded-2xl border border-primary/20 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <span className="text-sm font-medium text-on-surface px-2">
              {selectedTours.length} tour{selectedTours.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button 
                onClick={handleBulkPublish}
                className="px-4 py-1.5 rounded-full bg-surface-container text-on-surface-variant text-sm font-medium hover:bg-surface-container-high transition-colors"
              >
                Publish Selected
              </button>
              <button 
                onClick={handleBulkDelete}
                className="px-4 py-1.5 rounded-full bg-error text-on-error text-sm font-medium hover:bg-error/90 transition-colors"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
              <p>Loading tours...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 text-sm font-medium text-on-surface-variant">
                  <th className="pb-4 pl-4 font-medium w-12">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                      checked={selectedTours.length === sortedTours.length && sortedTours.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="pb-4 font-medium">Tour Details</th>
                  <th className="pb-4 font-medium">Location</th>
                  <th className="pb-4 font-medium">Duration</th>
                  <th className="pb-4 font-medium">Price</th>
                  <th className="pb-4 font-medium">Last Updated</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 pr-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {sortedTours.map((tour) => (
                  <tr
                    key={tour.id}
                    className={`border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-colors group ${
                      selectedTours.includes(tour.id) ? 'bg-primary-container/10' : ''
                    }`}
                  >
                    <td className="py-4 pl-4">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                        checked={selectedTours.includes(tour.id)}
                        onChange={() => toggleSelectTour(tour.id)}
                      />
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={tour.img}
                          alt={tour.name}
                          className="w-16 h-16 rounded-2xl object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-on-surface text-base">
                            {tour.name}
                          </p>
                          <p className="text-xs text-on-surface-variant mt-0.5">
                            ID: {tour.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-on-surface-variant">
                      {tour.location}
                    </td>
                    <td className="py-4 text-on-surface-variant">
                      {tour.duration}
                    </td>
                    <td className="py-4 font-medium text-on-surface">
                      {tour.price}
                    </td>
                    <td className="py-4 text-on-surface-variant">
                      {tour.date}
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tour.status === "Active"
                            ? "bg-primary-container text-on-primary-container"
                            : "bg-surface-container-high text-on-surface-variant"
                        }`}
                      >
                        {tour.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => toast.info("Viewing tour details...")}
                          className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => toast.info("Editing tour...")}
                          className="p-2 rounded-full hover:bg-surface-container-high text-primary transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(tour.id)}
                          className="p-2 rounded-full hover:bg-error-container text-error transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
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

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Tour Package"
        message="Are you sure you want to permanently delete this tour package? This action cannot be undone and will remove all associated data."
      />

      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Tour Package"
        maxWidth="max-w-3xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-on-surface">Tour Name</label>
              <input type="text" placeholder="e.g. Bali Paradise Escape" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-on-surface">Location</label>
              <input type="text" placeholder="e.g. Indonesia" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-on-surface">Duration</label>
              <input type="text" placeholder="e.g. 7 Days / 6 Nights" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-on-surface">Price</label>
              <input type="text" placeholder="e.g. $1,299" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-on-surface">Tour Image</label>
            <div className="mt-2 flex justify-center rounded-2xl border border-dashed border-outline-variant/50 px-6 py-10 bg-surface-container-lowest relative overflow-hidden group">
              {newTourImage ? (
                <>
                  <img src={newTourImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => setNewTourImage(null)}
                      className="p-2 bg-error text-on-error rounded-full hover:bg-error/90"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-outline" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-on-surface-variant justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-semibold text-primary hover:text-primary/80 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-on-surface-variant mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-on-surface">Description</label>
            <textarea rows={4} className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none" placeholder="Describe the tour package..."></textarea>
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
                toast.success("Tour package created successfully");
              }}
              className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors"
            >
              Save Tour
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
