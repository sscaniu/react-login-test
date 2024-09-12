import React, { useState } from 'react';
import emailValidator from 'email-validator';
import axios from 'axios';
import {
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Box,
  Typography
} from '@material-ui/core';
import useStyles from './styles';
import API from './api';

export default function App() {

  const classes = useStyles();

  const [login, setLogin] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [page, setPage] = useState('email');

  const handleChange = (prop) => (event) => {
    let valid = true;
    if (event.target.name === 'email') {
      if (event.target.value && !emailValidator.validate(event.target.value)) {
        valid = false;
        setError('This is not an email');
      } else if (!event.target.value) {
        valid = false;
        setError('Please fill in your email')
      }
    };
    if (valid) {
      setLogin({ ...login, [prop]: event.target.value });
    };
  };

  const handleContinue = () => {
    if (!error && login.email) {
      setPage('password')
    } else if (!login.email) {
      setError('Please fill in your email')
    };
  };

  const handleNotYou = () => {
    setLogin({
      email: '',
      password: '',
    });
    setPage('email');
  }

  const sendLoginData = (event) => {
    event.preventDefault();
    if (!login.password) {
      setError('Please fill in your passsword');
      return;
    };
    console.log("loginData",login);
    axios
      .post(API.LogIn, login)
      .then(async (res) => {
        if (res.data.statue !== 'success') {
          console.log("Login Failed!");
        } else {
          console.log("Login Successfully!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box
      component='main'
      textAlign='center'
      className={classes.mainContainer}
    >
      <Box className={classes.logoSection}>
      </Box>
      <CssBaseline />
      <Box className={classes.contentWrapper}>
        <Typography className={classes.contentType}>Log in</Typography>
        {page === 'email' &&
          <Box className={classes.contentSection}>
            <Typography className={classes.contentTitle}>Hi!</Typography>
            <Typography className={classes.contentDescription}>Please enter your email.</Typography>
            <TextField
              required
              fullWidth
              id="email"
              label={'Email Address'}
              name="email"
              autoComplete="email"
              onFocus={() => setError('')}
              onBlur={handleChange('email')}
              error={!!error}
              helperText={error}
            />
            <Button
              fullWidth
              className={classes.saveButton}
              onClick={handleContinue}
            >
              Continue
            </Button>
          </Box>
        }
        {page === 'password' &&
          <Box className={classes.contentSection}>
            <Typography className={classes.contentTitle}>Welcome back</Typography>
            <Typography className={classes.contentDescription}>{login.email}</Typography>
            <TextField
              required
              fullWidth
              id='password'
              label={'Password'}
              name='password'
              type='password'
              autoComplete='current-password'
              onFocus={() => setError('')}
              onBlur={handleChange('password')}
              error={!!error}
              helperText={error}
            />
            <Box display='flex' alignItems='center' className={classes.keepWrapper}>
              <FormControlLabel
                control={
                  <Checkbox iconstyle={{ fill: '#FF4081' }} />
                }
                className={classes.keepTitle}
                label="Keep me logged in"
                name="keepLoggedIn"
                onChange={handleChange}
              />
              <Link className={classes.pinkDescription}>
                Forgot password?
              </Link>
            </Box>
            <Button
              fullWidth
              className={classes.saveButton}
              onClick={sendLoginData}
            >
              Log in
            </Button>
            <Typography
              className={classes.otherLink}
              onClick={handleNotYou}
            >
              Not you?
            </Typography>
          </Box>
        }
      </Box>
    </Box>
  );
}
