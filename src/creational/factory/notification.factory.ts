import { EmailNotification } from "./email.notification";
import { PushNotification } from "./push.notification";
import { SMSNotification } from "./sms.notification";
import { Notification } from "./notification.interface";

export class NotificationFactory {
  static create(
    type: "email" | "sms" | "push"
  ): Notification {
    switch (type) {
      case "email":
        return new EmailNotification();

      case "sms":
        return new SMSNotification();

      case "push":
        return new PushNotification();

      default:
        throw new Error("Invalid notification type");
    }
  }
}
