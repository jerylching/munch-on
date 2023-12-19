import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import mealPlanImage from '../../assets/meal-plan.jpg';
import recipesImage from '../../assets/recipes.jpg';
import pantryImage from '../../assets/pantry.jpg';
import groceryImage from '../../assets/grocery.jpg';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box p={3} minHeight='100%' backgroundColor={'#E5D9D2'}>
      {' '}
      {/* Brownish hue background */}
      <Typography
        variant='h4'
        textAlign='center'
        marginTop='100px'
        color='#000' /* Light beige text */
        fontWeight='bold'
      >
        Welcome to Munch-On!
      </Typography>
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
      >
        {/* Responsive container */}
        <Box
          display='flex'
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent='center'
        >
          {/* First Column */}
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            margin='25px'
          >
            <img
              src={mealPlanImage}
              alt='Meal Plan'
              style={{
                width: '300px',
                height: '300px',
                border: '5px solid black',
              }}
            />
            <Button
              onClick={() => navigate('/calendar')} // Navigate to calendar
              fullWidth
              sx={{
                mt: '1rem', // Apply top margin
                p: '1rem',
                backgroundColor: '#1F3528', // Dark green buttons
                color: '#E5D9D2', // Light beige text on buttons
                '&:hover': { backgroundColor: '#AD8157' }, // Brownish hue on hover
              }}
            >
              My Meal Plan (Calendar)
            </Button>
          </Box>
          {/* Second Column */}
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            margin='25px'
          >
            <img
              src={recipesImage}
              alt='Recipes'
              style={{
                width: '300px',
                height: '300px',
                border: '5px solid black',
              }}
            />
            <Button
              onClick={() => navigate('/recipes')} // Navigate to recipes
              fullWidth
              sx={{
                mt: '1rem', // Apply top margin
                p: '1rem',
                backgroundColor: '#1F3528', // Dark green buttons
                color: '#E5D9D2', // Light beige text on buttons
                '&:hover': { backgroundColor: '#AD8157' }, // Brownish hue on hover
              }}
            >
              RECIPES
            </Button>
          </Box>
        </Box>

        {/* Responsive container */}
        <Box
          display='flex'
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent='center'
        >
          {/* Third Column */}
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            margin='25px'
          >
            <img
              src={pantryImage}
              alt='Pantry'
              style={{
                width: '300px',
                height: '300px',
                border: '5px solid black',
              }}
            />
            <Button
              onClick={() => navigate('/pantry')} // Navigate to pantry
              fullWidth
              sx={{
                mt: '1rem', // Apply top margin
                p: '1rem',
                backgroundColor: '#1F3528', // Dark green buttons
                color: '#E5D9D2', // Light beige text on buttons
                '&:hover': { backgroundColor: '#AD8157' }, // Brownish hue on hover
              }}
            >
              PANTRY
            </Button>
          </Box>
          {/* Fourth Column */}
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            margin='25px'
          >
            <img
              src={groceryImage}
              alt='Grocery'
              style={{
                width: '300px',
                height: '300px',
                border: '5px solid black',
              }}
            />
            <Button
              onClick={() => navigate('/grocery')} // Navigate to grocery
              fullWidth
              sx={{
                mt: '1rem', // Apply top margin
                p: '1rem',
                backgroundColor: '#1F3528', // Dark green buttons
                color: '#E5D9D2', // Light beige text on buttons
                '&:hover': { backgroundColor: '#AD8157' }, // Brownish hue on hover
              }}
            >
              GROCERY
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
