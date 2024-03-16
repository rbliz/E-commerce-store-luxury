import { Typography } from "@mui/material";

export default function CheckoutPage(){
    return(
        <Typography variant="h3" sx={{color: "white"}}>
            Only logged in users should see this!
        </Typography>
    )
}