import { useEffect } from "react";
import { productSelectors, fetchProductsAsync, fetchFilters } from "../../features/catalog/catalogSlice";
import { useAppSelector, useAppDispatch } from "../store/configureStore";

export default function useProducts(){
    const products = useAppSelector(productSelectors.selectAll);
    const dispatch = useAppDispatch();
    const {productsLoaded, filtersLoaded, brands, types, metaData} = useAppSelector(state => state.catalog);

// we do not loose redux state when we stay within our app but load a different component, as opposed to local state which we loose as soon the component is destroyed
useEffect(()=>{
    if(!productsLoaded) dispatch(fetchProductsAsync());
}, [productsLoaded, dispatch])

// I will use a different useEffect to avoid the double loading of the products
useEffect(()=>{
    if(!filtersLoaded) dispatch(fetchFilters());
}, [filtersLoaded, dispatch])

    return {
        products,
        productsLoaded,
        filtersLoaded,
        brands,
        types,
        metaData
    }

}