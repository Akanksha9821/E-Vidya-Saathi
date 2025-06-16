import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Placements = () => {
  // This would typically fetch placement opportunities from an API
  const placements = [
    { id: 1, company: 'Tech Corp', position: 'Software Engineer', location: 'New York' },
    { id: 2, company: 'Data Systems', position: 'Data Analyst', location: 'San Francisco' },
    { id: 3, company: 'Web Solutions', position: 'Frontend Developer', location: 'Remote' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Placement Opportunities
      </Typography>
      <Grid container spacing={3}>
        {placements.map((placement) => (
          <Grid item xs={12} md={6} lg={4} key={placement.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {placement.position}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {placement.company}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {placement.location}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  component={Link}
                  to={`/placements/${placement.id}`}
                  size="small"
                  color="primary"
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Placements; 