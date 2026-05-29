// ============================================
// FIXED: teacher-portal/src/routes.tsx
// ============================================
import { createBrowserRouter } from "react-router";
import { Root } from "./app/components/Root";
import { LoginPage } from "./app/components/LoginPage";
import { TeacherDashboard } from "./app/components/teacher/TeacherDashboard";
import { ClassManagement } from "./app/components/teacher/ClassManagement";
import { StudentManagement } from "./app/components/teacher/StudentManagement";
import { ContentManagement } from "./app/components/teacher/ContentManagement";
import { AssignmentManagement } from "./app/components/teacher/AssignmentManagement";
import { DoubtResolution } from "./app/components/teacher/DoubtResolution";
import { AnalyticsReports } from "./app/components/teacher/AnalyticsReports";
import { TeacherSettings } from "./app/components/teacher/TeacherSettings";
import { MyBatches } from "./app/components/teacher/MyBatches";  // ✅ ADD


export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: LoginPage },
      { path: "login", Component: LoginPage },
      { path: "teacher/dashboard", Component: TeacherDashboard },
      { path: "teacher/classes", Component: ClassManagement },
      { path: "teacher/students", Component: StudentManagement },
      { path: "teacher/batches", Component: MyBatches },      // ✅ ADDED
      { path: "teacher/content", Component: ContentManagement },
      { path: "teacher/assignments", Component: AssignmentManagement },
      { path: "teacher/doubts", Component: DoubtResolution },
      { path: "teacher/analytics", Component: AnalyticsReports },
      { path: "teacher/settings", Component: TeacherSettings },
    ],
  },
]);