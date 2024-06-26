import { Typography, Grid, Paper, Box, Button } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import { Product } from "../../app/models/product";
import { useEffect } from "react";
import useProducts from "../../app/hooks/useProducts";
import AppSelectList from "../../app/components/AppSelectList";
import AppDropzone from "../../app/components/AppDropzone";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./productValidation";
import agent from "../../app/api/agent";
import { useAppDispatch } from "../../app/store/configureStore";
import { setProduct } from "../catalog/catalogSlice";
import { LoadingButton } from "@mui/lab";
import MediaQuery from "react-responsive";

interface Props {
    product?: Product;
    cancelEdit: () => void;
}

export default function ProductForm({product, cancelEdit}: Props) {
    const { control, reset, handleSubmit, watch, formState: {isDirty, isSubmitting} } = useForm({
        resolver: yupResolver<any>(validationSchema)
    });
    const {brands, types} = useProducts();
    const watchFile = watch('file', null);
    const dispatch = useAppDispatch();

    // whatever is inside the return in the useEffect happens when the component is destroyed
    useEffect(() =>{
        if(product && !watchFile && !isDirty) reset(product); 
        return () => {
            if(watchFile) URL.revokeObjectURL(watchFile.preview);
        }
    }, [product, reset, watchFile, isDirty])

    async function handleSubmitData(data: FieldValues){
        try {
            let response: Product;
            if(product){
                response = await agent.Admin.updateProduct(data);
            }else {
                response = await agent.Admin.createProduct(data);
            }
            dispatch(setProduct(response));
            cancelEdit();
        } catch (error: any) {
            console.log(error);
        }
    }

    // in the image field, the name prop is 'file' because I called it like that in the createProductDto.
    // that is how the API is gonna bind to the correct property when I send up the product fields
    return (
        <Box component={Paper} sx={{p: 4, mt: 20}}>
            <Typography variant="h4" gutterBottom sx={{mb: 4}}>
                Product Details
            </Typography>
            <form onSubmit={handleSubmit(handleSubmitData)}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                    <AppTextInput control={control} name='name' label='Product name' />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AppSelectList control={control}  items={brands} name='brand' label='Brand' />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AppSelectList control={control} items={types} name='type' label='Type' />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AppTextInput type="number" control={control} name='price' label='Price' />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AppTextInput type="number" control={control} name='quantityInStock' label='Quantity in Stock' />
                </Grid>
                <Grid item xs={12}>
                    <AppTextInput multiline={true} rows={4} control={control} name='description' label='Description' />
                </Grid>
                <Grid item xs={12}>
                    <MediaQuery maxWidth={599}>
                        <Box display="block" justifyContent="space-between" alignItems="center">
                            <AppDropzone control={control} name='file'/>
                            {watchFile ? (
                                <img src={watchFile.preview} alt="preview" style={{maxHeight: 200, width: '50%', marginTop: 5}} />
                            ) : (
                                <img src={product?.pictureUrl} alt={product?.name} style={{maxHeight: 200, width: '50%', marginTop: 5}} />
                            )}
                        </Box>
                    </MediaQuery>
                    <MediaQuery minWidth={600}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <AppDropzone control={control} name='file' />
                            {watchFile ? (
                                <img src={watchFile.preview} alt="preview" style={{maxHeight: 200, width: '50%'}} />
                            ) : (
                                <img src={product?.pictureUrl} alt={product?.name} style={{maxHeight: 200, width: '50%'}} />
                            )}
                        </Box>
                    </MediaQuery>
                </Grid>
            </Grid>
            <Box display='flex' justifyContent='space-between' sx={{mt: 3}}>
                <Button onClick={cancelEdit} variant='contained' color='inherit'>Cancel</Button>
                <LoadingButton loading={isSubmitting} type="submit" variant='contained' color='success'>
                    Submit
                </LoadingButton>
            </Box>
            </form>
        </Box>
    )
}
