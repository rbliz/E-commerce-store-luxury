import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { currencyFormat } from "../../app/util/util";
import { useStoreContext } from "../../app/context/StoreContext";
import { LoadingButton } from "@mui/lab";

export default function ProductDetails(){
    //useParams to get the details about the route parameters. Below I am using the id, and because it
    //comes from the url it is a string
    const {basket, setBasket, removeItem} = useStoreContext();
    const {id} = useParams<{id: string}>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const item = basket?.items.find(i => i.productId === product?.id); // here I am checking if I already have the product in the basket

    // axios has the ability to use an intercepeter. It can intercept requests on the way out of the 
    // client's browser or on the way back in
    useEffect(()=>{
        if(item) setQuantity(item.quantity);
        id && agent.Catalog.details(parseInt(id)) // defensive code by having the id before using it
            .then(response => setProduct(response))
            .catch(error => console.log(error))
            .finally(()=> setLoading(false))
    },[id, item])

    const tableStyles={
        color: '#fffaff'
    }

    const disabledStyle = {
        '&:disabled':{
            color: "darkgrey",
            backgroundColor: "grey",
            height: "55px",
        }
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        if(parseInt(event.currentTarget.value) >= 0){

            setQuantity(parseInt(event.currentTarget.value))
        }
    }

    function handleUpdateBasket(){
        if(!product) return;
        setSubmitting(true);
        if(!item || quantity > item.quantity){
            const updatedQuantity = item ? quantity - item.quantity: quantity;
            agent.Basket.addItem(product.id, updatedQuantity)
                .then(basket => setBasket(basket))
                .catch(error => console.log(error))
                .finally(()=> setSubmitting(false));
        }else{
            const updatedQuantity = item.quantity - quantity;
            agent.Basket.removeItem(product.id, updatedQuantity)
                .then(()=> removeItem(product.id, updatedQuantity))
                .catch(error => console.log(error))
                .finally(()=> setSubmitting(false));
        }
    }


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
                <Typography variant="h4" sx={{color:'#ea638c'}}>{currencyFormat(product.price)}</Typography>
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
                <Grid container spacing={2} marginTop={1}>
                    <Grid item xs={6}>
                            <TextField
                                onChange={handleInputChange}
                                sx={{backgroundColor: "#ffd9da"}}
                                variant="filled"
                                type="number"
                                label="Quantity in Basket"
                                fullWidth
                                value={quantity}
                                
                            />
                    </Grid>
                    <Grid item xs={6}>
                        {item?.quantity === quantity || !item && quantity === 0?
                            <LoadingButton
                                disabled={true}
                                loading={submitting}
                                onClick={handleUpdateBasket}
                                // sx={{height: "55px"}}
                                sx={disabledStyle}
                                size="large"
                                variant="contained"
                                fullWidth
                            >
                                {item? "Update quantity": "Buy"}
                            </LoadingButton>
                        :
                            <LoadingButton
                                loading={submitting}
                                onClick={handleUpdateBasket}
                                sx={{height: "55px"}}
                                size="large"
                                variant="contained"
                                fullWidth
                                color="primary"
                            >
                                {item? "Update quantity": "Buy"}
                            </LoadingButton>
                        }
                    </Grid>
                </Grid>
            </Grid>
       </Grid>
    )
}