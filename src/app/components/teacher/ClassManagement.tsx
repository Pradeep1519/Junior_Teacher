// ============================================
// FINAL: teacher-portal/src/app/components/teacher/ClassManagement.tsx
// Fixed import paths for AuthContext
// ============================================
import { useState, useEffect } from "react";
import { DashboardLayout } from "../DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { getTeacherClasses, getTeacherBatches } from "../../config/firebase";
import { db } from "../../config/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import {
  Home, Calendar, Users, BookOpen, MessageCircle, BarChart3, Settings,
  ClipboardList, Clock, Plus, X, CheckCircle, Edit, Trash2
} from "lucide-react";

export function ClassManagement() {
  const { userData } = useAuth();
  const teacherId = userData?.teacherId || userData?.uid || "";
  const teacherName = userData?.name || "Teacher";
  const teacherAvatar = userData?.avatar || "TR";

  const [classes, setClasses] = useState([]);
  const [myBatches, setMyBatches] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({
    topic: "", subject: "", batchId: "", date: "", time: "", duration: "1 hour", status: "upcoming"
  });

  useEffect(() => {
    async function fetchData() {
      if (!teacherId) return;
      try {
        const [teacherClasses, batches] = await Promise.all([
          getTeacherClasses(teacherId),
          getTeacherBatches(teacherId)
        ]);
        setClasses(teacherClasses);
        setMyBatches(batches);
      } catch (err) { console.error(err); }
    }
    fetchData();
  }, [teacherId]);

  const resetForm = () => {
    setForm({ topic: "", subject: "", batchId: "", date: "", time: "", duration: "1 hour", status: "upcoming" });
    setEditingClass(null);
  };

  const refreshClasses = async () => {
    const updated = await getTeacherClasses(teacherId);
    setClasses(updated);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const batch = myBatches.find(b => b.id === form.batchId);
    await addDoc(collection(db, "classes"), {
      ...form, teacherId, teacherName,
      batchName: batch?.name || "", classId: `class_${Date.now()}`,
      createdAt: new Date().toISOString()
    });
    setSuccessMsg("✅ Class scheduled!"); setTimeout(() => setSuccessMsg(""), 3000);
    setShowCreateModal(false); resetForm(); refreshClasses();
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setForm({
      topic: cls.topic || "", subject: cls.subject || "", batchId: cls.batchId || "",
      date: cls.date || "", time: cls.time || "", duration: cls.duration || "1 hour",
      status: cls.status || "upcoming"
    });
    setShowCreateModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (editingClass) {
      await updateDoc(doc(db, "classes", editingClass.id), { ...form, updatedAt: new Date().toISOString() });
      setSuccessMsg("✅ Class updated!"); setTimeout(() => setSuccessMsg(""), 3000);
      setShowCreateModal(false); resetForm(); refreshClasses();
    }
  };

  const handleDelete = async (classId) => {
    if (!confirm("Delete this class?")) return;
    await deleteDoc(doc(db, "classes", classId));
    setSuccessMsg("✅ Class deleted!"); setTimeout(() => setSuccessMsg(""), 3000);
    refreshClasses();
  };

  const handleToggleStatus = async (cls) => {
    const newStatus = cls.status === "completed" ? "upcoming" : "completed";
    await updateDoc(doc(db, "classes", cls.id), { status: newStatus });
    refreshClasses();
  };

  const sidebarItems = [
    { icon: Home, label: "Dashboard", path: "/teacher/dashboard" },
    { icon: Calendar, label: "My Classes", active: true },
    { icon: Users, label: "My Students", path: "/teacher/students" },
    { icon: BookOpen, label: "My Batches", path: "/teacher/batches" },
    { icon: ClipboardList, label: "Assignments", path: "/teacher/assignments" },
    { icon: MessageCircle, label: "Doubts", path: "/teacher/doubts" },
    { icon: BarChart3, label: "Analytics", path: "/teacher/analytics" },
    { icon: Settings, label: "Settings", path: "/teacher/settings" },
  ];

  const filteredClasses = classes.filter(c => activeTab === "all" ? true : c.status === activeTab);

  return (
    <DashboardLayout
      title="My Classes"
      subtitle={`${classes.length} total classes`}
      sidebarItems={sidebarItems}
      userInfo={
        <div className="flex items-center gap-3">
          <button onClick={() => { resetForm(); setShowCreateModal(true); }} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2">
            <Plus size={16} /> Schedule Class
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">{teacherAvatar}</div>
        </div>
      }
    >
      {successMsg && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, background: '#10b981', color: 'white', padding: '12px 20px', borderRadius: '12px', fontWeight: 600, fontSize: '13px', boxShadow: '0 8px 25px rgba(16,185,129,0.3)' }}>{successMsg}</div>
      )}

      <div className="space-y-6">
        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1.5 overflow-x-auto">
          {[
            { id: "upcoming", label: "⏰ Upcoming", count: classes.filter(c => c.status === "upcoming").length },
            { id: "completed", label: "✅ Completed", count: classes.filter(c => c.status === "completed").length },
            { id: "all", label: "📋 All", count: classes.length },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap ${activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {tab.label} <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">{tab.count}</span>
            </button>
          ))}
        </div>

        {filteredClasses.length > 0 ? (
          <div className="space-y-4">
            {filteredClasses.map((cls) => (
              <div key={cls.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all"
                style={{ borderLeft: `4px solid ${cls.status === "upcoming" ? '#3b82f6' : '#10b981'}` }}>
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg ${cls.status === "upcoming" ? "bg-gradient-to-br from-purple-500 to-indigo-600" : "bg-gradient-to-br from-green-500 to-emerald-600"}`}>
                      {cls.subject?.charAt(0) || "C"}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">{cls.subject}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls.status === "upcoming" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>{cls.status}</span>
                      </div>
                      <p className="text-sm text-gray-600">{cls.topic}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 flex-wrap">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {cls.date}</span>
                        <span className="flex items-center gap-1"><Clock size={14} /> {cls.time} • {cls.duration}</span>
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">{cls.batchName || "Batch"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {cls.status === "upcoming" && (
                      <button onClick={() => handleToggleStatus(cls)} className="px-3 py-2 bg-green-500 text-white rounded-xl text-xs font-medium hover:bg-green-600 flex items-center gap-1">
                        <CheckCircle size={14} /> Complete
                      </button>
                    )}
                    <button onClick={() => handleEdit(cls)} className="p-2 hover:bg-gray-100 rounded-xl"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(cls.id)} className="p-2 hover:bg-red-50 rounded-xl text-red-500"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-12">No classes found</p>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setShowCreateModal(false); resetForm(); }}>
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{editingClass ? "Edit Class" : "Schedule New Class"}</h2>
              <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
            </div>
            <form onSubmit={editingClass ? handleUpdate : handleCreate} className="space-y-4">
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" required>
                  <option value="">Select</option>
                  {userData?.subjects?.map(s => <option key={s}>{s}</option>)}
                  {(!userData?.subjects || userData.subjects.length === 0) && (
                    <><option>Mathematics</option><option>Physics</option><option>Chemistry</option><option>Biology</option><option>English</option></>
                  )}
                </select>
              </div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Topic</label>
                <input type="text" value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" required />
                </div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                  <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
                  <select value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                    <option>30 min</option><option>1 hour</option><option>1.5 hours</option><option>2 hours</option>
                  </select>
                </div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Batch</label>
                  <select value={form.batchId} onChange={e => setForm({...form, batchId: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" required>
                    <option value="">Select</option>
                    {myBatches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                {editingClass ? "Update Class" : "Schedule Class"}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}