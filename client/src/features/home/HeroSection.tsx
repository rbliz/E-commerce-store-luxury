import { Link, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

const navStyles={
    bgcolor: 'white', 
    color: 'black', 
    textDecoration: 'none',
    padding: '10px',
    height: '2rem',
    typography:'h6',
    background: 'linear-gradient(to right, #ffd9da 50%, white 50%)',
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

export default function HeroSection(){
    return(
        <div className="hero-section">
           <Typography variant="h2" sx={{color: '#fffaff'}}>
                Hero section      
           </Typography> 
           <Typography variant="h6" sx={{color: '#fffaff', mt: '10px', mb: '50px'}}>
                Lorem Ipsis Verbum Lorem Ipsis Verbum Lorem Ipsis Verbum  
                Lorem Ipsis Verbum Lorem Ipsis Verbum Lorem Ipsis Verbum    
                Lorem Ipsis Verbum Lorem Ipsis Verbum Lorem Ipsis Verbum         
                Lorem Ipsis Verbum Lorem Ipsis Verbum Lorem Ipsis Verbum         
                Lorem Ipsis Verbum Lorem Ipsis Verbum Lorem Ipsis Verbum         
           </Typography>
           <Link
                component={NavLink}
                to='/catalog'
                sx={navStyles}
            >
                Our Products
            </Link>
        </div>
    )
}


