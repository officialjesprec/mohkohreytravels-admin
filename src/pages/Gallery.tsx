import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Trash2, Download, Eye, Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "../components/Modal";
import { supabase } from "../lib/supabase";
import { uploadToCloudinary } from "../lib/cloudinary";

export function Gallery() {
  const [media, setMedia] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // New media states
  const [newFile, setNewFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Tours & Trips");

  const fetchMedia = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setMedia(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!newFile) {
      toast.error("Please select a file first");
      return;
    }

    setIsSaving(true);
    try {
      // 1. Upload to Cloudinary with compression
      const { url } = await uploadToCloudinary(newFile, 'gallery');

      // 2. Save to Supabase
      const { error } = await supabase.from('gallery').insert([{
        title: title || newFile.name,
        image_url: url,
        category: category,
        is_featured: false
      }]);

      if (error) throw error;

      toast.success("Media synchronized across platform");
      setCreateModalOpen(false);
      setNewFile(null);
      setPreview(null);
      setTitle("");
      fetchMedia();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      setMedia(media.filter(m => m.id !== id));
      toast.success("Media removed");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-bold text-[#0F172A] tracking-tight">Media Gallery</h1>
          <p className="text-slate-500 mt-1">Manage global assets synchronized with the main website.</p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#005EB8] text-white font-bold hover:opacity-90 shadow-sm flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Upload Media
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
            <button className="px-4 py-2 rounded-full bg-[#005EB8] text-white font-bold text-sm whitespace-nowrap">
              All Media ({media.length})
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#005EB8]" />
            <p>Syncing gallery...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {media.map((item) => (
              <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <p className="text-white text-xs font-bold truncate">{item.title}</p>
                  <p className="text-white/70 text-[10px] uppercase font-bold mt-0.5">{item.category}</p>
                  <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:bg-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Upload Media" maxWidth="max-w-xl">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-widest text-[10px]">Select File</label>
            <div className="mt-2 flex justify-center rounded-2xl border border-dashed border-slate-300 px-6 py-10 bg-slate-50 relative overflow-hidden group">
              {preview ? (
                <>
                  <img src={preview} className="absolute inset-0 w-full h-full object-contain bg-black/5" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => { setPreview(null); setNewFile(null); }} className="p-2 bg-red-600 text-white rounded-full">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-slate-300" />
                  <div className="mt-4 flex text-sm text-slate-500 justify-center">
                    <label className="relative cursor-pointer text-[#005EB8] font-bold">
                      <span>Upload a image</span>
                      <input type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-widest text-[10px]">Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Bali Beach" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-[#005EB8]" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-widest text-[10px]">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-[#005EB8]">
                <option>Tours & Trips</option>
                <option>Visa Success</option>
                <option>CEO Conferences</option>
                <option>Testimonials</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button onClick={() => setCreateModalOpen(false)} className="px-5 py-2.5 font-bold text-slate-400">Cancel</button>
            <button
              onClick={handleUpload}
              disabled={isSaving}
              className="px-8 py-2.5 rounded-xl bg-[#005EB8] text-white font-bold hover:opacity-90 flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSaving ? "Syncing..." : "Publish to Platform"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
