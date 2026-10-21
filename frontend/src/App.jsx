import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CitizenOverviewPage from './pages/CitizenOverviewPage';
import ReportNoisePage from './pages/ReportNoisePage';
import MyComplaintsPage from './pages/MyComplaintsPage';
import NoiseMapPage from './pages/NoiseMapPage';
import StaffOverviewPage from './pages/StaffOverviewPage';
import StaffComplaintsPage from './pages/StaffComplaintsPage';
import SettingsPage from './pages/SettingsPage';

// Protected Route Guard
function ProtectedRoute({ children, staffOnly = false }) {
  const { user, loading, isStaff } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <LoadingSpinner message="Authenticating session..." size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (staffOnly && !isStaff) {
    return <Navigate to="/overview" replace />;
  }

  return children;
}

// Redirect root based on user role
function RootRedirect() {
  const { user, loading, isStaff } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <LoadingSpinner message="Loading..." size="md" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return isStaff ? (
    <Navigate to="/staff/overview" replace />
  ) : (
    <Navigate to="/overview" replace />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Authenticated Application Routes within Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<RootRedirect />} />
              
              {/* Citizen Routes */}
              <Route path="/overview" element={<CitizenOverviewPage />} />
              <Route path="/report" element={<ReportNoisePage />} />
              <Route path="/my-complaints" element={<MyComplaintsPage />} />
              <Route path="/map" element={<NoiseMapPage />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* Staff Only Routes */}
              <Route
                path="/staff/overview"
                element={
                  <ProtectedRoute staffOnly={true}>
                    <StaffOverviewPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/complaints"
                element={
                  <ProtectedRoute staffOnly={true}>
                    <StaffComplaintsPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
