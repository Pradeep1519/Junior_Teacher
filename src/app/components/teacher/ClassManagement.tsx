// ============================================
// File 1: src/app/components/teacher/ClassManagement.tsx
// ============================================
import { useState } from "react";
import { DashboardLayout } from "../DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import {
  Home, Calendar, Users, BookOpen, MessageCircle, BarChart3, Settings,
  ClipboardList, Clock, Video, Plus, Search, Filter, ChevronRight, X, CheckCircle,
  Play, Upload, User, MapPin, AlertCircle,
} from "lucide-react";

export function ClassManagement() {
  const { userData } = useAuth();
  const teacherName = userData?.name || "Teacher";
  const teacherAvatar = userData?.avatar || "TR";

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");

  const sidebarItems = [
    { icon: Home, label: "Dashboard", path: "/teacher/dashboard" },
    { icon: Calendar, label: "My Classes", active: true },
    { icon: Users, label: "Students", path: "/teacher/students" },
    { icon: BookOpen, label: "Content", path: "/teacher/content" },
    { icon: ClipboardList, label: "Assignments", path: "/teacher/assignments" },
    { icon: MessageCircle, label: "Doubts", path: "/teacher/doubts" },
    { icon: BarChart3, label: "Analytics", path: "/teacher/analytics" },
    { icon: Settings, label: "Settings", path: "/teacher/settings" },
  ];

  const classes = [
    { id: 1, subject: "Mathematics", topic: "Quadratic Equations", batch: "Class 10 - Engg", date: "2026-03-29", time: "09:00 AM", duration: "1h 15m", students: 42, status: "upcoming", meetingLink: "" },
    { id: 2, subject: "Physics", topic: "Laws of Motion", batch: "Class 11 - JEE", date: "2026-03-29", time: "11:00 AM", duration: "1h 30m", students: 38, status: "upcoming", meetingLink: "" },
    { id: 3, subject: "Mathematics", topic: "Trigonometry", batch: "Class 10 - Engg", date: "2026-03-28", time: "09:00 AM", duration: "1h", students: 42, status: "completed", recording: true, attendanceMarked: true },
    { id: 4, subject: "Chemistry", topic: "Organic Compounds", batch: "Class 12 - NEET", date: "2026-03-28", time: "02:00 PM", duration: "1h", students: 35, status: "completed", recording: false, attendanceMarked: false },
    { id: 5, subject: "Mathematics", topic: "Arithmetic Progressions", batch: "Class 10 - Engg", date: "2026-03-27", time: "09:00 AM", duration: "1h", students: 40, status: "completed", recording: true, attendanceMarked: true },
  ];

  const filteredClasses = classes.filter(c => 
    activeTab === "all" ? true : c.status === activeTab
  );

  return (
    <DashboardLayout
      title="Class Management"
      subtitle="Schedule and manage your live classes"
      sidebarItems={sidebarItems}
      userInfo={
        <div className="flex items-center gap-3">
          <button onClick={() => setShowCreateModal(true)} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2">
            <Plus size={16} /> Schedule Class
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">{teacherAvatar}</div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1.5 overflow-x-auto">
          {[
            { id: "upcoming", label: "📅 Upcoming", count: classes.filter(c => c.status === "upcoming").length },
            { id: "completed", label: "✅ Completed", count: classes.filter(c => c.status === "completed").length },
            { id: "all", label: "📋 All Classes", count: classes.length },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {tab.label} <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Classes List */}
        <div className="space-y-4">
          {filteredClasses.map((cls) => (
            <div key={cls.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg ${cls.status === "upcoming" ? "bg-gradient-to-br from-purple-500 to-indigo-600" : "bg-gradient-to-br from-green-500 to-emerald-600"}`}>
                    {cls.subject.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{cls.subject}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls.status === "upcoming" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                        {cls.status === "upcoming" ? "Upcoming" : "Completed"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{cls.topic}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(cls.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {cls.time} • {cls.duration}</span>
                      <span className="flex items-center gap-1"><Users size={14} /> {cls.students} students</span>
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">{cls.batch}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {cls.status === "upcoming" ? (
                    <>
                      <button className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-2">
                        <Play size={14} /> Start Class
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">Edit</button>
                    </>
                  ) : (
                    <>
                      {!cls.attendanceMarked && (
                        <button className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
                          <CheckCircle size={14} /> Mark Attendance
                        </button>
                      )}
                      {!cls.recording && (
                        <button className="px-4 py-2 bg-purple-500 text-white rounded-xl text-sm font-medium hover:bg-purple-600 transition-colors flex items-center gap-2">
                          <Upload size={14} /> Upload Recording
                        </button>
                      )}
                      {cls.recording && (
                        <span className="text-sm text-green-600 flex items-center gap-1"><CheckCircle size={14} /> Recording Ready</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Class Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-scaleIn" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Schedule New Class</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400">
                  <option>Mathematics</option><option>Physics</option><option>Chemistry</option><option>Biology</option><option>English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Topic</label>
                <input type="text" placeholder="Enter topic name" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                  <input type="date" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                  <input type="time" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400">
                  <option>1 Hour</option><option>1.5 Hours</option><option>2 Hours</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Batch</label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400">
                  <option>Class 10 - Engineering</option><option>Class 11 - JEE</option><option>Class 12 - NEET</option>
                </select>
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                Schedule Class
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } } .animate-scaleIn { animation: scaleIn 0.2s ease-out; }`}</style>
    </DashboardLayout>
  );
}