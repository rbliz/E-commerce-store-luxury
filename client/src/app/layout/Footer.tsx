import { AppBar, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
// import { useStoreContext } from "../context/StoreContext";





// by using the component prop in the <ListItem> from Material UI I am able to use the NavLink functionality
export default function Footer(){
    

    return (
        <AppBar position='static' sx={{mb: 0, mt: 8, bgcolor:'#161a1d', height: '175px'}}>
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent:'space-between',
                    alignItems:'center',
                    gap: '50px'
                }}
            >
                <Typography 
                    variant='h6' 
                    sx={{fontSize: '10px', textDecoration: 'none', color: 'white', fontFamily: 'inherit'}} 
                    component={NavLink} 
                    to='/'
                    >
                    COMPANY Lorem Ipsis Verbum 
                    Lorem Ipsis Verbum Lorem Ipsis Verbum
                    Lorem Ipsis Verbum Lorem Ipsis Verbum
                    Lorem Ipsis Verbum Lorem Ipsis Verbum
                    Lorem Ipsis Verbum Lorem Ipsis Verbum
                </Typography>
                <Typography 
                    variant='h6' 
                    sx={{fontSize: '10px', textDecoration: 'none', color: 'white', fontFamily: 'inherit'}} 
                    component={NavLink} 
                    to='/'
                    >
                    2024 POWERED BY RUBEN BLIZ BARRADAS
                    
                </Typography>
               
               
            </Toolbar>
        </AppBar>
    )
}
