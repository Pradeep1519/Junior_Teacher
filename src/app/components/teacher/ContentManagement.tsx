// ============================================
// File 3: src/app/components/teacher/ContentManagement.tsx
// ============================================
import { useState } from "react";
import { DashboardLayout } from "../DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import {
  Home, Calendar, Users, BookOpen, MessageCircle, BarChart3, Settings,
  ClipboardList, Search, Filter, Upload, Download, FileText, Eye, Plus, X, Grid, List,
} from "lucide-react";
export function ContentManagement() {
  const { userData } = useAuth();
  const teacherAvatar = userData?.avatar || "TR";
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showUpload, setShowUpload] = useState(false);

  const sidebarItems = [
    { icon: Home, label: "Dashboard", path: "/teacher/dashboard" },
    { icon: Calendar, label: "My Classes", path: "/teacher/classes" },
    { icon: Users, label: "Students", path: "/teacher/students" },
    { icon: BookOpen, label: "Content", active: true },
    { icon: ClipboardList, label: "Assignments", path: "/teacher/assignments" },
    { icon: MessageCircle, label: "Doubts", path: "/teacher/doubts" },
    { icon: BarChart3, label: "Analytics", path: "/teacher/analytics" },
    { icon: Settings, label: "Settings", path: "/teacher/settings" },
  ];

  const contents = [
    { id: 1, title: "Quadratic Equations Notes", subject: "Mathematics", type: "PDF", size: "4.2 MB", downloads: 234, date: "2026-03-25" },
    { id: 2, title: "Laws of Motion PPT", subject: "Physics", type: "PPT", size: "8.5 MB", downloads: 189, date: "2026-03-24" },
    { id: 3, title: "Organic Chemistry Guide", subject: "Chemistry", type: "PDF", size: "6.7 MB", downloads: 156, date: "2026-03-23" },
    { id: 4, title: "Cell Biology Diagrams", subject: "Biology", type: "PDF", size: "12 MB", downloads: 312, date: "2026-03-22" },
    { id: 5, title: "Trigonometry Formula Sheet", subject: "Mathematics", type: "PDF", size: "1.8 MB", downloads: 445, date: "2026-03-21" },
    { id: 6, title: "Grammar Handbook", subject: "English", type: "PDF", size: "3.9 MB", downloads: 178, date: "2026-03-20" },
  ];

  return (
    <DashboardLayout
      title="Content Management"
      subtitle={`${contents.length} materials uploaded`}
      sidebarItems={sidebarItems}
      userInfo={
        <div className="flex items-center gap-3">
          <button onClick={() => setShowUpload(true)} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2">
            <Plus size={16} /> Upload Content
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">{teacherAvatar}</div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search content..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-purple-400 transition-all" />
          </div>
          <div className="flex bg-gray-100 rounded-xl p-1 ml-3">
            <button onClick={() => setViewMode("grid")} className={`p-2.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm" : "text-gray-500"}`}><Grid size={18} /></button>
            <button onClick={() => setViewMode("list")} className={`p-2.5 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm" : "text-gray-500"}`}><List size={18} /></button>
          </div>
        </div>

        {/* Content Grid */}
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
          {contents.map((item) => (
            viewMode === "grid" ? (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 bg-purple-100 rounded-xl"><FileText size={20} className="text-purple-600" /></div>
                  <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">{item.type}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">{item.title}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span>{item.subject}</span><span>•</span><span>{item.size}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400 flex items-center gap-1"><Download size={12} /> {item.downloads}</span>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>
              </div>
            ) : (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer group flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-xl"><FileText size={20} className="text-purple-600" /></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500"><span>{item.subject}</span><span>•</span><span>{item.size}</span><span>•</span><span>{item.downloads} downloads</span></div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-purple-50 rounded-xl text-purple-600"><Eye size={16} /></button>
                  <button className="p-2 hover:bg-purple-50 rounded-xl text-purple-600"><Download size={16} /></button>
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowUpload(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scaleIn" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upload Content</h2>
              <button onClick={() => setShowUpload(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Title</label><input type="text" placeholder="Enter title" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label><select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"><option>Mathematics</option><option>Physics</option><option>Chemistry</option></select></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Type</label><select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"><option>PDF Notes</option><option>PPT</option><option>Formula Sheet</option></select></div>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-purple-400 cursor-pointer">
                <Upload size={40} className="mx-auto text-gray-400 mb-3" />
                <p className="font-medium text-gray-700">Drag & drop file here</p>
                <p className="text-sm text-gray-500 mt-1">or click to browse</p>
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold">Upload</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } } .animate-scaleIn { animation: scaleIn 0.2s ease-out; }`}</style>
    </DashboardLayout>
  );
}