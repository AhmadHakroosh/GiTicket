import Link from "next/link";

const HomePage = ({ currentUser, tickets }) => {
    const ticketList = tickets.map(ticket => {
        return (
            <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
                <td>
                    <Link
                        href="/tickets/[ticketId]"
                        as={`/tickets/${ticket.id}`}
                    >
                        View
                    </Link>
                </td>
            </tr>
        );
    });

    return (
        <div>
            <h1>Tickets</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>
                    {ticketList}
                </tbody>
            </table>
        </div>
    );
};

HomePage.getInitialProps = async (context, api, currentUser) => {
    const { data: tickets } = await api.get("/api/tickets");

    return { tickets };
};

export default HomePage;