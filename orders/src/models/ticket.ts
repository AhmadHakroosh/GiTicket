import { Model, Schema, model } from "mongoose";
import { Order, OrderStatus } from "./order";

/**
 * An interface that describes the properties
 * required to create a new ticket instance 
 */
interface TicketProperties {
    _id?: string;
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
    version: number;
}

interface TicketModel extends Model<TicketDocument> { }

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
        transform(_, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

TicketSchema.methods.isReserved = async function () {
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

TicketSchema.set("versionKey", "version");

TicketSchema.pre("save", function (done) {
    this.$where = {
        version: this.get("version") - 1
    };

    done();
});

const TicketInstance = model<TicketDocument, TicketModel>("Ticket", TicketSchema);

export class Ticket extends TicketInstance {
    constructor(ticket: TicketProperties) {
        super(new TicketInstance(ticket));
    }

    static findByEvent(event: { id: string, version: number }) {
        return this.findOne({
            _id: event.id,
            version: event.version - 1
        });
    };
};