import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary"   textAlign='center'>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Medireco
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function StickyFooter() {
  return (  
      <Box
        component="footer"
        sx={{
          display: 'flex',
          float: 'bottom',
          flexDirection: 'column',
          py: 3,
          px: 2,
          mt: 'auto',
          top: 'auto',
          bottom: 0,
        }}
      >
        <Container maxWidth="sm">
          <Copyright />
        </Container>
      </Box>
  );
}