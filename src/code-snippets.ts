export const CODE_SNIPPETS = {
  singleton: `// src/creational/singleton/logger.ts
import fs from "fs";
import path from "path";

export class Logger {
  private static instance: Logger;
  private logFilePath = path.join(process.cwd(), "app.log");

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(message: string): void {
    const formatted = \`[\${new Date().toISOString()}] \${message}\\n\`;
    console.log(formatted);
    fs.appendFileSync(this.logFilePath, formatted);
  }
}

// Usage
const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();
logger1.log("Application started");
console.log(logger1 === logger2); // true`,

  factory: `// src/creational/factory/notification.interface.ts
export interface Notification {
  send(message: string): void;
}

// src/creational/factory/email.notification.ts
export class EmailNotification implements Notification {
  send(message: string): void {
    console.log("Sending EMAIL:", message);
  }
}

// src/creational/factory/notification.factory.ts
export class NotificationFactory {
  static create(type: "email" | "sms" | "push"): Notification {
    switch (type) {
      case "email": return new EmailNotification();
      case "sms": return new SMSNotification();
      case "push": return new PushNotification();
      default: throw new Error("Invalid notification type");
    }
  }
}`,

  builder: `// src/creational/builder/user.ts
export interface User {
  name?: string;
  age?: number;
  email?: string;
  city?: string;
}

// src/creational/builder/user.builder.ts
export class UserBuilder {
  private user: User = {};

  setName(name: string): this {
    this.user.name = name;
    return this;
  }

  setAge(age: number): this {
    this.user.age = age;
    return this;
  }

  setEmail(email: string): this {
    this.user.email = email;
    return this;
  }

  setCity(city: string): this {
    this.user.city = city;
    return this;
  }

  build(): User {
    return this.user;
  }
}

// Usage
const user = new UserBuilder()
  .setName("Shiva")
  .setEmail("shiva@example.com")
  .setCity("Nagpur")
  .build();`,

  adapter: `// src/structural/adapter/external-api.ts
export class ExternalWeatherAPI {
  getTemperature(city: string): string {
    return \`Temperature in \${city} is 32°C\`;
  }
}

// src/structural/adapter/weather.interface.ts
export interface WeatherService {
  fetch(city: string): string;
}

// src/structural/adapter/weather.adapter.ts
export class WeatherAdapter implements WeatherService {
  constructor(private externalAPI: ExternalWeatherAPI) {}

  fetch(city: string): string {
    return this.externalAPI.getTemperature(city);
  }
}

// Usage
const weatherService = new WeatherAdapter(new ExternalWeatherAPI());
console.log(weatherService.fetch("Mumbai"));`,

  decorator: `// src/structural/decorator/types.ts
export interface Request {
  token?: string;
}
export type Handler = (req: Request) => void;

// src/structural/decorator/auth.decorator.ts
export function withAuth(handler: Handler): Handler {
  return (req: Request) => {
    if (!req.token) {
      console.log("Unauthorized");
      return;
    }
    handler(req);
  };
}

// Usage
const getProfile = (req: Request) => console.log("Fetching profile...");
const protectedHandler = withAuth(getProfile);
protectedHandler({ token: "valid-token" });`,

  strategy: `// src/behavioral/strategy/payment.strategy.ts
export interface PaymentStrategy {
  pay(amount: number): void;
}

// src/behavioral/strategy/upi.payment.ts
export class UpiPayment implements PaymentStrategy {
  pay(amount: number): void {
    console.log(\`Paid ₹\${amount} using UPI\`);
  }
}

// src/behavioral/strategy/payment.context.ts
export class PaymentContext {
  constructor(private strategy: PaymentStrategy) {}
  execute(amount: number): void {
    this.strategy.pay(amount);
  }
}

// Usage
const payment = new PaymentContext(new UpiPayment());
payment.execute(500);`,

  observer: `// src/behavioral/observer/subscriber.interface.ts
export interface Subscriber {
  update(message: string): void;
}

// src/behavioral/observer/user.subscriber.ts
export class UserSubscriber implements Subscriber {
  constructor(private name: string) {}
  update(message: string): void {
    console.log(\`\${this.name} received: \${message}\`);
  }
}

// src/behavioral/observer/event.manager.ts
export class EventManager {
  private subscribers: Subscriber[] = [];
  subscribe(subscriber: Subscriber): void {
    this.subscribers.push(subscriber);
  }
  notify(message: string): void {
    this.subscribers.forEach(sub => sub.update(message));
  }
}

// Usage
const manager = new EventManager();
manager.subscribe(new UserSubscriber("Shiva"));
manager.notify("New course released");`
};
