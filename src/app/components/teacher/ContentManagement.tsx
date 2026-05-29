// ============================================
// UPDATED: teacher-portal/src/app/components/teacher/ContentManagement.tsx
// ============================================
import { useState, useEffect } from "react";
import { DashboardLayout } from "../DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { getTeacherBatches } from "../../config/firebase";
import { db, storage } from "../../config/firebase";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  Home, Calendar, Users, BookOpen, MessageCircle, BarChart3, Settings,
  ClipboardList, Search, Upload, Download, FileText, Eye, Plus, X, Grid, List, Trash2
} from "lucide-react";

export function ContentManagement() {
  const { userData } = useAuth();
  const teacherId = userData?.teacherId || userData?.uid || "";
  const teacherAvatar = userData?.avatar || "TR";
  const [viewMode, setViewMode] = useState("grid");
  const [showUpload, setShowUpload] = useState(false);
  const [contents, setContents] = useState([]);
  const [myBatches, setMyBatches] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [form, setForm] = useState({
    title: "", subject: "", batchId: "", type: "PDF Notes", file: null
  });

  useEffect(() => {
    async function fetchData() {
      if (!teacherId) return;
      try {
        const [batches] = await Promise.all([getTeacherBatches(teacherId)]);
        setMyBatches(batches);
        const q = query(collection(db, "study_materials"), where("teacherId", "==", teacherId));
        const snap = await getDocs(q);
        setContents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) { console.error(err); }
    }
    fetchData();
  }, [teacherId]);

  const resetForm = () => {
    setForm({ title: "", subject: "", batchId: "", type: "PDF Notes", file: null });
    setUploadProgress(0);
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setForm({ ...form, file: e.target.files[0] });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.file) return;
    setIsUploading(true);
    
    try {
      const filePath = `study_materials/${teacherId}/${Date.now()}_${form.file.name}`;
      const storageRef = ref(storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, form.file);
      
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(progress);
        },
        (error) => { console.error(error); setIsUploading(false); },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const batch = myBatches.find(b => b.id === form.batchId);
          
          await addDoc(collection(db, "study_materials"), {
            ...form, file: null, fileUrl: downloadURL, fileName: form.file?.name,
            teacherId, teacherName: userData?.name || "Teacher",
            batchName: batch?.name || "", materialId: `material_${Date.now()}`,
            fileSize: form.file?.size ? `${(form.file.size / (1024 * 1024)).toFixed(1)} MB` : "N/A",
            downloads: 0, uploadDate: new Date().toISOString(), createdAt: new Date().toISOString()
          });
          
          setSuccessMsg("✅ Content uploaded!"); setTimeout(() => setSuccessMsg(""), 3000);
          setShowUpload(false); resetForm(); setIsUploading(false);
          
          const q = query(collection(db, "study_materials"), where("teacherId", "==", teacherId));
          const snap = await getDocs(q);
          setContents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      );
    } catch (err) { console.error(err); setIsUploading(false); }
  };

  const handleDelete = async (materialId) => {
    if (!confirm("Delete this material?")) return;
    await deleteDoc(doc(db, "study_materials", materialId));
    setSuccessMsg("✅ Deleted!"); setTimeout(() => setSuccessMsg(""), 3000);
    setContents(contents.filter(c => c.id !== materialId));
  };

  const sidebarItems = [
    { icon: Home, label: "Dashboard", path: "/teacher/dashboard" },
    { icon: Calendar, label: "My Classes", path: "/teacher/classes" },
    { icon: Users, label: "My Students", path: "/teacher/students" },
    { icon: BookOpen, label: "Content", active: true },
    { icon: ClipboardList, label: "Assignments", path: "/teacher/assignments" },
    { icon: MessageCircle, label: "Doubts", path: "/teacher/doubts" },
    { icon: BarChart3, label: "Analytics", path: "/teacher/analytics" },
    { icon: Settings, label: "Settings", path: "/teacher/settings" },
  ];

  const filteredContents = contents.filter(c =>
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout
      title="My Content"
      subtitle={`${contents.length} materials uploaded`}
      sidebarItems={sidebarItems}
      userInfo={
        <div className="flex items-center gap-3">
          <button onClick={() => { resetForm(); setShowUpload(true); }} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2">
            <Plus size={16} /> Upload Content
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">{teacherAvatar}</div>
        </div>
      }
    >
      {successMsg && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, background: '#10b981', color: 'white', padding: '12px 20px', borderRadius: '12px', fontWeight: 600, fontSize: '13px', boxShadow: '0 8px 25px rgba(16,185,129,0.3)' }}>{successMsg}</div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search content..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-purple-400 transition-all" />
          </div>
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button onClick={() => setViewMode("grid")} className={`p-2.5 rounded-lg ${viewMode === "grid" ? "bg-white shadow-sm" : "text-gray-500"}`}><Grid size={18} /></button>
            <button onClick={() => setViewMode("list")} className={`p-2.5 rounded-lg ${viewMode === "list" ? "bg-white shadow-sm" : "text-gray-500"}`}><List size={18} /></button>
          </div>
        </div>

        {filteredContents.length > 0 ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
            {filteredContents.map((item) => (
              viewMode === "grid" ? (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2.5 bg-purple-100 rounded-xl"><FileText size={20} className="text-purple-600" /></div>
                    <div className="flex gap-2">
                      <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">{item.type}</span>
                      <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">{item.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span>{item.subject}</span><span>•</span><span>{item.fileSize || item.size}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Download size={12} /> {item.downloads || 0}</span>
                    <span className="text-xs text-gray-400">{item.uploadDate ? new Date(item.uploadDate).toLocaleDateString() : item.date}</span>
                  </div>
                </div>
              ) : (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer group flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-xl"><FileText size={20} className="text-purple-600" /></div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500"><span>{item.subject}</span><span>•</span><span>{item.fileSize || item.size}</span></div>
                  </div>
                  <div className="flex gap-2">
                    {item.fileUrl && <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-purple-50 rounded-xl text-purple-600"><Download size={16} /></a>}
                    <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-50 rounded-xl text-red-500"><Trash2 size={16} /></button>
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-16">No content uploaded yet</p>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setShowUpload(false); resetForm(); }}>
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upload Content</h2>
              <button onClick={() => { setShowUpload(false); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
            </div>
            <form onSubmit={handleUpload} className="space-y-4">
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label><input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                  <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" required>
                    <option value="">Select</option>
                    {(userData?.subjects || ["Mathematics","Physics","Chemistry","Biology","English"]).map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                    <option>PDF Notes</option><option>PPT</option><option>Formula Sheet</option><option>Practice Set</option><option>Mind Map</option>
                  </select>
                </div>
              </div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Batch</label>
                <select value={form.batchId} onChange={e => setForm({...form, batchId: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                  <option value="">All Batches</option>
                  {myBatches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-purple-400 cursor-pointer" onClick={() => document.getElementById('fileInput')?.click()}>
                {form.file ? (
                  <div><FileText size={40} className="mx-auto text-purple-600 mb-3" /><p className="font-medium text-gray-700">{form.file.name}</p></div>
                ) : (
                  <div><Upload size={40} className="mx-auto text-gray-400 mb-3" /><p className="font-medium text-gray-700">Click to browse</p><p className="text-sm text-gray-500 mt-1">PDF, PPT, DOC, Images</p></div>
                )}
                <input id="fileInput" type="file" onChange={handleFileChange} className="hidden" accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg" />
              </div>
              {isUploading && (
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full transition-all" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              )}
              <button type="submit" disabled={!form.file || isUploading} className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold disabled:opacity-50">
                {isUploading ? `Uploading... ${uploadProgress}%` : "Upload"}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}