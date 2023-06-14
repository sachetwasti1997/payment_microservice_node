import { PaymentCreatedEvent, Publisher, Subjects } from "@ticketingplatform/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> { 
    subject: Subjects.PaymentCreatedEvent = Subjects.PaymentCreatedEvent;
    
}