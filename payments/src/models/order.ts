import { Model, Schema, model } from "mongoose";
import { OrderStatus } from "@giticket.dev/common";

export { OrderStatus };

/**
 * An interface that describes the properties
 * required to create a new order instance 
 */
interface OrderProperties {
    userId: string;
    status: OrderStatus;
    version: number;
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
    timestamps: true,
    toJSON: {
        transform(_, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

OrderSchema.set("versionKey", "version");

OrderSchema.pre("save", function (done) {
    this.$where = {
        version: this.get("version") - 1
    };

    done();
});

const OrderInstance = model<OrderDocument, OrderModel>("Order", OrderSchema);

export class Order extends OrderInstance {
    constructor(order: OrderProperties) {
        super(new OrderInstance(order));
    }
};