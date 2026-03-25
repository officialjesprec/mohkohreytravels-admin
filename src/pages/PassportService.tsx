import React, { useState, useEffect } from "react";
import { Scan, Users, Clock, CheckCircle, Search, Filter, Plus, MoreHorizontal, FileText, User, MapPin, Activity, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "../components/Modal";

export function PassportService() {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const handleCreateRecord = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
        setCreateModalOpen(false);
        toast.success("Passport record created successfully");
    };

    const statusColors = {
        pending: "bg-warning/10 text-warning",
        completed: "bg-success/10 text-success",
        rejected: "bg-error/10 text-error",
        processing: "bg-brand-passport/10 text-brand-passport",
    };

    const applications = [
        { id: "P-5021", name: "Damilola Adeniyi", type: "Fresh Application", status: "processing", center: "Ikoyi, Lagos", date: "2024-03-24" },
        { id: "P-5022", name: "Mustapha Musa", type: "Renewal", status: "completed", center: "Abuja HQ", date: "2024-03-23" },
        { id: "P-5023", name: "Nneka Obi", type: "Lost/Damage Reissue", status: "pending", center: "Enugu Center", date: "2024-03-22" },
    ];

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
                    { label: "Total Applications", value: "842", icon: FileText, color: "bg-brand-passport/10 text-brand-passport" },
                    { label: "Pending Capture", value: "31", icon: Users, color: "bg-brand-passport/5 text-brand-passport" },
                    { label: "In Review", value: "12", icon: Clock, color: "bg-warning/10 text-warning" },
                    { label: "Dispatched", value: "48", icon: CheckCircle, color: "bg-success/10 text-success" },
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
                            placeholder="Search by ID or name..."
                            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-surface-container-low border border-outline-variant/50 focus:border-brand-passport focus:ring-1 focus:ring-brand-passport text-sm text-on-surface transition-all font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2.5 rounded-full border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-high transition-all">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
                            <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-passport" />
                            <p>Loading files...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-outline-variant/30 text-sm italic">
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">App ID</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Applicant</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Center</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Type</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10">
                                {applications.map((app) => (
                                    <tr key={app.id} className="hover:bg-surface-container-lowest transition-colors cursor-pointer group">
                                        <td className="px-6 py-4 text-sm font-bold text-brand-passport">{app.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-on-surface italic">{app.name}</div>
                                            <div className="text-[10px] text-on-surface-variant font-medium uppercase">{app.date}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-on-surface-variant font-medium">{app.center}</td>
                                        <td className="px-6 py-4 text-sm text-on-surface-variant font-medium">{app.type}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[app.status as keyof typeof statusColors]}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-all">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
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
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                            <User className="w-4 h-4 text-brand-passport" />
                            Applicant Name
                        </label>
                        <input
                            type="text"
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
                            <select className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-passport focus:ring-1 focus:ring-brand-passport text-sm text-on-surface font-bold">
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
                            <select className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-passport focus:ring-1 focus:ring-brand-passport text-sm text-on-surface font-bold">
                                <option>Ikoyi, Lagos</option>
                                <option>Abuja HQ</option>
                                <option>Festac, Lagos</option>
                                <option>Enugu Center</option>
                                <option>Ibadan, Oyo</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                            <Activity className="w-4 h-4 text-brand-passport" />
                            Processing Status
                        </label>
                        <select className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-passport focus:ring-1 focus:ring-brand-passport text-sm text-on-surface font-bold">
                            <option>Pending</option>
                            <option>Processing</option>
                            <option>Completed</option>
                            <option>Rejected</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/20">
                        <button
                            onClick={() => setCreateModalOpen(false)}
                            className="px-5 py-2.5 rounded-full font-bold text-on-surface-variant hover:bg-surface-container-high transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreateRecord}
                            disabled={isSaving}
                            className="px-5 py-2.5 rounded-full bg-brand-passport text-white font-bold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {isSaving ? "Saving..." : "Create Record"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
