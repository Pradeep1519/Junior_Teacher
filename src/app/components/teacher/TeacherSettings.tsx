// ============================================
// File: src/app/components/teacher/TeacherSettings.tsx (IMPROVED)
// ============================================
import { useState } from "react";
import { useNavigate } from "react-router";
import { DashboardLayout } from "../DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../config/firebase";
import {
  Home, Calendar, Users, BookOpen, MessageCircle, BarChart3, Settings,
  ClipboardList, User, Camera, Mail, Phone, Lock, Key, LogOut, AlertTriangle,
  Bell, Moon, Sun, Globe, Shield, Eye, EyeOff, CheckCircle, X, Clock, Monitor,
} from "lucide-react";

export function TeacherSettings() {
  const navigate = useNavigate();
  const { userData, setUserData } = useAuth();
  const teacherAvatar = userData?.avatar || "TR";
  const teacherName = userData?.name || "Teacher";
  const teacherEmail = userData?.email || "";
  const teacherPhone = userData?.phone || "";
  const teacherSubject = userData?.subject || "Multiple Subjects";
  const teacherQualification = userData?.qualification || "";
  const teacherExperience = userData?.experience || "";

  const [activeSection, setActiveSection] = useState("profile");
  const [showLogout, setShowLogout] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState("");

  const [profile, setProfile] = useState({
    name: teacherName,
    email: teacherEmail,
    phone: teacherPhone,
    subject: teacherSubject,
    qualification: teacherQualification,
    experience: teacherExperience,
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: false,
    classReminder: true,
    doubtAlert: true,
    assignmentSubmission: true,
  });

  const [darkMode, setDarkMode] = useState(false);

  const sidebarItems = [
    { icon: Home, label: "Dashboard", path: "/teacher/dashboard" },
    { icon: Calendar, label: "My Classes", path: "/teacher/classes" },
    { icon: Users, label: "Students", path: "/teacher/students" },
    { icon: BookOpen, label: "Content", path: "/teacher/content" },
    { icon: ClipboardList, label: "Assignments", path: "/teacher/assignments" },
    { icon: MessageCircle, label: "Doubts", path: "/teacher/doubts" },
    { icon: BarChart3, label: "Analytics", path: "/teacher/analytics" },
    { icon: Settings, label: "Settings", active: true },
  ];

  const settingsSections = [
    { id: "profile", label: "👤 Profile", icon: User },
    { id: "account", label: "🔐 Account", icon: Lock },
    { id: "notifications", label: "🔔 Notifications", icon: Bell },
    { id: "appearance", label: "🎨 Appearance", icon: Moon },
    { id: "danger", label: "⚠️ Danger Zone", icon: AlertTriangle },
  ];

  const handleSave = () => {
    setShowSuccess("Profile updated successfully!");
    setTimeout(() => setShowSuccess(""), 3000);
  };

  const handleLogout = async () => {
    await logoutUser();
    setUserData(null as any);
    navigate("/login");
  };

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
        enabled ? "bg-purple-600" : "bg-gray-300"
      }`}
    >
      <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all duration-300 ${
        enabled ? "left-5.5" : "left-0.5"
      }`} />
    </button>
  );

  return (
    <DashboardLayout
      title="Settings"
      subtitle="Manage your profile and preferences"
      sidebarItems={sidebarItems}
      userInfo={
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
          {teacherAvatar}
        </div>
      }
    >
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-slideIn">
          <CheckCircle size={20} />
          <span className="font-medium">{showSuccess}</span>
        </div>
      )}

      <div className="flex gap-6">
        {/* Left Navigation */}
        <div className="hidden lg:block w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sticky top-24">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1 ${
                  activeSection === section.id
                    ? "bg-purple-50 text-purple-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <section.icon size={18} />
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Mobile Tabs */}
          <div className="lg:hidden flex gap-1 bg-gray-100 rounded-2xl p-1.5 overflow-x-auto">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${
                  activeSection === section.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                }`}
              >
                <section.icon size={16} /> {section.label}
              </button>
            ))}
          </div>

          {/* PROFILE SECTION */}
          {activeSection === "profile" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-xl mx-auto">
                    {teacherAvatar}
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg hover:bg-purple-700 transition-colors">
                    <Camera size={16} />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mt-4">{teacherName}</h2>
                <p className="text-gray-500">{teacherSubject}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                      <div className="relative">
                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})}
                          className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})}
                          className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 transition-all" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="tel" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})}
                          className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                      <select value={profile.subject} onChange={e => setProfile({...profile, subject: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400">
                        <option>Mathematics</option><option>Physics</option><option>Chemistry</option><option>Biology</option><option>English</option><option>Multiple Subjects</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Qualification</label>
                      <input type="text" value={profile.qualification} onChange={e => setProfile({...profile, qualification: e.target.value})} placeholder="e.g. Ph.D., M.Sc."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
                      <input type="text" value={profile.experience} onChange={e => setProfile({...profile, experience: e.target.value})} placeholder="e.g. 10+ years"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400" />
                    </div>
                  </div>
                  <button onClick={handleSave} className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ACCOUNT SECTION */}
          {activeSection === "account" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Change Password</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type={showCurrentPassword ? "text" : "password"} placeholder="Current Password"
                      className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400" />
                    <button onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="relative">
                    <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type={showNewPassword ? "text" : "password"} placeholder="New Password"
                      className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400" />
                    <button onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="relative">
                    <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="password" placeholder="Confirm New Password"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400" />
                  </div>
                  <button className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors">
                    Update Password
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Active Sessions</h3>
                {[
                  { device: "Chrome on Windows", location: "New Delhi, India", current: true },
                  { device: "Safari on iPhone", location: "New Delhi, India", current: false },
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-2">
                    <div className="flex items-center gap-3">
                      <Monitor size={18} className="text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{session.device}</p>
                        <p className="text-xs text-gray-500">{session.location}</p>
                      </div>
                    </div>
                    {session.current ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Current</span>
                    ) : (
                      <button className="text-xs text-red-500 font-medium">Revoke</button>
                    )}
                  </div>
                ))}
                <button className="w-full mt-2 py-2.5 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors">
                  Logout from all devices
                </button>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS SECTION */}
          {activeSection === "notifications" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Notification Preferences</h3>
              <div className="space-y-1">
                {[
                  { key: "emailNotifications", label: "Email Notifications", desc: "Receive notifications via email" },
                  { key: "pushNotifications", label: "Push Notifications", desc: "Browser push notifications" },
                  { key: "smsAlerts", label: "SMS Alerts", desc: "Important updates via SMS" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <Toggle enabled={notifications[item.key as keyof typeof notifications] as boolean}
                      onChange={() => setNotifications({...notifications, [item.key]: !notifications[item.key as keyof typeof notifications]})} />
                  </div>
                ))}
                <div className="border-t border-gray-200 my-2"></div>
                <p className="text-sm font-semibold text-gray-500 py-2">Alerts</p>
                {[
                  { key: "classReminder", label: "Class Reminders", desc: "15 min before class" },
                  { key: "doubtAlert", label: "New Doubts", desc: "When student asks a doubt" },
                  { key: "assignmentSubmission", label: "Assignment Submissions", desc: "When student submits work" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <Toggle enabled={notifications[item.key as keyof typeof notifications] as boolean}
                      onChange={() => setNotifications({...notifications, [item.key]: !notifications[item.key as keyof typeof notifications]})} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* APPEARANCE SECTION */}
          {activeSection === "appearance" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: "light", label: "Light", icon: Sun },
                    { id: "dark", label: "Dark", icon: Moon },
                    { id: "system", label: "System", icon: Monitor },
                  ].map((theme) => (
                    <button key={theme.id} onClick={() => setDarkMode(theme.id === "dark")}
                      className={`p-4 rounded-2xl border-2 text-center transition-all ${!darkMode && theme.id === "light" || darkMode && theme.id === "dark" ? "border-purple-400 bg-purple-50" : "border-gray-100 hover:border-gray-200"}`}>
                      <theme.icon size={28} className="mx-auto mb-2 text-gray-500" />
                      <p className="text-sm font-semibold text-gray-700">{theme.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DANGER ZONE SECTION */}
          {activeSection === "danger" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <AlertTriangle size={20} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-700">Danger Zone</h3>
                    <p className="text-sm text-gray-500">Irreversible actions</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                    <div>
                      <p className="font-medium text-gray-900">Delete Account</p>
                      <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                    </div>
                    <button onClick={() => setShowDeleteConfirm(true)}
                      className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors">
                      Delete
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                    <div>
                      <p className="font-medium text-gray-900">Logout</p>
                      <p className="text-sm text-gray-500">Sign out from current session</p>
                    </div>
                    <button onClick={() => setShowLogout(true)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logout Modal */}
      {showLogout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowLogout(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scaleIn text-center" onClick={e => e.stopPropagation()}>
            <LogOut size={32} className="mx-auto mb-3 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Logout?</h2>
            <p className="text-gray-600 text-sm mb-6">Are you sure you want to logout?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogout(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold">Cancel</button>
              <button onClick={handleLogout} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold">Yes, Logout</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scaleIn text-center" onClick={e => e.stopPropagation()}>
            <AlertTriangle size={32} className="mx-auto mb-3 text-red-600" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Account?</h2>
            <p className="text-gray-600 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold">Cancel</button>
              <button className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        .animate-slideIn { animation: slideIn 0.4s ease-out; }
      `}</style>
    </DashboardLayout>
  );
}