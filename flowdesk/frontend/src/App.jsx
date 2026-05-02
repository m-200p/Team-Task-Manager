import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './router/ProtectedRoute';
import AdminRoute from './router/AdminRoute';

import LoginPage    from './pages/LoginPage';
import SignupPage   from './pages/SignupPage';
import Dashboard    from './pages/Dashboard';
import ProjectPage  from './pages/ProjectPage';
import TaskPage     from './pages/TaskPage';
import AdminPanel   from './pages/AdminPanel';
import AppLayout    from './components/layout/AppLayout';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/"            element={<Dashboard />} />
              <Route path="/projects/:id" element={<ProjectPage />} />
              <Route path="/tasks/:id"    element={<TaskPage />} />
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPanel />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}