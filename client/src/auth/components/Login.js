import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUserAuthentication, resetAuthDataError } from '../../store/actions/auth-actions';

const Login = ({updateAuthState}) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [ userCredentials, setUserCredentials] = useState({ email:"", pwd:""});
  const [validError,setValidError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const authUserDataError = useSelector(state => state.authUserDataReducer.generalError);

  useEffect(() => {
    if (authUserDataError && submitted) {
        // handle response only when both errors are present
        handleResponse();
    }
  }, [authUserDataError, submitted, dispatch]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleAuth = () => {
    updateAuthState(true);
  };
  const handleChange = (e) => {
    const {name, value} = e.target;
    setUserCredentials((prevState) => ({...prevState, [name]: value}));
  };
  const handleSubmit = () => {
    dispatch(resetAuthDataError());
    const { email, pwd } = userCredentials;
    if(!email || !pwd) {
      setValidError(true);
      return;
    }
     if(email && pwd){
      dispatch(getUserAuthentication(userCredentials));
      setSubmitted(true);
    }
  };
 /** Handle API response  */
  const handleResponse = () => {
    if(authUserDataError === "success") {
        dispatch(resetAuthDataError());
        setValidError(false);
        setSubmitted(false);
    }
    else{
        setSubmitted(false);
        setValidError(true);
    }
  };
  return (
    <Box className = "login-main">
         <Typography className='title'>Login</Typography>
          <Box className="fields">
            <TextField type='email'  label="Email" className={(!userCredentials.email && validError) ? "validation-border" : "field"} name="email"  value={userCredentials["email"]} onChange={handleChange} fullWidth/>
            <FormControl className={(!userCredentials.pwd && validError) ? "validation-border" : "field"} variant="outlined"  >
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
               <OutlinedInput type={showPassword ? 'text' : 'password'} name="pwd"  value={userCredentials["pwd"]} onChange={handleChange}
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
            <Box className="validation-error-box">
                {(validError && (!userCredentials.email || !userCredentials.pwd)) ? (
                <Typography className='validtion-error'>Please fill required details</Typography>
                ): null}
                {validError ? (
                <Typography className='validtion-error'>{authUserDataError.message}</Typography>
                ): null}
            </Box>
          </Box>
          <Button className='action-button' onClick={handleSubmit}>Login</Button>
          <Typography className='desc'>Don't have an account ? <Link className='link' onClick={handleAuth}>Signup</Link></Typography>
    </Box>
  )
}

export default Login