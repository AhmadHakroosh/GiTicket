import { useState } from "react";
import Router from "next/router";
import { useRequest } from "../../hooks";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { fetch, errors } = useRequest({
        url: "/api/users/signin",
        method: "post",
        body: { email, password },
        onSuccess: () => {
            Router.push("/");
        }
    });

    const onSubmit = async event => {
        event.preventDefault();
        fetch();
    };

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign In</h1>
            <div className="form-group">
                <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                        className="form-control"
                    />
                </div>
                {errors}
                <button className="btn btn-primary">Sign In</button>
            </div>
        </form>
    );
};

export default Signup;