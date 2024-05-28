import { Remove, Add, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";
import { currencyFormat } from "../../app/util/util";
import { removeBasketItemAsync, addBasketItemAsync } from "./basketSlice";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";
import { BasketItem } from "../../app/models/basket";

interface Props
{
    items: BasketItem[];
    isBasket?: boolean;
}

export default function BasketTable({items, isBasket = true}: Props){
    const {status} = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();
    
    return(
        <TableContainer sx={{mt: 15}} component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Sub-Total</TableCell>
              {isBasket &&
              <TableCell align="right"></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.productId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Box display="flex" alignItems="center">
                      <img src={item.pictureUrl} alt={item.name} style={{height: 50, marginRight: 20, width: '25%'}} />
                      <span>{item.name}</span>
                  </Box>
                </TableCell>
                <TableCell align="right">{currencyFormat(item.price)}</TableCell>
                <TableCell align="center" sx={{width: '190px'}}>
                    {isBasket &&
                    <LoadingButton 
                        loading={status === 'pendingRemoveItem' + item.productId + 'rem'} 
                        onClick={()=> dispatch(removeBasketItemAsync({
                          productId: item.productId, quantity: 1, name: 'rem'}))} 
                        sx={{color: "#89023e", backgroundColor: "#ffd9da", marginRight: 1, padding: 0}}
                    >
                      <Remove />
                    </LoadingButton>}
                      {item.quantity}
                    {isBasket &&
                    <LoadingButton 
                        loading={status === 'pendingAddItem' + item.productId} 
                        onClick={()=> dispatch(addBasketItemAsync({productId: item.productId}))} 
                        sx={{color: "#89023e", backgroundColor: "#ffd9da", marginLeft: 1, padding: 0}}
                    >
                      <Add />
                    </LoadingButton>}
                  </TableCell>
                <TableCell align="right">${((item.price * item.quantity)/100).toFixed(2)}</TableCell>
                {isBasket &&
                <TableCell align="right">
                    <LoadingButton
                        loading={status === 'pendingRemoveItem' + item.productId + 'del'}
                        onClick={()=> dispatch(removeBasketItemAsync({
                          productId: item.productId, quantity: item.quantity, name: 'del'}))} 
                        color="error"
                    >
                      <Delete />
                    </LoadingButton>
                </TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
}