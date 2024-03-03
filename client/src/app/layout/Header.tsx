import { ShoppingBagRounded, ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, List, ListItem, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

const midLinks = [
    {title: 'catalog', path:'/catalog'},
    {title: 'about', path:'/about'},
    {title: 'contact', path:'/contact'}
]

const rightLinks = [
    {title: 'login', path:'/login'},
    {title: 'register', path:'/register'}
]

const navStyles={
    color: '#fffaff', 
    typography:'h6',
    '&:hover':{
        color:'#ffd9da'
    },
    '&.active':{
        color:'#ffd9da',
        textDecoration: 'underline'
    }
}

// by using the component prop in the <ListItem> from Material UI I am able to use the NavLink functionality
export default function Header(){
    return (
        <AppBar position='static' sx={{mb: 4, bgcolor:'#161a1d', height: '100px'}}>
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent:'space-between',
                    alignItems:'center'
                }}
            >
                <Typography 
                    variant='h6' 
                    sx={{padding:'35px', color:'#fffaff', textDecoration:'none'}} 
                    component={NavLink} 
                    to='/'
                    >
                    LUXURY STORE
                </Typography>
                <List sx={{display: 'flex'}}>
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
                    <IconButton size="large" edge='start' sx={{color:'#fffaff', mr: 2}}>
                        <Badge badgeContent='4' color='secondary'>
                            <ShoppingBagRounded />
                        </Badge>
                    </IconButton>

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
                </Box>
            </Toolbar>
        </AppBar>
    )
}
