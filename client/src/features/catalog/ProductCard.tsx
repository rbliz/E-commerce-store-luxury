import { Avatar, CardMedia, Button, Card, CardActions, CardContent, Typography, CardHeader, CircularProgress } from "@mui/material";
import { Product } from "../../app/models/product";
import { Link } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { currencyFormat } from "../../app/util/util";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync } from "../basket/basketSlice";

interface Props {
  product: Product;
}
const navStyles={
    color: '#3e92cc', 
    height: '1.75rem',
    width: '.5rem',
    typography:'h12',
    background: 'linear-gradient(to right, #3e92cc 50%, #161a1d 50%)',
    backgroundSize: '200% 100%',
    backgroundPosition: 'right bottom',
    transition: 'all .35s cubic-bezier(1, 0.68, 0.16, 0.9)',
    '&:hover':{
        color:'white',
        borderRadius: '3px',
        transition: 'all .35s cubic-bezier(1, 0.68, 0.16, 0.9)',
        backgroundPosition: 'left bottom'
    }
   
}

//to view the productDetails I use a Link instead of NavLink because I don't need to keep seeing the catalog view
export default function ProductCard({product}: Props){
    const {status} = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();
    // {product.name.charAt(0).toUpperCase()}
   return(
    <>
      <Card sx={{bgcolor: '#161a1d'}}>
          <CardHeader
              avatar={
                  <Avatar sx={{bgcolor: '#89023e'}}>
                      <img id="avatar-product-card-img" src="../images/products/logo_luxuryStore.png" />
                  </Avatar>
              }
            title={product.name}
            titleTypographyProps={{
              sx:{fontWeight: 'bold', color: '#ffd9da'}
            }}
          />
          <CardMedia
            sx={{ height: 140 }}
            image={product.pictureUrl}
            title="green iguana"
          />
          <CardContent>
            <Typography gutterBottom color="#ea638c" variant="h5" component="div">
              {currencyFormat(product.price)}
            </Typography>
            <Typography variant="body2" color="#ffd9da">
              {product.brand} / {product.type}
            </Typography>
          </CardContent>
          <CardActions>
            <LoadingButton 
              loading={status === ('pendingAddItem' + product.id)} // if it's pending then it will show the loading indicator specific for the card
              onClick={()=> dispatch(addBasketItemAsync({productId: product.id}))} 
              size="small" 
              sx={navStyles}
              loadingIndicator={<CircularProgress sx={{color:"#fffaff"}} size={16} />}
            >
              Buy
            </LoadingButton>
            <Button component={Link} to={`/catalog/${product.id}`} size="small" sx={{color: '#fffaff', '&:hover':{background: 'none'}}}>View</Button> 
          </CardActions>
      </Card>
    </>
    )
}

// I am using the LoadingButton API from material UI and to use it we need to run a npm install