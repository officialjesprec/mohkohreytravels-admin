import React, { useState, useEffect } from "react";
import { Scan, Users, Clock, CheckCircle, Search, Filter, Plus, MoreHorizontal, FileText, User, MapPin, Activity, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "../components/Modal";
import { ConfirmModal } from "../components/ConfirmModal";
import { supabase } from "../lib/supabase";

export function PassportService() {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [applications, setApplications] = useState<any[]>([]);
    const [stats, setStats] = useState({ total: 0, processing: 0, pending: 0, completed: 0 });
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [appToDelete, setAppToDelete] = useState<string | null>(null);

    const fetchApplications = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('passport_applications')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            toast.error(error.message);
        } else {
            setApplications(data || []);
            const total = data?.length || 0;
            const processing = data?.filter(a => a.status === 'PROCESSING').length || 0;
            const pending = data?.filter(a => a.status === 'PENDING').length || 0;
            const completed = data?.filter(a => a.status === 'COMPLETED').length || 0;
            setStats({ total, processing, pending, completed });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        const { error } = await supabase
            .from('passport_applications')
            .update({ status })
            .eq('id', id);

        if (error) {
            toast.error(error.message);
        } else {
            setApplications(applications.map(a => a.id === id ? { ...a, status } : a));
            toast.success(`Status updated to ${status}`);
        }
    };

    const confirmDelete = async () => {
        if (appToDelete) {
            const { error } = await supabase.from('passport_applications').delete().eq('id', appToDelete);
            if (error) {
                toast.error(error.message);
            } else {
                setApplications(applications.filter(a => a.id !== appToDelete));
                toast.success("Application deleted");
            }
        }
        setDeleteModalOpen(false);
        setAppToDelete(null);
    };

    const handleCreateRecord = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.target as HTMLFormElement);
        
        const payload = {
            full_name: formData.get('full_name'),
            request_type: formData.get('request_type'),
            capture_center: formData.get('capture_center'),
            status: 'PENDING',
        };

        const { error } = await supabase.from('passport_applications').insert([payload]);
        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Passport record created successfully");
            setCreateModalOpen(false);
            fetchApplications();
        }
        setIsSaving(false);
    };

    const filteredApplications = applications.filter(a =>
        !searchQuery ||
        a.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.id?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const statusColors: Record<string, string> = {
        PENDING: "bg-warning/10 text-warning",
        COMPLETED: "bg-success/10 text-success",
        REJECTED: "bg-error/10 text-error",
        PROCESSING: "bg-brand-passport/10 text-brand-passport",
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-on-surface tracking-tight">
                        Passport Services
                    </h1>
                    <p className="text-on-surface-variant mt-1">
                        Manage International Passport applications and processing status.
                    </p>
                </div>
                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="px-5 py-2.5 rounded-full bg-brand-passport text-white font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm shadow-brand-passport/20"
                >
                    <Plus className="w-5 h-5" />
                    Add Record
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Applications", value: stats.total, icon: FileText, color: "bg-brand-passport/10 text-brand-passport" },
                    { label: "Processing", value: stats.processing, icon: Users, color: "bg-brand-passport/5 text-brand-passport" },
                    { label: "Pending", value: stats.pending, icon: Clock, color: "bg-warning/10 text-warning" },
                    { label: "Completed", value: stats.completed, icon: CheckCircle, color: "bg-success/10 text-success" },
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-on-surface">{stat.value}</h3>
                            </div>
                            <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-surface-container-low border border-outline-variant/50 focus:border-brand-passport focus:ring-1 focus:ring-brand-passport text-sm text-on-surface transition-all font-medium"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
                            <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-passport" />
                            <p>Loading files...</p>
                        </div>
                    ) : filteredApplications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
                            <Scan className="w-12 h-12 opacity-20 mb-4" />
                            <p>No applications found</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-outline-variant/30 text-sm italic">
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Applicant</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Center</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Type</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10">
                                {filteredApplications.map((app) => (
                                    <tr key={app.id} className="hover:bg-surface-container-lowest transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-on-surface italic">{app.full_name}</div>
                                            <div className="text-[10px] text-on-surface-variant font-medium uppercase">{new Date(app.created_at).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-on-surface-variant font-medium">{app.capture_center}</td>
                                        <td className="px-6 py-4 text-sm text-on-surface-variant font-medium">{app.request_type}</td>
                                        <td className="px-6 py-4 text-sm text-on-surface-variant font-medium">{new Date(app.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={app.status || 'PENDING'}
                                                onChange={(e) => updateStatus(app.id, e.target.value)}
                                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border-0 outline-none cursor-pointer ${statusColors[app.status] || statusColors.PENDING}`}
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="PROCESSING">Processing</option>
                                                <option value="COMPLETED">Completed</option>
                                                <option value="REJECTED">Rejected</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => { setAppToDelete(app.id); setDeleteModalOpen(true); }} className="p-2 rounded-full hover:bg-error/10 text-error transition-all">
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

            <Modal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                title="New Passport Record"
                maxWidth="max-w-xl"
            >
                <form onSubmit={handleCreateRecord} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                            <User className="w-4 h-4 text-brand-passport" />
                            Applicant Name
                        </label>
                        <input
                            type="text"
                            name="full_name"
                            required
                            placeholder="Enter full name..."
                            className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-passport focus:ring-1 focus:ring-brand-passport text-sm text-on-surface font-medium"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                                <FileText className="w-4 h-4 text-brand-passport" />
                                Request Type
                            </label>
                            <select name="request_type" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-passport focus:ring-1 focus:ring-brand-passport text-sm text-on-surface font-bold">
                                <option>Fresh Application</option>
                                <option>Renewal (Expired)</option>
                                <option>Renewal (Damaged)</option>
                                <option>Correction of Data</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-brand-passport" />
                                Capture Center
                            </label>
                            <select name="capture_center" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-passport focus:ring-1 focus:ring-brand-passport text-sm text-on-surface font-bold">
                                <option>Ikoyi, Lagos</option>
                                <option>Abuja HQ</option>
                                <option>Festac, Lagos</option>
                                <option>Enugu Center</option>
                                <option>Ibadan, Oyo</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/20">
                        <button
                            type="button"
                            onClick={() => setCreateModalOpen(false)}
                            className="px-5 py-2.5 rounded-full font-bold text-on-surface-variant hover:bg-surface-container-high transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-5 py-2.5 rounded-full bg-brand-passport text-white font-bold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {isSaving ? "Saving..." : "Create Record"}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Passport Application"
                message="Are you sure you want to delete this passport application? This action cannot be undone."
            />
        </div>
    );
}
