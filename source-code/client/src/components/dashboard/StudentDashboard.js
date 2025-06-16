import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress
} from '@mui/material';
import {
  School as SchoolIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    courses: 0,
    attendance: 0,
    upcomingEvents: 0,
    jobApplications: 0
  });

  useEffect(() => {
    // TODO: Fetch student statistics
    // This will be implemented when we create the respective API endpoints
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const dashboardItems = [
    {
      title: 'My Courses',
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      description: 'View and manage your enrolled courses',
      path: '/courses',
      count: stats.courses
    },
    {
      title: 'Attendance',
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      description: 'Track your attendance and view reports',
      path: '/attendance',
      count: stats.attendance
    },
    {
      title: 'Events',
      icon: <EventIcon sx={{ fontSize: 40 }} />,
      description: 'View upcoming events and register',
      path: '/events',
      count: stats.upcomingEvents
    },
    {
      title: 'Placements',
      icon: <WorkIcon sx={{ fontSize: 40 }} />,
      description: 'View job postings and track applications',
      path: '/placements',
      count: stats.jobApplications
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Welcome, {user?.name}!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Here's an overview of your academic journey
            </Typography>
          </Paper>
        </Grid>

        {dashboardItems.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  {item.icon}
                  <Typography variant="h4" component="div">
                    {item.count}
                  </Typography>
                </Box>
                <Typography variant="h6" component="div" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => navigate(item.path)}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            {/* TODO: Add recent activity feed */}
            <Typography variant="body2" color="text.secondary">
              No recent activity to display
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentDashboard; 