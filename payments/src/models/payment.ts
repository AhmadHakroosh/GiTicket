import { Model, Schema, model } from "mongoose";
import { OrderStatus } from "@giticket.dev/common";

export { OrderStatus };

/**
 * An interface that describes the properties
 * required to create a new order instance 
 */
interface PaymentProperties {
    orderId: string;
    stripeId: string;
}

/**
 * An interface that describes the properties
 * a Order Model has
 */
interface PaymentDocument extends Document {
    orderId: string;
    stripeId: string;
    version: number;
    createdAt: string;
    updatedAt: string;
}

interface PaymentModel extends Model<PaymentDocument> { }

/**
 * A mongoDB schema that describes the properties
 * that define what an order is
 */
const PaymentSchema = new Schema({
    orderId: {
        type: String,
        required: true
    },
    stripeId: {
        type: String,
        required: true
    }
}, {
    optimisticConcurrency: true,
    timestamps: true,
    toJSON: {
        transform(_, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

PaymentSchema.set("versionKey", "version");

const PaymentInstance = model<PaymentDocument, PaymentModel>("Payment", PaymentSchema);

export class Payment extends PaymentInstance {
    constructor(order: PaymentProperties) {
        super(new PaymentInstance(order));
    }
};