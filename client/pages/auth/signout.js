import { useEffect } from "react";
import Router from "next/router";
import { useRequest } from "../../hooks";

const SignOut = () => {
    const {fetch} = useRequest({
        url: "/api/users/signout",
        method: "post",
        body: {},
        onSuccess: () => Router.push("/")
    });

    useEffect(() => {
        fetch();
    }, []);

    return <div>Signing you out...</div>
};

export default SignOut;