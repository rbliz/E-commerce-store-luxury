import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

interface Props{
    message?: string;
}

export default function LoadingComponent({message = "Loading..."}: Props){
    return(
        <Backdrop open={true} invisible={true}>
            <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
                <CircularProgress size={100} sx={{color: '#89023e'}}/>
                <Typography
                    variant="h4"
                    sx={{
                        justifyContent: 'center',
                        position: 'fixed',
                        top: '60%',
                        color: '#fffaff'
                    }}
                >
                    {message}
                </Typography>
            </Box>
        </Backdrop>
    )
}