import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUser, initialize } from './features/auth/authSlice';

// Layout
import Layout from './components/layout/Layout';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard
import StudentDashboard from './pages/dashboard/StudentDashboard';
import FacultyDashboard from './pages/dashboard/FacultyDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import Dashboard from './pages/dashboard/Dashboard';

// Courses
import Courses from './pages/courses/Courses';
import CourseDetails from './pages/courses/CourseDetails';
import AttendanceList from './pages/courses/AttendanceList';

// Attendance
import StudentAttendance from './pages/attendance/StudentAttendance';

// Events
import EventList from './pages/events/EventList';
import EventDetails from './pages/events/EventDetails';

// Placements
import JobList from './pages/placements/JobList';
import JobDetails from './pages/placements/JobDetails';

// Matching
import InterestPreferences from './pages/matching/InterestPreferences';
import EventRecommendations from './pages/matching/EventRecommendations';

// Private Route
import PrivateRoute from './components/routing/PrivateRoute';
import ProtectedRoute from './components/routing/ProtectedRoute';

// Profile
import Profile from './pages/profile/Profile';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const { isAuthenticated, user, isInitialized, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      await dispatch(getCurrentUser());
      dispatch(initialize());
    };
    initAuth();
  }, [dispatch]);

  if (!isInitialized || isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  const getDashboard = () => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    
    switch (user?.role) {
      case 'student':
        return <StudentDashboard />;
      case 'faculty':
        return <FacultyDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login /> : <Navigate to="/" />} 
          />
          <Route 
            path="/register" 
            element={!isAuthenticated ? <Register /> : <Navigate to="/" />} 
          />

          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            
            {/* Course Routes */}
            <Route path="courses">
              <Route index element={<ProtectedRoute><Courses /></ProtectedRoute>} />
              <Route path=":id" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />
              <Route path=":courseId/attendance" element={<ProtectedRoute><AttendanceList /></ProtectedRoute>} />
            </Route>
            
            {/* Attendance Routes */}
            <Route path="attendance" element={<ProtectedRoute><StudentAttendance /></ProtectedRoute>} />
            
            {/* Event Routes */}
            <Route path="events">
              <Route index element={<ProtectedRoute><EventList /></ProtectedRoute>} />
              <Route path=":eventId" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />
            </Route>
            
            {/* Placement Routes */}
            <Route path="placements">
              <Route index element={<ProtectedRoute><JobList /></ProtectedRoute>} />
              <Route path=":jobId" element={<ProtectedRoute><JobDetails /></ProtectedRoute>} />
            </Route>

            {/* Matching Routes */}
            <Route path="matching">
              <Route index element={<ProtectedRoute><InterestPreferences /></ProtectedRoute>} />
              <Route path="recommendations" element={<ProtectedRoute><EventRecommendations /></ProtectedRoute>} />
            </Route>

            {/* Profile Route */}
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
