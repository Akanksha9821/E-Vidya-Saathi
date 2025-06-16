import React from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function FacultyDashboard() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.name}!
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  My Courses
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your courses and student enrollments
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate('/courses')}>
                  Manage Courses
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Attendance
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track and manage student attendance
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate('/attendance')}>
                  Manage Attendance
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Events
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create and manage events
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate('/events')}>
                  Manage Events
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Placements
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Post and manage job opportunities
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate('/placements')}>
                  Manage Placements
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default FacultyDashboard; 