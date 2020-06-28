import { makeStyles } from '@material-ui/core/styles';

export const registerStyle = makeStyles((theme) => ({
    root: {
        width: '1250px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '20%',
        paddingTop: '200px',
    },
    formBody: {
        width: '55%',
        display: 'flex',
        justifyContent: 'center',
        justifyItems: 'center',
    },
    form: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
    },
    nameFields: {
        width: '100%',
        paddingBottom: '30px',
    },
    firstName: {
        width: '48.5%',
        paddingRight: '10px',
    },
    lastName: {
        width: '48.5%',
        paddingLeft: '10px',
    },
    email: {
        width: '100%', 
        paddingBottom: '30px'
    },
    password: {
        width: '100%', 
        paddingBottom: '8px'
    },
    confirmPassword: {
        width: '100%', 
        paddingBottom: '20px',
    },
    checkbox: {
        display: 'flex',
        justifyContent: 'center',
        // paddingTop: '20px',
        paddingBottom: '30px',
    },
    signupButton: {
        width: '50%',
    },
}))