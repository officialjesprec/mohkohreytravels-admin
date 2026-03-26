import React, { useState, useEffect } from "react";
import { GraduationCap, Users, CheckCircle, Search, Filter, Plus, MoreHorizontal, BookOpen, User, School, Book, Calendar, Activity, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "../components/Modal";
import { ConfirmModal } from "../components/ConfirmModal";
import { supabase } from "../lib/supabase";

export function StudyAbroadManager() {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [students, setStudents] = useState<any[]>([]);
    const [stats, setStats] = useState({ total: 0, applied: 0, enrolled: 0, inquiring: 0 });
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

    const fetchStudents = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('study_abroad')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            toast.error(error.message);
        } else {
            setStudents(data || []);
            const total = data?.length || 0;
            const applied = data?.filter(s => s.status === 'APPLIED').length || 0;
            const enrolled = data?.filter(s => s.status === 'ENROLLED').length || 0;
            const inquiring = data?.filter(s => s.status === 'INQUIRING').length || 0;
            setStats({ total, applied, enrolled, inquiring });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        const { error } = await supabase
            .from('study_abroad')
            .update({ status })
            .eq('id', id);

        if (error) {
            toast.error(error.message);
        } else {
            setStudents(students.map(s => s.id === id ? { ...s, status } : s));
            toast.success(`Status updated to ${status}`);
        }
    };

    const confirmDelete = async () => {
        if (studentToDelete) {
            const { error } = await supabase.from('study_abroad').delete().eq('id', studentToDelete);
            if (error) {
                toast.error(error.message);
            } else {
                setStudents(students.filter(s => s.id !== studentToDelete));
                toast.success("Record deleted");
            }
        }
        setDeleteModalOpen(false);
        setStudentToDelete(null);
    };

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.target as HTMLFormElement);
        
        const payload = {
            full_name: formData.get('full_name'),
            university: formData.get('university'),
            course: formData.get('course'),
            intake: formData.get('intake'),
            status: formData.get('status')?.toString().toUpperCase() || 'INQUIRING',
        };

        const { error } = await supabase.from('study_abroad').insert([payload]);
        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Student added successfully");
            setCreateModalOpen(false);
            fetchStudents();
        }
        setIsSaving(false);
    };

    const filteredStudents = students.filter(s =>
        !searchQuery ||
        s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.university?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const statusColors: Record<string, string> = {
        APPLIED: "bg-brand-study/10 text-brand-study",
        ENROLLED: "bg-success/10 text-success",
        REJECTED: "bg-error/10 text-error",
        INQUIRING: "bg-warning/10 text-warning",
    };

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
                    { label: "Total Students", value: stats.total, icon: GraduationCap, color: "bg-brand-study/10 text-brand-study" },
                    { label: "Applied", value: stats.applied, icon: Users, color: "bg-warning/10 text-warning" },
                    { label: "Enrolled", value: stats.enrolled, icon: CheckCircle, color: "bg-success/10 text-success" },
                    { label: "Inquiries", value: stats.inquiring, icon: BookOpen, color: "bg-brand-study/5 text-brand-study" },
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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-surface-container-low border border-outline-variant/50 focus:border-brand-study focus:ring-1 focus:ring-brand-study text-sm text-on-surface transition-all"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
                            <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-study" />
                            <p>Loading records...</p>
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
                            <GraduationCap className="w-12 h-12 opacity-20 mb-4" />
                            <p>No students found</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-outline-variant/30">
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-left">Student</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-left">University & Course</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-left">Intake</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-left">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10">
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-surface-container-lowest transition-colors group">
                                        <td className="px-6 py-4 font-bold text-on-surface text-sm italic">{student.full_name}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-on-surface">{student.university}</div>
                                            <div className="text-[10px] text-on-surface-variant font-medium">{student.course}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-on-surface-variant font-medium">{student.intake}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={student.status || 'INQUIRING'}
                                                onChange={(e) => updateStatus(student.id, e.target.value)}
                                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border-0 outline-none cursor-pointer ${statusColors[student.status] || statusColors.INQUIRING}`}
                                            >
                                                <option value="INQUIRING">Inquiring</option>
                                                <option value="APPLIED">Applied</option>
                                                <option value="ENROLLED">Enrolled</option>
                                                <option value="REJECTED">Rejected</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => { setStudentToDelete(student.id); setDeleteModalOpen(true); }} className="p-2 rounded-full hover:bg-error/10 text-error transition-all">
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
                title="Add New Student"
                maxWidth="max-w-xl"
            >
                <form onSubmit={handleAddStudent} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                            <User className="w-4 h-4 text-brand-study" />
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="full_name"
                            required
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
                            name="university"
                            required
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
                                name="course"
                                required
                                placeholder="e.g. MBA, MSC CS"
                                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-study focus:ring-1 focus:ring-brand-study text-sm text-on-surface font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-brand-study" />
                                Intake Period
                            </label>
                            <select name="intake" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-study focus:ring-1 focus:ring-brand-study text-sm text-on-surface font-bold">
                                <option>Fall 2025</option>
                                <option>Spring 2025</option>
                                <option>Winter 2026</option>
                                <option>Summer 2025</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                            <Activity className="w-4 h-4 text-brand-study" />
                            Current Status
                        </label>
                        <select name="status" className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-brand-study focus:ring-1 focus:ring-brand-study text-sm text-on-surface font-bold">
                            <option value="INQUIRING">Inquiring</option>
                            <option value="APPLIED">Applied</option>
                            <option value="ENROLLED">Enrolled</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
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
                            className="px-5 py-2.5 rounded-full bg-brand-study text-white font-bold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {isSaving ? "Adding..." : "Add Student"}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Student Record"
                message="Are you sure you want to delete this student record? This action cannot be undone."
            />
        </div>
    );
}
