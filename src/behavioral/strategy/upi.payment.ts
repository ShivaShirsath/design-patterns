import { PaymentStrategy } from "./payment.strategy";

export class UpiPayment implements PaymentStrategy {
  pay(amount: number): void {
    console.log(`Paid ₹${amount} using UPI`);
  }
}
