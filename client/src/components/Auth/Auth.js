import React, { useState } from 'react'
import { Avatar, Box, Button, Container, Grid, Paper, TextField, Typography } from '@material-ui/core';
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import {useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { signin, signup } from "../../actions/auth";
import useStyles from "./styles";
import Input from "./Input";
// import { createOrGetUser } from '../../api';

const Auth = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const initialState = {firstName: '', lastName: '', email:'', password:'', confirmPassword:''}
    
    const [isSignup, setIsSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(initialState);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSignup) {
            dispatch(signup(formData, navigate));
        }
        else {
            dispatch(signin(formData, navigate));
        }

    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    };
    const handleShowPassword = () => {
        setShowPassword((prevShowPassword)=> !prevShowPassword)
    }
    const googleSuccess = async (res) => {
        const result = jwtDecode(res.credential);
        // const { sub } = result;
        const token = res.credential;
        try {
            dispatch({ type: 'AUTH', data: { result, token } });
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }
    const googleFailure = (error) => {
        console.log("sign In failed");
        console.log(error);
    }

    return (
        
      <Container component="main" maxwidth="xs" >
          <Paper className={classes.paper} elevation={3} >
              <Avatar className={classes.avatar}>
                  <LockOutlinedIcon/>
              </Avatar>  
              <Typography variant='h5'>{isSignup?'Sign Up': 'Sign In' }</Typography>  
              <form className={classes.form} onSubmit={handleSubmit} >
                  <Grid container spacing={2}>{
                      
                      isSignup && (
                        <>
                            <Input name="firstName" label = "First Name" handleChange= {handleChange} autoFocus half/>
                            <Input name="lastName" label="Last Name" handleChange={handleChange}  half/>
                        </>
                      )}
                      <Input name='email' label='email address' handleChange={handleChange} type='email'/>
                      <Input name='password' label='password' handleChange={handleChange} type={showPassword ? 'text': 'password'} handleShowPassword={handleShowPassword} />

                      {isSignup && <Input name='confirmPassword' label="Repeat Password" handleChange= {handleChange} />}
                  </Grid>
                  
                  <Button type='submit' fullWidth variant="contained" color='primary' className={classes.submit}>
                      {isSignup ? 'Sign Up': 'Sign In'}
                  </Button>
                      
                  <GoogleLogin
                      
                      clientId="GOOGLE ID"
                      onSuccess={(response) => googleSuccess(response)}
                      onError={(error) => googleFailure(error)}

                  />
                  <Grid container justifyContent='flex-end'>
                      <Grid item>
                          <Button onClick={switchMode }>
                              {isSignup ? 'Already have an account? Sign In' : 'Dont have an account? Sign Up'}
                          </Button>
                      </Grid>
                      
                  </Grid>
              </form>
          </Paper>
    </Container>
  )
}

export default Auth