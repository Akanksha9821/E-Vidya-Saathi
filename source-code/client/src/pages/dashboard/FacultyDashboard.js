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
  Book,
  CheckCircle,
  Schedule,
  LocationOn,
  Grade,
  Event,
  Notifications
} from '@mui/icons-material';

export default function FacultyDashboard() {
  const { user } = useSelector((state) => state.auth);

  const teachingCourses = [
    {
      id: 1,
      code: 'CS201',
      title: 'Data Structures and Algorithms',
      students: 45,
      schedule: 'Mon, Wed 10:00 AM',
      room: 'Lab 101',
      attendance: 92
    },
    {
      id: 2,
      code: 'CS210',
      title: 'Database Management Systems',
      students: 38,
      schedule: 'Wed 11:00 AM',
      room: 'Lab 102',
      attendance: 88
    }
  ];

  const pendingGrading = [
    {
      id: 1,
      title: 'Binary Search Tree Implementation',
      course: 'CS201 - Data Structures',
      submissions: 42,
      totalStudents: 45,
      dueDate: '2024-01-25'
    },
    {
      id: 2,
      title: 'Database Design Project',
      course: 'CS210 - Database Systems',
      submissions: 35,
      totalStudents: 38,
      dueDate: '2024-01-28'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Welcome, {user?.name || 'Professor'}! 👨‍🏫
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your courses, track student progress, and stay updated with academic activities.
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
                    {teachingCourses.length}
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
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {teachingCourses.reduce((sum, course) => sum + course.students, 0)}
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
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {pendingGrading.length}
                  </Typography>
                  <Typography variant="body2">Pending Grading</Typography>
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
                    {Math.round(teachingCourses.reduce((sum, course) => sum + course.attendance, 0) / teachingCourses.length)}%
                  </Typography>
                  <Typography variant="body2">Avg Attendance</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <CheckCircle />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Teaching Courses */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <School sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                My Teaching Courses
              </Typography>
            </Box>
            
            {teachingCourses.map((course) => (
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
                        {course.students} students enrolled
                      </Typography>
                    </Box>
                    <Chip 
                      label={`${course.attendance}% Attendance`}
                      color={course.attendance >= 90 ? 'success' : course.attendance >= 80 ? 'warning' : 'error'}
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Schedule sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {course.schedule}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {course.room}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      startIcon={<People />}
                    >
                      View Students
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small"
                      startIcon={<Assignment />}
                    >
                      Manage Assignments
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small"
                      startIcon={<CheckCircle />}
                    >
                      Take Attendance
                    </Button>
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
                Pending Grading
              </Typography>
            </Box>
            
            <List sx={{ p: 0 }}>
              {pendingGrading.map((assignment, index) => (
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
                          <Typography variant="body2" color="text.secondary">
                            {assignment.submissions}/{assignment.totalStudents} submissions
                          </Typography>
                          <Typography variant="body2" color="error.main" sx={{ fontWeight: 'medium' }}>
                            Due: {assignment.dueDate}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < pendingGrading.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Button 
              variant="outlined" 
              fullWidth 
              sx={{ mt: 2 }}
              startIcon={<Assignment />}
            >
              Grade All Assignments
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 