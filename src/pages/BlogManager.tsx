import { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit2, Trash2, Eye, Calendar, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "../components/ConfirmModal";
import { Modal } from "../components/Modal";

const initialPosts = [
  {
    id: "1",
    title: "Top 10 Hidden Gems in Southeast Asia",
    category: "Travel Guides",
    date: "Oct 12, 2023",
    views: "1.2k",
    status: "Published",
    img: "https://picsum.photos/seed/asia/400/250",
  },
  {
    id: "2",
    title: "How to Pack Light for a 2-Week Trip",
    category: "Tips & Tricks",
    date: "Oct 05, 2023",
    views: "856",
    status: "Published",
    img: "https://picsum.photos/seed/pack/400/250",
  },
  {
    id: "3",
    title: "A Culinary Journey Through Italy",
    category: "Food & Culture",
    date: "Sep 28, 2023",
    views: "2.4k",
    status: "Published",
    img: "https://picsum.photos/seed/italy/400/250",
  },
  {
    id: "4",
    title: "The Ultimate Guide to Solo Travel",
    category: "Travel Guides",
    date: "Draft",
    views: "-",
    status: "Draft",
    img: "https://picsum.photos/seed/solo/400/250",
  },
];

export function BlogManager() {
  const [posts, setPosts] = useState(initialPosts);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newPostImage, setNewPostImage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleDeleteClick = (id: string) => {
    setPostToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      setPosts(posts.filter((p) => p.id !== postToDelete));
      setSelectedPosts(selectedPosts.filter(id => id !== postToDelete));
      toast.success("Blog post deleted successfully");
    }
    setDeleteModalOpen(false);
    setPostToDelete(null);
  };

  const toggleSelectPost = (id: string) => {
    if (selectedPosts.includes(id)) {
      setSelectedPosts(selectedPosts.filter(pId => pId !== id));
    } else {
      setSelectedPosts([...selectedPosts, id]);
    }
  };

  const handleBulkDelete = () => {
    setPosts(posts.filter(p => !selectedPosts.includes(p.id)));
    toast.success(`${selectedPosts.length} posts deleted`);
    setSelectedPosts([]);
  };

  const handleBulkPublish = () => {
    setPosts(posts.map(p => selectedPosts.includes(p.id) ? { ...p, status: "Published" } : p));
    toast.success(`${selectedPosts.length} posts published`);
    setSelectedPosts([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPostImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-headline font-bold text-on-surface tracking-tight">
            Blog & Articles
          </h1>
          <p className="text-on-surface-variant mt-1">
            Publish travel guides, tips, and destination stories.
          </p>
        </div>
        <button 
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Write Article
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex gap-2 w-full md:w-auto">
            <button className="px-4 py-2 rounded-full bg-primary-container text-on-primary-container font-medium text-sm">
              Published ({posts.filter(p => p.status === "Published").length})
            </button>
            <button className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-medium text-sm transition-colors">
              Drafts ({posts.filter(p => p.status === "Draft").length})
            </button>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input
                type="text"
                placeholder="Search articles..."
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

        {selectedPosts.length > 0 && (
          <div className="mb-6 p-3 bg-primary-container/30 rounded-2xl border border-primary/20 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <span className="text-sm font-medium text-on-surface px-2">
              {selectedPosts.length} post{selectedPosts.length > 1 ? 's' : ''} selected
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

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
            <p>Loading articles...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className={`rounded-3xl bg-surface-container-lowest border overflow-hidden group hover:shadow-md transition-all ${
                  selectedPosts.includes(post.id) ? 'border-primary ring-1 ring-primary' : 'border-outline-variant/30'
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary backdrop-blur-md bg-white/50"
                      checked={selectedPosts.includes(post.id)}
                      onChange={() => toggleSelectPost(post.id)}
                    />
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md ${
                        post.status === "Published"
                          ? "bg-primary/80 text-on-primary"
                          : "bg-surface-container-highest/80 text-on-surface"
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button 
                      onClick={() => toast.info("Editing post...")}
                      className="w-8 h-8 rounded-full bg-surface-container-lowest/90 text-on-surface flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(post.id)}
                      className="w-8 h-8 rounded-full bg-surface-container-lowest/90 text-error flex items-center justify-center hover:bg-error hover:text-on-error transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-primary font-medium mb-2">
                    <span>{post.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-on-surface leading-tight mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-on-surface-variant pt-4 border-t border-outline-variant/20">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1.5">
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
        title="Delete Blog Post"
        message="Are you sure you want to permanently delete this blog post? This action cannot be undone."
      />

      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Write New Article"
        maxWidth="max-w-4xl"
      >
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-on-surface">Article Title</label>
            <input type="text" placeholder="Enter an engaging title..." className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-on-surface">Category</label>
              <select className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                <option>Travel Guides</option>
                <option>Tips & Tricks</option>
                <option>Food & Culture</option>
                <option>News & Updates</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-on-surface">Status</label>
              <select className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                <option>Draft</option>
                <option>Published</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-on-surface">Featured Image</label>
            <div className="mt-2 flex justify-center rounded-2xl border border-dashed border-outline-variant/50 px-6 py-10 bg-surface-container-lowest relative overflow-hidden group">
              {newPostImage ? (
                <>
                  <img src={newPostImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => setNewPostImage(null)}
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
                      htmlFor="blog-image-upload"
                      className="relative cursor-pointer rounded-md font-semibold text-primary hover:text-primary/80 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input id="blog-image-upload" name="blog-image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-on-surface-variant mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-on-surface">Content</label>
            <textarea rows={8} className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none" placeholder="Write your article content here..."></textarea>
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
                toast.success("Article saved successfully");
              }}
              className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors"
            >
              Save Article
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
