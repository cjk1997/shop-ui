import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { ShopContext } from './context/ShopContext';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Item } from './pages/Item';
import { Accounts } from './pages/Accounts';
import { Inventory } from './pages/Inventory';
import { loggedIn } from './config/Auth';
import { adminLoggedIn } from './config/Auth';

function App() {
  const { Provider } = ShopContext;
  const [inventory, setInventory] = useState([]);
  const [selectedItem, selectItem] = useState({});
  const [retrievedItem, setRetrievedItem] = useState({});
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

  console.log("selectedItem._id", selectedItem._id)

  useEffect(() => {getInventory()}, []);

  return (
    <Provider value={{ inventory, getInventory, selectedItem, selectItem, retrievedItem, setRetrievedItem }}>
      <Router>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/register' component={Register} />
          <Route path={`/item`} component={Item} />
          <PrivateRoute exact path='/accounts'>
            <Accounts />
          </PrivateRoute>
          <InventoryRoute exact path='/inventory'>
            <Inventory />
          </InventoryRoute>
        </Switch>
      </Router>
    </Provider>
  );
}

const PrivateRoute = ({ children, ...rest }) => {
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

export default App;