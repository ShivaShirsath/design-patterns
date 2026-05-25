# Design Patterns with TypeScript Visualizer 🚀

An interactive, visual dashboard portal to study and simulate 7 classic software design patterns in TypeScript + React.

---

## 🎥 Presentation Link

Access the presentation slide deck:
👉 **[Design Patterns Presentation on Gamma](https://gamma.app/docs/Untitled-c07wczdpk1vc8fl?mode=present#card-8sbc988dmuta5q8)**

---

## 📁 Project Structure

```txt
design-patterns/
├── package.json               # Scripts and dependencies for React + Vite + TS
├── tsconfig.json              # TypeScript compilation setup
├── vite.config.ts             # Vite configuration with Node.js browser mocks
├── index.html                 # Main HTML template loading Google Fonts
└── src/
    ├── main.tsx               # Mounts React App
    ├── App.tsx                # Interactive Dashboard UI & Simulators
    ├── index.css              # Glassmorphic dark theme CSS & animations
    ├── code-snippets.ts       # Code strings for the side-by-side viewer
    │
    ├── creational/            # CREATIONAL PATTERNS
    │   ├── singleton/         # Logger Singleton
    │   ├── factory/           # Notification Factory
    │   └── builder/           # User Builder
    │
    ├── structural/            # STRUCTURAL PATTERNS
    │   ├── adapter/           # Weather Service Adapter
    │   └── decorator/         # Auth Middleware Decorator
    │
    ├── behavioral/            # BEHAVIORAL PATTERNS
    │   ├── strategy/          # Payment Context Strategy
    │   └── observer/          # Event Subscriber Observer
    │
    └── browser-mocks/         # Node.js polyfills for client browsers
        ├── fs.ts              # Simulates fs.appendFileSync in localStorage
        └── path.ts            # Simple path.join polyfill
```

---

## 🛠️ Implemented Design Patterns

### 1. Creational Patterns
* **Singleton (Logger)**: Restricts the instantiation of a class to one single instance and provides global access. The simulator writes logs to a virtual `app.log` file in `localStorage`.
* **Factory (Notification)**: Creates concrete notification subclasses (`EmailNotification`, `SMSNotification`, `PushNotification`) dynamically from a central factory class based on type strings.
* **Builder (User)**: Constructs complex `User` objects step-by-step, separating representation from assembly.

### 2. Structural Patterns
* **Adapter (Weather)**: Converts an incompatible legacy external API payload into a unified local client interface expected by the system.
* **Decorator (Authentication)**: Attaches authentication verification middleware dynamically around endpoint handler functions.

### 3. Behavioral Patterns
* **Strategy (Payment)**: Defines a family of payment algorithms (Credit Card, UPI), encapsulates them, and makes them dynamically interchangeable at runtime.
* **Observer (Event System)**: Establishes a one-to-many subscription model to broadcast event notifications in real-time to active subscribers.

---

## 🚀 How to Run the Project

### Option A: Open the Interactive Web Dashboard (Recommended)

To run the full dark-mode visualization portal:
```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev
```
Once started, open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### Option B: Run the CLI Demonstration

To compile and run the CLI demonstration of the pattern executions directly in your terminal:
```bash
# 1. Install dependencies
npm install

# 2. Run the entry point script
npm start
```
This runs `ts-node src/index.ts` and prints the output log streams for each pattern.
