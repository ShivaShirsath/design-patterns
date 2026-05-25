import { PaymentStrategy } from "./payment.strategy";

export class CardPayment implements PaymentStrategy {
  pay(amount: number): void {
    console.log(`Paid ₹${amount} using Card`);
  }
}
