import React, { useState, useEffect } from 'react';
import { registerStyle } from '../styles/register';
// import { Link } from 'react-router-dom';
import { setToken, setUser } from '../config/Auth';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Typography } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

export const RegisterUser = () => {
    const classes = registerStyle();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [failureOpen, setFailureOpen] = useState(false);
    const [loginRemembered, setLoginRemembered] = useState(false);

    const emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);

    const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

    const handleFormValidation = (event) => {
        const {name, value} = event;
        switch(name) {
            case "fName":
                firstName === '' ? setFirstNameError(true) : setFirstNameError(false);
                break;
            case "lName":
                lastName === '' ? setLastNameError(true) : setLastNameError(false);
                break;
            case "email":
                email.match(emailRegex) ? setEmailError(false) : setEmailError(true);
                break;
            case "password":
                password.match(passwordRegex) ? setPasswordError(false) : setPasswordError(true);
                break;
            case "confirmPassword":
                confirmPassword.match(password) ? setConfirmPasswordError(false) : setConfirmPasswordError(true);
                break;
        };
    };

    const isRemembered = () => {
        setLoginRemembered(!loginRemembered);
    };

    const handleBackdropOpen = () => {
        setBackdropOpen(true);
    };
    const handleSuccess = () => {
        setSuccessOpen(true);
    };

    const handleFailure = () => {
        setFailureOpen(true);
    };

    const handleSuccessClose = () => {
        setSuccessOpen(false);
        setBackdropOpen(false);
        refreshPage();
    };

    const handleFailureClose = () => {
        setFailureOpen(false);
        setBackdropOpen(false);
    };

    const handleSuccessAlertClose = () => {
        setSuccessOpen(false);
        setBackdropOpen(false);
        refreshPage();
    };

    const handleFailureAlertClose = () => {
        setFailureOpen(false);
        setBackdropOpen(false);
    };

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    };

    const refreshPage = () => {
        window.location.reload(false);
    };

    const handleRegister = () => {
        handleBackdropOpen();
        if (loginRemembered) {
            localStorage.setItem('email', email);
        };
        const url = process.env.REACT_APP_USERS_API;
        fetch(`${url}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName, email, password, cart, wishlist })
        }).then(response => {
            if (response.status === 200) {
                setToken(response.headers.get('authentication'));
                setUser(response.headers.get('user'));
                if (loginRemembered) {
                    localStorage.setItem('email', email);
                };
                handleSuccess();
            } else {
                handleFailure();
            };
            return response.json();
        }).then(data => setUser(data));
    };

    return (
        <div className={classes.root}>
            <div className={classes.title}>
                <Typography variant="h4">
                    Let's get you registered!
                </Typography>
            </div>
            <div className={classes.formBody} style={{ paddingTop: '30px' }}>
                <form className={classes.form} style={{ display: 'flex', alignItems: 'center', paddingTop: '80px'}}>
                    <div className={classes.nameFields}>
                        <TextField 
                            label="First Name" 
                            type="search" 
                            error={firstNameError}
                            required
                            autoFocus
                            variant="filled" 
                            name="fName"
                            value={firstName}
                            className={classes.firstName}
                            onChange={({ target }) => setFirstName(target.value)}
                            onBlur={({ target }) => handleFormValidation(target)}
                        />   
                        <TextField 
                            label="Last Name" 
                            type="search" 
                            error={lastNameError}
                            required
                            variant="filled" 
                            name="lName"
                            value={lastName}
                            className={classes.lastName}
                            onChange={({ target }) => setLastName(target.value)}
                            onBlur={({ target }) => handleFormValidation(target)}
                        />
                    </div> 
                    <TextField  
                        label="Email" 
                        type="search" 
                        error={emailError}
                        required
                        variant="filled"
                        name="email"
                        value={email}
                        className={classes.email}
                        onChange={({ target }) => setEmail(target.value)}
                        onBlur={({ target }) => handleFormValidation(target)} 
                    />    
                    <TextField
                        label="Password"
                        type="password"
                        error={passwordError}
                        required
                        variant="filled"
                        name="password"
                        value={password}
                        className={classes.password}
                        onChange={({ target }) => setPassword(target.value)}
                        onBlur={({ target }) => handleFormValidation(target)}
                        helperText="Password must be 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character."
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        error={confirmPasswordError}
                        required
                        variant="filled"
                        name="confirmPassword"
                        value={confirmPassword}
                        className={classes.confirmPassword}
                        onChange={({ target }) => setConfirmPassword(target.value)}
                        onBlur={({ target }) => handleFormValidation(target)}
                        helperText="Passwords must match."
                    />
                    <FormGroup>
                        <FormControlLabel 
                            className={classes.checkbox}
                            control={<Checkbox 
                                color="primary" 
                                inputProps={{ 'aria-label': 'disabled checked checkbox' }} 
                                onChange={() => isRemembered()} />}
                            label="Remember Me"
                        />
                    </FormGroup> 
                    <Button className={classes.signupButton} variant="contained" color="primary" onClick={() => handleRegister()}>
                        Sign up
                    </Button>
                </form>
            </div>
            <Backdrop open={backdropOpen}>
                <CircularProgress color="primary" />
            </Backdrop>
            <Snackbar open={successOpen} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={3000} onClose={handleSuccessClose}>
                <Alert onClose={handleSuccessAlertClose} severity="success">
                    Registration Successful
                </Alert>
            </Snackbar>
            <Snackbar open={failureOpen} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={3000} onClose={handleFailureClose}>
                <Alert onClose={handleFailureAlertClose} severity="error">
                    Registration Failed
                </Alert>
            </Snackbar>
        </div>
    );
};