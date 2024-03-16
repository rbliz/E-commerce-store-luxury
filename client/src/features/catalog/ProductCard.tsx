import { ListItem, ListItemAvatar, Avatar, ListItemText, CardMedia, Button, Card, CardActions, CardContent, Typography, CardHeader, colors, CircularProgress } from "@mui/material";
import { Product } from "../../app/models/product";
import { Link } from "react-router-dom";
import { useState } from "react";
import agent from "../../app/api/agent";
import { LoadingButton } from "@mui/lab";
import { useStoreContext } from "../../app/context/StoreContext";
import { currencyFormat } from "../../app/util/util";

interface Props {
  product: Product;
}

//to view the productDetails I use a Link instead of NavLink because I don't need to keep seeing the catalog view
export default function ProductCard({product}: Props){
    const [loading, setLoading] = useState(false)
    const {setBasket} = useStoreContext();

    function handleBuyButton(productId: number){
      setLoading(true);
      agent.Basket.addItem(productId)
        .then(basket => setBasket(basket))
        .catch(error => console.log(error))
        .finally(()=> setLoading(false))
    }

    return(
    <>
      <Card sx={{bgcolor: '#161a1d'}}>
          <CardHeader
              avatar={
                  <Avatar sx={{bgcolor: '#89023e'}}>
                      {product.name.charAt(0).toUpperCase()}
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
              loading={loading} 
              onClick={()=> handleBuyButton(product.id)} 
              size="small" 
              sx={{color: '#3e92cc'}}
              loadingIndicator={<CircularProgress sx={{color:"#fffaff"}} size={16} />}
            >
              Buy
            </LoadingButton>
            <Button component={Link} to={`/catalog/${product.id}`} size="small" sx={{color: '#fffaff'}}>View</Button> 
          </CardActions>
      </Card>
    </>
    )
}

// I am using the LoadingButton API from material UI and to use it we need to run a npm install