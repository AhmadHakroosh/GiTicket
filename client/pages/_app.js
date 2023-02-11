import "bootstrap/dist/css/bootstrap.css";
import "../styles/common.css";

import { apiClient } from "../api";
import { Header } from "../components";

const App = ({ Component, pageProps, currentUser }) => {
    return (
        <div className="app">
            <Header currentUser={currentUser} />
            <div className="container">
                <Component currentUser={currentUser} {...pageProps} />
            </div>
        </div>
    );
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
        pageProps = await context.Component.getInitialProps(context.ctx, api, data.currentUser);
    }

    return {
        pageProps,
        ...data
    };
};

export default App;