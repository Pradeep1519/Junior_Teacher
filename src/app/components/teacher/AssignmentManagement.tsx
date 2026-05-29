// ============================================
// UPDATED: teacher-portal/src/app/components/teacher/AssignmentManagement.tsx
// ============================================
import { useState, useEffect } from "react";
import { DashboardLayout } from "../DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { getTeacherBatches, getTeacherStudents } from "../../config/firebase";
import { db } from "../../config/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import {
  Home, Calendar, Users, BookOpen, MessageCircle, BarChart3, Settings,
  ClipboardList, Plus, Eye, Trash2, Edit, Clock, CheckCircle, AlertCircle
} from "lucide-react";

export function AssignmentManagement() {
  const { userData } = useAuth();
  const teacherId = userData?.teacherId || userData?.uid || "";
  const teacherAvatar = userData?.avatar || "TR";
  const [activeTab, setActiveTab] = useState("active");
  const [assignments, setAssignments] = useState([]);
  const [myBatches, setMyBatches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "", subject: "", batchId: "", description: "", points: 100,
    dueDate: "", status: "active"
  });

  useEffect(() => {
    async function fetchData() {
      if (!teacherId) return;
      try {
        const [batches] = await Promise.all([getTeacherBatches(teacherId)]);
        setMyBatches(batches);
        // Fetch assignments for teacher's batches
        const q = query(collection(db, "assignments"), where("teacherId", "==", teacherId));
        const snap = await getDocs(q);
        setAssignments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchData();
  }, [teacherId]);

  const resetForm = () => {
    setForm({ title: "", subject: "", batchId: "", description: "", points: 100, dueDate: "", status: "active" });
    setEditingAssignment(null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const batch = myBatches.find(b => b.id === form.batchId);
    await addDoc(collection(db, "assignments"), {
      ...form, teacherId, teacherName: userData?.name || "Teacher",
      assignmentId: `assignment_${Date.now()}`, batchName: batch?.name || "",
      submissions: {}, createdAt: new Date().toISOString()
    });
    setSuccessMsg("✅ Assignment created!"); setTimeout(() => setSuccessMsg(""), 3000);
    setShowModal(false); resetForm(); refreshAssignments();
  };

  const handleEdit = (a) => {
    setEditingAssignment(a);
    setForm({
      title: a.title || "", subject: a.subject || "", batchId: a.batchId || "",
      description: a.description || "", points: a.points || 100,
      dueDate: a.dueDate || "", status: a.status || "active"
    });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (editingAssignment) {
      await updateDoc(doc(db, "assignments", editingAssignment.id), { ...form, updatedAt: new Date().toISOString() });
      setSuccessMsg("✅ Assignment updated!"); setTimeout(() => setSuccessMsg(""), 3000);
      setShowModal(false); resetForm(); refreshAssignments();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this assignment?")) return;
    await deleteDoc(doc(db, "assignments", id));
    setSuccessMsg("✅ Deleted!"); setTimeout(() => setSuccessMsg(""), 3000);
    refreshAssignments();
  };

  const refreshAssignments = async () => {
    const q = query(collection(db, "assignments"), where("teacherId", "==", teacherId));
    const snap = await getDocs(q);
    setAssignments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const sidebarItems = [
    { icon: Home, label: "Dashboard", path: "/teacher/dashboard" },
    { icon: Calendar, label: "My Classes", path: "/teacher/classes" },
    { icon: Users, label: "My Students", path: "/teacher/students" },
    { icon: BookOpen, label: "My Batches", path: "/teacher/batches" },
    { icon: ClipboardList, label: "Assignments", active: true },
    { icon: MessageCircle, label: "Doubts", path: "/teacher/doubts" },
    { icon: BarChart3, label: "Analytics", path: "/teacher/analytics" },
    { icon: Settings, label: "Settings", path: "/teacher/settings" },
  ];

  const filteredAssignments = assignments.filter(a => activeTab === "all" ? true : a.status === activeTab);

  return (
    <DashboardLayout
      title="My Assignments"
      subtitle={`${assignments.length} total`}
      sidebarItems={sidebarItems}
      userInfo={
        <div className="flex items-center gap-3">
          <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2">
            <Plus size={16} /> Create Assignment
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">{teacherAvatar}</div>
        </div>
      }
    >
      {successMsg && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, background: '#10b981', color: 'white', padding: '12px 20px', borderRadius: '12px', fontWeight: 600, fontSize: '13px', boxShadow: '0 8px 25px rgba(16,185,129,0.3)' }}>{successMsg}</div>
      )}

      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1.5 overflow-x-auto">
          {[
            { id: "all", label: "📋 All", count: assignments.length },
            { id: "active", label: "⏳ Active", count: assignments.filter(a => a.status === "active").length },
            { id: "completed", label: "✅ Completed", count: assignments.filter(a => a.status === "completed").length },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap ${activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Assignment Cards */}
        {filteredAssignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAssignments.map((a) => (
              <div key={a.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all"
                style={{ borderLeft: `4px solid ${a.status === "active" ? '#f59e0b' : '#10b981'}` }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{a.title}</h3>
                    <p className="text-sm text-gray-600">{a.subject} • {a.batchName || a.batchId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${a.status === "active" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                    {a.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <p className="text-lg font-bold text-gray-900">{Object.keys(a.submissions || {}).length || 0}</p>
                    <p className="text-xs text-gray-500">Submitted</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <p className="text-lg font-bold text-gray-900">{a.points || 0}</p>
                    <p className="text-xs text-gray-500">Points</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <p className="text-lg font-bold text-gray-900">{a.dueDate ? new Date(a.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "N/A"}</p>
                    <p className="text-xs text-gray-500">Due</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(a)} className="flex-1 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 flex items-center justify-center gap-1">
                    <Edit size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(a.id)} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-16">No assignments yet</p>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 mb-6">{editingAssignment ? "Edit Assignment" : "Create Assignment"}</h2>
            <form onSubmit={editingAssignment ? handleUpdate : handleCreate} className="space-y-4">
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label><input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                  <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" required>
                    <option value="">Select</option>
                    {(userData?.subjects || ["Mathematics","Physics","Chemistry","Biology","English"]).map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Points</label><input type="number" value={form.points} onChange={e => setForm({...form, points: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" /></div>
              </div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Batch *</label>
                <select value={form.batchId} onChange={e => setForm({...form, batchId: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" required>
                  <option value="">Select Batch</option>
                  {myBatches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Due Date *</label><input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" required /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" rows={3} /></div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold">{editingAssignment ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}