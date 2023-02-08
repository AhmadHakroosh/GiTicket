export interface TicketCreatedEventData {
    id: string;
    title: string;
    price: number;
    userId: string;
};

export interface TicketUpdatedEventData {
    id: string;
    title: string;
    price: number;
    userId: string;
};

export type TicketEventData = TicketCreatedEventData | TicketUpdatedEventData;