import { Box, Typography, Pagination } from "@mui/material";
import { MetaData } from "../models/pagination";
import { useState } from "react";

interface Props{
    metaData: MetaData;
    onPageChange: (page: number) => void;
}

export default function AppPagination({metaData, onPageChange}: Props){
    const {pageSize, currentPage, totalPages, totalCount} = metaData;
    const [pageNumber, setPageNumber] = useState(currentPage);

    function handlePageNumber(page: number){
        setPageNumber(page);
        onPageChange(page);
    }
    return(
        <Box 
            display='flex' 
            justifyContent='space-between' 
            alignItems='center' 
            // sx={{bgcolor: '#161a1d', borderRadius: '5px'}}
        >
            <Typography color="white" sx={{p: 1}}>
                Displaying {(currentPage-1)*pageSize+1}-
                {currentPage*pageSize > totalCount? totalCount: currentPage*pageSize} of {totalCount} items
            </Typography>
    
            <Pagination 
                count={totalPages}
                page={pageNumber}
                onChange={(_e, page) => handlePageNumber(page)}
                sx={
                    {button: {
                            color: 'white',
                            '&:hover': {bgcolor: '#ffd9da', color: 'black'},
                            '&:focus': {bgcolor: '#ffd9da', color: 'black'}
                        }
                     }
                }
            />
        </Box>
    )
}