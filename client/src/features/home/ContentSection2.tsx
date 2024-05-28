import { Link, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { FadeIn } from "../../app/components/FadeIn";


export default function ContentSection2(){

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

    return(
        <div className="content-section-2">
            <FadeIn>
            <div className="info-content-section-2">
                <Typography 
                    variant="h6" 
                    sx={{color: '#fffaff', mb: '30px', textAlign: 'justify', textJustify: 'inter-word'}}
                >
                    The extraordinary future of tomorrow is crafted today.
                    Margaux Durand's mission is to be committed to create a meaningful tomorrow 
                    through kindness, generosity and sharing with dedication to the art and savoir-faire.
                    With a profound belief that life can be elevated by
                    harnessing the magnificent beauty, Margaux Durand aims to 
                    uncover, foster and treasure the limitless potential and unique beauty
                    of every piece passionately designed.
                </Typography>
                
                    <Link component={NavLink} to='/about' sx={navStyles}>
                        Learn More
                    </Link>
                
            </div>
            </FadeIn>
            <FadeIn>
                <img id="img-content-section-2" src="/images/homepage/content-section-2.jpg"/>
            </FadeIn>
        </div>
    )
}