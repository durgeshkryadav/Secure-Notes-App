import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #e0e0e0',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
          <strong>GD OFFICE:</strong> UNIT NO. 405, 4th FLOOR, TOWER A, UNITECH CYBER PARK, SECTOR 39, GURGAON-122003
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} NITS Solutions (India) Pvt Ltd | www.nits.ai
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
