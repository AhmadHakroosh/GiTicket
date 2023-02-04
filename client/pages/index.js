import { apiClient } from "../api";

const HomePage = ({ currentUser }) => {
    return currentUser ? <h1>You're signed in</h1> : <h1>You're not signed in</h1>
};

HomePage.getInitialProps = async context => {
    const api = apiClient(context);
    const { data } = await api
        .get("/api/users/currentuser")
        .catch(error => {
            console.log(error);
        });

    return data;
};

export default HomePage;