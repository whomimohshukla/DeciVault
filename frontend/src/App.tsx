import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './routes/ProtectedRoute';
import OrganizationList from './pages/organizations/OrganizationList';
import OrganizationDetail from './pages/organizations/OrganizationDetail';
import Invitations from './pages/organizations/Invitations';
import ProjectList from './pages/projects/ProjectList';
import ProjectDetail from './pages/projects/ProjectDetail';
import DecisionRegister from './pages/decisions/DecisionRegister';
import DecisionDetail from './pages/decisions/DecisionDetail';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
          position="top-right"
          closeButton
          richColors
          expand
          toastOptions={{
            classNames: {
              toast:
                'group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-800 group-[.toaster]:border group-[.toaster]:border-slate-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl',
              title: 'text-sm font-semibold',
              description: 'text-xs text-slate-600',
              actionButton: 'bg-[#0E6669] text-white',
              cancelButton: 'bg-slate-100 text-slate-700',
            },
          }}
        />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizations"
              element={
                <ProtectedRoute>
                  <OrganizationList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizations/:organizationId"
              element={
                <ProtectedRoute>
                  <OrganizationDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invitations"
              element={
                <ProtectedRoute>
                  <Invitations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizations/:organizationId/projects"
              element={
                <ProtectedRoute>
                  <ProjectList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizations/:organizationId/projects/:projectId"
              element={
                <ProtectedRoute>
                  <ProjectDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizations/:organizationId/decisions"
              element={
                <ProtectedRoute>
                  <DecisionRegister />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizations/:organizationId/decisions/:decisionId"
              element={
                <ProtectedRoute>
                  <DecisionDetail />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
