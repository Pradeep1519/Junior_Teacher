// ============================================
// UPDATED: teacher-portal/src/app/components/teacher/DoubtResolution.tsx
// ============================================
import { useState, useEffect } from "react";
import { DashboardLayout } from "../DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { getTeacherBatches } from "../../../config/firebase";
import { db } from "../../config/firebase";
import { collection, addDoc, getDocs, query, where, updateDoc, doc, orderBy } from "firebase/firestore";
import {
  Home, Calendar, Users, BookOpen, MessageCircle, BarChart3, Settings,
  Search, CheckCircle, X, Send, ClipboardList, Clock
} from "lucide-react";

export function DoubtResolution() {
  const { userData } = useAuth();
  const teacherId = userData?.teacherId || userData?.uid || "";
  const teacherAvatar = userData?.avatar || "TR";
  const [doubts, setDoubts] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [activeDoubt, setActiveDoubt] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoubts() {
      if (!teacherId) return;
      try {
        const q = query(collection(db, "doubts"), where("teacherId", "==", teacherId));
        const snap = await getDocs(q);
        setDoubts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchDoubts();
  }, [teacherId]);

  const refreshDoubts = async () => {
    const q = query(collection(db, "doubts"), where("teacherId", "==", teacherId));
    const snap = await getDocs(q);
    setDoubts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !activeDoubt) return;
    
    const newReply = {
      teacherId, teacherName: userData?.name || "Teacher",
      message: replyText, timestamp: new Date().toISOString()
    };
    
    await updateDoc(doc(db, "doubts", activeDoubt.id), {
      replies: [...(activeDoubt.replies || []), newReply],
      status: "resolved"
    });
    
    setSuccessMsg("✅ Reply sent!"); setTimeout(() => setSuccessMsg(""), 3000);
    setActiveDoubt(null); setReplyText(""); refreshDoubts();
  };

  const handleResolve = async (doubt) => {
    await updateDoc(doc(db, "doubts", doubt.id), { status: "resolved" });
    setSuccessMsg("✅ Doubt resolved!"); setTimeout(() => setSuccessMsg(""), 3000);
    refreshDoubts();
  };

  const sidebarItems = [
    { icon: Home, label: "Dashboard", path: "/teacher/dashboard" },
    { icon: Calendar, label: "My Classes", path: "/teacher/classes" },
    { icon: Users, label: "My Students", path: "/teacher/students" },
    { icon: BookOpen, label: "Content", path: "/teacher/content" },
    { icon: ClipboardList, label: "Assignments", path: "/teacher/assignments" },
    { icon: MessageCircle, label: "Doubts", active: true },
    { icon: BarChart3, label: "Analytics", path: "/teacher/analytics" },
    { icon: Settings, label: "Settings", path: "/teacher/settings" },
  ];

  const filteredDoubts = doubts.filter(d => {
    if (filterStatus === "pending") return d.status === "pending";
    if (filterStatus === "resolved") return d.status === "resolved";
    return true;
  }).filter(d => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (d.studentName || "").toLowerCase().includes(q) || (d.subject || "").toLowerCase().includes(q) || (d.question || "").toLowerCase().includes(q);
  });

  const pendingCount = doubts.filter(d => d.status === "pending").length;

  return (
    <DashboardLayout
      title="Doubt Resolution"
      subtitle={`${pendingCount} pending doubts`}
      sidebarItems={sidebarItems}
      userInfo={
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">{teacherAvatar}</div>
      }
    >
      {successMsg && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, background: '#10b981', color: 'white', padding: '12px 20px', borderRadius: '12px', fontWeight: 600, fontSize: '13px', boxShadow: '0 8px 25px rgba(16,185,129,0.3)' }}>{successMsg}</div>
      )}

      <div className="space-y-4">
        {/* Search + Filter */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search doubts..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-purple-400 transition-all" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-700">
            <option value="all">📋 All ({doubts.length})</option>
            <option value="pending">⏳ Pending ({pendingCount})</option>
            <option value="resolved">✅ Resolved ({doubts.length - pendingCount})</option>
          </select>
        </div>

        {/* Doubts List */}
        {filteredDoubts.length > 0 ? (
          <div className="space-y-3">
            {filteredDoubts.map((doubt) => (
              <div key={doubt.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all"
                style={{ borderLeft: `4px solid ${doubt.status === "pending" ? '#ef4444' : '#10b981'}` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 text-sm font-bold">
                      {(doubt.studentName || "S").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{doubt.studentName || "Student"}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${doubt.status === "pending" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{doubt.status}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{doubt.question}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-purple-600 font-medium">{doubt.subject}</span>
                        {doubt.createdAt && (
                          <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} /> {new Date(doubt.createdAt).toLocaleDateString()}</span>
                        )}
                        {doubt.replies?.length > 0 && <span className="text-xs text-gray-400">{doubt.replies.length} replies</span>}
                      </div>
                    </div>
                  </div>
                </div>
                {doubt.replies?.length > 0 && (
                  <div className="mb-3 pl-12">
                    {doubt.replies.slice(-1).map((reply, i) => (
                      <div key={i} className="p-3 bg-green-50 rounded-xl text-sm text-gray-700">
                        <p className="font-medium text-green-700 text-xs mb-1">{reply.teacherName}:</p>
                        <p>{reply.message}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button onClick={() => setActiveDoubt(doubt)} className="flex-1 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700">Reply</button>
                  {doubt.status === "pending" && (
                    <button onClick={() => handleResolve(doubt)} className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-medium hover:bg-green-200 flex items-center gap-1">
                      <CheckCircle size={14} /> Resolve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-16">No doubts found</p>
        )}
      </div>

      {/* Reply Modal */}
      {activeDoubt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setActiveDoubt(null)}>
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-sm">
                  {(activeDoubt.studentName || "S").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{activeDoubt.studentName || "Student"}</h3>
                  <p className="text-sm text-gray-500">{activeDoubt.subject}</p>
                </div>
              </div>
              <button onClick={() => setActiveDoubt(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl mb-4">
              <p className="text-sm text-gray-700">{activeDoubt.question}</p>
            </div>
            {/* Previous replies */}
            {activeDoubt.replies?.length > 0 && (
              <div className="mb-4 space-y-2">
                {activeDoubt.replies.map((reply, i) => (
                  <div key={i} className="p-3 bg-green-50 rounded-xl text-sm">
                    <p className="font-medium text-green-700 text-xs mb-1">{reply.teacherName}:</p>
                    <p className="text-gray-700">{reply.message}</p>
                  </div>
                ))}
              </div>
            )}
            <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type your reply..."
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm min-h-[100px] focus:outline-none focus:border-purple-400 mb-4" />
            <button onClick={handleSendReply} disabled={!replyText.trim()} className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50">
              <Send size={16} /> Send Reply
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}