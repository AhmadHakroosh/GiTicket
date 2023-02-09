export interface TicketCreatedEventData {
    id: string;
    version: number;
    title: string;
    price: number;
    userId: string;
};

export interface TicketUpdatedEventData {
    id: string;
    version: number;
    title: string;
    price: number;
    userId: string;
    orderId?: string;
};

export type TicketEventData = TicketCreatedEventData | TicketUpdatedEventData;