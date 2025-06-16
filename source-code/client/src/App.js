import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';

// Layout Components
import Layout from './components/layout/Layout';
import PrivateRoute from './components/routing/PrivateRoute';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Dashboard Components
import Dashboard from './components/dashboard/Dashboard';
import StudentDashboard from './components/dashboard/StudentDashboard';
import FacultyDashboard from './components/dashboard/FacultyDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';

// Feature Components
import Courses from './components/courses/Courses';
import CourseDetails from './components/courses/CourseDetails';
import Attendance from './components/attendance/Attendance';
import Events from './components/events/Events';
import EventDetails from './components/events/EventDetails';
import Placements from './components/placements/Placements';
import PlacementDetails from './components/placements/PlacementDetails';
import AttendanceList from './components/attendance/AttendanceList';
import StudentAttendance from './components/attendance/StudentAttendance';
import EventList from './components/events/EventList';
import JobList from './components/placements/JobList';
import JobDetails from './components/placements/JobDetails';
import InterestPreferences from './components/matching/InterestPreferences';
import EventRecommendations from './components/matching/EventRecommendations';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
  },
});

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={getDashboard()} />
            
            {/* Course Routes */}
            <Route path="courses" element={<PrivateRoute><Courses /></PrivateRoute>} />
            <Route path="courses/:id" element={<PrivateRoute><CourseDetails /></PrivateRoute>} />
            <Route path="courses/:courseId/attendance" element={
              <PrivateRoute>
                <Layout>
                  <AttendanceList />
                </Layout>
              </PrivateRoute>
            } />
            
            {/* Attendance Routes */}
            <Route path="attendance" element={
              <PrivateRoute>
                <Layout>
                  <StudentAttendance />
                </Layout>
              </PrivateRoute>
            } />
            
            {/* Event Routes */}
            <Route path="events" element={
              <PrivateRoute>
                <Layout>
                  <EventList />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="events/:eventId" element={
              <PrivateRoute>
                <Layout>
                  <EventDetails />
                </Layout>
              </PrivateRoute>
            } />
            
            {/* Placement Routes */}
            <Route path="placements" element={
              <PrivateRoute>
                <Layout>
                  <JobList />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="placements/:jobId" element={
              <PrivateRoute>
                <Layout>
                  <JobDetails />
                </Layout>
              </PrivateRoute>
            } />

            {/* Matching Routes */}
            <Route
              path="matching"
              element={
                <PrivateRoute>
                  <Layout>
                    <Routes>
                      <Route index element={<InterestPreferences />} />
                      <Route path="recommendations" element={<EventRecommendations />} />
                    </Routes>
                  </Layout>
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
