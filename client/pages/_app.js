import "bootstrap/dist/css/bootstrap.css";

import { apiClient } from "../api";
import { Header } from "../components/header";

const App = ({ Component, pageProps, currentUser }) => {
    return <div className="app">
        <Header currentUser={currentUser} />
        <div className="p-3">
            <Component {...pageProps} />
        </div>
    </div>;
};

App.getInitialProps = async context => {
    const api = apiClient(context.ctx);

    const { data } = await api
        .get("/api/users/currentuser")
        .catch(error => {
            console.log(error);
        });

    let pageProps = {};

    if (context.Component.getInitialProps) {
        pageProps = await context.Component.getInitialProps(context.ctx);
    }

    return {
        pageProps,
        ...data
    };
};

export default App;