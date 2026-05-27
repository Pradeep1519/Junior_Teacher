// ============================================
// File 6: src/app/components/teacher/AnalyticsReports.tsx
// ============================================
import { useState } from "react";
import { DashboardLayout } from "../DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import {
  Home, Calendar, Users, BookOpen, MessageCircle, BarChart3, Settings,
  TrendingUp, Download, Star, ArrowUp, ArrowDown,ClipboardList,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export function AnalyticsReports() {
  const { userData } = useAuth();
  const teacherAvatar = userData?.avatar || "TR";

  const sidebarItems = [
    { icon: Home, label: "Dashboard", path: "/teacher/dashboard" },
    { icon: Calendar, label: "My Classes", path: "/teacher/classes" },
    { icon: Users, label: "Students", path: "/teacher/students" },
    { icon: BookOpen, label: "Content", path: "/teacher/content" },
    { icon: ClipboardList, label: "Assignments", path: "/teacher/assignments" },
    { icon: MessageCircle, label: "Doubts", path: "/teacher/doubts" },
    { icon: BarChart3, label: "Analytics", active: true },
    { icon: Settings, label: "Settings", path: "/teacher/settings" },
  ];

  const performanceData = [
    { month: "Oct", avgScore: 78, attendance: 90 },
    { month: "Nov", avgScore: 82, attendance: 92 },
    { month: "Dec", avgScore: 80, attendance: 88 },
    { month: "Jan", avgScore: 85, attendance: 94 },
    { month: "Feb", avgScore: 87, attendance: 93 },
    { month: "Mar", avgScore: 89, attendance: 95 },
  ];

  const subjectData = [
    { subject: "Math", score: 88 },
    { subject: "Physics", score: 82 },
    { subject: "Chemistry", score: 79 },
    { subject: "Biology", score: 76 },
    { subject: "English", score: 90 },
  ];

  return (
    <DashboardLayout
      title="Analytics & Reports"
      subtitle="Track performance and generate reports"
      sidebarItems={sidebarItems}
      userInfo={
        <div className="flex items-center gap-3">
          <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2">
            <Download size={16} /> Export Report
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">{teacherAvatar}</div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Avg Score", value: "87%", trend: "+5%", up: true },
            { label: "Attendance", value: "92%", trend: "+2%", up: true },
            { label: "Completion", value: "95%", trend: "+3%", up: true },
            { label: "Top Scorer", value: "Aarav S.", trend: "92%", up: true },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
              <p className={`text-xs mt-1 ${s.up ? "text-green-600" : "text-red-600"} flex items-center gap-1`}>
                {s.up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}{s.trend}
              </p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Monthly Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} domain={[70, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="avgScore" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} name="Avg Score" />
                <Line type="monotone" dataKey="attendance" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} name="Attendance" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Subject-wise Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={subjectData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="subject" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} domain={[60, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Avg Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}