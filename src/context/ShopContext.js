import { createContext } from 'react';

export const ShopContext = createContext({
    inventory: [],
    getInventory: () => {},
    selectedItem: {},
    selectItem: () => {},
    retrievedItem: {},
    setRetrievedItem: () => {},
});