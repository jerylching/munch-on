import { Box, Typography, useMediaQuery } from '@mui/material';
import LoginForm from './loginForm.jsx';

const LoginPage = () => {
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');

  return (
    <Box
      width='100%'
      height='100%'
      backgroundColor={'#AD8157'} // Changed to brownish hue
    >
      <Box>
        <Box
          width='100%'
          backgroundColor={'#1F3528'} // Dark green
          p='1rem 6%'
          textAlign='center'
        >
          <Typography
            fontWeight='bold'
            fontSize='32px'
            color='#E5D9D2' // Light beige for better contrast
          >
            Munch-On
          </Typography>
        </Box>

        <Box
          width={isNonMobileScreens ? '50%' : '93%'}
          p='2rem'
          m='2rem auto'
          borderRadius='1.5rem'
          backgroundColor={'#E5D9D2'} // Consistent with the page background
        >
          <Typography
            fontWeight='500'
            variant='h5'
            sx={{ mb: '1.5rem', color: '#1F3528' }} // Text color changed to dark green
          >
            Welcome to Munch-On!
          </Typography>
          <LoginForm />
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
