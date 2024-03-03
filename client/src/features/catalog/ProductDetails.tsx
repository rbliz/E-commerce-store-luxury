import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/product";

export default function ProductDetails(){
    //useParams to get the details about the route parameters. Below I am using the id, and because it
    //comes from the url it is a string

    const {id} = useParams<{id: string}>();
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        axios.get(`http://localhost:5000/api/products/${id}`)
            .then(response => setProduct(response.data))
            .catch(error => console.log(error))
            .finally(()=> setLoading(false))
    },[id])

    const tableStyles={
        color: '#fffaff'
    }
  

    if(loading) return <h3>Loading...</h3>

    if(!product) return <h3>Product not found</h3>

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