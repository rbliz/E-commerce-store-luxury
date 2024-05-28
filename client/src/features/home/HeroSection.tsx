import { Link, Typography } from "@mui/material";
import MediaQuery from "react-responsive";
import { NavLink } from "react-router-dom";

const navStyles={
    position: 'relative',
    top:'50px',
    left: '50px',
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
        borderRadius: '3px',
        transition: 'all .35s cubic-bezier(1, 0.68, 0.16, 0.9)',
        backgroundPosition: 'left bottom'
    },
    '&.active':{
        color:'#ffd9da',
        background: 'none',
        borderBottom: 'none',
       
    },
    
}

const mobileNavStyles={
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
        borderRadius: '3px',
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
            <MediaQuery minWidth={600}>
           <Typography variant="h4" sx={{color: '#fffaff', position: 'relative', top:'50px', left: '50px'}}>
                Margaux Durand Jewelry Designer     
           </Typography> 
           <Typography
                variant="h6" 
                sx={
                    {
                        color: '#fffaff', 
                        mt: '25px', mb: '50px', 
                        textAlign: 'justify', 
                        textJustify: 'inter-word',  
                        position: 'relative', 
                        top:'55px',
                        left: '50px',
                        width: '50%'
                    }
                }
            >
               The origins of Margaux Durand jewelry date back to 2017, when the young apprentice Margaux Durand
               started out in the jewelry business.
               Three years after, she moved to Barcelona and opened her own establishment, 
               building great notoriety and becoming one of the most sought after designers amongst
               the youngest generations.        
           </Typography>
           <Link
                component={NavLink}
                to='/catalog'
                sx={navStyles}
            >
                Our Products
            </Link>
           </MediaQuery>
           <MediaQuery maxWidth={599}>
           <Typography variant="h4" sx={{color: '#fffaff'}}>
                Margaux Durand Jewelry Designer     
           </Typography> 
           <Typography
                variant="h6" 
                sx={
                    {
                        color: '#fffaff', 
                        mt: '25px', mb: '50px', 
                        textAlign: 'justify', 
                        textJustify: 'inter-word',  
                        
                    }
                }
            >
               The origins of Margaux Durand jewelry date back to 2017, when the young apprentice Margaux Durand
               started out in the jewelry business.
               Three years after, she moved to Barcelona and opened her own establishment, 
               building great notoriety and becoming one of the most sought after designers amongst
               the youngest generations.        
           </Typography>
           <Link
                component={NavLink}
                to='/catalog'
                sx={mobileNavStyles}
            >
                Our Products
            </Link>
           </MediaQuery> 
        </div>
    )
}


