import { Avatar, Box, Dialog, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { GLOBALS } from '../global';
import UserProfile from './Components/UserProfile';
import { logout, resetAddNewUserError, resetAuthDataError, resetLogoutState, resetTokenDetails } from '../store/actions/auth-actions';
import { resetSelectedUser } from '../store/actions/global-actions';

const Header = ({ handleDrawerToggle }) => {

  const dispatch = useDispatch();

  const fetchOnce = useRef(false);

  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null); 

  const [open,setOpen] = useState(false);

  const logoutStatus = useSelector(state => state.logoutReducer.isLogout);
  const { userLogin, userSignUp, userDetails  } = useSelector(state => ({
    userLogin: state.authUserDataReducer.authUser,
    userSignUp: state.addNewUserReducer.authUser,
    userDetails: state.fetchTokenDetailsReducer.token
  }));
  
  const userData = { ...userLogin, ...userSignUp, ...userDetails };

  useEffect(() => {
    if(logoutStatus && fetchOnce.current) {
      dispatch(resetTokenDetails());
      dispatch(resetAddNewUserError());
      dispatch(resetAuthDataError());
      dispatch(resetLogoutState());
      dispatch(resetSelectedUser());
    }
  },[logoutStatus])

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget); 
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false)
  }


  const handleLogout = () => {
    dispatch(logout());
    fetchOnce.current = true;
  }

  return (
    <Box className="header-main">
      <IconButton edge="start" aria-label="menu" sx={{ mr: 2 }} onClick={handleDrawerToggle}>
        <MenuIcon className="menu-icon" />
      </IconButton>
      <Typography className="title">Sphere</Typography>
      <Box>
          <Tooltip title="Open Settings">
            <IconButton onClick={handleUserMenuOpen} className="user-menu-icon">
              <Avatar alt="Avatar" src= {userData.photo ? GLOBALS.api_usersemedia + userData.photo : "/static/images/avatar/2.jpg"} />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={userMenuAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(userMenuAnchorEl)}
            onClose={handleUserMenuClose}
          >
            <MenuItem>
              <Typography className="menu-item" onClick = {handleOpen}>Profile</Typography>
            </MenuItem>
            <MenuItem>
              <Typography className="menu-item" onClick = {handleLogout}>Logout</Typography>
            </MenuItem>
          </Menu>
      </Box>
      <Dialog open = {open}>
        <UserProfile  userData = {userData} onClose = {handleClose}/>
      </Dialog>
    </Box>
  );
};

export default Header;
