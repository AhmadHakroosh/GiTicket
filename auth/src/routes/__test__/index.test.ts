import request from "supertest";

import { app } from "../../app";

it("Should return 404 when a request sent to a path that does not exist", async () => {
    const response = await request(app)
        .get(`/somefakeroute`)
        .send();

    expect(response.status).toEqual(404);
});