import { Subscriber } from "./subscriber.interface";

export class EventManager {
  private subscribers: Subscriber[] = [];

  subscribe(subscriber: Subscriber): void {
    this.subscribers.push(subscriber);
  }

  notify(message: string): void {
    this.subscribers.forEach((subscriber) => {
      subscriber.update(message);
    });
  }
}
