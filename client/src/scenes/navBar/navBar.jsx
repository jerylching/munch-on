import React, { useState } from 'react';
import { Typography, Box, Avatar } from '@mui/material';
import FlexBetween from '../../components/FlexBetween';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DropdownMenu from './DropdownMenu';
import guestImage from '../../assets/guest.png';

const NavBar = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Implement logout logic here, e.g., dispatch a logout action
    handleClose();
    // If you have an action to clear the user state, dispatch it here.
    // dispatch(logoutUser()); // This action should clear the user state in the Redux store.
    navigate('/'); // Redirect to login after logout
    // Clear any local storage or session storage as needed
  };

  return (
    <Box
      width='100%'
      backgroundColor='#1F3528'
      p='1rem 6%'
      position='fixed'
      top={0}
      left={0}
      right={0}
      zIndex='999'
    >
      <FlexBetween>
        <Typography
          onClick={() => navigate('/home')}
          fontWeight='bold'
          fontSize='32px'
          color='#E5D9D2'
          sx={{ cursor: 'pointer' }}
        >
          Munch-On
        </Typography>
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={handleMenuClick}
        >
          <Avatar
            src={user?.picture || guestImage} // Fallback to guestImage if no user picture is available
            alt={user?.username || 'Guest'}
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              marginRight: 1,
              backgroundColor: '#E5D9D2',
            }}
          />
          <Typography
            fontWeight='bold'
            fontSize='32px'
            color='#E5D9D2'
            sx={{ marginLeft: 1 }}
          >
            {user?.username || 'Guest'}
          </Typography>
        </Box>
      </FlexBetween>
      <DropdownMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        handleClose={handleClose}
        handleLogout={handleLogout}
      />
    </Box>
  );
};

export default NavBar;
