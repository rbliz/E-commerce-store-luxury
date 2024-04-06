import { TextField, debounce } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setProductParams } from "./catalogSlice";
import { useState } from "react";

export default function ProductSearch(){
    const {productParams} = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();
    // We'll need to store the search term in the component local state
    const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);

    // and we'll also need a debounced function that will call the setProductParams so that it only updates
    // the result after some delay or some inputs condition  
     
    const debouncedSearch = debounce((event: any) => {
        dispatch(setProductParams({searchTerm: event.target.value}))
    }, 1000)

    return(
        <TextField 
            InputLabelProps={{sx:{color: '#fffaff'}}}
            inputProps={{style:{color:'#fffaff'}}}
            label="Search products" 
            variant="outlined" 
            fullWidth
            value={searchTerm || ''}
            onChange={(event: any) => {
                setSearchTerm(event.target.value); // this will show while the user is typing
                debouncedSearch(event); // this will wait the specified amount of time 
            }} 
            // this is going to the catalogSlice to be passed as payload and override what is inside the existing product params state
        />
    )
}

// adding a search term will lead to this chain of events:
// 1. when we dispatch the action above we are going to set the product params inside the catalog slice
// 2. that sets the state of the productsLoaded to false
// 3. and the search term is passed as payload which will override the product params part of the existing state
// 4. Then on the Catalog, the useEffect will be triggered because of the changes in the values of the slice
// 5. Therefore the dispatch will run
// 6. Therefore, again in the catlog slice, we are gonna get the axios parameters which now will contain the search terms and/or the other params
// 7. and that will make the request to the api