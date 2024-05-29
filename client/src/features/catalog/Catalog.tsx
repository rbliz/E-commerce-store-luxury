import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import ProductList from "./ProductList";
import { setPageNumber, setProductParams } from "./catalogSlice";
import { Grid, Paper } from "@mui/material";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import AppPagination from "../../app/components/AppPagination";
import MediaQuery from "react-responsive";
import useProducts from "../../app/hooks/useProducts";


const sortOptions = [
    {value: 'name', label: 'Alphabetical'},
    {value: 'priceDesc', label: 'Price - Highest to Lowest'},
    {value: 'price', label: 'Price - Lowest to highest'}
]

export default function Catalog(){
    const {products, filtersLoaded, brands, types, metaData} = useProducts();
    const dispatch = useAppDispatch();
    const { productParams } = useAppSelector(state => state.catalog);

    if(!filtersLoaded) return <LoadingComponent message="Loading Products..."/>

    return(
    <>
    <MediaQuery minWidth={600}>
        <Grid container columnSpacing={4} sx={{mt: '130px'}}>
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
                        items={types}
                        checked={productParams.types}
                        onChange={(items: string[]) => dispatch(setProductParams({types: items}))}
                    />             
               </Paper> 
               <Paper sx={{mb: 2, p: 2, bgcolor: '#161a1d'}}>
                  <CheckboxButtons
                    items={brands}
                    checked={productParams.brands}
                    onChange={(items: string[]) => dispatch(setProductParams({brands: items}))}
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
        </MediaQuery>
        <MediaQuery maxWidth={599}>
            <Grid container columnSpacing={4} sx={{display: 'block', mt: '130px'}}>
                <Grid>
                    <Paper sx={{mb: 1, ml: 3, bgcolor: '#161a1d'}}> 
                        <ProductSearch />
                    </Paper>
                </Grid>
                <Grid sx={{display: 'flex', gap: 1, margin: '0 auto'}}>
                   
                    <Paper sx={{mb: 2, ml: 3, p: 2, bgcolor: '#161a1d'}}>
                        <RadioButtonGroup
                            selectedValue={productParams.orderBy}
                            options={sortOptions}
                            onChange={(e) => dispatch(setProductParams({orderBy: e.target.value}))}
                            
                        />
                    </Paper>
                    <Paper sx={{mb: 2, p: 2, bgcolor: '#161a1d'}}>
                        <CheckboxButtons 
                            items={types}
                            checked={productParams.types}
                            onChange={(items: string[]) => dispatch(setProductParams({types: items}))}
                        />             
                    </Paper> 
                    <Paper sx={{mb: 2, p: 2, bgcolor: '#161a1d'}}>
                        <CheckboxButtons
                            items={brands}
                            checked={productParams.brands}
                            onChange={(items: string[]) => dispatch(setProductParams({brands: items}))}
                        />
                    </Paper>
                                    
                </Grid>           
                <Grid item xs={9} margin='0 auto'>
                    <ProductList products={products} />
                </Grid>
                <Grid item xs={3} />
                <Grid item xs={12} sx={{mb:2}}>
                    {metaData &&
                    <AppPagination
                        metaData={metaData} // to make the warning go away, add the null (!metaData) to display the loading....
                        onPageChange={(page: number) => dispatch(setPageNumber({pageNumber: page}))}
                    />}
                </Grid>
            </Grid>
        </MediaQuery>
    </>
    )
}
