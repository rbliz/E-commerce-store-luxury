import { Checkbox, FormControlLabel } from "@mui/material";
import { UseControllerProps, useController } from "react-hook-form";

// this is again to have a reusable component for anything that will have the user interacting with such as forms, checboxes etc
// so instead of creating our own change events to handle the different actions in the forms etc,
// we'll use the react hook 

interface Props extends UseControllerProps
{
    label: string;
    disabled: boolean;
}

export default function AppCheckbox(props: Props){
    const {field} = useController({...props, defaultValue: false}) // ...props means to spread the props across into our usecontroller hook
        return(
            <FormControlLabel 
                    control={
                        <Checkbox
                            disabled={props.disabled}
                            {...field} // this includes the onChange etc...
                            checked = {field.value}
                            color="secondary"
                        />
                    }
            label={props.label}
            />
        )
}