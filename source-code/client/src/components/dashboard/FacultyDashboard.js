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
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  School as SchoolIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    courses: 0,
    students: 0,
    upcomingEvents: 0,
    pendingTasks: 0
  });

  useEffect(() => {
    // TODO: Fetch faculty statistics
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
      description: 'Manage your courses and materials',
      path: '/courses',
      count: stats.courses
    },
    {
      title: 'Students',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      description: 'View and manage student records',
      path: '/students',
      count: stats.students
    },
    {
      title: 'Events',
      icon: <EventIcon sx={{ fontSize: 40 }} />,
      description: 'Create and manage events',
      path: '/events',
      count: stats.upcomingEvents
    },
    {
      title: 'Tasks',
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      description: 'View pending tasks and deadlines',
      path: '/tasks',
      count: stats.pendingTasks
    }
  ];

  const recentActivities = [
    {
      title: 'New student enrolled in Web Development',
      time: '2 hours ago',
      icon: <PeopleIcon />
    },
    {
      title: 'Attendance report due for Database Systems',
      time: '4 hours ago',
      icon: <AssignmentIcon />
    },
    {
      title: 'New event: Tech Workshop',
      time: '1 day ago',
      icon: <EventIcon />
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
              Here's an overview of your teaching activities
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

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>{activity.icon}</ListItemIcon>
                    <ListItemText
                      primary={activity.title}
                      secondary={activity.time}
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AssignmentIcon />}
                  onClick={() => navigate('/attendance/mark')}
                >
                  Mark Attendance
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<EventIcon />}
                  onClick={() => navigate('/events/create')}
                >
                  Create Event
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<NotificationsIcon />}
                  onClick={() => navigate('/notifications')}
                >
                  Send Notification
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<SchoolIcon />}
                  onClick={() => navigate('/courses/create')}
                >
                  Add Course
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FacultyDashboard; 