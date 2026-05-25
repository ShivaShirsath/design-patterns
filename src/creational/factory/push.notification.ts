import { Notification } from "./notification.interface";

export class PushNotification implements Notification {
  send(message: string): void {
    console.log("Sending PUSH:", message);
  }
}
