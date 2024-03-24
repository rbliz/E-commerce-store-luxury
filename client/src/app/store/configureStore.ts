import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "../../features/contact/counterSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { basketSlice } from "../../features/basket/basketSlice";
import { catalogSlice } from "../../features/catalog/catalogSlice";

// export default function configureStore(){
//     return createStore(counterReducer)
// }


// 1 Redux Store
export const store = configureStore({
    reducer: {
        counter: counterSlice.reducer,
        basket: basketSlice.reducer,
        catalog: catalogSlice.reducer
    }
})


// creating types to make it easier to use what we have here inside typescript

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// creating custom Hooks to use elsewhere. Instead of useSelector, for instance in the contactPage, we'll use the useAppSelector.

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;