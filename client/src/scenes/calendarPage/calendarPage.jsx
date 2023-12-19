import React from 'react';
import { Typography, Box } from '@mui/material';
import Calendar from './calendar.jsx';

const CalendarPage = () => {
  return (
    <Box p={3} minHeight='100%' backgroundColor={'#E5D9D2'}>
      {' '}
      {/* Brownish hue background */}
      <Typography
        variant='h4'
        textAlign='center'
        marginTop='100px'
        marginBottom='10px'
        color='#000' /* Light beige text */
      >
        MEAL PLANNER
      </Typography>
      <Calendar />
    </Box>
  );
};

export default CalendarPage;
