// ============================================
// File 4: teacher-portal/src/app/App.tsx
// ============================================
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './app/context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}