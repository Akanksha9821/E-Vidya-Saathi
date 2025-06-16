import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Events = () => {
  // This would typically fetch events from an API
  const events = [
    { id: 1, title: 'Tech Workshop', date: '2024-03-25', description: 'Learn about the latest technologies' },
    { id: 2, title: 'Career Fair', date: '2024-03-28', description: 'Connect with potential employers' },
    { id: 3, title: 'Hackathon', date: '2024-04-01', description: 'Build something amazing in 24 hours' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Upcoming Events
      </Typography>
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} md={6} lg={4} key={event.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {event.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {event.date}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  component={Link}
                  to={`/events/${event.id}`}
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

export default Events; 