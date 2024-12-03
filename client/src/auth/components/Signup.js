import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addNewUser, resetAddNewUserError } from '../../store/actions/auth-actions';

const Signup = ({updateAuthState}) => {

  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [ newUser, setNewUser] = useState({ u_nm:"", email:"", pwd:"", photo: ""});
  const [validError,setValidError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const addNewUserError = useSelector(state => state.addNewUserReducer.generalError);

  useEffect(() => {
    if (addNewUserError && submitted) {
        // handle response only when both errors are present
        handleResponse();
    }
  }, [addNewUserError, submitted, dispatch]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleAuth = () => {
    updateAuthState(false);
  };
  const handleChange = (e) => {
    const {name, value, type, files} = e.target;
    if(type === "file") {
      const fileName = files[0].name;
      setNewUser((prevState) => ({...prevState, [name]: fileName, image: files[0]}));
    } else {
      setNewUser((prevState) => ({...prevState, [name]: value}));
    }
  };

  const handleSubmit = () => {
    dispatch(resetAddNewUserError())
    const { u_nm, pwd , email, photo} = newUser;
    if(!u_nm || !pwd) {
      setValidError(true);
      return;
    }
    if (u_nm && pwd && email && photo) {
      const formData = new FormData();

      // Append each field to formData using a for...of loop
      for (const [key, value] of Object.entries(newUser)) {
        formData.append(key, value);
    }

      dispatch(addNewUser(formData));
      setSubmitted(true);
  }
  };

   /** Handle API response  */
   const handleResponse = () => {
    if(addNewUserError === "success") {
        dispatch(resetAddNewUserError());
        setValidError(false);
        setSubmitted(false);
    }
    else{
        setSubmitted(false);
        setValidError(true);
    }
  };

  
  return (
    <Box className = "signup-main">
         <Typography className='title'>Signup</Typography>
          <Box className="fields">
            <TextField type='text'  label="User Name" className={(!newUser.u_nm && validError) ? "validation-border" : "field"} name="u_nm"  value={newUser["u_nm"]} onChange={handleChange} fullWidth/>
            <TextField type='email'  label="Email"  className={(!newUser.email && validError) ? "validation-border" : "field"} name="email"  value={newUser["email"]} onChange={handleChange} fullWidth/>
            <FormControl className={(!newUser.pwd && validError) ? "validation-border" : "field"} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
               <OutlinedInput type={showPassword ? 'text' : 'password'}  name="pwd"  value={newUser["pwd"]} onChange={handleChange}
               endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end" >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            label="Password"
            />
            </FormControl>
            <TextField type='file'  className={(!newUser.photo && validError) ? "validation-border" : "field"} name="photo"  onChange={handleChange} fullWidth/>
            <Box className="validation-error-box">
                {(validError && (!newUser.u_nm || !newUser.pwd)) ? (
                <Typography className='validtion-error'>Please fill required details</Typography>
                ): null}
                {validError ? (
                <Typography className='validtion-error'>{addNewUserError.message}</Typography>
                ): null}
            </Box>
          </Box>
          <Button className='action-button' onClick={handleSubmit}>Signup</Button>
          <Typography className='desc'>Already have an account ? <Link className='link' onClick={handleAuth}>Login</Link></Typography>
    </Box>
  )
}

export default Signup;