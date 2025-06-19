import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Container } from '@mui/material';

function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
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