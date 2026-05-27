// ============================================
// File 5: src/app/components/teacher/DoubtResolution.tsx
// ============================================
import { useState } from "react";
import { DashboardLayout } from "../DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import {
  Home, Calendar, Users, BookOpen, MessageCircle, BarChart3, Settings,
  Search, Filter, CheckCircle, X, Send,ClipboardList,
} from "lucide-react";

export function DoubtResolution() {
  const { userData } = useAuth();
  const teacherAvatar = userData?.avatar || "TR";
  const [replyText, setReplyText] = useState("");
  const [activeDoubt, setActiveDoubt] = useState<any>(null);

  const sidebarItems = [
    { icon: Home, label: "Dashboard", path: "/teacher/dashboard" },
    { icon: Calendar, label: "My Classes", path: "/teacher/classes" },
    { icon: Users, label: "Students", path: "/teacher/students" },
    { icon: BookOpen, label: "Content", path: "/teacher/content" },
    { icon: ClipboardList, label: "Assignments", path: "/teacher/assignments" },
    { icon: MessageCircle, label: "Doubts", active: true },
    { icon: BarChart3, label: "Analytics", path: "/teacher/analytics" },
    { icon: Settings, label: "Settings", path: "/teacher/settings" },
  ];

  const doubts = [
    { id: 1, student: "Rahul Kumar", subject: "Mathematics", question: "I'm confused about the discriminant method in quadratic equations. When do we use b²-4ac?", time: "10 min ago", status: "pending", replies: 0 },
    { id: 2, student: "Priya Singh", subject: "Physics", question: "Can you explain Newton's third law with a real-life example?", time: "1 hour ago", status: "pending", replies: 0 },
    { id: 3, student: "Amit Verma", subject: "Mathematics", question: "How to prove trigonometric identities easily?", time: "3 hours ago", status: "pending", replies: 0 },
    { id: 4, student: "Neha Gupta", subject: "Chemistry", question: "What's the difference between ionic and covalent bonds?", time: "Yesterday", status: "resolved", replies: 2 },
    { id: 5, student: "Sanya Kapoor", subject: "Physics", question: "How to solve numericals on work-energy theorem?", time: "2 days ago", status: "resolved", replies: 1 },
  ];

  return (
    <DashboardLayout
      title="Doubt Resolution"
      subtitle={`${doubts.filter(d => d.status === "pending").length} pending doubts`}
      sidebarItems={sidebarItems}
      userInfo={
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">{teacherAvatar}</div>
      }
    >
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search doubts by student, subject..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-purple-400 transition-all" />
        </div>

        {/* Doubts List */}
        <div className="space-y-3">
          {doubts.map((doubt) => (
            <div key={doubt.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 text-sm font-bold">
                    {doubt.student.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{doubt.student}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${doubt.status === "pending" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                        {doubt.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{doubt.question}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-purple-600 font-medium">{doubt.subject}</span>
                      <span className="text-xs text-gray-400">{doubt.time}</span>
                      {doubt.replies > 0 && <span className="text-xs text-gray-400">{doubt.replies} replies</span>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button onClick={() => setActiveDoubt(doubt)} className="flex-1 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors">Reply</button>
                {doubt.status === "pending" && (
                  <button className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-medium hover:bg-green-200 transition-colors flex items-center gap-1">
                    <CheckCircle size={14} /> Resolve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reply Modal */}
      {activeDoubt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setActiveDoubt(null)}>
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scaleIn" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-sm">
                  {activeDoubt.student.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{activeDoubt.student}</h3>
                  <p className="text-sm text-gray-500">{activeDoubt.subject}</p>
                </div>
              </div>
              <button onClick={() => setActiveDoubt(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl mb-4">
              <p className="text-sm text-gray-700">{activeDoubt.question}</p>
            </div>
            <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type your reply..."
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm min-h-[100px] focus:outline-none focus:border-purple-400 mb-4" />
            <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">
              <Send size={16} /> Send Reply
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } } .animate-scaleIn { animation: scaleIn 0.2s ease-out; }`}</style>
    </DashboardLayout>
  );
}