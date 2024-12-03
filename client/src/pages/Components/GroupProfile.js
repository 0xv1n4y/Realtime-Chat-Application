import { Avatar, Box, Button, Chip, IconButton, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { getUsers, resetUsers } from '../../store/actions/user-actions';
import { GLOBALS } from '../../global';
import { useDispatch, useSelector } from 'react-redux';
import { createGroup, resetGroupState } from '../../store/actions/group-actions';
import { getChats } from '../../store/actions/chat-actions';

const GroupProfile = ({onClose}) => {
    const dispatch = useDispatch();

    const [groupName, setGroupName] = useState("");
    const [search, setSearch] = useState("");
    const [userDetails, setUserDetails] = useState([]);
    const [validationError, setvalidationError] = useState(false);


    const users = useSelector( state => state.getUsersReducer.users);

    const createdGroup = useSelector( state => state.createGroupReducer.newGroup);

    useEffect(() => {
        if (search !== "") {
            dispatch(getUsers(search));  
        }
    }, [search, dispatch]);  

    useEffect(() => {
        if(Object.keys(createdGroup).length > 0) {
            setGroupName("");
            setSearch("");
            setvalidationError(false);
            setUserDetails([]);
            dispatch(getChats());
            dispatch(resetGroupState());
            onClose()
        }
    },[createdGroup, dispatch, onClose]);
    

    const handleAddUser = (user) => {
        setUserDetails((prevUserDetails) => {
            // Check if the user with the same userId already exists
            const isUserAlreadyAdded = prevUserDetails.some(
                (detail) => detail.userId === user.user_id
            );
    
            // If the user is not already in the array, add them
            if (!isUserAlreadyAdded) {
                return [...prevUserDetails, { u_nm: user.u_nm, userId: user.user_id, photo: user.photo }];
            }

            return prevUserDetails;
        });
    };
    
    const handleRemoveUser = (user) => {
        setUserDetails((prevUserDetails) => 
            prevUserDetails.filter((detail) => detail.userId !== user.userId)
        );
    };

    const handleSubmit = () => {
        if( groupName && userDetails.length > 1 ) {
            const users = userDetails.map((user) => user.userId);
            dispatch(createGroup({ group_name: groupName, users}))
        }else {
            setvalidationError(true);
        }
    }
  return (
    <Box className = "group-profile-main">
        <Box className = "header-container">
            <Typography className='title'>Create Group Chat</Typography>
            <CloseIcon  onClick={() => onClose()} className="close-icon"/>
        </Box>
        <Box className = "textfields-main">
                <TextField label=" GroupName" className={(!groupName && validationError) ? "validation-border" : "field"} variant="outlined"   value={groupName} onChange={(e) => setGroupName(e.target.value)}/>
                <TextField label="Add Users" className={(!search && validationError) ? "validation-border" : "field"} variant="outlined" onChange = {(e) => setSearch(e.target.value)} value={search}/>
        </Box>
        <Box className = "tooltip-main"> 
            {
                userDetails && userDetails.length > 0 && userDetails.map(user => (
                    <Chip
                    avatar={<Avatar alt="Natacha" src= { user.photo ? GLOBALS.api_usersemedia + user.photo : "/static/images/avatar/1.jpg"} />}
                    label={user.u_nm}
                    color='default'
                    onDelete={() => handleRemoveUser(user)}
                    />
                )) 
            }
        </Box>
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
        <Button className='group-action-button' onClick={handleSubmit}>Create Group</Button>
    </Box>
  )
}

export default GroupProfile