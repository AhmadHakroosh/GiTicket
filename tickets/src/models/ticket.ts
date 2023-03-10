import { Model, Schema, model } from "mongoose";

/**
 * An interface that describes the properties
 * required to create a new user instance 
 */
interface TicketProperties {
    title: string;
    price: number;
    userId: string;
}

/**
 * An interface that describes the properties
 * a User Model has
 */
interface TicketDocument extends Document {
    title: string;
    price: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    orderId?: string;
}

interface TicketModel extends Model<TicketDocument> { }

/**
 * A mongoDB schema that describes the properties
 * that defined what a user is
 */
const TicketSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    orderId: {
        type: String
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

TicketSchema.set("versionKey", "version");

const TicketInstance = model<TicketDocument, TicketModel>("Ticket", TicketSchema);

export class Ticket extends TicketInstance {
    constructor(ticket: TicketProperties) {
        super(new TicketInstance(ticket));
    }
};