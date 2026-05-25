import { PaymentStrategy } from "./payment.strategy";

export class PaymentContext {
  constructor(
    private strategy: PaymentStrategy
  ) {}

  execute(amount: number): void {
    this.strategy.pay(amount);
  }
}
