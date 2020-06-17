import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import clsx from 'clsx';
import { useTheme, getContrastRatio } from '@material-ui/core/styles';
import { layoutStyle } from '../styles/layout';
import { SignIn } from '../components/SignIn';
import { logout, adminLoggedIn } from './Auth';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuSharpIcon from '@material-ui/icons/MenuSharp';
import Badge from '@material-ui/core/Badge';
import ShoppingCartSharpIcon from '@material-ui/icons/ShoppingCartSharp';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Button from '@material-ui/core/Button';
import HomeSharpIcon from '@material-ui/icons/HomeSharp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

export const Layout = ({ children }) => {
    const classes = layoutStyle();
    const theme = useTheme();
    const { user, getUser } = useContext(ShopContext);
    const [cart, setCart] = useState([]);
    const [open, setOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const getCart = () => {
        if (localStorage.getItem('cart')) {
            const cart = JSON.parse(localStorage.getItem('cart')).cartItems;
            setCart(cart);
        };
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const loggedInCheck = () => {
        if (localStorage.getItem('auth') && localStorage.getItem('admin') === 'admin') {
            setLoggedIn(true);
            setIsAdmin(true)
        } else if (localStorage.getItem('auth') && localStorage.getItem('admin') != 'admin') {
            setLoggedIn(true);
            setIsAdmin(false);
        } else {
            setLoggedIn(false);
            setIsAdmin(false);
        };
    };

    const accountAccess = () => {
        if (!loggedIn) {
            return (
               <SignIn />
            );
        } else {
            return (
                <>
                    <Button className={classes.logoutButton} variant="contained" style={{ fontSize: '20px', fontWeight: '450', width: '100%' }} color="primary" onClick={() => logout()}>
                        Log Out
                        {logout}
                    </Button>
                </>
            );
        };
        if (localStorage.getItem('admin') === 'admin') {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        };
    };

    const showCart = () => {
        if (isAdmin) {
            return (
                <>
                </>
            );
        } else {
            return (
                <Link to='/cart' className={classes.link}>
                    <IconButton className={classes.cartButton} edge="end" style={{ paddingLeft: '30px' }}>
                        <Badge badgeContent={cart.length} max={10} anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }} color="secondary">
                            <ShoppingCartSharpIcon className={classes.shoppingCartIcon} style={{ fontSize: '35', color: '#fff' }} />
                        </Badge>
                    </IconButton>
                </Link>
            );
        };
    };

    const showAdminOptions = () => {
        if (isAdmin) {
            return (
                <div className={classes.adminOptions} style={{ paddingBottom: '100px' }}>
                    <Link to='/admin' className={classes.link}>
                        <AccountCircleIcon style={{ fontSize: '40', color: 'black' }} />
                        <Button className={classes.adminButton} style={{ fontSize: '30px', color: 'black', fontWeight: '450', textTransform: 'none'}}>
                            Admin
                        </Button>
                    </Link>
                    <Link to='/inventory' className={classes.link}>
                        <Button className={classes.inventoryButton} style={{ fontSize: '20px', color: 'black', fontWeight: '400', paddingTop: '10px' }}>
                            Inventory
                        </Button>
                    </Link>
                </div>
            )
        } else {
            return (
                <>
                </>
            )
        };
    };

    const showProfileOptions = () => {
        if (loggedIn && !isAdmin) {
            return (
                <div className={classes.profileOptions} style={{ paddingBottom: '50px', width: '100%' }}>
                    <Link to='/profile' className={classes.link}>
                        <AccountCircleIcon style={{ fontSize: '40', color: 'black' }} />
                        <Button className={classes.profileButton}style={{ fontSize: '30px', color: 'black', fontWeight: '450', textTransform: 'none'}}>
                            {user.firstName}
                        </Button>
                    </Link>
                    <Link to='/wishlist' className={classes.link}>
                        <Button className={classes.wishlistButton} style={{ fontSize: '20px', color: 'black', fontWeight: '450', paddingTop: '10px' }}>
                            Wishlist
                        </Button>
                    </Link>
                </div>
            );
        } else {
            return (
                <> 
                </>
            );
        };
    };

    useEffect(() => {loggedInCheck(); getCart(); showCart()}, []);

    return (
        <div className={classes.root}>
            <AppBar 
                position="fixed"   
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton 
                        color="inherit"
                        aria-label="open drawer" 
                        onClick={handleDrawerOpen}
                        edge="start" 
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuSharpIcon className={classes.menuIcon} style={{ fontSize: '35' }} />
                    </IconButton>
                    <div className={classes.homeCartButtons}>
                        <Link to='/' className={classes.homeButtonLink}>
                            <IconButton className={classes.homeIconButton}>
                                <HomeSharpIcon className={classes.homeIcon} style={{ fontSize: '35', color: '#fff' }} />
                            </IconButton>
                        </Link>
                        </div>
                        <div className={classes.cartButtonContainer}>
                            {showCart()}
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer 
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{paper: clsx({[classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                }),}}
                style={{ height: '100%' }}
            >
                <div  className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon style={{ fontSize: '35', color: 'black' }} /> : <ChevronLeftIcon style={{ fontSize: '35', color: 'black' }} />}
                    </IconButton>
                </div>
                <Divider />
                <div className={classes.links} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: '50px' }}>
                    <div className={classes.links} style={{ padding: '20px'}}>
                        <Link to='/shop' className={classes.shopLink} style={{ textDecoration: 'none' }}>
                            <Button className={classes.shopButton} style={{ fontSize: '20px', color: 'black', fontWeight: '500', textDecoration: 'none', width: '100%' }}>
                                Shop
                            </Button>
                        </Link>
                    </div>
                    <div className={classes.accountAccess} style={{ padding: '20px'}}>
                        {showProfileOptions()}
                        {showAdminOptions()}
                        {accountAccess()}
                    </div>
                </div>
            </Drawer>
            <main className={classes.content}>
                {children}
            </main>
            <div className={classes.footerContainer}>
                <div className={classes.footer}>
                    <div className={classes.linksContainer}>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};