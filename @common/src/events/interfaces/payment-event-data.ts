export interface PaymentCreatedEventData {
    id: string;
    orderId: string;
    stripeId: string;
};

export type PaymentEventData = PaymentCreatedEventData;