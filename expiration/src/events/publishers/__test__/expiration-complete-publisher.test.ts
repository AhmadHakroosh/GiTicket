import { Subject } from "@giticket.dev/common";
import { EventBus } from "../../../event-bus";
import { ExpirationCompletePublisher } from "../expiration-complete-publisher";

it("Should have correct definitions", async () => {
    const publisher = new ExpirationCompletePublisher(EventBus.client);

    expect(publisher.subject).toEqual(Subject.ExpirationComplete);

    expect(publisher.publish).toBeDefined();
});