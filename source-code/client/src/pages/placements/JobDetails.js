import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import axios from 'axios';

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const [jobResponse, applicationsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/placements/${id}`),
          axios.get(`http://localhost:5000/api/placements/${id}/applications`),
        ]);
        setJob(jobResponse.data);
        setApplications(applicationsResponse.data);
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };
    fetchJobDetails();
  }, [id]);

  if (!job) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {job.title}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Job Details
              </Typography>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                {job.company}
              </Typography>
              <Typography variant="body1" paragraph>
                {job.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Location: {job.location}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Salary: {job.salary}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Posted: {new Date(job.postedDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Requirements: {job.requirements}
              </Typography>
            </Paper>
            {user?.role === 'faculty' && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Applications
                </Typography>
                <List>
                  {applications.map((application) => (
                    <React.Fragment key={application._id}>
                      <ListItem>
                        <ListItemText
                          primary={application.student.name}
                          secondary={application.student.email}
                        />
                        <Chip
                          label={application.status}
                          color={getStatusColor(application.status)}
                          size="small"
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Actions
              </Typography>
              {user?.role === 'student' && (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mb: 2 }}
                  onClick={() => navigate(`/placements/${id}/apply`)}
                >
                  Apply for Job
                </Button>
              )}
              {user?.role === 'faculty' && (
                <>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mb: 2 }}
                    onClick={() => navigate(`/placements/${id}/edit`)}
                  >
                    Edit Job
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    onClick={() => navigate(`/placements/${id}/delete`)}
                  >
                    Delete Job
                  </Button>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default JobDetails; 