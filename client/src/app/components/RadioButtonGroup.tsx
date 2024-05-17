import { FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material";

// I am creating a more generic component for reusability if needed. That's why I am creating it at the app level.

// 1. I will pass a list of items to it
// 2. then pass it an onChange event from the parent component so we can get the value and do sth with it
// Here, in this case, what I am doing is updating the product params inside the redux state so it causes the
// request to go the the API and get the updated and ordered list of products

interface Props {
    options: any[];
    onChange: (event: any) => void;
    selectedValue: string;
}

export default function RadioButtonGroup({options, onChange, selectedValue}: Props){
    return(
        <FormControl component="fieldset">
            <RadioGroup onChange={onChange} value={selectedValue}>
                {options.map(({value, label}) => (
                        
                            <FormControlLabel
                                control={
                                    <Radio 
                                        sx={
                                            {
                                                '&.Mui-checked': {
                                                    '&, & + .MuiFormControlLabel-label':{color: '#ffd9da',
                                                }},
                                                    '&:hover': {
                                                        color: '#ffd9da'
                                                    },
                                                    color: 'white',

                                            }
                                        } 
                                    />
                                   
                                } 
                                value={value} label={label} key={value} 
                                sx={{color: 'white', '&:hover': {color: '#ffd9da'}}}
                            />
                 

                        )

                    )
                }
            </RadioGroup>
        </FormControl>
    )
}