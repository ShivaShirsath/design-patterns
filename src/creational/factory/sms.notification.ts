import { Notification } from "./notification.interface";

export class SMSNotification implements Notification {
  send(message: string): void {
    console.log("Sending SMS:", message);
  }
}
