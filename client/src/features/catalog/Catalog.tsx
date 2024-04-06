import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import ProductList from "./ProductList";
import { useEffect } from "react";
import { fetchFilters, fetchProductsAsync, productSelectors, setPageNumber, setProductParams } from "./catalogSlice";
import { Grid, Paper } from "@mui/material";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import AppPagination from "../../app/components/AppPagination";

// import "../../app/layout/styles.css"


const sortOptions = [
    {value: 'name', label: 'Alphabetical'},
    {value: 'priceDesc', label: 'Price - Highest to Lowest'},
    {value: 'price', label: 'Price - Lowest to highest'}
]

export default function Catalog(){
    const products = useAppSelector(productSelectors.selectAll);
    const dispatch = useAppDispatch();
    const {productsLoaded, filtersLoaded, brands, types, productParams, metaData} = useAppSelector(state => state.catalog);

// we do not loose redux state when we stay within our app but load a different component, as opposed to local state which we loose as soon the component is destroyed
useEffect(()=>{
    if(!productsLoaded) dispatch(fetchProductsAsync());
}, [productsLoaded, dispatch])

// I will use a different useEffect to avoid the double loading of the products
useEffect(()=>{
    if(!filtersLoaded) dispatch(fetchFilters());
}, [filtersLoaded, dispatch])

if(!filtersLoaded) return <LoadingComponent message="Loading Products..."/>

    return(
        <Grid container columnSpacing={4}>
            <Grid item xs={3}>
                <Paper sx={{mb: 2, bgcolor: '#161a1d'}}> 
                    <ProductSearch />
                </Paper>
               <Paper sx={{mb: 2, p: 2, bgcolor: '#161a1d'}}>
                    <RadioButtonGroup
                        selectedValue={productParams.orderBy}
                        options={sortOptions}
                        onChange={(e) => dispatch(setProductParams({orderBy: e.target.value}))}
                    />
               </Paper>
               <Paper sx={{mb: 2, p: 2, bgcolor: '#161a1d'}}>
                  <CheckboxButtons
                    items={brands}
                    checked={productParams.brands}
                    onChange={(items: string[]) => dispatch(setProductParams({brands: items}))}
                  />
               </Paper>
               <Paper sx={{mb: 2, p: 2, bgcolor: '#161a1d'}}>
                    <CheckboxButtons 
                        items={types}
                        checked={productParams.types}
                        onChange={(items: string[]) => dispatch(setProductParams({types: items}))}
                    />             
               </Paper>                 
            </Grid>
                <Grid item xs={9}>
                    <ProductList products={products} />
                </Grid>
                <Grid item xs={3} />
                <Grid item xs={9} sx={{mb:2}}>
                    {metaData &&
                    <AppPagination
                        metaData={metaData} // to make the warning go away, add the null (!metaData) to display the loading....
                        onPageChange={(page: number) => dispatch(setPageNumber({pageNumber: page}))}
                    />}
                </Grid>
        </Grid>
    )
}
