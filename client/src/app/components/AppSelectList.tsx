import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { UseControllerProps, useController } from "react-hook-form";

interface Props extends UseControllerProps {
    label: string;
    items: string[];
}

export default function AppSelectList(props: Props){
    const {fieldState, field} = useController({...props, defaultValue: ""});
    return(
        // !! is to cast the presence of an obj into a boolean
        <FormControl sx={{ m: 1, minWidth: 80 }} error={!!fieldState.error}> 
            <InputLabel>{props.label}</InputLabel>
            <Select
                value={field.value}
                onChange={field.onChange}
                autoWidth
                label={props.label}
            >
                {props.items.map((item, index) => (
                    <MenuItem key={index} value={item}>{item}</MenuItem>
                ))}
            </Select>
            <FormHelperText>{fieldState.error?.message}</FormHelperText>
        </FormControl>
    )
}