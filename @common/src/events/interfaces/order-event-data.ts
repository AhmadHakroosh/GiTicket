import { OrderStatus } from "../enums";

export interface OrderCreatedEventData {
    id: string;
    version: number;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    ticket: {
        id: string;
        price: number;
    };
    clientSecret: string;
};

export interface OrderCancelledEventData {
    id: string;
    version: number;
    ticket: {
        id: string;
    };
}

export type OrderEventData = OrderCreatedEventData | OrderCancelledEventData;