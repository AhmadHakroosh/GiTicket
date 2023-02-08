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
}

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
    timestamps: true,
    toJSON: {
        versionKey: false,
        transform(_, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

const OrderModel = model<OrderDocument, Model<OrderDocument>>("Order", OrderSchema);

export class Order extends OrderModel {
    constructor(order: OrderProperties) {
        super(new OrderModel(order));
    }
};