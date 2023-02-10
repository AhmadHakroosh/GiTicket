import { Ticket } from "../ticket";

it("Should implement optimistic concurrency control", async () => {
    // Create an instance of a ticket
    const ticket = new Ticket({
        title: "some ticket",
        price: 100,
        userId: "123456"
    });

    // Save the ticket to the database
    await ticket.save();

    // Fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // Make two separate changes to the tickets we fetched
    firstInstance!.set({ price: 50 });
    secondInstance!.set({ price: 95 });

    // Save the first fetched ticket
    await firstInstance!.save();

    // Save the second fetched ticket and expect an error
    try {
        await secondInstance!.save();
    } catch (error) {
        return;
    }

    throw new Error("We should not reach to this point");
});

it("Should incerement the version number on multiple saves", async () => {
    const ticket = new Ticket({
        title: "some ticket",
        price: 100,
        userId: "123"
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);

    ticket.set({ price: 105 });
    await ticket.save();
    expect(ticket.version).toEqual(1);

    ticket.set({ price: 115 });
    await ticket.save();
    expect(ticket.version).toEqual(2);
});