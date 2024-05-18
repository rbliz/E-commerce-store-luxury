import { Container, Divider, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function ServerError(){
    const {state} = useLocation();
    return(
        <Container sx={{mt: 25}} component={Paper}>
            {state?.error ?(
                    <>
                        <Typography variant="h3" color='secondary' gutterBottom>
                            {state.error.title}
                        </Typography>
                        <Divider />
                        <Typography variant="body1">{state.error.detail || 'Internal Server Error'}</Typography> 
                    </>
                ) : (
                <Typography variant="h5" gutterBottom>Server Error</Typography>
                )
            }
        </Container>
    )
}

//In production we do not have access to stackTrace so I hard code the 'Internal Server Error' message above