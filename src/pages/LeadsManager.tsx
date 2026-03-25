import React, { useState, useEffect } from "react";
import { Search, Filter, Trash2, Mail, Phone, Calendar, Loader2, MessageSquare, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import { ConfirmModal } from "../components/ConfirmModal";

export function LeadsManager() {
    const [leads, setLeads] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState<string | null>(null);

    const fetchLeads = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            toast.error(error.message);
        } else {
            setLeads(data || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        const { error } = await supabase
            .from('leads')
            .update({ status })
            .eq('id', id);

        if (error) {
            toast.error(error.message);
        } else {
            setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
            toast.success(`Status updated to ${status}`);
        }
    };

    const confirmDelete = async () => {
        if (leadToDelete) {
            const { error } = await supabase.from('leads').delete().eq('id', leadToDelete);
            if (error) {
                toast.error(error.message);
            } else {
                setLeads(leads.filter(l => l.id !== leadToDelete));
                toast.success("Lead removed");
            }
        }
        setDeleteModalOpen(false);
    };

    const filteredLeads = leads.filter(l =>
        l.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.message?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-[#0F172A] tracking-tight">Monitoring Requests</h1>
                    <p className="text-slate-500 mt-1">Manage inquiries and contact requests from the platform.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search requests..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-[#005EB8] outline-none text-sm"
                        />
                    </div>
                    <button onClick={fetchLeads} className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600">
                        <Clock className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-500">
                        <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#005EB8]" />
                        <p>Syncing global requests...</p>
                    </div>
                ) : filteredLeads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                        <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                        <p>No requests found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Requester</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Message</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Details</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeads.map((lead) => (
                                    <tr key={lead.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900">{lead.full_name}</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <a href={`mailto:${lead.email}`} className="text-xs text-[#005EB8] hover:underline flex items-center gap-1">
                                                        <Mail size={12} /> {lead.email}
                                                    </a>
                                                </div>
                                                {lead.phone && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                                            <Phone size={12} /> {lead.phone}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-md">
                                            <p className="text-sm text-slate-600 line-clamp-2">{lead.message}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 text-[11px] font-bold uppercase text-slate-400">
                                                <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(lead.created_at).toLocaleDateString()}</span>
                                                <span className="text-[#FFA000]">{lead.metadata?.service || lead.source}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={lead.status || 'PENDING'}
                                                onChange={e => updateStatus(lead.id, e.target.value)}
                                                className={`text-xs font-bold px-3 py-1.5 rounded-full border-none outline-none cursor-pointer ${lead.status === 'RESPONDED' ? 'bg-green-100 text-green-700' :
                                                        lead.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-amber-100 text-amber-700'
                                                    }`}
                                            >
                                                <option value="PENDING">New Request</option>
                                                <option value="IN_PROGRESS">Attending</option>
                                                <option value="RESPONDED">Responded</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button onClick={() => { setLeadToDelete(lead.id); setDeleteModalOpen(true); }} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Request"
                message="Are you sure you want to remove this monitoring record? This action cannot be undone."
            />
        </div>
    );
}
