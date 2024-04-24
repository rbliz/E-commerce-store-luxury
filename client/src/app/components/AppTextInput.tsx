import { TextField } from "@mui/material";
import { UseControllerProps, useController } from "react-hook-form";
 
// I am extending from a react hook form type
interface Props extends UseControllerProps
{
    label: string;
}


export default function AppTextInput(props: Props){
    const {fieldState, field} = useController({...props, defaultValue: ""})
    return(
        <TextField
            {...props}
            {...field}
            fullWidth
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
        />
    )
}