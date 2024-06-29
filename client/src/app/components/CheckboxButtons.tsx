import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from "react";


interface Props{
    items: string[]; // pass an array of items
    checked?: string[]; // to identify which ones have been checked
    onChange: (items: string[]) => void; // this is what we're gonna return to the parent component and send to the redux state
}
export default function CheckboxButtons({items, checked, onChange}: Props){
    const [checkedItems, setCheckedItems] = useState(checked || []);

    function handleChecked(value: string){
        const currentIndex = checkedItems.findIndex(item => item === value);
        let newChecked: string[] = [];
        if(currentIndex === -1) newChecked = [...checkedItems, value]
        else newChecked = checkedItems.filter(item => item !== value); // this gives us the list of items minus the one we are unchecking
        setCheckedItems(newChecked);
        onChange(newChecked);
        
    }
    
    return(
        <FormGroup>
            {items.map((item) => (
                <FormControlLabel 
                    control={
                        <Checkbox
                            checked={checkedItems.indexOf(item) !== -1}
                            onChange={() => handleChecked(item)}
                            sx={{color: 'white', '&.Mui-checked': {'&, & + .MuiFormControlLabel-label':{color: '#ffd9da'}}, '&:hover': {color: '#ffd9da'}}}
                        />
                    } 
                    label={item} key={item}
                    sx={{color: 'white', '&:hover': {color: '#ffd9da'}}}
                />
            ))}
        </FormGroup>  
    )
}