import { createContext } from 'react';

export const ShopContext = createContext({
    inventory: [],
    getInventory: () => {},
    selectedItem: {},
    selectItem: () => {},
    user: [],
    getUser: () => {},
    cart: [],
    getCart: () => {},
});