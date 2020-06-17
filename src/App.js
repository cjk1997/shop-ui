import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { ShopContext } from './context/ShopContext';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Shop } from './pages/Shop';
import { Item } from './pages/Item';
import { Profile } from './pages/Profile';
import { Wishlist } from './pages/Wishlist';
import { Cart } from './pages/Cart';
import { Inventory } from './pages/Inventory';
import { loggedIn, adminLoggedIn } from './config/Auth';

function App() {
  const { Provider } = ShopContext;
  const [inventory, setInventory] = useState([]);
  const [selectedItem, selectItem] = useState({});
  const [user, setUser] = useState({});
  // const [cart, setCart] = useState([]);
  // const [loggedIn, setLoggedIn] = useState(false);
  // const [selectedDate, setSelectedDate] = useState({});
  const getInventory = () => {
    const url = process.env.REACT_APP_INVENTORY_API;
    fetch(`${url}`)
        .then(response => response.json())
        .then(data => {
          setInventory(data);
          if (selectedItem._id) {
            const listArray = data.filter((list) => selectedItem._id === list._id);
            selectItem(listArray[0]);
        }})
        .catch(err => err);
  };

  const getUser = () => {
    if (localStorage.getItem('user')) {
      setUser(JSON.parse(localStorage.getItem('user')).user);
    };
  };

  const saveWishlist = (wishlist) => {
    localStorage.removeItem('wishlist');
    localStorage.setItem('wishlist', JSON.stringify({ wishlist }));
  };

  const getWishlist = (user) => {
    const url = process.env.REACT_APP_USERS_API;
    fetch(`${url}/wishlist/${user._id}`)
      .then(response => response.json())
      .then(data => saveWishlist(data))
      .catch(err => err);
  };

  const saveCart = (cartItems) => {
    localStorage.removeItem('cart');
    // const updatedCart = cartItems;
    localStorage.setItem('cart', JSON.stringify({ cartItems }));
  };

  const getCart = (user) => {
    const url = process.env.REACT_APP_USERS_API;
    console.log("user inside getCart", user)
    console.log("user._id inside getCart", user._id)
    fetch(`${url}/cart/${user._id}`)
      .then(response => response.json())
      .then(data => saveCart(data))
      // ,then(data => {localStorage.setItem('cart', data)})
      // .then(console.log("cart after data assign", cart))
      // .then(localStorage.setItem('cart',))
      .catch(err => err);
  };

  const RegisterRoute = ({ children, ...rest }) => {
    return (
      <Route
        {...rest}
        render = {({ location }) =>
          loggedIn() ? (<Redirect to={{ pathname: '/',
          state: { from: location }}} />) : (children)
        }
      />
    );
  };

  const ProfileRoute = ({ children, ...rest }) => {
    return (
      <Route
        {...rest}
        render = {({ location }) => 
          loggedIn() ? (children) : 
          (<Redirect to={{ pathname: '/', 
          state: { from: location }}} />)
        }
      />
    );
  };

  const WishlistRoute = ({ children, ...rest}) => {
    return (
      <Route
        { ...rest }
        render = {({ location }) => 
          loggedIn() ? (children) :
          (<Redirect to={{ pathname: '/',
          state: { from: location }}} />)
        }
      />
    );
  };

  const CartRoute = ({ children, ...rest }) => {
    return (
      <Route
        {...rest}
        render = {({ location }) => 
          loggedIn() ? (children) :
          (<Redirect to={{ pathname: '/', state: 
          { from: location }}} />)
        }
      />
    );
  };
  
  const InventoryRoute = ({ children, ...rest }) => {
    return (
      <Route
        {...rest}
        render = {({ location }) => 
          adminLoggedIn() ? (children) :
          (<Redirect to={{ pathname: '/',
          state: { from: location }}} />)
        }
      />
    );
  };

  useEffect(() => {getInventory()}, []);

  useEffect(() => {if (inventory) getUser()}, []);

  useEffect(() => {if (user._id) {getCart(user)}}, [user]);

  useEffect(() => {if (user._id) {getWishlist(user)}}, [user]);


  // useEffect(()  => {if (user._id) getWishlist(user)}, [user]);

  return (
    <Provider value={{ inventory, getInventory, selectedItem, selectItem, user, getUser }}>
      <Router>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/shop' component={Shop} />
          <Route path={`/item`} component={Item} />
          <RegisterRoute exact path='/register'>
            <Register />
          </RegisterRoute>
          <ProfileRoute exact path='/profile'>
            <Profile />
          </ProfileRoute>
          <WishlistRoute exact path='/wishlist'>
            <Wishlist />
          </WishlistRoute>
          <CartRoute exact path='/cart'>
            <Cart />
          </CartRoute>
          <InventoryRoute exact path='/inventory'>
            <Inventory />
          </InventoryRoute>
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;