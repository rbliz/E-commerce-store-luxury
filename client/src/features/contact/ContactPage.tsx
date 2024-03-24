import { Button, ButtonGroup, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { decrement, increment } from "./counterSlice";

export default function ContactPage(){
    const dispatch = useAppDispatch();
    const {data, title} = useAppSelector(state => state.counter)

    return(
        <>
            <Typography variant="h2" sx={{color: '#fffaff'}}>
                {title}
            </Typography>
            <Typography variant="h5" sx={{color: '#fffaff'}}>
                The data is: {data}
            </Typography>
            <ButtonGroup>
                <Button onClick={()=> dispatch(decrement(1))}  variant="contained" color="error">Decrement 1</Button>
                <Button onClick={()=> dispatch(increment(1))} variant="contained" color="primary">Increment 1</Button>
                <Button onClick={()=> dispatch(increment(5))} variant="contained" color="secondary">Increment 5</Button>
            </ButtonGroup>
        </>
    )
}

