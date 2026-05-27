// ============================================
// File 8: teacher-portal/src/app/components/teacher/TeacherDashboard.tsx
// ============================================
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { DashboardLayout } from "../DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import {
  Home, Calendar, Users, BookOpen, MessageCircle, BarChart3, Settings,
  Clock, ArrowUp, Video, Star, Sparkles, ClipboardList,
} from "lucide-react";

export function TeacherDashboard() {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  
  const teacherName = userData?.name || "Teacher";
  const teacherAvatar = userData?.avatar || "TR";
  const teacherSubject = userData?.subject || "Multiple Subjects";

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const sidebarItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: Calendar, label: "My Classes", path: "/teacher/classes", badge: 3 },
    { icon: Users, label: "Students", path: "/teacher/students" },
    { icon: BookOpen, label: "Content", path: "/teacher/content" },
    { icon: ClipboardList, label: "Assignments", path: "/teacher/assignments", badge: 8 },
    { icon: MessageCircle, label: "Doubts", path: "/teacher/doubts", badge: 5 },
    { icon: BarChart3, label: "Analytics", path: "/teacher/analytics" },
    { icon: Settings, label: "Settings", path: "/teacher/settings" },
  ];

  const todayClasses = [
    { time: "09:00 AM", subject: "Mathematics", topic: "Quadratic Equations", students: 42, status: "live", batch: "Class 10 - Engg" },
    { time: "11:00 AM", subject: "Physics", topic: "Laws of Motion", students: 38, status: "upcoming", batch: "Class 11 - JEE" },
    { time: "02:00 PM", subject: "Mathematics", topic: "Trigonometry Basics", students: 35, status: "upcoming", batch: "Class 10 - Engg" },
  ];

  const quickStats = [
    { label: "Total Students", value: "156", icon: Users, color: "text-blue-600", bg: "bg-blue-50", trend: "+12 this month" },
    { label: "Classes Today", value: "3", icon: Video, color: "text-purple-600", bg: "bg-purple-50", trend: "2 remaining" },
    { label: "Pending Grading", value: "8", icon: ClipboardList, color: "text-orange-600", bg: "bg-orange-50", trend: "Due this week" },
    { label: "Avg Rating", value: "4.8", icon: Star, color: "text-yellow-600", bg: "bg-yellow-50", trend: "156 reviews" },
  ];

  const recentDoubts = [
    { student: "Rahul Kumar", question: "Quadratic equation discriminant doubt", time: "10 min ago", subject: "Mathematics" },
    { student: "Priya Singh", question: "Newton's third law application", time: "1 hour ago", subject: "Physics" },
    { student: "Amit Verma", question: "Trigonometry identity proof", time: "3 hours ago", subject: "Mathematics" },
  ];

  const topStudents = [
    { name: "Aarav Sharma", score: 92, avatar: "AS" },
    { name: "Priya Patel", score: 90, avatar: "PP" },
    { name: "Rohan Gupta", score: 88, avatar: "RG" },
    { name: "Ananya Singh", score: 86, avatar: "AN" },
  ];

  return (
    <DashboardLayout
      title={`${greeting}, ${teacherName}! 👨‍🏫`}
      subtitle={teacherSubject}
      sidebarItems={sidebarItems}
      userInfo={
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium">
            <Star size={16} className="fill-purple-500 text-purple-500" />
            <span>4.8 Rating</span>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
            {teacherAvatar}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Quick Stats */}
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
          {/* Left - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Classes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Today's Classes</h2>
                  <p className="text-sm text-gray-500 mt-1">3 classes scheduled</p>
                </div>
                <button onClick={() => navigate("/teacher/classes")} className="text-purple-600 text-sm font-medium hover:underline">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {todayClasses.map((classItem, index) => (
                  <div key={index} className="group flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/20 transition-all duration-300">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`min-w-[90px] text-center p-2 rounded-lg ${classItem.status === 'live' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                        <p className="text-xs font-medium">{classItem.status === 'live' ? '🔴 LIVE' : '⏰'}</p>
                        <p className="text-sm font-bold">{classItem.time}</p>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">{classItem.subject}</h3>
                          {classItem.status === 'live' && (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{classItem.topic}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500">{classItem.batch}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-400">{classItem.students} students</span>
                        </div>
                      </div>
                    </div>
                    <button className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${classItem.status === 'live' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200 hover:shadow-xl' : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-200 hover:shadow-xl'}`}>
                      {classItem.status === 'live' ? 'Start Class' : 'Prepare'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Students */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div><h2 className="text-xl font-bold text-gray-900">Top Students</h2><p className="text-sm text-gray-500 mt-1">Based on recent performance</p></div>
                <button onClick={() => navigate("/teacher/students")} className="text-purple-600 text-sm font-medium hover:underline">View All</button>
              </div>
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
            </div>

            {/* Recent Doubts */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div><h2 className="text-xl font-bold text-gray-900">Recent Doubts</h2><p className="text-sm text-gray-500 mt-1">Students need your help</p></div>
                <button onClick={() => navigate("/teacher/doubts")} className="text-purple-600 text-sm font-medium hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                {recentDoubts.map((doubt, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:border-purple-200 border border-transparent transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 text-xs font-bold">
                        {doubt.student.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{doubt.student}</p>
                        <p className="text-sm text-gray-600">{doubt.question}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-purple-600">{doubt.subject}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-400">{doubt.time}</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors">Reply</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - 1/3 */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold backdrop-blur-sm">{teacherAvatar}</div>
                <div>
                  <h3 className="text-xl font-bold">{teacherName}</h3>
                  <p className="text-purple-200 text-sm">{teacherSubject}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm"><p className="text-2xl font-bold">156</p><p className="text-xs text-purple-200">Students</p></div>
                <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm"><p className="text-2xl font-bold">4.8</p><p className="text-xs text-purple-200">Rating</p></div>
                <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm"><p className="text-2xl font-bold">48</p><p className="text-xs text-purple-200">Classes</p></div>
                <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm"><p className="text-2xl font-bold">6</p><p className="text-xs text-purple-200">Years Exp.</p></div>
              </div>
            </div>

            {/* Upcoming Schedule */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Upcoming Schedule</h3>
              <div className="space-y-3">
                {[
                  { day: "Tomorrow", classes: ["Mathematics - 9AM", "Physics - 11AM"] },
                  { day: "Fri, Mar 30", classes: ["Mathematics - 9AM", "Doubt Session - 2PM"] },
                  { day: "Sat, Mar 31", classes: ["Test - 10AM"] },
                ].map((day, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs font-semibold text-purple-600 mb-2">{day.day}</p>
                    {day.classes.map((cls, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-gray-700 py-0.5"><Clock size={12} className="text-gray-400" /><span>{cls}</span></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Tasks */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Pending Tasks</h3>
              <div className="space-y-3">
                {[
                  { task: "Grade Physics Assignments", count: "12 pending", priority: "high" },
                  { task: "Upload Chemistry Notes", count: "Due today", priority: "medium" },
                  { task: "Reply to Doubts", count: "5 unanswered", priority: "high" },
                  { task: "Create Test Paper", count: "By Friday", priority: "low" },
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