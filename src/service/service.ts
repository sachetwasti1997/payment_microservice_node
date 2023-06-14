import { NotBeforeError } from "jsonwebtoken";
import { Order } from "../models/order";
import { BadRequestError, NotFoundError, OrderStatus, UnAuthorisedError } from "@ticketingplatform/common";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

export async function doPayment(token: string, orderId: string, userId: string) {
    console.log("calling order", orderId);
    
    const order = await Order.findById(orderId)
    console.log("order", order);
    
    if (!order) { 
        console.log("no order");
        
        throw new NotFoundError()
    }
    if (order.userId !== userId) {
        console.log("unauthorised user");
        
        throw new UnAuthorisedError()
    }
    if (order.status === OrderStatus.Cancelled) { 
        console.log("Cancelled Orders");
        
        throw new BadRequestError('Cancelled Order');
    }
    console.log('Creating charge');
    
    const charge = await stripe.paymentIntents.create({
        currency: 'usd',
        amount: order.price * 100,
    })
    console.log("created stripe charge");
    
    console.log('saving payment');
    
    const payment = Payment.build({
        orderId,
        stripeId: charge.id
    })
    await payment.save();
    console.log("saved payment", payment);
    
    new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
    })
    console.log("created publisher");
    
    return payment.id
}