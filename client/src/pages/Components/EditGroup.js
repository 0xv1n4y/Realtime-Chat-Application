import { Avatar, Box, Button, Chip, IconButton, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { getUsers, resetUsers } from '../../store/actions/user-actions';
import { GLOBALS } from '../../global';
import { useDispatch, useSelector } from 'react-redux';
import { addNewMembers, leaveGroup, removeMembers, resetaddMembers, resetLeaveGroup, resetRemoveMembers, resetUpdateGroupName, updateGroupName } from '../../store/actions/group-actions';
import { getChats } from '../../store/actions/chat-actions';
import { resetSelectedUser, selectUser } from '../../store/actions/global-actions';

const EditGroup = ({ userData, onClose , logedInUser}) => {
    const dispatch = useDispatch();
    const fetchOnce = useRef(false);
    const [groupName, setGroupName] = useState("");
    const [search, setSearch] = useState("");
    const [userDetails, setUserDetails] = useState([]);
     
    const users = useSelector( state => state.getUsersReducer.users);
    const updatedGroupName = useSelector( state => state.updateGroupNameReducer.updatedGroupName);
    const addedNewMembers = useSelector( state => state.addNewMembersReducer.newMembers);
    const removedMembers = useSelector( state => state.removeMembersReducer.removeMembers);
    const leaveGroupStatus = useSelector( state => state.leaveGroupReducer.leaveGroup);
    const chats = useSelector( state => state.getChatsReducer.chats);

    useEffect(() => {
      if (chats.length > 0 && fetchOnce.current) {
        const selectedChat = chats.find((chat) => chat.chat_id === userData.chat_id);
        dispatch(selectUser(selectedChat));
        dispatch(resetUsers());
        setUserDetails([]); // Clear userDetails
        setSearch("");      // Clear search field
        setGroupName("");   // Reset groupName
        fetchOnce.current = false; 
      }
    
    }, [chats, dispatch]);
    
  // useEffect to handle chat fetching after updates
  useEffect(() => {
    if (fetchOnce.current && (updatedGroupName?.status || addedNewMembers?.status || removedMembers?.status)) {
      dispatch(getChats()); // Fetch chats after group update
      fetchOnce.current = true; // Reset the fetchOnce flag to prevent loops
    }
  }, [updatedGroupName, addedNewMembers, removedMembers, dispatch]);

  // useEffect to handle when the user leaves the group
  useEffect(() => {
    if (leaveGroupStatus?.status) {
      onClose();  // Close the group edit modal
      dispatch(resetSelectedUser());
      dispatch(getChats()); // Fetch chats only after leaving the group
      dispatch(resetLeaveGroup());
    }
  }, [leaveGroupStatus, dispatch, onClose]);

  // Handle searching users
  const handleSearch = (event) => {
    if (event.key === "Enter" && search.trim()) {
      dispatch(getUsers(search.trim()));
    }
  };

  // Handle removing user from group
  const handleRemoveUser = (user_id) => {
    if (logedInUser.user_id === userData.group_admin) {
      dispatch(removeMembers({ group_id: userData.chat_id, user_id }));
      fetchOnce.current = true;  // Set fetch flag for later useEffect call
    }
  };

  // Handle leaving the group
  const handleLeaveGroup = () => {
    dispatch(leaveGroup(userData.chat_id));
  };

  // Update group name
  const updateUserName = () => {
    if (groupName && logedInUser.user_id === userData.group_admin) {
      dispatch(updateGroupName({ group_id: userData.chat_id, groupName }));
      fetchOnce.current = true;
    }
  };

  // Handle adding new user to group
  const handleAddUser = (newUser) => {
    setUserDetails((prevUserDetails) => {
      const isUserAlreadyAdded = prevUserDetails.some(detail => detail.userId === newUser.user_id);
      const isUserAlreadyExist = userData.users.some(user => user.user_id === newUser.user_id);

      if (!isUserAlreadyAdded && !isUserAlreadyExist) {
        return [...prevUserDetails, { u_nm: newUser.u_nm, userId: newUser.user_id, photo: newUser.photo }];
      }
      return prevUserDetails;
    });
  };

  // Handle removing added user
  const handleDeleteUser = (user) => {
    setUserDetails(prevUsers => prevUsers.filter(prevUser => prevUser.userId !== user.userId));
    fetchOnce.current = true;
  };

  // Add new users to group
  const addNewUsers = () => {
    if (logedInUser.user_id === userData.group_admin) {
      const users = userDetails.map(user => user.userId);
      dispatch(addNewMembers({ groupId: userData.chat_id, users }));
      fetchOnce.current = true;
    }
  };

  return (
    <Box className = "edit-profile-main">
    <Box className = "header-container">
        <Typography className='title'>{userData?.group_name}</Typography>
        <CloseIcon  onClick={() => onClose()} className="close-icon"/>
    </Box>
    <Box className = "tooltip-main"> 
        {
            userData.users && userData.users.length > 0 && userData.users.map(user => (
              userData.group_admin === logedInUser.user_id ? (
                <Chip
                avatar={<Avatar alt="Natacha" src= { user.photo ? GLOBALS.api_usersemedia + user.photo : "/static/images/avatar/1.jpg"} />}
                label={user.u_nm}
                color='default'
                onDelete={() => handleRemoveUser(user.user_id)}
               /> 
              ) : (
                <Chip
                    avatar={<Avatar alt="Natacha" src= { user.photo ? GLOBALS.api_usersemedia + user.photo : "/static/images/avatar/1.jpg"} />}
                    label={user.u_nm}
                    color='default'
               /> 
              )
            )) 
        }
    </Box>
    { userData.group_admin === logedInUser.user_id && (

      <>
          <Box className = "textfields-main">
          <Box className = "update-username">
            <TextField fullWidth label=" GroupName" className="field" variant="outlined"   value={groupName} onChange={(e) => setGroupName(e.target.value)}/>
            <Button onClick = {updateUserName} className='secondary-action-button update'>Update</Button>
          </Box>
          <Box className = "update-username">
            <TextField fullWidth label="Add Users" className="field" variant="outlined" onChange = {(e) => setSearch(e.target.value)}  onKeyDown = {handleSearch}value={search}/>
            <Button onClick = {addNewUsers} className='secondary-action-button add'>Add</Button>
          </Box>
                
        </Box>
        <Box className = " tooltip-main">
        {
            userDetails && userDetails.length > 0 && userDetails.map(user => (
                <Chip
                avatar={<Avatar alt="Natacha" src= { user.photo ? GLOBALS.api_usersemedia + user.photo : "/static/images/avatar/1.jpg"} />}
                label={user.u_nm}
                variant='outlined'
                color='success'
                onDelete={() => handleDeleteUser(user)}
                />
            )) 
        }
        </Box>
      </>

    )}

    <Box className = "profile-main">
        {
            users && users.length > 0  &&  (
                users.map((user, index) => (
                    <Box className="profile" key={index} onClick = {() => handleAddUser(user)}>
                    <Avatar src={ user.photo ? GLOBALS.api_usersemedia + user.photo : "/static/images/avatar/2.jpg"} alt='user-profile' className='user-photo'/>
                    <Box className="details">
                    <Typography className='title'>{user.u_nm}</Typography>
                    <Typography className='message'>{user.email}</Typography>
                    </Box>
                </Box>
                ))
            ) 
        }
    </Box> 
    <Button className='group-action-button' onClick={handleLeaveGroup}>Leave Group</Button>
</Box>
  )
}

export default EditGroup;