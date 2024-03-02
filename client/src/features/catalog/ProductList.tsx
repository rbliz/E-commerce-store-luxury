import { Grid, List } from "@mui/material";
import { Product } from "../../app/models/product";
import ProductCard from "./ProductCard";

interface Props {
    products: Product[];
}

// RWD with xs(extra small), sm(small) and md(medium)
export default function ProductList({products}: Props){
    return(
    <>
         <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {products.map((product)=>(
                <Grid item xs={2} sm={4} md={3} key={product.id}>
                    <ProductCard key={product.id} product={product}/>
                </Grid>
            ))}
        </Grid>
    </>
    )
}