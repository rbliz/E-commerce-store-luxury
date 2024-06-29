import { Box, Button, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./checkoutValidation";
import agent from "../../app/api/agent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { clearBasket } from "../basket/basketSlice";
import { LoadingButton } from "@mui/lab";
import { StripeElementType } from "@stripe/stripe-js";
import { CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";

const steps = ['Shipping address', 'Review your order', 'Payment details'];

export default function CheckoutPage() {
    // I am setting state locally in this case to use the Orders methods, instead of creating an reducer
    const [orderNumber, setOrderNumber] = useState(0); // this is all we get in return from the api, when we create an order, an integer
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    
    // now, here I have to set some local state to track the card state, because we're not using the react form validation
    // Besides, I am setting it here in a higher level of the app rather than on the paymentForm component
    // because the place order button needs to recognize both the validation for the cardName and for the stripe validations
    // in order to be enabled/disabled. To pass the props I will set an interface in the paymentForm.tsx file
    const [cardState, setCardState] = useState<{elementError: {[key in StripeElementType]?: string}}>({elementError: {}});
    const [cardComplete, setCardComplete] = useState<any>({cardNumber: false, cardExpiry: false, cardCvc: false});
    const[paymentMessage, setPaymentMessage] = useState('');
    const [paymentSucceeded, setPaymentSucceeded] = useState(false);
    const{basket} = useAppSelector(state => state.basket); // the basket contains the client secret we need to send up our payment to stripe
    const stripe = useStripe(); // this will give us the function to create the actual payment
    const elements = useElements(); // this is to access the card elements

    function onCardInputChange(event: any){
        setCardState({
        ...cardState,
        elementError:{
        ...cardState.elementError, // this is so that I can keep the error messages for all the errors in the inputs already detected
        [event.elementType]: event.error?.message
        }
    })
    setCardComplete({...cardComplete, [event.elementType]: event.complete});
  }
    function getStepContent(step: number) {
        switch (step) {
            case 0:
                return <AddressForm/>;
            case 1:
                return <Review/>;
            case 2:
                return <PaymentForm cardState={cardState} onCardInputChange={onCardInputChange}/>;
            default:
                throw new Error('Unknown step');
        }
    }

    // since the validation schema is an array these declarations have to be in this order
    // so I can use the active steps in order to determine which schema to use
    // for instance, if it's on the 0 active step it is in the address form...
    const [activeStep, setActiveStep] = useState(0);
    const currentValidationSchema = validationSchema[activeStep]

    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(currentValidationSchema) // the resolver will take our validation schema
    });

    // this side effect (useEffect) needs to be below the useForm so we can work with the methods
    // I will use the reset method if we get a response so we can set those values in the form

    useEffect(() =>{
        agent.Account.fetchAddress()
            .then(response => {
                if(response){
                    methods.reset({...methods.getValues(), ...response, saveAddress: false}) // since I am overriding the values of the form, I also set the saveAddress option to false
                }
            })
    }, [methods])

    async function submitOrder(data:FieldValues) {
        setLoading(true);
        const {nameOnCard, saveAddress, ...shippingAddress} = data;
        if(!stripe || !elements) return; // at this point stripe is not ready
        try {
            const cardElement = elements.getElement(CardNumberElement); // I only need to specify this one time because JS stripe will know that we want all the card elements(number, cvv, expiry)
            const paymentResult = await stripe.confirmCardPayment(basket?.clientSecret!, {
                payment_method: {
                    card: cardElement!,
                    billing_details: {
                        name: nameOnCard
                    }
                }
            });
            console.log(paymentResult);
            if(paymentResult.paymentIntent?.status === 'succeeded'){
                // functionality to actually create the order
                const orderNumber = await agent.Orders.create({saveAddress,shippingAddress});
                setOrderNumber(orderNumber);
                setPaymentSucceeded(true);
                setPaymentMessage('Thank you - Payment received!')
                setActiveStep(activeStep +1);
                dispatch(clearBasket());
                setLoading(false);
            }else{
                setPaymentMessage(paymentResult.error?.message!);
                setPaymentSucceeded(false);
                setLoading(false);
                setActiveStep(activeStep +1);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const handleNext = async (data: FieldValues) => {
        if(activeStep === steps.length -1)
        {
            await submitOrder(data);
        }else{
            setActiveStep(activeStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    function submitDisabled(): boolean {
        if(activeStep === steps.length -1){
            return !cardComplete.cardNumber 
                || !cardComplete.cardExpiry 
                || !cardComplete.cardCvc
                || !methods.formState.isValid
        }else{
            return !methods.formState.isValid
        }
    }

    return (
        <div className="checkout-container">
        <FormProvider {...methods}>
            <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
                <Typography component="h1" variant="h4" align="center">
                    Checkout
                </Typography>
                <Stepper activeStep={activeStep} sx={{pt: 3, pb: 5}}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <>
                    {activeStep === steps.length ? (
                        <>
                            <Typography variant="h5" gutterBottom>
                                {paymentMessage}
                            </Typography>
                            {paymentSucceeded ?(
                                <Typography variant="subtitle1">
                                Your order number is #{orderNumber}. We have not emailed your order
                                confirmation, and will not send you an update when your order has
                                shipped as this is a simulation store.
                                </Typography>
                            ) : (
                                <Button 
                                    variant="contained" 
                                    onClick={handleBack}
                                >
                                Go back and try again
                                </Button>
                            )}
                        </>
                    ) : (
                        <form onSubmit={methods.handleSubmit(handleNext)}>
                            {getStepContent(activeStep)}
                            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                {activeStep !== 0 && (
                                    <Button onClick={handleBack} sx={{mt: 3, ml: 1}}>
                                        Back
                                    </Button>
                                )}
                                <LoadingButton
                                    loading={loading}
                                    disabled={submitDisabled()}
                                    variant="contained"
                                    type="submit"
                                    sx={{mt: 3, ml: 1}}
                                >
                                    {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                                </LoadingButton>
                            </Box>
                        </form>
                    )}
                </>
            </Paper>
        </FormProvider>
        </div>
    );
}

