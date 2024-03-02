import { AppBar, Toolbar, Typography } from "@mui/material";

export default function Header(){
    return (
        <AppBar position='static' sx={{mb: 4, bgcolor:'#161a1d', height: '100px'}}>
            <Toolbar>
                <Typography variant='h6' sx={{padding:'35px'}}>
                    Luxury Store
                </Typography>
            </Toolbar>
        </AppBar>
    )
}
