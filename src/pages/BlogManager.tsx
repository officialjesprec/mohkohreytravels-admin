import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit2, Trash2, Eye, Calendar, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "../components/ConfirmModal";
import { Modal } from "../components/Modal";
import { supabase } from "../lib/supabase";
import { uploadToCloudinary } from "../lib/cloudinary";

export function BlogManager() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    category: "Travel Guides",
    content: "",
    is_published: false,
  });
  const [newImage, setNewImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setPosts(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeleteClick = (id: string) => {
    setPostToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (postToDelete) {
      const { error } = await supabase.from('blogs').delete().eq('id', postToDelete);
      if (error) {
        toast.error(error.message);
      } else {
        setPosts(posts.filter(p => p.id !== postToDelete));
        toast.success("Article deleted");
      }
    }
    setDeleteModalOpen(false);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      toast.error("Title and Content are required");
      return;
    }

    setIsSaving(true);
    try {
      let coverUrl = "";
      if (newImage) {
        const res = await uploadToCloudinary(newImage, 'blog');
        coverUrl = res.url;
      }

      const payload = {
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        content: formData.content,
        category: formData.category,
        cover_image: coverUrl,
        is_published: formData.is_published,
      };

      const { error } = await supabase.from('blogs').insert([payload]);
      if (error) throw error;

      toast.success("Blog article synchronized!");
      setCreateModalOpen(false);
      setFormData({ title: "", category: "Travel Guides", content: "", is_published: false });
      setPreview(null);
      setNewImage(null);
      fetchPosts();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-bold text-[#0F172A] tracking-tight">Blog & Articles</h1>
          <p className="text-slate-500 mt-1">Publish travel stories and updates across the platform.</p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#005EB8] text-white font-bold hover:opacity-90 shadow-sm flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Write Article
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#005EB8]" />
            <p>Gathering latest stories...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="rounded-3xl bg-white border border-slate-100 overflow-hidden group hover:shadow-lg transition-all">
                <div className="relative h-48 overflow-hidden">
                  <img src={post.cover_image || "/blog-placeholder.png"} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm ${post.is_published ? "bg-green-600/80 text-white" : "bg-slate-500/80 text-white"}`}>
                      {post.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDeleteClick(post.id)} className="w-10 h-10 rounded-full bg-white shadow-xl text-red-600 flex items-center justify-center hover:bg-red-50">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-xs text-[#005EB8] font-bold uppercase tracking-wider">{post.category}</span>
                  <h3 className="text-lg font-bold text-[#0F172A] leading-tight mb-3 line-clamp-2 mt-1">{post.title}</h3>
                  <div className="flex items-center justify-between text-sm text-slate-400 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <Eye className="w-4 h-4" />
                      {post.views}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Blog Article"
        message="This will remove the article from the main website. Continue?"
      />

      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Write New Article" maxWidth="max-w-4xl">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 font-heading tracking-wide uppercase text-[10px]">Article Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#005EB8] outline-none transition-all"
              placeholder="e.g. Exploring the Great Barrier Reef"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 font-heading tracking-wide uppercase text-[10px]">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-[#005EB8]"
              >
                <option>Travel Guides</option>
                <option>Tips & Tricks</option>
                <option>Food & Culture</option>
                <option>News & Updates</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 font-heading tracking-wide uppercase text-[10px]">Status</label>
              <label className="flex items-center gap-3 cursor-pointer mt-3">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-[#005EB8] focus:ring-[#005EB8]"
                />
                <span className="text-sm font-bold text-slate-600">Publish Immediately</span>
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 font-heading tracking-wide uppercase text-[10px]">Featured Cover (Auto-Optimized)</label>
            <div className="mt-2 flex justify-center rounded-2xl border border-dashed border-slate-300 px-6 py-10 bg-slate-50 relative overflow-hidden group">
              {preview ? (
                <>
                  <img src={preview} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => { setPreview(null); setNewImage(null); }} className="p-2 bg-red-600 text-white rounded-full"><Trash2 /></button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-slate-300" />
                  <div className="mt-4 flex text-sm text-slate-500 justify-center">
                    <label className="relative cursor-pointer text-[#005EB8] font-bold">
                      <span>Upload a image</span>
                      <input type="file" className="sr-only" accept="image/*" onChange={handleImage} />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 font-heading tracking-wide uppercase text-[10px]">Article Content</label>
            <textarea
              rows={8}
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-[#005EB8] resize-none"
              placeholder="Start writing your travel story..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button onClick={() => setCreateModalOpen(false)} className="px-5 py-2.5 font-bold text-slate-400 hover:text-slate-600">Disregard</button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-2.5 rounded-xl bg-[#005EB8] text-white font-bold hover:opacity-95 shadow-lg shadow-[#005EB8]/20 flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSaving ? "Syncing Platform..." : "Post Article"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
