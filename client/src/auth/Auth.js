import React, { useState } from 'react';
import Login from "./components/Login";
import { Box, Typography } from '@mui/material';
import Signup from './components/Signup';
import chatLogo from "../images/chat-logo.png";

const Auth = () => {
  const [auth, setAuth] = useState(false);

  const updateAuthState = (newAuthState) => {
    setAuth(newAuthState);
  };

  return (
    <Box className="auth-main">
       <Typography className='title'>Sphere</Typography>
        <Box className="auth-container">
          <Box className="description">
            <Typography className='desc'>Enhance your communication experience with Sphere—offering real-time messaging, seamless file sharing, and a personalized space for effortless connection. Sphere is designed to bring people closer, providing a secure and intuitive environment for meaningful interactions.</Typography>
            <img src={chatLogo} alt="Chat Logo" className='chat-logo' />
          </Box>
          {!auth ? <Login updateAuthState = {updateAuthState}/> : <Signup updateAuthState={updateAuthState}/> }
        </Box>
    </Box>
  )
}

export default Auth