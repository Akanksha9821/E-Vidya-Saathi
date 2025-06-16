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

function AdminDashboard() {
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
                  Users
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage users and their roles
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate('/users')}>
                  Manage Users
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Courses
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage all courses and enrollments
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
                  Events
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage all events and registrations
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
                  Manage all job postings and applications
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

export default AdminDashboard; 