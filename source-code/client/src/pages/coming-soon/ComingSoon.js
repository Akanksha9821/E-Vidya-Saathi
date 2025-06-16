import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import axios from 'axios';

function ComingSoon() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Set the launch date (example: 30 days from now)
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 30);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });

      if (distance < 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/notifications/subscribe', {
        email,
      });
      setSuccess('Thank you for subscribing! We will notify you when we launch.');
      setError('');
      setEmail('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error subscribing to notifications');
      setSuccess('');
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            Coming Soon
          </Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            E-Vidya Saathi
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            We are working hard to bring you an amazing educational platform.
            Stay tuned for our launch!
          </Typography>

          <Box sx={{ my: 4 }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Paper
                  sx={{
                    p: 2,
                    minWidth: 100,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h4">{timeLeft.days}</Typography>
                  <Typography variant="body2">Days</Typography>
                </Paper>
              </Grid>
              <Grid item>
                <Paper
                  sx={{
                    p: 2,
                    minWidth: 100,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h4">{timeLeft.hours}</Typography>
                  <Typography variant="body2">Hours</Typography>
                </Paper>
              </Grid>
              <Grid item>
                <Paper
                  sx={{
                    p: 2,
                    minWidth: 100,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h4">{timeLeft.minutes}</Typography>
                  <Typography variant="body2">Minutes</Typography>
                </Paper>
              </Grid>
              <Grid item>
                <Paper
                  sx={{
                    p: 2,
                    minWidth: 100,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h4">{timeLeft.seconds}</Typography>
                  <Typography variant="body2">Seconds</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mt: 4, width: '100%', maxWidth: 400 }}>
            <Typography variant="h6" gutterBottom>
              Get Notified When We Launch
            </Typography>
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            {success && (
              <Typography color="success.main" sx={{ mb: 2 }}>
                {success}
              </Typography>
            )}
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<SendIcon />}
                  >
                    Notify Me
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default ComingSoon; 