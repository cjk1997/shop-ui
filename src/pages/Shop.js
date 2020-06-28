import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import clsx from 'clsx';
import { Layout } from '../config/Layout';
import { AddToWishlist, RemoveFromWishlist } from '../components/UpdateWishlist';
import { AddToCart } from '../components/UpdateCart';
import { shopStyle } from '../styles/shop';
import { Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddShoppingCartSharpIcon from '@material-ui/icons/AddShoppingCartSharp';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

export const Shop = () => {
    const { inventory, getInventory } = useContext(ShopContext);
    const { user, getUser } = useContext(ShopContext);
    const [shuffledInventory, setShuffledInventory] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [cart, setCart] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [expanded, setExpanded] = useState([]);
    const classes = shopStyle();

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

    const getCart = () => {
        if (localStorage.getItem('cart')) {
            const cart = JSON.parse(localStorage.getItem('cart')).cartItems;
            setCart(cart);
        };
    };

    const shuffleInventory = (inventory) => {
        const inventoryCopy = Object.assign([], inventory);
        for (let i = 0; i < inventoryCopy.length; i++) {
            const j = Math.floor(Math.random() * i);
            const temp = inventoryCopy[i];
            inventoryCopy[i] = inventoryCopy[j];
            inventoryCopy[j] = temp;
        };
        setShuffledInventory(inventoryCopy);
    };

    const cardMap = shuffledInventory.map((item, index) => {
        console.log("item in Shop.js", item)

        return (
            <Card className={classes.card} style={{ display: 'flex', flexDirection: 'column' }}>
                <Link to='/item' style={{ textDecoration: 'none', color: 'black' }} onClick={() => setSelectedItem(item)}>
                    <CardMedia
                        className={classes.cardImage}
                        component="img"
                        src={`${item.images[0]}`}
                        title={item.item}
                        style={{ width: '380px', height: '380px'}}
                    />
                </Link>
                <CardContent>
                    <Link to='/item' style={{ textDecoration: 'none', color: 'black' }} onClick={() => setSelectedItem(item)}>
                        <Typography className={classes.cardTitle} variant="h5" color="black" component="h2">
                            {item.item}
                        </Typography>
                    </Link>
                    <Typography className={classes.cardBrand} variant="h6" color="black" component="h3" style={{ paddingTop: '3px' }}>
                        {item.brand}
                    </Typography>
                </CardContent>
                <CardActions style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <IconButton aria-label="add to favorites" onClick={() => AddToWishlist(user, wishlist, item)}>
                        <FavoriteIcon className={classes.favoriteIcon} />
                    </IconButton>
                    <IconButton aria-label="add to cart" onClick={() => AddToCart(user, cart, item, quantity)}>
                        <AddShoppingCartSharpIcon className={classes.addToCartIcon} />
                    </IconButton>
                </CardActions>
            </Card>
        );
    });

    useEffect(() => {shuffleInventory(inventory)}, [inventory]);

    useEffect(() => {getWishlist(); getCart()}, []);

    return (
        <Layout>
            <div className={classes.shopRoot}>
                <div className={classes.title}>
                    <Typography variant="h3" style={{ paddingTop: '40px'}}>
                        Here's What's In Stock
                    </Typography>
                </div>
                <div className={classes.itemCards} style={{ paddingTop: '80px'}}>
                    {cardMap}
                </div>
            </div>
        </Layout>
    );
};