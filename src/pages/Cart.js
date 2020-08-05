import React, { useContext, useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Layout } from '../config/Layout';
import { AddToWishlist } from '../components/UpdateWishlist';
import { UpdateQuantity, RemoveFromCart, UpdateCart } from '../components/UpdateCart';
import { cartStyle } from '../styles/cart';
import '../styles/cart.css';
import { Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import RemoveShoppingCartSharpIcon from '@material-ui/icons/RemoveShoppingCartSharp';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import ShoppingBasketSharpIcon from '@material-ui/icons/ShoppingBasketSharp';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';

export const Cart = () => {
    const { user, getUser } = useContext(ShopContext);
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [runningTotal, setRunningTotal] = useState([]);
    const [quantity, setQuantity] = useState(0);
    const [open, setOpen] = useState(false);
    const [emptyOpen, setEmptyOpen] = useState(false);
    const [redirectBool, setRedirectBool] = useState(false);
    const [emptyCartBool, setEmptyCartBool] = useState(false);
    const classes = cartStyle();

    const getCart = () => {
        if (localStorage.getItem('cart')) {
            const cart = JSON.parse(localStorage.getItem('cart')).cartItems;
            setCart(cart);
        };
    };

    const setSelectedItem = (itemSelection) => {
        localStorage.removeItem('item');
        localStorage.setItem('item', JSON.stringify({ itemSelection }));
    };

    const getWishlist = () => {
        if (localStorage.getItem('wishlist')) {
            const wishlist = JSON.parse(localStorage.getItem('wishlist')).wishlist;
            setWishlist(wishlist);
        };
    };

    const handleEmptyOpen = () => {
        if (cart.length === 0) {
            setEmptyOpen(true);
        };
    };

    const handleEmptyClose = () => {
        setEmptyOpen(false);
        setEmptyCartBool(true);
    };

    const generatePriceTags = (num) => {
        if (typeof num === "string") {
            const newNum = parseFloat(num);
            console.log("num after parse", newNum)
            return newNum.toLocaleString(undefined, {'minimumFractionDigits':2, 'maximumFractionDigits':2});
        } else if (typeof num === "number") { 
            return num.toLocaleString(undefined, {'minimumFractionDigits':2, 'maximumFractionDigits':2});
        }
    };

    console.log("runningTotal", runningTotal)

    const cartTotal = cart.reduce((acc, item) => {return acc + (item.item.price * item.quantity)}, 0);

    const cardMap = cart.map((item, index) => {
        const selectOptions = () => {
            const menuOptionsArray = [];
            for (let i = 1; i <= item.item.quantity && i < 11; i++) {
                menuOptionsArray.push(<MenuItem value={i}>{i}</MenuItem>)
            };

            return (
                menuOptionsArray
            );
        };

        return (
            <Card className={classes.card}>
                <Link to='/item' style={{ textDecoration: 'none', color: 'black' }} onClick={() => setSelectedItem(item.item)}>
                    <CardMedia
                        className={classes.cardImage}
                        component="img"
                        src={`${item.item.images[0]}`}
                        title={item.item.item}
                        style={{ width: '380px', height: '380px'}}
                    />
                </Link>
                <div className={classes.cardDetails}>
                    <CardContent className={classes.cardContent}>
                        <div className={classes.titleAndBrand}>
                            <Link to='/item' style={{ textDecoration: 'none', color: 'black' }} onClick={() => setSelectedItem(item.item)}>
                                <Typography className={classes.cardTitle} variant="h4" color="black" component="h2">
                                    {item.item.item}
                                </Typography>
                            </Link>
                            <Typography className={classes.cardBrand} variant="h5" color="black" component="h3" style={{ paddingTop: '3px' }}>
                                {item.item.brand}
                            </Typography>
                        </div>
                        <div className={classes.pricetag}>
                            <Typography variant="h4">
                                ${generatePriceTags(item.item.price * item.quantity)}
                            </Typography>
                            <div className={classes.individualPrice}>
                                <Typography variant="body1">
                                    ${generatePriceTags(item.item.price)}
                                </Typography>
                                <Typography className={classes.each} variant="body1">
                                    (ea.)
                                </Typography>
                            </div>
                        </div>
                    </CardContent>
                    <CardActions style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="demo-simple-select-outlined-label">Quantity</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                name="quantity"
                                // autoFocus
                                required
                                // error={quantityError}
                                value={item.quantity}
                                // defaultValue={item.quantity}
                                // onChange={({ target }) => setQuantity(target.value)}
                                onChange={({ target }) => UpdateQuantity(user, cart, index, target.value)}
                                label="Quantity"
                            >
                                {selectOptions()}
                            </Select>
                        </FormControl>
                        <IconButton className={classes.favoriteButton} aria-label="add to favorites" onClick={() => AddToWishlist(user, wishlist, item.item)}>
                            <FavoriteIcon className={classes.favoriteIcon} />
                        </IconButton>
                        <IconButton className={classes.removeButton} aria-label="add to cart" onClick={() => RemoveFromCart(user, cart, index)}>
                            <RemoveShoppingCartSharpIcon className={classes.removeIcon} />
                        </IconButton>
                    </CardActions>
                </div>
            </Card>
        );
    });

    const checkout = () => {
        setOpen(true);
    };

    const processCheckout = (user) => {
        setOpen(false);
        UpdateCart(user, []);
        setRedirectBool(true);
    };

    const emptyOrNah = () => {
        if (cart.length === 0) {
            return (
                <div className={classes.emptyCartBody}>
                    <div className={classes.emtpyCartModal}>
                        <Dialog
                            open={emptyOpen}
                            onClose={handleEmptyClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <div className={classes.emptyModalHeader}>
                                <DialogActions>
                                    <IconButton onClick={() => handleEmptyClose()}>
                                        <CloseIcon />
                                    </IconButton>
                                </DialogActions>
                                <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center' }}><Typography variant="h4" >Looks like your cart is empty. Better get shopping!</Typography></DialogTitle>
                            </div>
                        </Dialog>
                    </div>
                    {emptyCartBool ? <Redirect to='/shop' /> : ''}
                </div>
            );
        } else {
            return (
                <>
                    <div className={classes.cartBody}>
                        <div className={classes.title}>
                            <Typography variant="h3">
                                Here's Your Cart
                            </Typography>
                        </div>
                        <div className={classes.itemCards} style={{ paddingTop: '80px'}}>
                            {cardMap}
                        </div>
                        <div className={classes.cartSummary}>
                            <div className={classes.subtotal}>
                                <Typography variant="h5">Subtotal:</Typography>
                                <Typography variant="h5">${generatePriceTags(cartTotal)}</Typography>
                            </div>
                            <div className={classes.shipping}>
                                <Typography variant="h5">Shipping:</Typography>
                                <Typography variant="h5">$6.99</Typography>
                            </div>
                            <div className={classes.taxes}>
                                <Typography variant="h5">Taxes & Fees</Typography>
                                <Typography variant="h5">${generatePriceTags(cartTotal * .047)}</Typography>
                            </div>
                            <div className={classes.total}>
                                <Typography variant="h4">Total:</Typography>
                                <Typography variant="h4">${generatePriceTags(cartTotal + 6.99 + (cartTotal * .047))}</Typography>
                            </div>
                        </div>
                        <div className={classes.checkout}>
                            <Button className={classes.checkoutButton} variant="contained" color="primary" onClick={() => checkout()}>
                                <ShoppingBasketSharpIcon className={classes.basketIcon} />
                                <Typography variant="h5">Checkout</Typography>
                            </Button>
                        </div>
                    </div>
                    <div className={classes.checkoutModal}>
                        <Dialog
                            open={open}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <div className={classes.modalHeader}>
                                <DialogTitle id="alert-dialog-title"><Typography variant="h4">You have great taste!</Typography></DialogTitle>
                                <DialogActions>
                                    <IconButton onClick={() => processCheckout(user)}>
                                        <CloseIcon />
                                    </IconButton>
                                </DialogActions>
                            </div>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    <Typography variant="h6" style={{ textAlign: 'center', color: 'black', fontWeight: '300' }}>
                                        Looks like we got your order. We'll get it processed and sent out right away. We can't wait to see what you whip up!
                                    </Typography>
                                </DialogContentText>
                            </DialogContent>
                        </Dialog>
                    </div>
                </>
            );
        };
    };

    useEffect(() => {getWishlist(); getCart()}, []);

    useEffect(() => {if (cart) handleEmptyOpen()}, []);

    return (
        <Layout>
            {emptyOrNah()}
            {/* <div className={classes.cartBody}>
                <div className={classes.title}>
                    <Typography variant="h3">
                        Here's Your Cart
                    </Typography>
                </div>
                <div className={classes.itemCards} style={{ paddingTop: '80px'}}>
                    {cardMap}
                </div>
                <div className={classes.cartSummary}>
                    <div className={classes.subtotal}>
                        <Typography variant="h5">Subtotal:</Typography>
                        <Typography variant="h5">${generatePriceTags(cartTotal)}</Typography>
                    </div>
                    <div className={classes.shipping}>
                        <Typography variant="h5">Shipping:</Typography>
                        <Typography variant="h5">$6.99</Typography>
                    </div>
                    <div className={classes.taxes}>
                        <Typography variant="h5">Taxes & Fees</Typography>
                        <Typography variant="h5">${generatePriceTags(cartTotal * .047)}</Typography>
                    </div>
                    <div className={classes.total}>
                        <Typography variant="h4">Total:</Typography>
                        <Typography variant="h4">${generatePriceTags(cartTotal + 6.99 + (cartTotal * .047))}</Typography>
                    </div>
                </div>
                <div className={classes.checkout}>
                    <Button className={classes.checkoutButton} variant="contained" color="primary" onClick={() => checkout()}>
                        <ShoppingBasketSharpIcon className={classes.basketIcon} />
                        <Typography variant="h5">Checkout</Typography>
                    </Button>
                </div>
            </div>
            <div className={classes.checkoutModal}>
                <Dialog
                    open={open}
                    // onClose={processCheckout}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <div className={classes.modalHeader}>
                        <DialogTitle id="alert-dialog-title">Checkout Successful!</DialogTitle>
                        <DialogActions>
                            <IconButton onClick={() => processCheckout(user)}>
                                <CloseIcon />
                            </IconButton>
                        </DialogActions>
                    </div>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Looks like we got your order. We'll get it processed and sent out right away. We can't wait to see what you whip up!
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </div> */}
            {redirectBool ? <Redirect to='/' /> : ''}
        </Layout>
    )
};