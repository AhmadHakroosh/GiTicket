import { OrderStatus } from "../enums";

export interface OrderCreatedEventData {
    id: string;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    ticket: {
        id: string;
        price: number;
    };
};

export interface OrderCancelledEventData {
    id: string;
    ticket: {
        id: string;
    };
}

export type OrderEventData = OrderCreatedEventData | OrderCancelledEventData;