import { useEffect, useState } from "react";
import Router from "next/router";
import {
    PaymentElement,
    LinkAuthenticationElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import { useRequest } from "../hooks";

const CheckoutForm = ({ currentUser, orderId }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [email, setEmail] = useState(currentUser.email);
    const [isLoading, setIsLoading] = useState(false);
    const [paymentId, setPaymentId] = useState(undefined);

    const { fetch, errors } = useRequest({
        url: "/api/payments",
        method: "post",
        body: {
            paymentId: paymentId,
            orderId
        },
        onSuccess: () => Router.push("/orders")
    });

    useEffect(() => {
        if (paymentId) {
            fetch();
        }
    }, [paymentId])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        const { paymentIntent, error } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
            confirmParams: {
                receipt_email: email
            }
        });

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message);
            } else {
                setMessage("An unexpected error occurred.");
            }
        } else {
            setPaymentId(paymentIntent.id);
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs",
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <LinkAuthenticationElement
                id="link-authentication-element"
                onChange={(e) => setEmail(e.target.value)}
                options={
                    {
                        defaultValues: {
                            email
                        }
                    }
                }
            />
            <PaymentElement id="payment-element" options={paymentElementOptions} />
            <button disabled={isLoading || !stripe || !elements} id="submit">
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
                </span>
            </button>
            {errors}
        </form>
    );
};

export { CheckoutForm };