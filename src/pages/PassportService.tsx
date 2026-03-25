import { Scan, Users, Clock, CheckCircle, Search, Filter, Plus, MoreHorizontal, FileText } from "lucide-react";
import { toast } from "sonner";

export function PassportService() {
    const statusColors = {
        pending: "bg-amber-100 text-amber-700",
        completed: "bg-emerald-100 text-emerald-700",
        rejected: "bg-rose-100 text-rose-700",
        processing: "bg-blue-100 text-blue-700",
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
                    <h1 className="text-3xl font-heading font-bold text-primary tracking-tight">
                        Passport Services
                    </h1>
                    <p className="text-primary/60 mt-1">
                        Manage International Passport applications and processing status.
                    </p>
                </div>
                <button
                    onClick={() => toast.success("Opening Passport Form")}
                    className="px-5 py-2.5 rounded-xl bg-secondary text-white font-bold hover:bg-secondary/90 transition-all flex items-center gap-2 shadow-sm shadow-secondary/20"
                >
                    <Plus className="w-4 h-4" />
                    Add Record
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Applications", value: "842", icon: FileText, color: "bg-primary/5 text-primary" },
                    { label: "Pending Capture", value: "31", icon: Users, color: "bg-blue-50 text-blue-600" },
                    { label: "In Review", value: "12", icon: Clock, color: "bg-amber-50 text-amber-600" },
                    { label: "Dispatched", value: "48", icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-white border border-primary/5 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-primary">{stat.value}</h3>
                            </div>
                            <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl border border-primary/5 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-primary/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30" />
                        <input
                            type="text"
                            placeholder="Search by ID or name..."
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-primary/5 border-none focus:ring-2 focus:ring-secondary/20 text-sm text-primary transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2.5 rounded-xl border border-primary/10 text-primary/60 hover:bg-primary/5 transition-all">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-primary/[0.02]">
                                <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest">App ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest">Applicant</th>
                                <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest">Center</th>
                                <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                            {applications.map((app) => (
                                <tr key={app.id} className="hover:bg-primary/[0.01] transition-colors cursor-pointer group">
                                    <td className="px-6 py-4 text-sm font-bold text-primary">{app.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-primary">{app.name}</div>
                                        <div className="text-xs text-primary/40">{app.date}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-primary/70">{app.center}</td>
                                    <td className="px-6 py-4 text-sm text-primary/70">{app.type}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[app.status as keyof typeof statusColors]}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 rounded-lg hover:bg-primary/5 text-primary/40 group-hover:text-primary transition-all">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
