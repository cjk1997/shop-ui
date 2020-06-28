import React, { useContext, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Layout } from '../config/Layout';
import { AddToCart } from '../components/UpdateCart';
import { ImageCarousel } from '../components/ItemCarousel';
import { AddToWishlist } from '../components/UpdateWishlist';
import { itemStyle } from '../styles/item';
import { Typography } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import Button from '@material-ui/core/Button';
import AddShoppingCartSharpIcon from '@material-ui/icons/AddShoppingCartSharp';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Card from '@material-ui/core/Card';

export const Item = () => {
    const { user, getUser } = useContext(ShopContext);
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [saved, setSaved] = useState(false);
    const [storedItem, setStoredItem] = useState({});
    const [paragraphs, setParagraphs] = useState([]);
    const [quantity, setQuantity] = useState(0);
    const [quantityError, setQuantityError] = useState(false);
    const [quantityNotification, setQuantityNotification] = useState(false);
    const classes = itemStyle();
    
    const localStorageItem = () => {
        if (localStorage.getItem('item')) {
            const localStorageItem = JSON.parse(localStorage.getItem('item')).itemSelection;
            setStoredItem(localStorageItem);
        };
    };

    const getWishlist = () => {
        if (localStorage.getItem('wishlist')) {
            const wishlist = JSON.parse(localStorage.getItem('wishlist')).wishlist;
            setWishlist(wishlist);
        };
    };

    const getCart = () => {
        if (localStorage.getItem('cart')) {
            const cart = JSON.parse(localStorage.getItem('cart')).cartItems;
            setCart(cart);
        };
    };

    const renderText = () => {
        const additionalText = storedItem.paragraphs.map((section) => {
            return (
                <Typography style={{ width: '100%', fontSize: '22px', fontWeight: '300', paddingTop: '40px' }} align="justify">
                    {section}
                </Typography>
            );
        });

        return (
            setParagraphs(additionalText)
        );
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

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        };
        setQuantityNotification(false);
    };

    const handleQuantityValidation = (event) => {
        const {name, value} = event;
        switch(name) {
            case "quantity":
                quantity === null ? setQuantityError(true) : setQuantityError(false);
                quantity === null ? setQuantityNotification(true) : setQuantityNotification(false);
        };
    };

    const handleAddToCart = (user, cart, storedItem, quantity) => {
        if (quantity === null) {
            setQuantityNotification(true);
        }  else {
            setQuantityNotification(false);
            AddToCart(user, cart, storedItem, quantity);
        };
    };

    const selectOptions = () => {
        const menuOptionsArray = [];
        // console.log("storedItem.quantity", storedItem.quantity)
        for (let i = 1; i <= storedItem.quantity && i < 11; i++) {
            menuOptionsArray.push(<MenuItem value={i}>{i}</MenuItem>)
        };

        return (
            menuOptionsArray
        );
    };

    useEffect(() => {localStorageItem()}, []);

    useEffect(() => {getWishlist(); getCart()}, []);

    useEffect(() => {if (storedItem.paragraphs) renderText()}, [storedItem]);

    // useEffect(() => {if (localStorageItem && inventory) additionalItems()}, [])

    // const stars = parseFloat(storedItem.star_rating);

    return (
        <Layout>
            <Typography>
                <div className={classes.item}>
                    <div className={classes.header}>
                        <div className={classes.carousel}>
                            <ImageCarousel />
                        </div>
                        <div className={classes.headerText}>
                            <div className={classes.title}>
                                {storedItem.item}
                            </div>
                            <div className={classes.brand}>
                                {storedItem.brand}
                            </div>
                            <div className={classes.rating}>
                                <Rating name="read-only" value={parseFloat(storedItem.star_rating)} size="large" precision={0.5} readOnly />
                            </div>
                            <div className={classes.price}>
                                ${generatePriceTags(storedItem.price)}
                            </div>
                            <FormControl variant="outlined" className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-outlined-label">Quantity</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        name="quantity"
                                        required
                                        error={quantityError}
                                        value={quantity}
                                        onChange={({ target }) => setQuantity(target.value)}
                                        onBlur={({ target }) => handleQuantityValidation(target)}
                                        label="Quantity"
                                    >
                                        {selectOptions()}
                                    </Select>
                                </FormControl>
                                <Snackbar open={quantityNotification} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={4000} onClose={handleClose}>
                                    <Alert onClose={handleClose} severity="warning">
                                        Please select a quantity.
                                    </Alert>
                                </Snackbar>
                            <div className={classes.buttons}>
                                <div className={classes.cartButton}>
                                    <Button className={classes.addToCartButton} variant="contained" color="primary" onClick={() => handleAddToCart(user, cart, storedItem, quantity)}>
                                        <AddShoppingCartSharpIcon className={classes.addToCartIcon} />
                                        Add to Cart
                                    </Button>
                                </div>
                                <div className={classes.addButton} onClick={() => AddToWishlist(user, wishlist, storedItem)}>
                                    <Button className={classes.favoriteButton}>
                                        <FavoriteIcon className={classes.favoriteIcon} />
                                        Add to Wishlist
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={classes.body}>
                        <div className={classes.description} align="justify">
                            {storedItem.description}
                        </div>
                        <div className={classes.additionalDescription}>
                            {paragraphs}
                        </div>
                        <div className={classes.style}>
                            Color: {storedItem.style}
                        </div>
                        <div className={classes.itemSuggestions}>
                            {/* {inventory.length ? additionalItems() : ''} */}
                        </div>
                    </div>
                </div>
            </Typography>
            {!storedItem ? <Redirect to='/' /> : ''}
        </Layout>
    );
};