// ============================================
// NEW: teacher-portal/src/app/components/teacher/MyBatches.tsx
// ============================================
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { DashboardLayout } from "../DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { getTeacherBatches } from "../../config/firebase";
import {
  Home, Calendar, Users, BookOpen, MessageCircle, BarChart3, Settings,
  ClipboardList, Clock, Eye, GraduationCap, DollarSign, Star
} from "lucide-react";

export function MyBatches() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const teacherId = userData?.teacherId || userData?.uid || "";
  const teacherAvatar = userData?.avatar || "TR";
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBatches() {
      if (!teacherId) return;
      try {
        const data = await getTeacherBatches(teacherId);
        setBatches(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchBatches();
  }, [teacherId]);

  const sidebarItems = [
    { icon: Home, label: "Dashboard", path: "/teacher/dashboard" },
    { icon: Calendar, label: "My Classes", path: "/teacher/classes" },
    { icon: Users, label: "My Students", path: "/teacher/students" },
    { icon: BookOpen, label: "My Batches", active: true },
    { icon: ClipboardList, label: "Assignments", path: "/teacher/assignments" },
    { icon: MessageCircle, label: "Doubts", path: "/teacher/doubts" },
    { icon: BarChart3, label: "Analytics", path: "/teacher/analytics" },
    { icon: Settings, label: "Settings", path: "/teacher/settings" },
  ];

  return (
    <DashboardLayout
      title="My Batches"
      subtitle={`${batches.length} batches assigned to you`}
      sidebarItems={sidebarItems}
      userInfo={
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">{teacherAvatar}</div>
      }
    >
      <div className="space-y-6">
        {batches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {batches.map((batch) => (
              <div key={batch.id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer"
                style={{ borderLeft: '4px solid #7c3aed' }}
                onClick={() => navigate(`/teacher/batches/${batch.id}`)}>
                
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <BookOpen size={24} className="text-purple-600" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${batch.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {batch.status || 'active'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">{batch.name}</h3>
                <p className="text-sm text-purple-600 mb-3">{batch.courseName || batch.courseId}</p>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <p className="text-lg font-bold text-gray-900">{batch.students?.length || 0}</p>
                    <p className="text-xs text-gray-500">Students</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <p className="text-lg font-bold text-gray-900">{batch.maxStudents || 0}</p>
                    <p className="text-xs text-gray-500">Max Seats</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg font-medium capitalize">{batch.variant}</span>
                  {batch.schedule && <span className="flex items-center gap-1"><Clock size={12} /> Schedule set</span>}
                </div>

                <button className="w-full mt-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                  <Eye size={14} /> View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No batches assigned yet</p>
            <p className="text-sm mt-1">Contact admin to get assigned to batches</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}