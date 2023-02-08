/**
 * When the order has been created, but the
 *  ticket it's trying to order has not been reserved
 */
export type Created = "created";

/**
 * The ticket the order is trying to reserve has already 
 * been reserved, or when the user has cancelled the order.
 * Or if the order expires before payment
 */
export type Cancelled = "cancelled";

/**
 * The order has successfully reserved the ticket
 */
export type Pending = "pending";

/**
 * The order has reserved the ticket and the user has provided
 * payment successfully
 */
export type Complete = "complete";

/**
 * All statuses available for orders
 */
export type OrderStatus = Created | Cancelled | Pending | Complete;

