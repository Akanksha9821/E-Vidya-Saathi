import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, Grid, Button, Box } from '@mui/material';

const PlacementDetails = () => {
  const { jobId } = useParams();

  // This would typically fetch job details from an API
  const jobDetails = {
    id: jobId,
    company: 'Tech Corp',
    position: 'Software Engineer',
    location: 'New York',
    description: 'We are looking for a skilled software engineer to join our team...',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      '3+ years of experience in software development',
      'Strong knowledge of JavaScript and React',
    ],
    salary: '$100,000 - $120,000',
    type: 'Full-time',
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {jobDetails.position}
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {jobDetails.company}
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Job Description
            </Typography>
            <Typography paragraph>
              {jobDetails.description}
            </Typography>

            <Typography variant="h6" gutterBottom>
              Requirements
            </Typography>
            <ul>
              {jobDetails.requirements.map((req, index) => (
                <li key={index}>
                  <Typography>{req}</Typography>
                </li>
              ))}
            </ul>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Job Details
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Location</Typography>
                <Typography>{jobDetails.location}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Salary</Typography>
                <Typography>{jobDetails.salary}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Job Type</Typography>
                <Typography>{jobDetails.type}</Typography>
              </Box>
              <Button variant="contained" color="primary" fullWidth>
                Apply Now
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default PlacementDetails; 