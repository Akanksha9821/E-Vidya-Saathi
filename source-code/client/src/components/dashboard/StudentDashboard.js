import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Typography, Grid, Paper } from '@mui/material';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    upcomingEvents: 0,
    pendingApplications: 0
  });

  useEffect(() => {
    // Fetch student stats
    const fetchStats = async () => {
      try {
        // This would typically be an API call
        const mockStats = {
          enrolledCourses: 3,
          upcomingEvents: 2,
          pendingApplications: 1
        };
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [dispatch]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Student Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Enrolled Courses
            </Typography>
            <Typography variant="h4">{stats.enrolledCourses}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Events
            </Typography>
            <Typography variant="h4">{stats.upcomingEvents}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Pending Applications
            </Typography>
            <Typography variant="h4">{stats.pendingApplications}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentDashboard; 