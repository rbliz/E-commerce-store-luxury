import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default function ProductDetails(){
    //useParams to get the details about the route parameters. Below I am using the id, and because it
    //comes from the url it is a string

    const {id} = useParams<{id: string}>();
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)

    // axios has the ability to use an intercepeter. It can intercept requests on the way out of the 
    // client's browser or on the way back in
    useEffect(()=>{
        id && agent.Catalog.details(parseInt(id)) // defensive code by having the id before using it
            .then(response => setProduct(response))
            .catch(error => console.log(error))
            .finally(()=> setLoading(false))
    },[id])

    const tableStyles={
        color: '#fffaff'
    }
  console.log(product)

    if(loading) return <LoadingComponent message="Loading Product..."/>

    if(!product) return <NotFound />

    return(
       <Grid container spacing={6} columns={{xs: 4, sm: 12, md: 12}}>
            <Grid item xs={6}>
                <img 
                    src={product.pictureUrl} 
                    alt={product.name} 
                    style={{width: '100%', borderRadius: '5px'}} />
            </Grid>
            <Grid item xs={6}>
                <Typography variant='h3' sx={{color: '#ffd9da'}}>{product.name}</Typography>
                <Divider sx={{mb: 2, bgcolor:'#89023e'}} />
                <Typography variant="h4" sx={{color:'#ea638c'}}>${((product.price)/100).toFixed(2)}</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={tableStyles}>Description</TableCell>
                                <TableCell sx={tableStyles}>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={tableStyles}>Brand</TableCell>
                                <TableCell sx={tableStyles}>{product.brand}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={tableStyles}>Type</TableCell>
                                <TableCell sx={tableStyles}>{product.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={tableStyles}>Availability</TableCell>
                                <TableCell sx={tableStyles}>
                                {product.quantityInStock != null && product.quantityInStock > 0? "In Stock": "Unavailable"}
                                </TableCell>
                                
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
       </Grid>
    )
}