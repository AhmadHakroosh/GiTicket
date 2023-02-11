import request from "supertest";

import { app } from "../../app";

it("Should has a route handler listening to /api/ticket/:id for get requests", async () => {

    const response = await request(app)
        .get(`/somefakeroute`)
        .send();

    expect(response.status).toEqual(404);
});