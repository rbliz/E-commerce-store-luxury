import { ListItem, ListItemAvatar, Avatar, ListItemText, CardMedia, Button, Card, CardActions, CardContent, Typography, CardHeader } from "@mui/material";
import { Product } from "../../app/models/product";
import { Link } from "react-router-dom";

interface Props {
  product: Product;
}

//to view the productDetails I use a Link instead of NavLink because I don't need to keep seeing the catalog view
export default function ProductCard({product}: Props){
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
              ${((product.price)/100).toFixed(2)}
            </Typography>
            <Typography variant="body2" color="#ffd9da">
              {product.brand} / {product.type}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" sx={{color: '#3e92cc'}}>Buy</Button>
            <Button component={Link} to={`/catalog/${product.id}`} size="small" sx={{color: '#fffaff'}}>View</Button> 
          </CardActions>
      </Card>
    </>
    )
}