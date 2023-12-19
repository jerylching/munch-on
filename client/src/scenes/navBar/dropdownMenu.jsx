import React from "react";
import { MenuItem, Menu } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DropdownMenu = ({ anchorEl, open, handleClose, handleLogout }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    handleClose();
    navigate(path);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      Paper={{
        style: {
          backgroundColor: "#E5D9D2", // Updated background color
        },
      }}
    >
      <MenuItem
        onClick={handleLogout}
        style={{ color: "#1F3528" }} // Updated text color
      >
        Logout
      </MenuItem>
    </Menu>
  );
};

export default DropdownMenu;
