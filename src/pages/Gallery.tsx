import { useState } from "react";
import { Plus, Search, Filter, Trash2, Download, Eye, Upload } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "../components/Modal";

export function Gallery() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newMediaImage, setNewMediaImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMediaImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-headline font-bold text-on-surface tracking-tight">
            Media Gallery
          </h1>
          <p className="text-on-surface-variant mt-1">
            Manage images and videos for tours and blogs.
          </p>
        </div>
        <button 
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Upload Media
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex gap-2 w-full md:w-auto">
            <button className="px-4 py-2 rounded-full bg-primary-container text-on-primary-container font-medium text-sm">
              All Media (1,248)
            </button>
            <button className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-medium text-sm transition-colors">
              Images (1,102)
            </button>
            <button className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-medium text-sm transition-colors">
              Videos (146)
            </button>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input
                type="text"
                placeholder="Search media..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary text-sm text-on-surface"
              />
            </div>
            <button className="p-2 rounded-full bg-surface-container-low border border-outline-variant/50 hover:bg-surface-container-high text-on-surface-variant transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[
            { img: "https://picsum.photos/seed/g1/400/400", name: "bali-beach.jpg", size: "2.4 MB" },
            { img: "https://picsum.photos/seed/g2/400/400", name: "swiss-alps.jpg", size: "3.1 MB" },
            { img: "https://picsum.photos/seed/g3/400/400", name: "kyoto-temple.jpg", size: "1.8 MB" },
            { img: "https://picsum.photos/seed/g4/400/400", name: "safari-lion.jpg", size: "4.2 MB" },
            { img: "https://picsum.photos/seed/g5/400/400", name: "paris-tower.jpg", size: "2.1 MB" },
            { img: "https://picsum.photos/seed/g6/400/400", name: "nyc-skyline.jpg", size: "3.5 MB" },
            { img: "https://picsum.photos/seed/g7/400/400", name: "rome-colosseum.jpg", size: "2.8 MB" },
            { img: "https://picsum.photos/seed/g8/400/400", name: "tokyo-street.jpg", size: "3.9 MB" },
            { img: "https://picsum.photos/seed/g9/400/400", name: "london-bridge.jpg", size: "2.5 MB" },
            { img: "https://picsum.photos/seed/g10/400/400", name: "sydney-opera.jpg", size: "3.2 MB" },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-surface-container-low border border-outline-variant/20"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <p className="text-white text-xs font-medium truncate">
                  {item.name}
                </p>
                <p className="text-white/70 text-[10px] mt-0.5">{item.size}</p>
                <div className="absolute top-2 right-2 flex gap-1">
                  <button 
                    onClick={() => toast.info("Viewing media...")}
                    className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => toast.success("Download started")}
                    className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => toast.success("Media deleted")}
                    className="w-7 h-7 rounded-full bg-error/80 backdrop-blur-md text-white flex items-center justify-center hover:bg-error transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Upload Media"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-on-surface">Select File</label>
            <div className="mt-2 flex justify-center rounded-2xl border border-dashed border-outline-variant/50 px-6 py-10 bg-surface-container-lowest relative overflow-hidden group">
              {newMediaImage ? (
                <>
                  <img src={newMediaImage} alt="Preview" className="absolute inset-0 w-full h-full object-contain bg-black/5" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => setNewMediaImage(null)}
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
                      htmlFor="media-upload"
                      className="relative cursor-pointer rounded-md font-semibold text-primary hover:text-primary/80 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input id="media-upload" name="media-upload" type="file" className="sr-only" accept="image/*,video/*" onChange={handleImageUpload} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-on-surface-variant mt-1">PNG, JPG, GIF, MP4 up to 50MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-on-surface">File Name (Optional)</label>
            <input type="text" placeholder="e.g. bali-beach-sunset" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
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
                toast.success("Media uploaded successfully");
              }}
              className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors"
            >
              Upload
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
