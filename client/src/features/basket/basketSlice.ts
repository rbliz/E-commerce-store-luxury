import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { Basket } from "../../app/models/basket";
import agent from "../../app/api/agent";
import { getCookie } from "../../app/util/util";

// starting to prepare for async code by adding status state to the basket. // I'll use createAsyncThunk from Redux Toolkit
interface BasketState{
    basket: Basket | null,
    status: string
}

const initialState: BasketState={
    basket: null,
    status: 'idle' // I will want to set this to 'pending' once I go fetch the data, the change it to 'idle' once the promise is fulfilled or rejected. For that I will add extraReducers below  
}


export const fetchBasketAsync = createAsyncThunk<Basket>(
    'basket/fetchBasketAsync',
    async (_, thunkAPI) => {
        try {
            return await agent.Basket.get();
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    },
    {
        condition: () => {
            if(!getCookie('buyerId')) return false;
        }
    }
)


// the createAsyncThunk creates actions that we can use in the store
// the first parameter represents what we are returning from this method
// the other parameters I am passing are the arguments types
export const addBasketItemAsync = createAsyncThunk<Basket, {productId: number, quantity?: number}>(
    'basket/addBasketItemAsync',
    async({productId, quantity = 1}, thunkAPI)=>{
        try {
            return await agent.Basket.addItem(productId, quantity);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const removeBasketItemAsync = createAsyncThunk<void, {productId: number, quantity: number, name?: string}>(
    'basket/removeBasketItem',
    async ({productId, quantity}, thunkAPI)=>{
        try {
            return await agent.Basket.removeItem(productId, quantity);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        setBasket: (state, action)=>{
            state.basket = action.payload
        },
        clearBasket: (state) => {
            state.basket = null;
        }
    },
    extraReducers: (builder =>{
        // adding the method (action) name 'addBasketItemAsync' that the Thunk created as parameter, then with .dot we can see the actions we can use
        builder.addCase(addBasketItemAsync.pending, (state, action)=>{ 
            state.status = 'pendingAddItem' + action.meta.arg.productId;
        });
        builder.addCase(removeBasketItemAsync.pending, (state, action)=>{
            state.status = 'pendingRemoveItem' + action.meta.arg.productId + action.meta.arg.name;
        });
        // whenever we have to remove an item we need to have an asynchronous version of the method because we are gonna update the API and therefore the Db. So I'll use the logic inside the extraReducer
        builder.addCase(removeBasketItemAsync.fulfilled, (state, action)=>{
            const {productId, quantity} = action.meta.arg; // destructuring what is in the payload of the action
            const itemIndex = state.basket?.items.findIndex(i => i.productId === productId); // finding the item index
            if(itemIndex === -1 || itemIndex === undefined) return; // if the itemIndex returns either -1 or undefined we do not want to take any further action here
            state.basket!.items[itemIndex].quantity -= quantity;  // overriding typescript safety by using the !                         
            if(state.basket?.items[itemIndex].quantity === 0)
                state.basket.items.splice(itemIndex, 1); // since I am using Redux Toolkit I can ignore the mutating state aspect of using the splice method
            state.status = 'idle';
        });
        builder.addCase(removeBasketItemAsync.rejected, (state, action)=>{
            state.status = 'idle';
            console.log(action)
        });
        builder.addMatcher(isAnyOf(addBasketItemAsync.fulfilled, fetchBasketAsync.fulfilled), (state, action)=>{
            state.basket = action.payload; // setting the basket with what comes back with the action payload
            state.status = 'idle';
        });
        builder.addMatcher(isAnyOf(addBasketItemAsync.rejected, fetchBasketAsync.rejected), (state, action)=>{
            state.status = 'idle';
            console.log(action)
        })
    })

    
})

export const {setBasket, clearBasket} = basketSlice.actions;