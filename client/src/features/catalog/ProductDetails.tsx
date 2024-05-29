import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { currencyFormat } from "../../app/util/util";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "../basket/basketSlice";
import { fetchProductAsync, productSelectors } from "./catalogSlice";

export default function ProductDetails(){
    //useParams to get the details about the route parameters. Below I am using the id, and because it
    //comes from the url it is a string
    const {basket, status} = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();
    const {id} = useParams<{id: string}>();
    const product = useAppSelector(state => productSelectors.selectById(state, parseInt(id!)));
    const {status: productStatus} = useAppSelector(state => state.catalog); // I have to give another name to the status variable so I can specify status: productStatus
    const [quantity, setQuantity] = useState(0);
    const item = basket?.items.find(i => i.productId === product?.id); // here I am checking if I already have the product in the basket

    // axios has the ability to use an intercepeter. It can intercept requests on the way out of the 
    // client's browser or on the way back in
    useEffect(()=>{
        if(item) setQuantity(item.quantity);
        if(!product && id) dispatch(fetchProductAsync(parseInt(id))); // defensive code by having the id before using it
    },[id, item, dispatch, product])

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
        if(!item || quantity > item.quantity){
            const updatedQuantity = item ? quantity - item.quantity: quantity;
            dispatch(addBasketItemAsync({productId: product.id, quantity: updatedQuantity}))
        }else{
            const updatedQuantity = item.quantity - quantity;
            // since the names I am passing do not match the properties in the method I need to specify them in curly brackets with {prop: name}
            dispatch(removeBasketItemAsync({productId: product.id, quantity: updatedQuantity})) 
        }
    }

    if(productStatus.includes('pending')) return <LoadingComponent message="Loading Product..."/>

    if(!product) return <NotFound />

    return(
       <Grid container spacing={6} columns={{xs: 4, sm: 12, md: 12}} sx={{mt: '120px'}}>
            <Grid item xs={6}>
                <img 
                    src={product.pictureUrl} 
                    alt={product.name} 
                    style={{width: '100%', borderRadius: '5px', marginTop: 10}} />
            </Grid>
            <Grid item xs={6}>
                <Grid container display='flex' justifyContent='space-between'>
                <Typography variant='h3' sx={{color: '#ffd9da'}}>{product.name}</Typography>
                <Link style={{color: 'whitesmoke', alignSelf: 'center'}} to='/catalog' relative='path'>&larr; Back</Link>
                </Grid>
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
                                sx={{backgroundColor: "whitesmoke"}}
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
                                loading={status.includes('pending')}
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
                                loading={status.includes('pending')}
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