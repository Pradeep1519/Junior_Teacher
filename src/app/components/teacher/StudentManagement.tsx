// ============================================
// File 2: src/app/components/teacher/StudentManagement.tsx
// ============================================
import { useState } from "react";
import { DashboardLayout } from "../DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import {
  Home, Calendar, Users, BookOpen, MessageCircle, BarChart3, Settings,
  ClipboardList, Search, Filter, Star, TrendingUp, Eye, ChevronRight, Mail, Phone,
} from "lucide-react";

export function StudentManagement() {
  const { userData } = useAuth();
  const teacherAvatar = userData?.avatar || "TR";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const sidebarItems = [
    { icon: Home, label: "Dashboard", path: "/teacher/dashboard" },
    { icon: Calendar, label: "My Classes", path: "/teacher/classes" },
    { icon: Users, label: "Students", active: true },
    { icon: BookOpen, label: "Content", path: "/teacher/content" },
    { icon: ClipboardList, label: "Assignments", path: "/teacher/assignments" },
    { icon: MessageCircle, label: "Doubts", path: "/teacher/doubts" },
    { icon: BarChart3, label: "Analytics", path: "/teacher/analytics" },
    { icon: Settings, label: "Settings", path: "/teacher/settings" },
  ];

  const students = [
    { id: 1, name: "Aarav Sharma", avatar: "AS", class: "Class 10", program: "Engineering Excellence", attendance: 95, avgScore: 92, email: "aarav@email.com", phone: "+91 9876543210", status: "active" },
    { id: 2, name: "Priya Patel", avatar: "PP", class: "Class 10", program: "Engineering Excellence", attendance: 98, avgScore: 90, email: "priya@email.com", status: "active" },
    { id: 3, name: "Rohan Gupta", avatar: "RG", class: "Class 11", program: "JEE Advanced", attendance: 88, avgScore: 85, email: "rohan@email.com", status: "active" },
    { id: 4, name: "Ananya Singh", avatar: "AN", class: "Class 10", program: "Engineering Excellence", attendance: 92, avgScore: 86, email: "ananya@email.com", status: "inactive" },
    { id: 5, name: "Arjun Nair", avatar: "AR", class: "Class 12", program: "NEET", attendance: 90, avgScore: 88, email: "arjun@email.com", status: "active" },
    { id: 6, name: "Sanya Kapoor", avatar: "SK", class: "Class 11", program: "JEE Advanced", attendance: 85, avgScore: 78, email: "sanya@email.com", status: "active" },
  ];

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.class.includes(searchQuery) ||
    s.program.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Student Management"
      subtitle={`${students.length} total students`}
      sidebarItems={sidebarItems}
      userInfo={
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">{teacherAvatar}</div>
      }
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search students by name, class..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-purple-400 transition-all" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Students", value: "156", color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Active", value: "142", color: "text-green-600", bg: "bg-green-50" },
            { label: "Avg Attendance", value: "92%", color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Avg Score", value: "87%", color: "text-orange-600", bg: "bg-orange-50" },
          ].map((stat, i) => (
            <div key={i} className={`${stat.bg} rounded-2xl p-4 text-center`}>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Student Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <div key={student.id} onClick={() => setSelectedStudent(student)}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg">{student.avatar}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{student.name}</h3>
                    <p className="text-sm text-gray-500">{student.class} • {student.program}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${student.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {student.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <p className="text-lg font-bold text-gray-900">{student.attendance}%</p>
                  <p className="text-xs text-gray-500">Attendance</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <p className="text-lg font-bold text-gray-900">{student.avgScore}%</p>
                  <p className="text-xs text-gray-500">Avg Score</p>
                </div>
              </div>
              <button className="w-full mt-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-sm font-medium hover:bg-purple-100 transition-colors flex items-center justify-center gap-1">
                <Eye size={14} /> View Profile
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedStudent(null)}>
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scaleIn" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3">{selectedStudent.avatar}</div>
              <h2 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h2>
              <p className="text-gray-500">{selectedStudent.class} • {selectedStudent.program}</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-600 flex items-center gap-2"><Mail size={14} /> Email</span>
                <span className="font-medium text-gray-900 text-sm">{selectedStudent.email}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-600 flex items-center gap-2"><Phone size={14} /> Phone</span>
                <span className="font-medium text-gray-900 text-sm">{selectedStudent.phone}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-xl text-center">
                  <p className="text-xl font-bold text-blue-700">{selectedStudent.attendance}%</p>
                  <p className="text-xs text-gray-600">Attendance</p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl text-center">
                  <p className="text-xl font-bold text-green-700">{selectedStudent.avgScore}%</p>
                  <p className="text-xs text-gray-600">Avg Score</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } } .animate-scaleIn { animation: scaleIn 0.2s ease-out; }`}</style>
    </DashboardLayout>
  );
}