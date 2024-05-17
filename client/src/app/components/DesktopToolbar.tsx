import { ShoppingBagRounded } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, List, ListItem, Toolbar, Typography } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
// import { useStoreContext } from "../context/StoreContext";
import { useAppSelector } from "../store/configureStore";
import SignedInMenu from "../layout/SignedInMenu"


const midLinks = [
    {title: 'catalog', path:'/catalog'},
    {title: 'about', path:'/about'},
    {title: 'contact', path:'/contact'}
]

const rightLinks = [
    {title: 'login', path:'/login'},
    {title: 'register', path:'/register'}
]

const brandLogo = {
    typography: {
        fontFamily: 'Luxury, sans-serif',
        fontSize: '3rem'
    },
    padding:'30px', 
    color:'#fffaff', 
    textDecoration:'none'
}

const navStyles={
    color: '#fffaff', 
    height: '2rem',
    typography:'h6',
    background: 'linear-gradient(to right, #ffd9da 50%, #161a1d 50%)',
    backgroundSize: '200% 100%',
    backgroundPosition: 'right bottom',
    transition: 'all .35s cubic-bezier(1, 0.68, 0.16, 0.9)',
    '&:hover':{
        color:'black',
        // borderBottom: '3px solid #ffd9da',
        borderRadius: '1px',
        transition: 'all .35s cubic-bezier(1, 0.68, 0.16, 0.9)',
        backgroundPosition: 'left bottom'
    },
    '&.active':{
        color:'#ffd9da',
        background: 'none',
        borderBottom: 'none',
       
    },
    
}

// by using the component prop in the <ListItem> from Material UI I am able to use the NavLink functionality
export default function DesktopToolbar(){
    const {basket} = useAppSelector(state => state.basket);
    const {user} = useAppSelector(state => state.account);
    const itemCount = basket?.items.reduce((accumulator, currentValue) => accumulator += currentValue.quantity, 0)

    return (
        <AppBar position='fixed' sx={{mb: 4, bgcolor:'#161a1d', height: '100px'}}>
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent:'space-between',
                    alignItems:'center'
                }}
            >
                <Typography 
                    variant='h6' 
                    sx={brandLogo} 
                    component={NavLink} 
                    to='/'
                    >
                    Fleur Caroline
                </Typography>
                <List sx={{display: 'flex', justifyContent: 'space-between'}}>
                    {midLinks.map(({title, path})=>(
                        <ListItem
                            component={NavLink}
                            to={path}
                            key={path}
                            sx={navStyles}
                            
                        >
                       {title.toUpperCase()}
                        </ListItem>
                    ))}
                </List>
                <Box display='flex' alignItems='center'>        
                    <IconButton component={Link} to='/basket' size="large" edge='start' sx={navStyles}>
                        <Badge badgeContent={itemCount} color='secondary'>
                            <ShoppingBagRounded />
                        </Badge>
                    </IconButton>
                    {user ? (
                        <SignedInMenu />
                    ): (
                        <List sx={{display: 'flex'}}>
                            {rightLinks.map(({title, path})=>(
                                <ListItem
                                    component={NavLink}
                                    to={path}
                                    key={path}
                                    sx={navStyles}
                                >
                                {title.toUpperCase()}
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    )
}
