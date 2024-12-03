import { Box, Typography, Avatar } from '@mui/material';
import React from 'react';
import { GLOBALS } from '../../global';

const MessagesBox = ({ messages, logedInUser }) => {
  
  return (
    <Box className="messages-container" >
      { messages && messages.length > 0 && messages.map((message, index) => {
        const isSender = message.user_id === logedInUser.user_id;

        return (
          <Box  key={index} className="messages-main" sx={{  justifyContent: isSender ? 'flex-end' : 'flex-start', }} >
            {/* For Group Chat: Display Avatar, Name, and Message */}
            {message.isGroup_chat ? (
             <Box sx={{  flexDirection: isSender ? 'row-reverse' : 'row'}}  className="message-box"  >
                {/* User Avatar */}
                <Avatar  src={message.photo ? GLOBALS.api_usersemedia + message.photo : "/static/images/avatar/1.jpg"}  alt={message.u_nm}
                  sx={{ marginRight: isSender ? '0.5rem' : '0',  marginLeft: isSender ? '0' : '0.5rem'  }}   />
                {/* Message Content */}
                <Box className = "messsage" sx={{ backgroundColor: isSender ? "#005C4B": "#202C33"}}>
                  <Typography className='user-name' sx={{ color: isSender ? "#0cafcf" : "#ff0a92"}}> {message.u_nm} </Typography>
                  <Typography className='text'>{message.content}</Typography>
                </Box>
              </Box>
            ) : (
              // For One-to-One Chat: Display only message with Avatar
              <Box sx={{ flexDirection: isSender ? 'row-reverse' : 'row'}}  className="message-box"  >
                {/* User Avatar */}
                <Avatar  src={message.photo ? GLOBALS.api_usersemedia + message.photo : "/static/images/avatar/1.jpg"}  alt={message.u_nm}
                  sx={{ marginRight: isSender ? '0.5rem' : '0',  marginLeft: isSender ? '0' : '0.5rem'  }}   />
                <Box className = "messsage" sx={{ backgroundColor: isSender ? "#005C4B": "#202C33"}}>
                    <Typography className='text'>{message.content}</Typography>
                </Box>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default MessagesBox;
