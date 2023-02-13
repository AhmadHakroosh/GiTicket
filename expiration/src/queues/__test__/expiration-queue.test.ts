import { worker, publisher } from "../expiration-queue";

it("Should call the publish function when worker is called", async () => {
    const publish = jest.spyOn(publisher, "publish");

    worker({ data: { orderId: "some_order" } });

    expect(publish).toHaveBeenCalled();
});