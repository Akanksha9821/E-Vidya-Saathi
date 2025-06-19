import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Container, Paper } from '@mui/material';

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

function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={2} sx={{ p: 2, mb: 2, background: 'linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%)' }}>
          <Typography variant="subtitle1" align="center" sx={{ fontStyle: 'italic', color: 'primary.main' }}>
            "{quoteOfTheDay}"
          </Typography>
        </Paper>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name}!
        </Typography>
        <Typography variant="body1">
          This is your dashboard. More features coming soon.
        </Typography>
      </Box>
    </Container>
  );
}

export default Dashboard; 