import { Model, Schema, model } from "mongoose";
import { OrderStatus } from "@giticket.dev/common";
import { Ticket } from "./ticket";

export { OrderStatus };

/**
 * An interface that describes the properties
 * required to create a new order instance 
 */
interface OrderProperties {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: Ticket;
}

/**
 * An interface that describes the properties
 * a Order Model has
 */
interface OrderDocument extends Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: Ticket;
    createdAt: string;
    updatedAt: string;
    version: number;
}

interface OrderModel extends Model<OrderDocument> { }

/**
 * A mongoDB schema that describes the properties
 * that define what an order is
 */
const OrderSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: Schema.Types.Date,
        required: true
    },
    ticket: {
        type: Schema.Types.ObjectId,
        ref: "Ticket"
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

OrderSchema.set("versionKey", "version");

const OrderInstance = model<OrderDocument, OrderModel>("Order", OrderSchema);

export class Order extends OrderInstance {
    constructor(order: OrderProperties) {
        super(new OrderInstance(order));
    }
};