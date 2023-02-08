import { Model, Schema, model } from "mongoose";
import { Order, OrderStatus } from "./order";

/**
 * An interface that describes the properties
 * required to create a new ticket instance 
 */
interface TicketProperties {
    title: string;
    price: number;
}

/**
 * An interface that describes the properties
 * a Ticket Model has
 */
interface TicketDocument extends Document {
    title: string;
    price: number;
    isReserved(): Promise<boolean>,
    createdAt: string;
    updatedAt: string;
}

/**
 * A mongoDB schema that describes the properties
 * that defined what a ticket is
 */
const TicketSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
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

TicketSchema.methods.isReserved = async function() {
    const orderExists = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.Pending,
                OrderStatus.Complete
            ]
        }
    });

    return !!orderExists;
};

const TicketModel = model<TicketDocument, Model<TicketDocument>>("Ticket", TicketSchema);

export class Ticket extends TicketModel {
    constructor(ticket: TicketProperties) {
        super(new TicketModel(ticket));
    }
};