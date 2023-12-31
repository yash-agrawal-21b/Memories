import { AppBar, Avatar, Button, Toolbar, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useStyles from "./styles";
import memories from '../../images/memories.png';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import {useDispatch} from 'react-redux';
import decode from 'jwt-decode';
import memoriesLogo from '../../images/memoriesLogo.png'
import memoriesText from '../../images/memoriesText.png'

const Navbar = () => {
    const classes = useStyles();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation(); 

    useEffect(() => {
        const token = user?.token;

        // if (token) {
        //     const decodedToken = decode(token);
        //     if (decodedToken.exp * 1000 < new Date().getTime()) logout();
        // }

        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/posts');
        setUser(null);
    }
  return (
      <AppBar className={classes.appBar} position="static" color="inherit">
          <div className={classes.brandContainer}>
              <Link to='/' className={classes.brandContainer}>
                  
              <img src={memoriesText} alt='icon' height='45px' />
              <img src={memoriesLogo} alt='icon' height='40px' />
            </Link>  
              
          </div>
          <Toolbar className={classes.toolbar}>
              {user ? (
                  <div className={classes.profile}>
                      <Avatar className={classes.purple} alt={user.result.name} src={user.result.imageUrl}>{user.result.name.charAt(0)}</Avatar>
                      <Typography className={classes.userName} variant='h6'>{user.result.name} </Typography>
                      <Button variant='contained' className={classes.logout} color='secondary' onClick={logout}>Logout </Button>
                  </div>
              ) : (
                      <Button component={Link} to="/auth" variant='contained' color='primary'>Sign In</Button>
              )}
          </Toolbar>
      </AppBar>
  )
}

export default Navbar