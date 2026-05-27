// ============================================
// File 4: src/app/components/teacher/AssignmentManagement.tsx
// ============================================
import { useState } from "react";
import { DashboardLayout } from "../DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import {
  Home, Calendar, Users, BookOpen, MessageCircle, BarChart3, Settings,
  ClipboardList, Search, Filter, CheckCircle, X, Send, Plus, Eye,
} from "lucide-react";

export function AssignmentManagement() {
  const { userData } = useAuth();
  const teacherAvatar = userData?.avatar || "TR";
  const [activeTab, setActiveTab] = useState("all");

  const sidebarItems = [
    { icon: Home, label: "Dashboard", path: "/teacher/dashboard" },
    { icon: Calendar, label: "My Classes", path: "/teacher/classes" },
    { icon: Users, label: "Students", path: "/teacher/students" },
    { icon: BookOpen, label: "Content", path: "/teacher/content" },
    { icon: ClipboardList, label: "Assignments", active: true },
    { icon: MessageCircle, label: "Doubts", path: "/teacher/doubts" },
    { icon: BarChart3, label: "Analytics", path: "/teacher/analytics" },
    { icon: Settings, label: "Settings", path: "/teacher/settings" },
  ];

  const assignments = [
    { id: 1, title: "Quadratic Problems Set", subject: "Mathematics", batch: "Class 10 - Engg", dueDate: "2026-03-30", submissions: 38, total: 42, graded: 30, status: "active" },
    { id: 2, title: "Motion Lab Report", subject: "Physics", batch: "Class 11 - JEE", dueDate: "2026-04-02", submissions: 25, total: 38, graded: 20, status: "active" },
    { id: 3, title: "Organic Chemistry Quiz", subject: "Chemistry", batch: "Class 12 - NEET", dueDate: "2026-03-25", submissions: 35, total: 35, graded: 35, status: "completed" },
    { id: 4, title: "Shakespeare Essay", subject: "English", batch: "Class 10 - Engg", dueDate: "2026-03-28", submissions: 40, total: 42, graded: 40, status: "completed" },
  ];

  const filteredAssignments = assignments.filter(a => activeTab === "all" ? true : a.status === activeTab);

  return (
    <DashboardLayout
      title="Assignment Management"
      subtitle={`${assignments.length} assignments`}
      sidebarItems={sidebarItems}
      userInfo={
        <div className="flex items-center gap-3">
          <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2">
            <Plus size={16} /> Create Assignment
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">{teacherAvatar}</div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1.5 overflow-x-auto">
          {[{ id: "all", label: "All" }, { id: "active", label: "Active" }, { id: "completed", label: "Completed" }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{tab.label}</button>
          ))}
        </div>

        {/* Assignment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAssignments.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{a.title}</h3>
                  <p className="text-sm text-gray-600">{a.subject} • {a.batch}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${a.status === "active" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                  {a.status === "active" ? "Active" : "Completed"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <p className="text-lg font-bold text-gray-900">{a.submissions}/{a.total}</p>
                  <p className="text-xs text-gray-500">Submitted</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <p className="text-lg font-bold text-gray-900">{a.graded}/{a.total}</p>
                  <p className="text-xs text-gray-500">Graded</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <p className="text-lg font-bold text-gray-900">{new Date(a.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                  <p className="text-xs text-gray-500">Due Date</p>
                </div>
              </div>
              <button className="w-full py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                <Eye size={14} /> View Submissions
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}