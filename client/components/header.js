import Link from "next/link";

const Header = ({ currentUser }) => {
    const links = [
        !currentUser && { label: "Sign Up", href: "/auth/signup" },
        !currentUser && { label: "Sign In", href: "/auth/signin" },
        currentUser && { label: "Sell a Ticket", href: "/tickets/new" },
        currentUser && { label: "My Orders", href: "/orders" },
        currentUser && { label: "Sign Out", href: "/auth/signout" }
    ]
        .filter(link => link)
        .map(({ label, href }) => {
            return (
                <li key={href} className="nav-item">
                    <Link href={href} className="nav-link">{label}</Link>
                </li>
            );
        });

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light p-3">
            <Link href="/" className="navbar-brand h1">GiTicket</Link>
            <div className="d-flex justify-content-end">
                <ul className="nav d-flex align-items-center">
                    {links}
                </ul>
            </div>
        </nav>
    );
};

export { Header };