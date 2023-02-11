import { useState } from "react";
import { useRequest } from "../../hooks";
import Router from "next/router";

const NewTicket = () => {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const { fetch, errors } = useRequest({
        url: "/api/tickets",
        method: "post",
        body: {
            title,
            price
        },
        onSuccess: () => Router.push("/")
    });

    const onSubmit = event => {
        event.preventDefault();
        fetch();
    };

    const onBlur = () => {
        const roundedPrice = parseFloat(price);

        if (isNaN(roundedPrice)) {
            return;
        }

        setPrice(roundedPrice.toFixed(2));
    };

    return (
        <div>
            <h1>Create a ticket</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group mb-3">
                    <label>Title</label>
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Price</label>
                    <input
                        value={price}
                        onBlur={onBlur}
                        onChange={e => setPrice(e.target.value)}
                        className="form-control"
                    />
                </div>
                {errors}
                <button className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default NewTicket;