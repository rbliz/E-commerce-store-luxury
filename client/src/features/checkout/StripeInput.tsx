import { InputBaseComponentProps } from "@mui/material";
import { Ref, forwardRef, useImperativeHandle, useRef } from "react";

interface Props extends InputBaseComponentProps{}

// So, here I am forwarding our ref from material UI text input, and then
// I am creating a ref inside the stripe input component which I am calling 'elementRef'
export const StripeInput = forwardRef(function StripeInput({component: Component, ...props}: Props, ref: Ref<unknown>)
{
        const elementRef = useRef<any>();

        useImperativeHandle(ref, () =>({
            focus: () => elementRef.current.focus
        }));

        // when the stripe component is mounted and it's ready we're then passing it the element
        // to the current elementRef
        return(
            <Component
                onReady={(element: any) => elementRef.current = element}
                {...props}
            />
        )
    }
)

// the purpose of using this imperative handle is to retain styling in the payment form
// because if we were to use the CardElement it would loose the style