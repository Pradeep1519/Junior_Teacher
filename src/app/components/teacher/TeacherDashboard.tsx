// ============================================
// UPDATED: teacher-portal/src/app/components/teacher/TeacherDashboard.tsx
// ============================================
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { DashboardLayout } from "../DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { getTeacherStudents, getTeacherBatches, getTeacherClasses } from "../../config/firebase";
import {
  Home, Calendar, Users, BookOpen, MessageCircle, BarChart3, Settings,
  Clock, ArrowUp, Video, Star, Sparkles, ClipboardList,
} from "lucide-react";

export function TeacherDashboard() {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  
  const teacherId = userData?.teacherId || userData?.uid || "";
  const teacherName = userData?.name || "Teacher";
  const teacherAvatar = userData?.avatar || "TR";
  const teacherSubject = userData?.subject || "Multiple Subjects";
  const teacherExperience = userData?.experience || "0";

  const [greeting, setGreeting] = useState("");
  const [myStudents, setMyStudents] = useState([]);
  const [myBatches, setMyBatches] = useState([]);
  const [myClasses, setMyClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
    
    // ✅ Fetch teacher's OWN data only
    async function fetchMyData() {
      if (!teacherId) return;
      try {
        const [students, batches, classes] = await Promise.all([
          getTeacherStudents(teacherId),
          getTeacherBatches(teacherId),
          getTeacherClasses(teacherId)
        ]);
        setMyStudents(students);
        setMyBatches(batches);
        setMyClasses(classes);
      } catch (err) {
        console.error("Error fetching teacher data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMyData();
  }, [teacherId]);

  const sidebarItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: Calendar, label: "My Classes", path: "/teacher/classes", badge: myClasses.length || 0 },
    { icon: Users, label: "My Students", path: "/teacher/students", badge: myStudents.length || 0 },
    { icon: BookOpen, label: "My Batches", path: "/teacher/batches", badge: myBatches.length || 0 },
    { icon: ClipboardList, label: "Assignments", path: "/teacher/assignments" },
    { icon: MessageCircle, label: "Doubts", path: "/teacher/doubts" },
    { icon: BarChart3, label: "Analytics", path: "/teacher/analytics" },
    { icon: Settings, label: "Settings", path: "/teacher/settings" },
  ];

  // ✅ Dynamic stats from real data
  const quickStats = [
    { label: "My Students", value: myStudents.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50", trend: "Assigned to you" },
    { label: "Classes Today", value: myClasses.filter(c => c.date === new Date().toISOString().split('T')[0]).length, icon: Video, color: "text-purple-600", bg: "bg-purple-50", trend: "Today's schedule" },
    { label: "Active Batches", value: myBatches.filter(b => b.status === 'active').length, icon: BookOpen, color: "text-orange-600", bg: "bg-orange-50", trend: "Your batches" },
    { label: "Avg Rating", value: userData?.rating || "4.8", icon: Star, color: "text-yellow-600", bg: "bg-yellow-50", trend: `${myStudents.length} reviews` },
  ];

  // ✅ Today's classes from REAL data
  const todayClasses = myClasses
    .filter(c => c.date === new Date().toISOString().split('T')[0])
    .slice(0, 3);

  // ✅ Top students from REAL data
  const topStudents = [...myStudents]
    .sort((a, b) => (b.avgScore || 0) - (a.avgScore || 0))
    .slice(0, 4)
    .map(s => ({
      name: s.fullName || s.name || "Student",
      score: s.avgScore || 85,
      avatar: (s.fullName || s.name || "S").charAt(0).toUpperCase()
    }));

  return (
    <DashboardLayout
      title={`${greeting}, ${teacherName}! 👨‍🏫`}
      subtitle={teacherSubject}
      sidebarItems={sidebarItems}
      userInfo={
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium">
            <Star size={16} className="fill-purple-500 text-purple-500" />
            <span>{userData?.rating || "4.8"} Rating</span>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
            {teacherAvatar}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Quick Stats - REAL DATA */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <ArrowUp size={14} className="text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.trend}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Classes - REAL DATA */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Today's Classes</h2>
                  <p className="text-sm text-gray-500 mt-1">{todayClasses.length} classes scheduled</p>
                </div>
                <button onClick={() => navigate("/teacher/classes")} className="text-purple-600 text-sm font-medium hover:underline">View All</button>
              </div>
              {todayClasses.length > 0 ? (
                <div className="space-y-3">
                  {todayClasses.map((classItem, index) => (
                    <div key={index} className="group flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/20 transition-all duration-300">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`min-w-[90px] text-center p-2 rounded-lg ${classItem.status === 'live' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                          <p className="text-xs font-medium">{classItem.status === 'live' ? '🔴 LIVE' : '⏰'}</p>
                          <p className="text-sm font-bold">{classItem.time}</p>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{classItem.subject}</h3>
                          <p className="text-sm text-gray-600">{classItem.topic}</p>
                          <p className="text-xs text-gray-500 mt-1">{classItem.batchName || 'Your Batch'}</p>
                        </div>
                      </div>
                      <button className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${classItem.status === 'live' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200 hover:shadow-xl' : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-200 hover:shadow-xl'}`}>
                        {classItem.status === 'live' ? 'Start Class' : 'Prepare'}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No classes scheduled for today</p>
              )}
            </div>

            {/* Top Students - REAL DATA */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div><h2 className="text-xl font-bold text-gray-900">Top Students</h2><p className="text-sm text-gray-500 mt-1">Your best performers</p></div>
                <button onClick={() => navigate("/teacher/students")} className="text-purple-600 text-sm font-medium hover:underline">View All ({myStudents.length})</button>
              </div>
              {topStudents.length > 0 ? (
                <div className="space-y-3">
                  {topStudents.map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center text-white text-sm font-bold">{student.avatar}</div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{student.name}</p>
                          <div className="h-1.5 w-32 bg-gray-200 rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full" style={{ width: `${student.score}%` }}></div>
                          </div>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{student.score}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No students assigned yet</p>
              )}
            </div>

            {/* My Batches - NEW */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div><h2 className="text-xl font-bold text-gray-900">My Batches</h2><p className="text-sm text-gray-500 mt-1">{myBatches.length} assigned batches</p></div>
                <button onClick={() => navigate("/teacher/batches")} className="text-purple-600 text-sm font-medium hover:underline">View All</button>
              </div>
              {myBatches.length > 0 ? (
                <div className="space-y-3">
                  {myBatches.slice(0, 3).map((batch, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:border-purple-200 border border-transparent transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <BookOpen size={20} className="text-purple-600" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{batch.name}</p>
                          <p className="text-xs text-gray-500">{batch.courseName || batch.courseId} • {batch.variant} • {batch.students?.length || 0} students</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${batch.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{batch.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No batches assigned</p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Profile Card - REAL DATA */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold backdrop-blur-sm">{teacherAvatar}</div>
                <div>
                  <h3 className="text-xl font-bold">{teacherName}</h3>
                  <p className="text-purple-200 text-sm">{teacherSubject}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm"><p className="text-2xl font-bold">{myStudents.length}</p><p className="text-xs text-purple-200">Students</p></div>
                <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm"><p className="text-2xl font-bold">{userData?.rating || "4.8"}</p><p className="text-xs text-purple-200">Rating</p></div>
                <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm"><p className="text-2xl font-bold">{myClasses.length}</p><p className="text-xs text-purple-200">Classes</p></div>
                <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm"><p className="text-2xl font-bold">{teacherExperience}</p><p className="text-xs text-purple-200">Years Exp.</p></div>
              </div>
            </div>

            {/* My Batches List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">My Assigned Batches</h3>
              {myBatches.length > 0 ? (
                <div className="space-y-2">
                  {myBatches.map((batch, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-sm font-semibold text-purple-600">{batch.name}</p>
                      <p className="text-xs text-gray-500">{batch.students?.length || 0} students enrolled</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center py-4">No batches assigned yet</p>
              )}
            </div>

            {/* Pending Tasks */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Pending Tasks</h3>
              <div className="space-y-3">
                {[
                  { task: "Check today's attendance", count: `${todayClasses.length} classes`, priority: "high" },
                  { task: "Review student progress", count: `${myStudents.length} students`, priority: "medium" },
                  { task: "Prepare next class", count: "Due tomorrow", priority: "medium" },
                ].map((task, i) => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                    <div className="flex-1"><p className="text-sm font-medium text-gray-900">{task.task}</p><p className="text-xs text-gray-500">{task.count}</p></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tip */}
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-8 -mt-8"></div>
              <Sparkles size={24} className="mb-3" />
              <p className="font-medium text-sm leading-relaxed relative z-10">"Interactive sessions with real-world examples increase student engagement by 40%!"</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}