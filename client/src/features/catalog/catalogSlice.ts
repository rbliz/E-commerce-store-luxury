import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "@reduxjs/toolkit/query";

const productsAdapter = createEntityAdapter<Product>();

// I did not create Initial state here because with entityAdapter I will have a function to getInitialState
// so I will use it inside the createSlice for the catalog.

// when we need to specify a second argument w/o having a first argument to give we can use _ which is void (_,secondArgument)
export const fetchProductsAsync = createAsyncThunk<Product[]>(
    'catalog/fetchProductsAsync',
    async(_, thunkAPI) => {
        try {
            return await agent.Catalog.list();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

// One thing I have to take care of is if the user is inside the product detail view and refreshes the page, then I must still have the state products that I got from the API 
// Since the createAsyncThunk is an 'outer function' with an 'inner function'(the logic written inside it...), when we get to the catch error
// the outer function still thinks that the request has been fulfilled (successfull getting the product...). So I'll use ThunkApi to deal with that
export const fetchProductAsync = createAsyncThunk<Product, number>(
    'catalog/fetchProductAsync',
    async(productId, thunkAPI) => {
        try {
            return await agent.Catalog.details(productId);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

// after creating this new slice I have to go to the configure store...
export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState({
        productsLoaded: false, // this is additional state that I am adding, besides the ids and entities that already exists
        status: 'idle'
    }),
    reducers: {},
    extraReducers: (builder =>{
        builder.addCase(fetchProductsAsync.pending, (state)=>{
            state.status = 'pendingFetchProducts';
        });
        builder.addCase(fetchProductsAsync.fulfilled, (state, action)=>{
            productsAdapter.setAll(state, action.payload); // setAll because I am gonna set all the products when I receive them from the API. the second parameter is the list of entities so we'll get that from the action payload
            state.status = 'idle';
            state.productsLoaded = true;
        });
        builder.addCase(fetchProductsAsync.rejected, (state, action)=>{
            console.log(action.payload);
            state.status = 'idle';
        });
        builder.addCase(fetchProductAsync.pending, (state)=>{
            state.status = 'pending';
        });
        builder.addCase(fetchProductAsync.fulfilled, (state, action)=>{
            productsAdapter.upsertOne(state, action.payload); // upsert a new product into the entities stored inside state
            state.status = 'idle';
        });
        builder.addCase(fetchProductAsync.rejected, (state, action) =>{
            console.log(action)
            state.status = 'idle';
        });
    })
})

// with this product selectors I am able to go and get data from the store
export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);