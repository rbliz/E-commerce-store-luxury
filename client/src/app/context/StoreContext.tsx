// I am wrapping the app with a component in order to have context available to apply everywhere in the app
// So When we're using our context we're able to access what is specified in the interface

import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Basket } from "../models/basket";

interface StoreContextValue
{
    basket: Basket | null;
    setBasket: (basket: Basket) => void;
    removeItem: (productId: number, quantity: number) => void;
}

export const StoreContext = createContext<StoreContextValue | undefined>(undefined);

// in order to consume our context I am gonna create a custom Hook

// eslint-disable-next-line react-refresh/only-export-components
export function useStoreContext(){
    const context = useContext(StoreContext);

    if(context === undefined){
        throw Error("Oops, we do not seem to be inside the provider");
    }

    return context;
}

// creating the Provider where we will create state and methods.
// when we're setting state in a component then it is not advisable to mutate state but to do a copy of it an then replace the existing state.

export function StoreProvider({children}: PropsWithChildren<unknown>){
    const [basket, setBasket] = useState<Basket | null>(null);

    function removeItem(productId: number, quantity: number){
        if(!basket) return;
        const items = [...basket.items]; // the spread operator is creating a copy of the array and storing it in a new variable. thus applying what I said above about not mutating state
        const itemIndex = items.findIndex(i => i.productId == productId);
        if(itemIndex >= 0){
            items[itemIndex].quantity -= quantity;
        }
        if(items[itemIndex].quantity === 0) items.splice(itemIndex, 1);
        setBasket(prevState => {
            return {...prevState!, items}
        })
    }
    return(
        <StoreContext.Provider value={{basket, setBasket, removeItem}}>
            {children}
        </StoreContext.Provider>
    )
}

// after completing this, we're gonna go to the highest level (index.tsx) and apply <StoreProvider> there


