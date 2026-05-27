// ============================================
// File 6: teacher-portal/src/app/components/DashboardLayout.tsx
// ============================================
import { useState, ReactNode } from "react";
import { useNavigate } from "react-router";
import { 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  Moon, 
  Sun,
  MessageSquare,
  HelpCircle,
  ChevronRight
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  userInfo?: ReactNode;
  sidebarItems: Array<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    path?: string;
    active?: boolean;
    badge?: number;
  }>;
}

export function DashboardLayout({ children, title, subtitle, userInfo, sidebarItems }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications] = useState(3);

  const getPathFromLabel = (label: string): string => {
    const pathMap: Record<string, string> = {
      "Dashboard": "/teacher/dashboard",
      "My Classes": "/teacher/classes",
      "Students": "/teacher/students",
      "Content": "/teacher/content",
      "Assignments": "/teacher/assignments",
      "Doubts": "/teacher/doubts",
      "Analytics": "/teacher/analytics",
      "Settings": "/teacher/settings",
    };
    return pathMap[label] || "";
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-[#F2F2F7]'} transition-colors duration-300`}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-violet-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <header className={`sticky top-0 z-40 backdrop-blur-xl ${
        darkMode 
          ? 'bg-gray-900/80 border-gray-800' 
          : 'bg-white/80 border-gray-200/50'
      } border-b`}>
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`lg:hidden p-2.5 rounded-xl transition-all duration-200 ${
                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Junior<span className="text-purple-600">Dream</span>
                </h1>
                <p className="text-xs text-purple-500 font-medium">Teacher Portal</p>
              </div>
            </div>
          </div>

          <div className={`hidden md:flex items-center flex-1 max-w-md mx-6`}>
            <div className={`relative w-full group`}>
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                darkMode ? 'text-gray-500 group-focus-within:text-purple-400' : 'text-gray-400 group-focus-within:text-purple-500'
              }`} />
              <input
                type="text"
                placeholder="Search students, classes, content..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800 text-white placeholder-gray-500 border-gray-700 focus:border-purple-500' 
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-200 focus:border-purple-500'
                } border-2 focus:outline-none focus:bg-white focus:shadow-lg focus:shadow-purple-500/10`}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl transition-all duration-200 ${
                darkMode ? 'hover:bg-gray-800 text-yellow-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button className={`p-2.5 rounded-xl transition-all duration-200 hidden sm:block ${
              darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}>
              <HelpCircle size={20} />
            </button>

            <button className={`relative p-2.5 rounded-xl transition-all duration-200 ${
              darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}>
              <MessageSquare size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-purple-500 rounded-full border-2 border-white"></span>
            </button>

            <button className={`relative p-2.5 rounded-xl transition-all duration-200 ${
              darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}>
              <Bell size={20} />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {notifications}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate("/login")}
              className={`p-2 rounded-xl transition-all duration-200 ${
                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
              title="Logout"
            >
              <LogOut size={20} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
            </button>

            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20 cursor-pointer ring-2 ring-white">
              TR
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`fixed lg:sticky top-[73px] left-0 h-[calc(100vh-73px)] w-72 transition-transform duration-300 lg:translate-x-0 z-30 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className={`h-full overflow-y-auto border-r backdrop-blur-xl ${
            darkMode 
              ? 'bg-gray-900/90 border-gray-800' 
              : 'bg-white/90 border-gray-200/50'
          }`}>
            <div className="p-6 border-b border-gray-200/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    TR
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Mr. Sharma
                  </h3>
                  <p className="text-sm text-gray-500">Mathematics Teacher</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Experience</span>
                  <span className="text-purple-500 font-medium">6+ Years</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" 
                       style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>

            <nav className="p-4 space-y-1">
              <p className={`text-xs font-semibold uppercase tracking-wider px-4 mb-3 ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Main Menu
              </p>
              {sidebarItems.map((item, index) => {
                const Icon = item.icon;
                const finalPath = item.path || getPathFromLabel(item.label);
                
                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (finalPath) navigate(finalPath);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                      item.active
                        ? darkMode 
                          ? 'bg-purple-500/10 text-purple-400 font-medium' 
                          : 'bg-purple-50 text-purple-600 font-medium'
                        : darkMode
                          ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {item.active && <ChevronRight className="w-4 h-4" />}
                  </button>
                );
              })}

              <div className="my-4 border-t border-gray-200/50"></div>

              <p className={`text-xs font-semibold uppercase tracking-wider px-4 mb-3 mt-4 ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Quick Actions
              </p>
              
              <button 
                onClick={() => { navigate("/teacher/classes"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm ${
                  darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">📹</span> Start Live Class
              </button>
              <button 
                onClick={() => { navigate("/teacher/content"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm ${
                  darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">📤</span> Upload Content
              </button>
              <button 
                onClick={() => { navigate("/teacher/assignments"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm ${
                  darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">📝</span> Create Assignment
              </button>
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-4 lg:p-8 min-h-[calc(100vh-73px)]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {title}
                  </h1>
                  {subtitle && (
                    <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {subtitle}
                    </p>
                  )}
                </div>
                {userInfo && <div>{userInfo}</div>}
              </div>
            </div>

            <div className="animate-fadeIn">
              {children}
            </div>
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .delay-1000 { animation-delay: 1s; }
        .delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
}