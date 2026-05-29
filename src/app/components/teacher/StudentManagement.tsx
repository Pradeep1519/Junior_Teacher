// ============================================
// UPDATED: teacher-portal/src/app/components/teacher/StudentManagement.tsx
// ============================================
import { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { getTeacherStudents } from "../../config/firebase";
import {
  Home, Calendar, Users, BookOpen, MessageCircle, BarChart3, Settings,
  ClipboardList, Search, Mail, Phone, Eye, GraduationCap, MapPin
} from "lucide-react";

export function StudentManagement() {
  const { userData } = useAuth();
  const teacherId = userData?.teacherId || userData?.uid || "";
  const teacherAvatar = userData?.avatar || "TR";
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      if (!teacherId) return;
      try {
        const data = await getTeacherStudents(teacherId);
        setStudents(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchStudents();
  }, [teacherId]);

  const filteredStudents = students.filter(s =>
    (s.fullName || s.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.class || "").includes(searchQuery) ||
    (s.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeStudents = students.filter(s => s.status === "active").length;
  const avgAttendance = students.length > 0 ? Math.round(students.reduce((sum, s) => sum + (s.attendance || 0), 0) / students.length) : 0;
  const avgScore = students.length > 0 ? Math.round(students.reduce((sum, s) => sum + (s.avgScore || 0), 0) / students.length) : 0;

  const sidebarItems = [
    { icon: Home, label: "Dashboard", path: "/teacher/dashboard" },
    { icon: Calendar, label: "My Classes", path: "/teacher/classes" },
    { icon: Users, label: "My Students", active: true },
    { icon: BookOpen, label: "My Batches", path: "/teacher/batches" },
    { icon: ClipboardList, label: "Assignments", path: "/teacher/assignments" },
    { icon: MessageCircle, label: "Doubts", path: "/teacher/doubts" },
    { icon: BarChart3, label: "Analytics", path: "/teacher/analytics" },
    { icon: Settings, label: "Settings", path: "/teacher/settings" },
  ];

  return (
    <DashboardLayout
      title="My Students"
      subtitle={`${students.length} students assigned to you`}
      sidebarItems={sidebarItems}
      userInfo={
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">{teacherAvatar}</div>
      }
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search your students..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-purple-400 transition-all" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "My Students", value: students.length, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Active", value: activeStudents, color: "text-green-600", bg: "bg-green-50" },
            { label: "Avg Attendance", value: `${avgAttendance}%`, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Avg Score", value: `${avgScore}%`, color: "text-orange-600", bg: "bg-orange-50" },
          ].map((stat, i) => (
            <div key={i} className={`${stat.bg} rounded-2xl p-4 text-center`}>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Student Cards */}
        {filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student) => (
              <div key={student.studentId} onClick={() => setSelectedStudent(student)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer group"
                style={{ borderLeft: '4px solid #7c3aed' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                      {(student.fullName || student.name || "S").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{student.fullName || student.name}</h3>
                      <p className="text-sm text-gray-500">{student.class || "N/A"} • {student.enrolledBatchName || "N/A"}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${student.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {student.paymentStatus === "paid" ? "Paid" : "Pending"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <p className="text-lg font-bold text-gray-900">{student.attendance || 0}%</p>
                    <p className="text-xs text-gray-500">Attendance</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <p className="text-lg font-bold text-gray-900">{student.avgScore || 0}%</p>
                    <p className="text-xs text-gray-500">Avg Score</p>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-sm font-medium hover:bg-purple-100 transition-colors flex items-center justify-center gap-1">
                  <Eye size={14} /> View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <GraduationCap size={48} className="mx-auto mb-4 opacity-50" />
            <p>No students assigned to you yet</p>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedStudent(null)}>
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3">
                {(selectedStudent.fullName || selectedStudent.name || "S").charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{selectedStudent.fullName || selectedStudent.name}</h2>
              <p className="text-gray-500">{selectedStudent.class || "N/A"} • {selectedStudent.enrolledBatchName || "N/A"}</p>
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
              {selectedStudent.school && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600 flex items-center gap-2"><MapPin size={14} /> School</span>
                  <span className="font-medium text-gray-900 text-sm">{selectedStudent.school}</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-xl text-center">
                  <p className="text-xl font-bold text-blue-700">{selectedStudent.attendance || 0}%</p>
                  <p className="text-xs text-gray-600">Attendance</p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl text-center">
                  <p className="text-xl font-bold text-green-700">{selectedStudent.avgScore || 0}%</p>
                  <p className="text-xs text-gray-600">Avg Score</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}