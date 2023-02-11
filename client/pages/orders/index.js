const Orders = ({ orders }) => {
    return (
        <div>
            <ul>
                {orders.map(order => {
                    return (
                        <li key={order.id}>
                            {order.ticket.title} - {order.status}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

Orders.getInitialProps = async (context, api) => {
    const { data: orders } = await api.get("/api/orders");

    return { orders };
};

export default Orders;