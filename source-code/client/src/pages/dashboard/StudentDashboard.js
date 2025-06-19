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
  LinearProgress,
  Button
} from '@mui/material';
import {
  School,
  Event,
  Assignment,
  Book,
  CheckCircle,
  Schedule,
  LocationOn,
  CalendarToday,
  Work
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

export default function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);

  const enrolledCourses = [
    {
      id: 1,
      code: 'CS201',
      title: 'Data Structures and Algorithms',
      faculty: 'Dr. Amit Patel',
      schedule: 'Mon, Wed 10:00 AM',
      room: 'Lab 101',
      progress: 75
    },
    {
      id: 2,
      code: 'ML301',
      title: 'Machine Learning Fundamentals',
      faculty: 'Prof. Meera Singh',
      schedule: 'Tue, Thu 2:00 PM',
      room: 'Lab 203',
      progress: 60
    }
  ];

  const pendingAssignments = [
    {
      id: 1,
      title: 'Implement Binary Search Tree',
      course: 'CS201 - Data Structures',
      dueDate: '2024-01-30',
      weight: 20
    },
    {
      id: 2,
      title: 'Linear Regression Implementation',
      course: 'ML301 - Machine Learning',
      dueDate: '2024-02-02',
      weight: 15
    }
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
          Welcome back, {user?.name || 'Student'}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your academic journey today.
        </Typography>
      </Box>

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
                    85%
                  </Typography>
                  <Typography variant="body2">Attendance Rate</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <CheckCircle />
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
                    5
                  </Typography>
                  <Typography variant="body2">Enrolled Courses</Typography>
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
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    3
                  </Typography>
                  <Typography variant="body2">Pending Assignments</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <Assignment />
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
                    2
                  </Typography>
                  <Typography variant="body2">Upcoming Events</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <Event />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Placement Status Badge */}
      <Paper sx={{ p: 2, mb: 3, background: 'linear-gradient(90deg, #ffecd2 0%, #fcb69f 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Placement Status
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track your job application progress
            </Typography>
          </Box>
          <Chip 
            label="Shortlisted" 
            color="warning" 
            icon={<Work />}
            sx={{ fontWeight: 'bold' }}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Progress: Applied → Shortlisted → Interview → Placed
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={50} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      </Paper>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Enrolled Courses */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <School sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                My Enrolled Courses
              </Typography>
            </Box>
            
            {enrolledCourses.map((course) => (
              <Card key={course.id} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {course.code}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {course.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Faculty: {course.faculty}
                      </Typography>
                    </Box>
                    <Chip 
                      label={`${course.progress}% Complete`}
                      color={course.progress >= 80 ? 'success' : course.progress >= 60 ? 'warning' : 'error'}
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Schedule sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {course.schedule}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {course.room}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Course Progress
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={course.progress} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Assignment sx={{ mr: 1, color: 'warning.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Pending Assignments
              </Typography>
            </Box>
            
            <List sx={{ p: 0 }}>
              {pendingAssignments.map((assignment, index) => (
                <React.Fragment key={assignment.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Assignment color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary={assignment.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {assignment.course}
                          </Typography>
                          <Typography variant="body2" color="error.main" sx={{ fontWeight: 'medium' }}>
                            Due: {assignment.dueDate} • Weight: {assignment.weight}%
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < pendingAssignments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Button 
              variant="outlined" 
              fullWidth 
              sx={{ mt: 2 }}
              startIcon={<Assignment />}
            >
              View All Assignments
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 