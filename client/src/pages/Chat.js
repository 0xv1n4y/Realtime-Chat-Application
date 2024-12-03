import { Box, Button, CircularProgress, Dialog, IconButton, InputBase, Paper, TextField, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UserProfile from './Components/UserProfile';
import { getChats } from '../store/actions/chat-actions';
import {  resetSelectedUser, selectUser } from '../store/actions/global-actions';
import { getMessages, resetMessages, sendNewMessage } from '../store/actions/message-actions';
import GroupProfile from './Components/GroupProfile';
import { resetUsers } from '../store/actions/user-actions';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import EditGroup from './Components/EditGroup';
import MessagesBox from './Components/MessagesBox';
import io from "socket.io-client";
import Lottie from 'react-lottie-player';
import animationdata from "../animations/typing.json";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ENDPOINT = "http://localhost:7010"; // Socket endpoint
let socket, selectedChatCompare; // Global variables for socket connection and selected chat comparison

const Chat = () => {
  const dispatch = useDispatch();
  const fetchOnce = useRef(false); // Flag to avoid multiple fetches
 
  // State variables to handle UI and messages
  const [open, setOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [editGroup, setEditGroup] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [content, setContent] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Fetch logged in user from Redux store
  const { userLogin, userSignUp , userDetails} = useSelector(state => ({
    userLogin: state.authUserDataReducer.authUser,
    userSignUp: state.addNewUserReducer.authUser,
    userDetails: state.fetchTokenDetailsReducer.token
  }));
  
  const logedInUser = { ...userLogin, ...userSignUp, ...userDetails }; // Merge logged in user data
 
  // Fetch selecteduser, chats, messages, and notifications from Redux store
  const selectedUser = useSelector(state => state.selectedUserReducer.selectUser);
  const myChats = useSelector(state => state.getChatsReducer.chats);
  const messages = useSelector(state => state.getMessagesReducer.messages);
  const newMessage = useSelector(state => state.sendNewMessageReducer.newMessage);
  const AllNotfications = useSelector(state => state.notficationReducer.notfications);

  // Update messages list when messages state changes
  useEffect(() => {
    if (messages) {
      setAllMessages(messages);
      setLoading(false);
      if(socket && selectedUser) {
        socket.emit('join room', selectedUser.chat_id); // Join socket room for selected chat
      }
    }
  }, [messages]);

   // Handle sending new message and updating chat
  useEffect(() => {
    if (newMessage && Object.keys(newMessage).length > 0 && socket) {
      socket.emit("new message", newMessage);
      setAllMessages((prevMessages) => [...prevMessages, newMessage]);
      dispatch(getChats());  
    }
  }, [newMessage, dispatch]);
  
  // Set up socket connection and event listeners on mount
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', logedInUser.user_id);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
  }, []);

  // Send message when "Enter" key is pressed
  const sendMessage = (event) => {
    if(event.key === "Enter" ) {
      event.preventDefault();
      if (content) {
        dispatch(sendNewMessage({ content, chatId: selectedUser.chat_id }));
        socket.emit("stop typing", selectedUser.chat_id); // Stop typing when sending the message
        setContent(""); // Clear input after sending
      }
    }
  };
  
 // Fetch messages for the selected chat
  useEffect(() => {
    if(selectedUser && fetchOnce.current) {
      dispatch(getMessages(selectedUser.chat_id));
      selectedChatCompare = selectedUser;
      fetchOnce.current = false;
    }
  },[selectedUser]);

  // Handle incoming messages from socket
  useEffect(() => {
    const handleMessageReceived = (newMessageRecived) => {
      console.log("New message received:", newMessageRecived);
  
      // If no chat is selected or the selected chat does not match the message's chat_id
      if (!selectedChatCompare || selectedChatCompare.chat_id !== newMessageRecived.chat_id) {
         // Handle notifications
      } else {
        // If the message is from the currently selected chat, add the message to the active chat
        setAllMessages((prevMessages) => [...prevMessages, newMessageRecived]);
      }
    };
  
    // Always listen for messages, regardless of the selected chat state
    socket.on("message Recived", handleMessageReceived);
  
    // Clean up listener on unmount to avoid duplicates
    return () => {
      socket.off("message Recived", handleMessageReceived);
    };
  }, [AllNotfications, selectedChatCompare, allMessages, dispatch]);

  // Fetch chat list on mount
  useEffect(() => {
    if(!fetchOnce.current) {
      dispatch(getChats()); // Fetch all chats
      fetchOnce.current = true;
    }
  }, [dispatch]);

  // Handle typing events for real-time typing indicator
  const typingHandler = (e) => {
    setContent(e.target.value);
  
    if (!socketConnected || !selectedUser) return; // Ensure user is connected and a chat is selected
  
    // Only emit typing if the user is in the same chat
    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedUser.chat_id);
    }
  
    let lastTypingTime = new Date().getTime();
    const timerLength = 3000; // 3 seconds for typing timeout
  
    // Set a timeout to stop typing if no further input
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
  
      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedUser.chat_id);
        setTyping(false);
      }
    }, timerLength);
  };
  // Select a user to start chatting
  const handleSelectUser = (user) => {
    dispatch(selectUser(user));
    fetchOnce.current = true;
    setLoading(true);
  };
  // Open new group dialog
  const handleOpenGroup = () => {
    setGroupOpen(true);
  };
 // Close new group dialog
  const handleCloseGroup = () => {
    setGroupOpen(false);
    dispatch(resetUsers());
  };
 // Open edit group dialog
  const handleEditGroupOpen = () => {
    setEditGroup(true);
  };
  // Close edit group dialog
  const handleEditGroupClose = () => {
    setEditGroup(false);
  };
  // Remove selected user and reset messages
  const handleRemoveSelectedUser = () => {
    dispatch(resetSelectedUser());
    dispatch(resetMessages()); // Reset messages
  }

  return (
    <Box className="chatbox-main">
      <Box className={`mychats-main ${ selectedUser && Object.keys(selectedUser).length > 0 ? 'hide' : ''}`}>
        <Box className="header">
          <Typography className='title'>Chats</Typography>
          <Button variant="outlined" className='group-button' onClick={handleOpenGroup} startIcon={<GroupAddIcon />}>
            New Group
          </Button>
        </Box>
        <Box className="all-chats">
          {myChats.length > 0 && (
            myChats.map((chat, index) => (
              <Box key={index} className="chat-box" onClick={() => handleSelectUser(chat)}>
                <Typography className='name'>{!chat.isGroup_chat ? chat.u_nm : chat.group_name}</Typography>
                {chat.latest_message && (
                  <Typography className='message'>
                    {chat.latest_message.length > 30 ? chat.latest_message.slice(0, 30) + "..." : chat.latest_message}
                  </Typography>
                )}
              </Box>
            ))
          )}
        </Box>
      </Box>
      <Box className={`main-chatbox ${ selectedUser && Object.keys(selectedUser).length > 0 ? 'show' : 'hide'}`}>
        {selectedUser && Object.keys(selectedUser).length > 0 ? (
          <>
            <Box className="header">
              {!selectedUser.isGroup_chat ? (
                <>
                  <IconButton  className="back-button" onClick={handleRemoveSelectedUser} >
                    <ArrowBackIcon />
                  </IconButton>
                  <Typography className="title">{selectedUser?.u_nm || 'User'}</Typography>
                  <IconButton className="eye-button" onClick={() => setOpen(true)}>
                    <VisibilityIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton  className="back-button" onClick={handleRemoveSelectedUser}>
                    <ArrowBackIcon />
                  </IconButton>
                  <Typography className="title">{selectedUser?.group_name || 'Group'}</Typography>
                  <IconButton className="eye-button" onClick={handleEditGroupOpen}>
                    <GroupRemoveIcon />
                  </IconButton>
                </>
              )}
            </Box>
            {loading ? (
              <Box className="spinner-main">
                 <CircularProgress size="5rem" />
              </Box>
              ): (
                <Box className="chat-content">
                  <MessagesBox messages={allMessages} logedInUser={logedInUser} />
                  </Box>
              )}
            
            <Box className="chat-textbox">
              { isTyping ? (
                <Box sx={{ height: "70px", width: "70px" }}>
                  <Lottie loop animationData={animationdata}  play sx={{ height: "70px", width: "70px" }}  />
                </Box>
              ) : ( <></>)}
              <Paper component="form"  className='search-main' >
                <InputBase  sx={{ ml: 2, flex: 1, width: '90%' }}  className='text-box' placeholder="Message...." value={content} onChange={typingHandler}   onKeyDown={sendMessage}/>
              </Paper>
            </Box>
          </>
        ) : (
          <Box className="message">Click on a user to start chatting</Box>
        )}
      </Box>
      {selectedUser && (
        <>
          <Dialog open={open}>
            <UserProfile userData={selectedUser} onClose={() => setOpen(false)} />
          </Dialog>
          <Dialog open={editGroup}>
            <EditGroup userData={selectedUser} onClose={handleEditGroupClose} logedInUser={logedInUser} />
          </Dialog>
        </>
      )}
      <Dialog open={groupOpen}>
        <GroupProfile onClose={handleCloseGroup} />
      </Dialog>
    </Box>
    
  );
};

export default Chat;
