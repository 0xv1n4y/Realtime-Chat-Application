import { Avatar, Box, IconButton, InputBase,  Paper, Skeleton, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, resetUsers } from '../../store/actions/user-actions';
import { useEffect, useRef, useState } from 'react';
import { GLOBALS } from '../../global';
import { selectUser } from '../../store/actions/global-actions';
import { createChat, getChats } from '../../store/actions/chat-actions';
import { getMessages } from '../../store/actions/message-actions';

const MenuDrawer = ({setOpen}) => {
  const dispatch = useDispatch();
  const fetchOnce = useRef(false); // useRef to prevent multiple unnecessary fetches

   // Local state to handle search input and loading state
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  

  const { userLogin, userSignUp, userDetails } = useSelector(state => ({  // Extract login and signup user data from Redux store
    userLogin: state.authUserDataReducer.authUser,
    userSignUp: state.addNewUserReducer.authUser,
    userDetails: state.fetchTokenDetailsReducer.token
  }));

  const users = useSelector( state => state.getUsersReducer.users);
  const newChat = useSelector (state => state.createChatReducer.newChat);
  const selectedUser = useSelector(state => state.selectedUserReducer.selectUser);
  
  const userData = { ...userLogin, ...userSignUp, ...userDetails };

  useEffect(() => {
    if(newChat?.status === true && selectedUser && fetchOnce.current) {
      dispatch(getChats());
      dispatch(getMessages(selectedUser.chat_id));
      fetchOnce.current = false;
    }
  },[newChat, selectedUser])
 
  const handleSearch = () => {
    if (search && Object.keys(userData).length > 0) {
      setLoading(true); // Set loading state to true
      dispatch(getUsers(search)); // Dispatch action to fetch users based on search input
    }
  };
  
  const handleSubmit = (event) => {
    if (event.type === 'keydown' && event.key !== 'Enter') {
      return; // Only proceed if it's a keydown event and the key is 'Enter'
    }
    
    event.preventDefault(); // Prevent default form submission behavior
    handleSearch(); // Trigger the search logic
  };
  

  useEffect(() => {
    if (users.length > 0) {
      setLoading(false);
    }
  }, [users]);

  const handleUser = (user) => {
    dispatch(selectUser(user));
    dispatch(createChat(user.user_id));
    fetchOnce.current = true;
    dispatch(resetUsers());
    setSearch("");
    setOpen(false);
  };

  return (
    <Box className = "menu-drawer-main">
       <Paper component="form"  className='search-box' >
          <InputBase  sx={{ ml: 1, flex: 1 }} className='search' placeholder="Search User" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleSubmit}/>
            <IconButton type="button"  className='button' sx={{ p: '10px', color:"#7766e4" }} aria-label="search" onClick={handleSubmit}>
              <SearchIcon />
            </IconButton>
        </Paper>
      <Box className = "profile-main">
        {
          loading ? (
            <Skeleton variant="rectangular" width={300} height={100} />
          ) : (
            users && users.length > 0  ?  (
              users.map((user, index) => (
                <Box className="profile" key={index} onClick = {() => handleUser(user)}>
                  <Avatar src={ user.photo ? GLOBALS.api_usersemedia + user.photo : "/static/images/avatar/2.jpg"} alt='user-profile' className='user-photo'/>
                  <Box className="details">
                  <Typography className='title'>{user.u_nm}</Typography>
                  <Typography className='message'>{user.email}</Typography>
                  </Box>
              </Box>
              ))
            ) : ("")
          )
        }
      </Box>
    </Box>
  )
}

export default MenuDrawer