import { ShoppingBagRounded } from "@mui/icons-material";
import { AppBar, Badge, Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
// import { useStoreContext } from "../context/StoreContext";
import { useAppSelector } from "../store/configureStore";
import SignedInMenu from "../layout/SignedInMenu"
import React from "react";
import MenuIcon from '@mui/icons-material/Menu';

interface Props {
    window?: () => Window;
  }
  
const drawerWidth = 240;

const navLinkItems = [
    {title: 'catalog', path:'/catalog'},
    {title: 'about', path:'/about'},
    {title: 'contact', path:'/contact'},
    
]

const navAccountLinks = [
    {title: 'login', path:'/login'},
    {title: 'register', path:'/register'}
]


const brandLogo = {
    typography: {
        fontFamily: 'Luxury, sans-serif',
        fontSize: '3rem'
    },
    padding:'5px', 
    color:'#fffaff', 
    textDecoration:'none',
    margin: '0 auto'
}

const navStyles={
    color: '#fffaff', 
    height: '2rem',
    typography:'h6',
    background: 'linear-gradient(to right, #ffd9da 50%, black 50%)',
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
export default function MobileToolbar(props: Props){
    const {basket} = useAppSelector(state => state.basket);
    const {user} = useAppSelector(state => state.account);
    const itemCount = basket?.items.reduce((accumulator, currentValue) => accumulator += currentValue.quantity, 0)

    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
  
    const handleDrawerToggle = () => {
      setMobileOpen((prevState) => !prevState);
    };
  
    const drawer = (
      <Box 
        onClick={handleDrawerToggle} 
        sx={{textAlign: 'center', bgcolor: 'black', color: 'white'}}>
        <Typography variant="h6" sx={{ my: 2 }}>
          MENU
        </Typography>
        <IconButton component={Link} to='/basket' size="large" edge='start' sx={navStyles}>
                        <Badge badgeContent={itemCount} color='secondary'>
                            <ShoppingBagRounded />
                        </Badge>
                    </IconButton>
        <Divider />
        <List>
          {navLinkItems.map(({title, path}) => (
            <ListItem component={NavLink} to={path} key={title} disablePadding>
              <ListItemButton sx={navStyles}>
                <ListItemText primary={title.toUpperCase()} />
              </ListItemButton>
            </ListItem>
          ))}
          {user && user.roles?.includes('Admin') &&
          <ListItem
                  component={NavLink}
                  to={'/inventory'}
                  sx={navStyles}
          >
          INVENTORY
          </ListItem>}
        </List>
        {user ? (
                <SignedInMenu />
                ): (
                    <List>
                            {navAccountLinks.map(({title, path}) => (
                            <ListItem component={NavLink} to={path} key={title} disablePadding>
                                <ListItemButton sx={navStyles}>
                                <ListItemText primary={title.toUpperCase()} />
                                </ListItemButton>
                            </ListItem>
                            ))}
                    </List>
                )}
        </Box>  
                  
     );
  
    const container = window !== undefined ? () => window().document.body : undefined;
  
    return (
        <Box sx={{ display: 'flex'}}>
        <CssBaseline />
        <AppBar component="nav" sx={{bgcolor: '#161a1d' }}>
          <Toolbar>
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              color="inherit"
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography 
                variant='h6' 
                sx={brandLogo}
                component={NavLink}
                to='/'
            >
                Fleur Caroline
            </Typography>
            </Toolbar>
        </AppBar>
        <nav>
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        </nav>
        </Box>
    )
}
