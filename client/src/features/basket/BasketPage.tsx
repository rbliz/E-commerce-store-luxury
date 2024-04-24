import { Button, Grid, Typography } from "@mui/material";
import BasketSummary from "./BasketSummary";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/store/configureStore";
import BasketTable from "./BasketTable";


export default function BasketPage(){
    const {basket} = useAppSelector(state => state.basket);
    // I am setting status state with an obj to specify a property name
    // so I can identify the single product and the loadingButton that it is loading when true
   
    if(!basket) return <Typography variant="h3" color={"white"}>Your basket is empty</Typography>

    return(
      <>
      <BasketTable items={basket.items} /> 
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