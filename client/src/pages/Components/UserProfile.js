import { Box, IconButton, Typography } from '@mui/material';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { GLOBALS } from '../../global';

const UserProfile = ({ userData, onClose }) => {
    
  return (
    <Box className = "user-profile">
        <IconButton onClick={() => onClose()} className="close-icon">
            <CloseIcon  />
        </IconButton>
        <Box className="details-main">
            <img alt='user-profile' src= {userData.photo ? GLOBALS.api_usersemedia + userData.photo : "/static/images/avatar/2.jpg"} className='user-photo'/>
            <Box className = "details">
                <Typography className='title'>  {userData.u_nm}</Typography>
                <Typography className='email'> {userData.email}</Typography>
            </Box>
        </Box>
    </Box>
  )
}

export default UserProfile