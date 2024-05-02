import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "./CheckoutPage";
import { loadStripe } from "@stripe/stripe-js";
import { useAppDispatch } from "../../app/store/configureStore";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { setBasket } from "../basket/basketSlice";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default function CheckoutWrapper(){
    const stripePromise = loadStripe("pk_test_51P9n8pF5fv5uP7z4133ecoqs1yck7boP9wtllGNjsRWztObyH3jRdcC3s73ZwWES7Ie5vn3d7GRfWLXUOUoYU1kV00MSBOzMrG")
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        agent.Payments.createPaymentIntent()
            .then(basket => setBasket(basket))
            .catch(error => console.log(error))
            .finally(() => setLoading(false))
    }, [dispatch])

    if(loading) return <LoadingComponent message="Loading checkout..." />
    
    return(
        <Elements stripe={stripePromise}>
            <CheckoutPage />
        </Elements>
    )
}