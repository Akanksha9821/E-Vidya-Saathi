import React, { useState } from 'react';
import { Box, CssBaseline, useTheme } from '@mui/material';
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
import Footer from '../footer/Footer';

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Header onMenuClick={handleSidebarToggle} />
      <Sidebar open={sidebarOpen} onClose={handleSidebarToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${theme.drawerWidth}px)` },
          ml: { sm: `${theme.drawerWidth}px` },
          mt: '64px',
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
}

export default DashboardLayout; 