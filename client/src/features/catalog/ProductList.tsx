import { Grid } from "@mui/material";
import { Product } from "../../app/models/product";
import ProductCard from "./ProductCard";
import { useAppSelector } from "../../app/store/configureStore";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface Props {
    products: Product[];
}

// RWD with xs(extra small), sm(small) and md(medium)
export default function ProductList({products}: Props){
    const {productsLoaded} = useAppSelector(state => state.catalog)
    return(
    <>
         <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12 }}>
            {products.map((product)=>(
                <Grid item xs={2} sm={2} md={4} key={product.id}>
                    {!productsLoaded?(
                        <ProductCardSkeleton />
                    ) : (
                        <ProductCard key={product.id} product={product}/>
                    )}
                </Grid>
            ))}
        </Grid>
    </>
    )
}