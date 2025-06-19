import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button
} from '@mui/material';
import {
  School,
  People,
  Assignment,
  TrendingUp,
  Book,
  CheckCircle,
  AdminPanelSettings,
  Security,
  Analytics,
  Notifications,
  HealthAndSafety
} from '@mui/icons-material';

const quotes = [
  "Success is not the key to happiness. Happiness is the key to success.",
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "Opportunities don't happen, you create them.",
  "Don't watch the clock; do what it does. Keep going.",
  "The future depends on what you do today.",
  "Dream big and dare to fail.",
  "Your limitation—it's only your imagination."
];
const quoteOfTheDay = quotes[new Date().getDate() % quotes.length];

export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);

  const institutionalStats = {
    totalStudents: 1250,
    totalFaculty: 45,
    totalCourses: 85,
    placementRate: 78
  };

  const recentActivities = [
    { action: 'New student registration', user: 'Arjun Mehta', time: '2 hours ago' },
    { action: 'Course created', user: 'Dr. Amit Patel', time: '4 hours ago' },
    { action: 'Event scheduled', user: 'Prof. Priya Sharma', time: '6 hours ago' },
    { action: 'Faculty login', user: 'Prof. Sneha Reddy', time: '8 hours ago' }
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Motivational Quote */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, background: 'linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%)' }}>
        <Typography variant="subtitle1" align="center" sx={{ fontStyle: 'italic', color: 'primary.main' }}>
          "{quoteOfTheDay}"
        </Typography>
      </Paper>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Welcome, {user?.name || 'Administrator'}! 👨‍💼
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor institutional performance, manage users, and oversee academic operations.
        </Typography>
      </Box>

      {/* Campus Health Badge */}
      <Paper sx={{ p: 2, mb: 3, background: 'linear-gradient(90deg, #ffecd2 0%, #fcb69f 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Campus Health
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Overall institutional performance this week
            </Typography>
          </Box>
          <Chip 
            label="95% Attendance" 
            color="success" 
            icon={<HealthAndSafety />}
            sx={{ fontWeight: 'bold' }}
          />
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {institutionalStats.totalStudents}
                  </Typography>
                  <Typography variant="body2">Total Students</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <People />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {institutionalStats.totalFaculty}
                  </Typography>
                  <Typography variant="body2">Faculty Members</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <School />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {institutionalStats.totalCourses}
                  </Typography>
                  <Typography variant="body2">Active Courses</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <Book />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {institutionalStats.placementRate}%
                  </Typography>
                  <Typography variant="body2">Placement Rate</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <TrendingUp />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Notifications sx={{ mr: 1, color: 'info.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Recent Activities
              </Typography>
            </Box>
            
            <List sx={{ p: 0 }}>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        <People />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.action}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {activity.user} • {activity.time}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Security sx={{ mr: 1, color: 'info.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Quick Actions
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button 
                variant="contained" 
                fullWidth
                startIcon={<People />}
                sx={{ mb: 1 }}
              >
                Manage Users
              </Button>
              <Button 
                variant="outlined" 
                fullWidth
                startIcon={<Book />}
                sx={{ mb: 1 }}
              >
                Course Management
              </Button>
              <Button 
                variant="outlined" 
                fullWidth
                startIcon={<Assignment />}
                sx={{ mb: 1 }}
              >
                Event Management
              </Button>
              <Button 
                variant="outlined" 
                fullWidth
                startIcon={<Analytics />}
              >
                Generate Reports
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 