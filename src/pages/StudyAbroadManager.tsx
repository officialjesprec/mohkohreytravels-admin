import React, { useState, useEffect } from "react";
import { GraduationCap, Users, Clock, CheckCircle, Search, Filter, Plus, MoreHorizontal, BookOpen, User, School, Book, Calendar, Activity, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "../components/Modal";

export function StudyAbroadManager() {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const handleAddStudent = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
        setCreateModalOpen(false);
        toast.success("Student added successfully");
    };

    const statusColors = {
        applied: "bg-brand-study/10 text-brand-study",
        enrolled: "bg-success/10 text-success",
        rejected: "bg-error/10 text-error",
        inquiring: "bg-warning/10 text-warning",
    };

    const students = [
        { id: "S-9001", name: "Ifeanyi Okafor", university: "University of Toronto", course: "Computer Science", status: "applied", intake: "Fall 2024" },
        { id: "S-9002", name: "Bose Salau", university: "Coventry University", course: "MBA", status: "enrolled", intake: "Spring 2024" },
        { id: "S-9003", name: "Kelechi Iheacho", university: "McMaster University", course: "Eng. Management", status: "inquiring", intake: "Winter 2025" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-on-surface tracking-tight">
                        Study Abroad Manager
                    </h1>
                    <p className="text-on-surface-variant mt-1">
                        Manage student admissions, inquiries, and university placements.
                    </p>
                </div>
                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="px-5 py-2.5 rounded-full bg-brand-study text-white font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm shadow-brand-study/20"
                >
                    <Plus className="w-5 h-5" />
                    Add Student
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Active Students", value: "312", icon: GraduationCap, color: "bg-brand-study/10 text-brand-study" },
                    { label: "New Inquiries", value: "64", icon: Users, color: "bg-warning/10 text-warning" },
                    { label: "Admits Issued", value: "85", icon: CheckCircle, color: "bg-success/10 text-success" },
                    { label: "Partner Unis", value: "24", icon: BookOpen, color: "bg-brand-study/5 text-brand-study" },
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
                            placeholder="Search by student or university..."
                            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-surface-container-low border border-outline-variant/50 focus:border-brand-study focus:ring-1 focus:ring-brand-study text-sm text-on-surface transition-all"
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
                            <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-study" />
                            <p>Loading records...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-outline-variant/30">
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-left">Stud. ID</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-left">Student</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-left">University & Course</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-left">Intake</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-left">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-surface-container-lowest transition-colors cursor-pointer group">
                                        <td className="px-6 py-4 text-sm font-bold text-brand-study">{student.id}</td>
                                        <td className="px-6 py-4 font-bold text-on-surface text-sm italic">{student.name}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-on-surface">{student.university}</div>
                                            <div className="text-[10px] text-on-surface-variant font-medium">{student.course}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-on-surface-variant font-medium">{student.intake}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[student.status as keyof typeof statusColors]}`}>
                                                {student.status}
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
                title="Add New Student"
                maxWidth="max-w-xl"
            >
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                            <User className="w-4 h-4 text-brand-study" />
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter student name..."
                            className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-study focus:ring-1 focus:ring-brand-study text-sm text-on-surface font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                            <School className="w-4 h-4 text-brand-study" />
                            University / Institution
                        </label>
                        <input
                            type="text"
                            placeholder="Enter university name..."
                            className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-study focus:ring-1 focus:ring-brand-study text-sm text-on-surface font-medium"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                                <Book className="w-4 h-4 text-brand-study" />
                                Course / Program
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. MBA, MSC CS"
                                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-study focus:ring-1 focus:ring-brand-study text-sm text-on-surface font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-brand-study" />
                                Intake Period
                            </label>
                            <select className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-study focus:ring-1 focus:ring-brand-study text-sm text-on-surface font-bold">
                                <option>Fall 2024</option>
                                <option>Spring 2024</option>
                                <option>Winter 2025</option>
                                <option>Summer 2024</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                            <Activity className="w-4 h-4 text-brand-study" />
                            Current Status
                        </label>
                        <select className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-study focus:ring-1 focus:ring-brand-study text-sm text-on-surface font-bold">
                            <option>Inquiring</option>
                            <option>Applied</option>
                            <option>Enrolled</option>
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
                            onClick={handleAddStudent}
                            disabled={isSaving}
                            className="px-5 py-2.5 rounded-full bg-brand-study text-white font-bold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {isSaving ? "Adding..." : "Add Student"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
