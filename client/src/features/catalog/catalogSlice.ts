import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product, ProductParams } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "@reduxjs/toolkit/query";
import { MetaData } from "../../app/models/pagination";

// we're gonna pass up our product parameters along with our request to the api and they're gonna
// and they're gonna be passed as parameters to the list() below. But we need to provide first an interface
// for the type of state we are storing here if we want to use the product params as a type of state inside
// the initialState. Then we will provide the type <CatalogState> to the slice created and specify the productParams
// then add some reducer functions to be able to set the product parameters
interface CatalogState{
    productsLoaded: boolean;
    filtersLoaded: boolean;
    status: string;
    brands: string[];
    types: string[];
    productParams: ProductParams;
    metaData: MetaData | null; // then set another reducer function below to set the metadata
}

// creating the url search params type to then pass them as an argument to the list(). Because we cannot simply pass the params as an obj to the list.

function getAxiosParams(productParams: ProductParams){
    const params = new URLSearchParams();
    params.append('pageNumber', productParams.pageNumber.toString());
    params.append('pageSize', productParams.pageSize.toString());
    params.append('orderBy', productParams.orderBy.toString());
    if(productParams.brands?.length > 0) params.append('brands', productParams.brands.toString());
    if(productParams.types?.length > 0) params.append('types', productParams.types.toString());
    if(productParams.searchTerm) params.append('searchTerm', productParams.searchTerm);

    return params;
}

const productsAdapter = createEntityAdapter<Product>();

// I did not create Initial state here because with entityAdapter I will have a function to getInitialState
// so I will use it inside the createSlice for the catalog.

// when we need to specify a second argument w/o having a first argument to give we can use _ which is void (_,secondArgument)
export const fetchProductsAsync = createAsyncThunk<Product[], void, {state: RootState}>(
    'catalog/fetchProductsAsync',
    async(_, thunkAPI) => {
        const params = getAxiosParams(thunkAPI.getState().catalog.productParams);
        try {
            const response = await agent.Catalog.list(params); // setting a response variable here whose body has already the data needed
            thunkAPI.dispatch(setMetaData(response.metaData)); // then I am just extracting the metaData part of the response to dispatch it to the redux state
            return response.items;
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

export const fetchFilters = createAsyncThunk(
    'catalog/fetchFilters',
    async(_, thunkAPI) => {
        try {
            return agent.Catalog.fetchFilters();
        } catch (error: any) {
           return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

function initParams(){
    return {
        pageNumber: 1,
        pageSize: 6,
        orderBy: 'name',
        brands: [],
        types: []
    }
}

// after creating this new slice I have to go to the configure store...
export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState<CatalogState>({
        productsLoaded: false, // this is additional state that I am adding, besides the ids and entities that already exists
        filtersLoaded: false,
        status: 'idle',
        brands: [],
        types: [],
        productParams: initParams(),
        metaData: null
    }),
    reducers: {
        setProductParams: (state, action) => {
            state.productsLoaded = false; // setting this to false to be able to trigger the useEffect, because it is listening for changes and if the !productsLoaded it will run the dispatch and go get the next batch of products
            state.productParams = {...state.productParams, ...action.payload, pageNumber: 1} // using the spread operator because I want to append new values into the existing product params
        },
        setPageNumber: (state, action) => {
            state.productsLoaded = false;
            state.productParams = {...state.productParams, ...action.payload}
        },
        setMetaData: (state, action) => {
            state.metaData = action.payload;
        },
        resetProductParams: (state) => {
            state.productParams = initParams();
        }
    },
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
        builder.addCase(fetchFilters.pending, (state)=>{
            state.status = 'pendingFetchFilters'
        });
        builder.addCase(fetchFilters.fulfilled, (state, action)=>{
            state.brands = action.payload.brands;
            state.types = action.payload.types;
            state.filtersLoaded = true
        });
        builder.addCase(fetchFilters.rejected, (state, action) =>{
            state.status = 'idle';
            console.log(action);
        });
    })
})

// with this product selectors I am able to go and get data from the store
export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);

export const {setProductParams, resetProductParams, setMetaData, setPageNumber} = catalogSlice.actions;


// setPageNumber to correct pagination issue when filtering after advancing in the pages:
// before applying this, the request for filtering, for instance, by brand would get for example
// a total count of 4 and a total pages of 1, but the currentPage would be page we're in, for instance 3.
// therefore if we only have 1 page with 4 products how can there be a page number 3?
// the solution then is to reset the page number to 1 in the reducer when setting the product params.

//*the only time we want to maintain state of the productParams is when we change the page...
// so in the appPagination we dispatch the setPageNumber reducer