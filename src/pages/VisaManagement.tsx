import React, { useState, useEffect } from "react";
import { ShieldCheck, Users, Clock, CheckCircle, Search, Filter, Plus, MoreHorizontal, User, Globe, FileText, Activity, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "../components/Modal";

export function VisaManagement() {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const handleCreateApplication = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
        setCreateModalOpen(false);
        toast.success("Visa application created successfully");
    };

    const statusColors = {
        pending: "bg-warning/10 text-warning",
        approved: "bg-success/10 text-success",
        rejected: "bg-error/10 text-error",
        processing: "bg-brand-visa/10 text-brand-visa",
    };

    const visaApplications = [
        { id: "V-1024", name: "Adebayo Olawale", country: "Canada", type: "Study Visa", status: "processing", date: "2024-03-24" },
        { id: "V-1025", name: "Chidi Eze", country: "United Kingdom", type: "Tourist Visa", status: "approved", date: "2024-03-23" },
        { id: "V-1026", name: "Fatima Yusuf", country: "USA", type: "Work Visa", status: "pending", date: "2024-03-22" },
        { id: "V-1027", name: "Grace Amen", country: "Schengen", type: "Business Visa", status: "rejected", date: "2024-03-21" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-on-surface tracking-tight">
                        Visa Management
                    </h1>
                    <p className="text-on-surface-variant mt-1">
                        Track and process visa applications for global destinations.
                    </p>
                </div>
                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="px-5 py-2.5 rounded-full bg-brand-visa text-white font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm shadow-brand-visa/20"
                >
                    <Plus className="w-5 h-5" />
                    New Application
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Applications", value: "1,284", icon: ShieldCheck, color: "bg-brand-visa/10 text-brand-visa" },
                    { label: "Active Processing", value: "42", icon: Clock, color: "bg-brand-visa/5 text-brand-visa" },
                    { label: "Pending Review", value: "18", icon: Clock, color: "bg-warning/10 text-warning" },
                    { label: "Approved (MTD)", value: "156", icon: CheckCircle, color: "bg-success/10 text-success" },
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
                            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-surface-container-low border border-outline-variant/50 focus:border-brand-visa focus:ring-1 focus:ring-brand-visa text-sm text-on-surface transition-all"
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
                            <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-visa" />
                            <p>Loading applications...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-outline-variant/30">
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">App ID</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Applicant</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Destination</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Type</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10">
                                {visaApplications.map((app) => (
                                    <tr key={app.id} className="hover:bg-surface-container-lowest transition-colors cursor-pointer group">
                                        <td className="px-6 py-4 text-sm font-bold text-brand-visa">{app.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-on-surface">{app.name}</div>
                                            <div className="text-[10px] text-on-surface-variant font-medium">{app.date}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-on-surface-variant font-medium">{app.country}</td>
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
                title="New Visa Application"
                maxWidth="max-w-xl"
            >
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                            <User className="w-4 h-4 text-brand-visa" />
                            Applicant Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter full name..."
                            className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-visa focus:ring-1 focus:ring-brand-visa text-sm text-on-surface"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                                <Globe className="w-4 h-4 text-brand-visa" />
                                Destination Country
                            </label>
                            <select className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-visa focus:ring-1 focus:ring-brand-visa text-sm text-on-surface">
                                <option>United Kingdom</option>
                                <option>United States</option>
                                <option>Canada</option>
                                <option>Schengen</option>
                                <option>UAE</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                                <FileText className="w-4 h-4 text-brand-visa" />
                                Visa Type
                            </label>
                            <select className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-visa focus:ring-1 focus:ring-brand-visa text-sm text-on-surface">
                                <option>Tourist Visa</option>
                                <option>Study Visa</option>
                                <option>Work Visa</option>
                                <option>Business Visa</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                            <Activity className="w-4 h-4 text-brand-visa" />
                            Current Status
                        </label>
                        <select className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-visa focus:ring-1 focus:ring-brand-visa text-sm text-on-surface">
                            <option>Pending</option>
                            <option>Processing</option>
                            <option>Approved</option>
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
                            onClick={handleCreateApplication}
                            disabled={isSaving}
                            className="px-5 py-2.5 rounded-full bg-brand-visa text-white font-bold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {isSaving ? "Creating..." : "Create Application"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
