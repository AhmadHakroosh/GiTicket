import { useEffect, useState } from "react";
import { CheckoutForm } from "../../components";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51HPVUxFxnBpDGwA9V6HlolS3X2hrqz8uzsYbXH8QsrpKPGoknBXIjTtb8hzqkzz1abIUPc9mQJylXhIHFmrIsLbI00Fn8ubMux");

const Order = ({ order, clientSecret, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState(0);

    const appearance = {
        theme: 'stripe',
    };

    const options = {
        clientSecret,
        appearance,
    };

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        };

        findTimeLeft();
        const timer = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    if (timeLeft <= 0) {
        return <div>Order expired</div>;
    }

    return (
        <div>
            <div>Time left to pay: {timeLeft} seconds</div>
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm currentUser={currentUser} orderId={order.id} />
                </Elements>
            )}
        </div>
    );
};

Order.getInitialProps = async (context, api, currentUser) => {
    const { orderId } = context.query;
    const { data } = await api.get(`/api/orders/${orderId}`);

    return { order: data.order, clientSecret: data.clientSecret, currentUser };
};

export default Order;