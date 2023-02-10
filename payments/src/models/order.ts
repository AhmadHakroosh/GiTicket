import { Model, Schema, model } from "mongoose";
import { OrderStatus } from "@giticket.dev/common";

export { OrderStatus };

/**
 * An interface that describes the properties
 * required to create a new order instance 
 */
interface OrderProperties {
    _id?: string;
    userId: string;
    status: OrderStatus;
    price: number;
}

/**
 * An interface that describes the properties
 * a Order Model has
 */
interface OrderDocument extends Document {
    userId: string;
    status: OrderStatus;
    version: number;
    price: number;
    createdAt: string;
    updatedAt: string;
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
    price: {
        type: Number,
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

OrderSchema.set("versionKey", "version");

const OrderInstance = model<OrderDocument, OrderModel>("Order", OrderSchema);

export class Order extends OrderInstance {
    constructor(order: OrderProperties) {
        super(new OrderInstance(order));
    }

    static findByEvent(event: { id: string, version: number }) {
        return this.findOne({
            _id: event.id,
            version: event.version - 1
        });
    };
};