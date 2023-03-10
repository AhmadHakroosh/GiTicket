import request from "supertest";

import { app } from "../../app";

it("Should delete the cookie upon signing out", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201);

    const response = await request(app)
        .post("/api/users/signout")
        .send({})
        .expect(200);

    expect(response.get("Set-Cookie")).toMatchObject(["session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"]);
});