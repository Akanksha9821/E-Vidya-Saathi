import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

// Auth Pages
import Login from './pages/auth/Login';
import Welcome from './pages/Welcome';

// Dashboard
import Dashboard from './pages/dashboard/Dashboard';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import FacultyDashboard from './pages/dashboard/FacultyDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

// Layouts
import DashboardLayout from './components/dashboard-layout/DashboardLayout';

// Protected Route
import ProtectedRoute from './components/protected-route/ProtectedRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes with Role-based Access */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/dashboard" element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout>
                <StudentDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/faculty/dashboard" element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <DashboardLayout>
                <FacultyDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
