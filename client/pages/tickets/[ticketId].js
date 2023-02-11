import { useRequest } from "../../hooks";
import Router from "next/router";

const Ticket = ({ ticket }) => {
    const { fetch, errors } = useRequest({
        url: "/api/orders",
        method: "post",
        body: {
            ticketId: ticket.id
        },
        onSuccess: (order) => Router.push("/orders/[orderId]", `/orders/${order.id}`)
    })
    return (
        <div>
            <h1>{ticket.title}</h1>
            <h4>{ticket.price}</h4>
            {errors}
            <button
                onClick={fetch}
                className="btn btn-primary"
            >
                Purchase
            </button>
        </div>
    );
};

Ticket.getInitialProps = async (context, api) => {
    const { ticketId } = context.query;
    const { data: ticket } = await api.get(`/api/tickets/${ticketId}`);

    return { ticket };
};

export default Ticket;