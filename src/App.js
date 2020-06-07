import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { ShopContext } from './context/ShopContext';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Shop } from './pages/Shop';
import { Item } from './pages/Item';
import { Accounts } from './pages/Accounts';
import { Inventory } from './pages/Inventory';
import { loggedIn, adminLoggedIn } from './config/Auth';

function App() {
  const { Provider } = ShopContext;
  const [inventory, setInventory] = useState([]);
  const [selectedItem, selectItem] = useState({});
  const [user, setUser] = useState({});
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
      setUser(JSON.parse(localStorage.getItem('user')));
    };
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
    )
  }

  const AccountRoute = ({ children, ...rest }) => {
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

  useEffect(() => {if (inventory) getUser()}, [])

  // useEffect(() => {if (loggedIn) getUser()}, [])

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
          <AccountRoute exact path='/account'>
            <Accounts />
          </AccountRoute>
          <InventoryRoute exact path='/inventory'>
            <Inventory />
          </InventoryRoute>
        </Switch>
      </Router>
    </Provider>
  );
};

// const RegisterRouter = ({ children, ...rest }) => {
//   return (
//     <Route
//       {...rest}
//       render = {({ location }) => 
//         }
//   )
// }

// const PrivateRoute = ({ children, ...rest }) => {
//   return (
//     <Route
//       {...rest}
//       render = {({ location }) => 
//         loggedInCheck() ? (children) : 
//         (<Redirect to={{ pathname: '/', 
//         state: { from: location }}} />)
//       }
//     />
//   );
// };

// const InventoryRoute = ({ children, ...rest }) => {
//   return (
//     <Route
//       {...rest}
//       render = {({ location }) => 
//         adminLoggedIn() ? (children) :
//         (<Redirect to={{ pathname: '/',
//         state: { from: location }}} />)
//       }
//     />
//   );
// };

export default App;