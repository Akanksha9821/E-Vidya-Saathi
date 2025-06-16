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
} from '@mui/material';
import axios from 'axios';

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const [eventResponse, registrationsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/events/${id}`),
          axios.get(`http://localhost:5000/api/events/${id}/registrations`),
        ]);
        setEvent(eventResponse.data);
        setRegistrations(registrationsResponse.data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };
    fetchEventDetails();
  }, [id]);

  if (!event) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {event.name}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Event Details
              </Typography>
              <Typography variant="body1" paragraph>
                {event.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Date: {new Date(event.date).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Time: {new Date(event.date).toLocaleTimeString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Location: {event.location}
              </Typography>
            </Paper>
            {user?.role === 'faculty' && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Registrations
                </Typography>
                <List>
                  {registrations.map((registration) => (
                    <React.Fragment key={registration._id}>
                      <ListItem>
                        <ListItemText
                          primary={registration.student.name}
                          secondary={registration.student.email}
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
                  onClick={() => navigate(`/events/${id}/register`)}
                >
                  Register for Event
                </Button>
              )}
              {user?.role === 'faculty' && (
                <>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mb: 2 }}
                    onClick={() => navigate(`/events/${id}/edit`)}
                  >
                    Edit Event
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    onClick={() => navigate(`/events/${id}/delete`)}
                  >
                    Delete Event
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

export default EventDetails; 