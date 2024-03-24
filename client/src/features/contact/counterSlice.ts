import { createSlice } from "@reduxjs/toolkit";

// creating the interface
export interface CounterState{
    data: number;
    title: string;
}

// and creating the initial state of those properties above
const initialState: CounterState ={
    data: 42,
    title: "(Redux Toolkit)"
}


// making use of Redux Toolkit here!!
// below I am writing mutating logic in the reducers's action creator
// but since the createSlice API is using the immer library, the updates are immutable
export const counterSlice = createSlice({
    name: "counter",
    initialState,
    reducers: {
        increment: (state, action) =>{
            state.data += action.payload
        },
        decrement: (state, action) =>{
            state.data -= action.payload
        }
    }
})

// the increment and decrement are the actions that I will export 
export const {increment, decrement} = counterSlice.actions