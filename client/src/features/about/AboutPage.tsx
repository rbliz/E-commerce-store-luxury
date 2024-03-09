import { Alert, AlertTitle, Button, ButtonGroup, Container, List, ListItem, ListItemText, Typography } from "@mui/material";
import agent from "../../app/api/agent";
import { useState } from "react";

export default function AboutPage(){
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    
    function getValidationError(){
        agent.TestErrors.getValidationError()
            .then(() => console.log('should not see this'))
            .catch(error => setValidationErrors(error));
    }
    return(
        <Container>
            <Typography gutterBottom variant="h2" sx={{color: '#fffaff'}}>
                Errors for testing purposes
            </Typography>
            <ButtonGroup fullWidth>
                <Button 
                    variant="contained"
                    onClick={()=> agent.TestErrors.get400error().catch(error => console.log(error))}
                >
                    Test 400 error
                </Button>
                <Button
                    variant="contained"
                    onClick={()=> agent.TestErrors.get401error().catch(error => console.log(error))}
                >
                    Test 401 error
                </Button>
                <Button
                    variant="contained"
                    onClick={()=> agent.TestErrors.get404error().catch(error => console.log(error))} // still need to catch the error here, so I don't get an uncaught error message in the console
                >
                    Test 404 error
                </Button>
                <Button
                    variant="contained"
                    onClick={()=> agent.TestErrors.get500error().catch(error => console.log(error))}
                >
                    Test 500 error
                </Button>
                <Button
                    variant="contained"
                    onClick={getValidationError}
                >
                    Test Validation error
                </Button>
            </ButtonGroup>
            {validationErrors.length > 0 &&
                <Alert severity='error'>
                    <AlertTitle>Validation Errors</AlertTitle>
                        <List>
                            {validationErrors?.map((error)=>(
                                <ListItem key={error}>
                                    <ListItemText>
                                        {error}
                                    </ListItemText>
                                </ListItem>
                            ))}
                        </List>
                </Alert>
                } 
        </Container>

    )
        
}
