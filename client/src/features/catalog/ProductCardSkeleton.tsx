import {
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Grid,
    Skeleton
} from "@mui/material";

export default function ProductCardSkeleton() {
    return (
        <Grid item xs component={Card}>
            <CardHeader
                avatar={
                    <Skeleton animation="wave" variant="circular" width={40} height={40} sx={{bgcolor: '#89023e'}}   />
                }
                title={
                    <Skeleton
                        animation="wave"
                        height={10}
                        width="80%"
                        style={{ marginBottom: 6}}
                        sx={{bgcolor: '#ffd9da'}}
                    />
                }
                sx={{bgcolor: '#161a1d'}}
             />
            <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
            <CardContent sx={{bgcolor: '#161a1d'}}>
                <>
                    <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} sx={{bgcolor: '#ea638c'}} />
                    <Skeleton animation="wave" height={10} width="80%" sx={{bgcolor: '#ffd9da'}}/>
                </>
            </CardContent>
            <CardActions sx={{bgcolor: '#161a1d'}}>
                <>
                    <Skeleton animation="wave" height={10} width='40%' sx={{bgcolor: '#3e92cc'}}/>
                    <Skeleton animation="wave" height={10} width="20%" sx={{bgcolor: '#fffaff'}} />
                </>
            </CardActions>
        </Grid>
    )
}