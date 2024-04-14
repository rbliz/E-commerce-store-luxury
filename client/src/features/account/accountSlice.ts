import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { User } from "../../app/models/user";
import { FieldValues } from "react-hook-form";
import agent from "../../app/api/agent";
import { router } from "../../app/router/Routes";
import { toast } from "react-toastify";
import { setBasket } from "../basket/basketSlice";

interface AccountState{
    user: User | null;
}

const initialState: AccountState = {
    user: null
}

// the sign in method will return a type User, with the data from the form passed in as arguments
// we are gonna want to persist our data here, and to do that we'll use some type of persistent storage
// and in the case here, the localStorage, so when the browser is refreshed the data is still there

export const signInUser = createAsyncThunk<User, FieldValues>(
    'account/signInUser',
    async(data, thunkAPI) => {
        try {
            const userDto = await agent.Account.login(data);
            const {basket, ...user} = userDto; // with this the basket can be destructured into its own property, and the rest of the properties are accessed through what we called with the spread operator.
            if(basket) thunkAPI.dispatch(setBasket(basket)); // the basket we can use it on its own to set the basket in the basket slice of redux
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const fetchCurrentUser = createAsyncThunk<User>(
    'account/fetchCurrentUser',
    async (_, thunkAPI) => {
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)));
        try {
            const userDto = await agent.Account.currentUser();
            const {basket, ...user} = userDto;
            if(basket) thunkAPI.dispatch(setBasket(basket));
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error: any) {
           return thunkAPI.rejectWithValue({error: error.data})
        }
    },
    {
        condition: () => {
            if(!localStorage.getItem('user')) return false;
        }
    }
)

// the sign out is in the reducers since we do not need to do anything asynchrounously. 
export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        signOut: (state) => {
            state.user = null;
            localStorage.removeItem('user');
            router.navigate('/');
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchCurrentUser.rejected, (state) => {
            state.user = null;
            localStorage.removeItem('user');
            toast.error('Session expired - Please log in');
            router.navigate('/login')
        });
        builder.addCase(signInUser.rejected, (_state, action) => {
            throw action.payload;
        });
        builder.addMatcher(isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled), (state, action) => {
            state.user = action.payload;
        });
        
    })
})

export const {signOut, setUser} = accountSlice.actions