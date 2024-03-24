import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import BasketSummary from "./BasketSummary";
import { currencyFormat } from "../../app/util/util";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "./basketSlice";


export default function BasketPage(){
    const {basket,status} = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();
    // I am setting status state with an obj to specify a property name
    // so I can identify the single product and the loadingButton that it is loading when true
   
    if(!basket) return <Typography variant="h3" color={"white"}>Your basket is empty</Typography>

    return(
      <>
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Sub-Total</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {basket.items.map((item) => (
              <TableRow
                key={item.productId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Box display="flex" alignItems="center">
                      <img src={item.pictureUrl} alt={item.name} style={{height: 50, marginRight: 20}} />
                      <span>{item.name}</span>
                  </Box>
                </TableCell>
                <TableCell align="right">${currencyFormat(item.price)}</TableCell>
                <TableCell align="center">
                    <LoadingButton 
                        loading={status === 'pendingRemoveItem' + item.productId + 'rem'} 
                        onClick={()=> dispatch(removeBasketItemAsync({
                          productId: item.productId, quantity: 1, name: 'rem'}))} 
                        sx={{color: "#89023e", backgroundColor: "#ffd9da", marginRight: 1}}
                    >
                      <Remove />
                    </LoadingButton>
                      {item.quantity}
                    <LoadingButton 
                        loading={status === 'pendingAddItem' + item.productId} 
                        onClick={()=> dispatch(addBasketItemAsync({productId: item.productId}))} 
                        sx={{color: "#ffd9da", backgroundColor: "#89023e", marginLeft: 1}}
                    >
                      <Add />
                    </LoadingButton>
                  </TableCell>
                <TableCell align="right">${((item.price * item.quantity)/100).toFixed(2)}</TableCell>
                <TableCell align="right">
                    <LoadingButton
                        loading={status === 'pendingRemoveItem' + item.productId + 'del'}
                        onClick={()=> dispatch(removeBasketItemAsync({
                          productId: item.productId, quantity: item.quantity, name: 'del'}))} 
                        color="error"
                    >
                      <Delete />
                    </LoadingButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container>
              <Grid item xs={6} />
              <Grid item xs={6}>
                  <BasketSummary />
                  <Button
                    component={Link}
                    to='/checkout'
                    variant="contained"
                    size="large"
                    fullWidth
                  >
                    Checkout
                  </Button>
              </Grid>
      </Grid>
    </>
    )
}