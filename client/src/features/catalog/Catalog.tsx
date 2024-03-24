import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import ProductList from "./ProductList";
import { useEffect } from "react";
import { fetchProductsAsync, productSelectors } from "./catalogSlice";
// import "../../app/layout/styles.css"

export default function Catalog(){
    const products = useAppSelector(productSelectors.selectAll);
    const dispatch = useAppDispatch();
    const {productsLoaded, status} = useAppSelector(state => state.catalog);

// we do not loose redux state when we stay within our app but load a different component, as opposed to local state which we loose as soon the component is destroyed
useEffect(()=>{
    if(!productsLoaded) dispatch(fetchProductsAsync());
}, [productsLoaded, dispatch])

if(status.includes('pending')) return <LoadingComponent message="Loading Products..."/>

    return(
        <>
            <ProductList products={products} />
        </>
    )
}
