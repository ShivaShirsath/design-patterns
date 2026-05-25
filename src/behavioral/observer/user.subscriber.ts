import { Subscriber } from "./subscriber.interface";

export class UserSubscriber implements Subscriber {
  constructor(private name: string) {}

  update(message: string): void {
    console.log(`${this.name} received: ${message}`);
  }
}
