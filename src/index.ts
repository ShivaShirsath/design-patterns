import { Logger } from "./creational/singleton/logger";
import { NotificationFactory } from "./creational/factory/notification.factory";
import { UserBuilder } from "./creational/builder/user.builder";
import { ExternalWeatherAPI } from "./structural/adapter/external-api";
import { WeatherAdapter } from "./structural/adapter/weather.adapter";
import { Request } from "./structural/decorator/types";
import { withAuth } from "./structural/decorator/auth.decorator";
import { PaymentContext } from "./behavioral/strategy/payment.context";
import { CardPayment } from "./behavioral/strategy/card.payment";
import { UpiPayment } from "./behavioral/strategy/upi.payment";
import { EventManager } from "./behavioral/observer/event.manager";
import { UserSubscriber } from "./behavioral/observer/user.subscriber";

console.log("=========================================");
console.log("🚀 DESIGN PATTERNS DEMONSTRATION RUNNER 🚀");
console.log("=========================================\n");

// --- 1. Singleton Logger ---
console.log("--- 1. Singleton Pattern (Logger) ---");
const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();
logger1.log("Application started");
console.log(`Are logger instances equal? ${logger1 === logger2}`);
console.log("-------------------------------------\n");

// --- 2. Factory Pattern ---
console.log("--- 2. Factory Pattern (Notification Factory) ---");
const emailNotifier = NotificationFactory.create("email");
const smsNotifier = NotificationFactory.create("sms");
const pushNotifier = NotificationFactory.create("push");

emailNotifier.send("Hello via Email!");
smsNotifier.send("Hello via SMS!");
pushNotifier.send("Welcome user via Push!");
console.log("-------------------------------------\n");

// --- 3. Builder Pattern ---
console.log("--- 3. Builder Pattern (User Builder) ---");
const user = new UserBuilder()
  .setName("Shiva")
  .setEmail("shiva.shirsath@p99soft.com")
  .setCity("Kolhar")
  .build();
console.log("Built User Object:", user);
console.log("-------------------------------------\n");

// --- 4. Adapter Pattern ---
console.log("--- 4. Adapter Pattern (Weather Service Adapter) ---");
const weatherService = new WeatherAdapter(new ExternalWeatherAPI());
console.log(weatherService.fetch("Mumbai"));
console.log("-------------------------------------\n");

// --- 5. Decorator Pattern ---
console.log("--- 5. Decorator Pattern (Auth Middleware Decorator) ---");
const getProfile = (req: Request) => {
  console.log("Profile Data: { name: 'Shiva', role: 'Developer' }");
};
const protectedHandler = withAuth(getProfile);

console.log("Executing protected handler without token:");
protectedHandler({}); // Should print Unauthorized

console.log("Executing protected handler with token:");
protectedHandler({ token: "valid-token" }); // Should succeed
console.log("-------------------------------------\n");

// --- 6. Strategy Pattern ---
console.log("--- 6. Strategy Pattern (Payment Context) ---");
console.log("Choosing Card Payment Strategy:");
const cardPayment = new PaymentContext(new CardPayment());
cardPayment.execute(1500);

console.log("Choosing UPI Payment Strategy:");
const upiPayment = new PaymentContext(new UpiPayment());
upiPayment.execute(500);
console.log("-------------------------------------\n");

// --- 7. Observer Pattern ---
console.log("--- 7. Observer Pattern (Event Notification System) ---");
const manager = new EventManager();
const sub1 = new UserSubscriber("Shiva");
const sub2 = new UserSubscriber("Alex");

manager.subscribe(sub1);
manager.subscribe(sub2);

console.log("Publishing notification to subscribers:");
manager.notify("New course on Design Patterns is now released!");
console.log("-------------------------------------\n");
