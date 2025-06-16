import React from 'react';
import { useSelector } from 'react-redux';
import StudentDashboard from './StudentDashboard';
import FacultyDashboard from './FacultyDashboard';
import AdminDashboard from './AdminDashboard';

function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return null;
  }

  switch (user.role) {
    case 'student':
      return <StudentDashboard />;
    case 'faculty':
      return <FacultyDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return null;
  }
}

export default Dashboard; 