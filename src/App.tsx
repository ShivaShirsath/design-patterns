import React, { useState, useEffect, useRef } from "react";
import { CODE_SNIPPETS } from "./code-snippets";

// --- Import Original Design Pattern TS Files ---
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

// --- SVG Icons ---
const IconSingleton = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2S8 7 8 11s4 4 4 8-4-1-4-5" /><path d="M12 2s4 5 4 9-4 4-4 8 4-1 4-5" /></svg>
);
const IconFactory = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20V9l4-2 4 2 4-2 4 2 4-2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" /><path d="M17 18h1" /><path d="M12 18h1" /><path d="M7 18h1" /><path d="M7 14h1" /><path d="M12 14h1" /><path d="M17 14h1" /></svg>
);
const IconBuilder = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
);
const IconAdapter = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="9" y1="22" x2="9" y2="18" /><line x1="15" y1="22" x2="15" y2="18" /><line x1="12" y1="2" x2="12" y2="8" /><path d="M9 8h6" /></svg>
);
const IconDecorator = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);
const IconStrategy = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M18 15V9a4 4 0 0 0-4-4H9" /><path d="M8 9l-3-3 3-3" /></svg>
);
const IconObserver = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2" /><path d="M16.24 7.76a6 6 0 0 1 0 8.49" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M7.76 16.24a6 6 0 0 1 0-8.49" /><path d="M4.93 19.07a10 10 0 0 1 0-14.14" /></svg>
);
const IconCode = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
);
const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
);

export default function App() {
  const [activePattern, setActivePattern] = useState<
    "home" | "singleton" | "factory" | "builder" | "adapter" | "decorator" | "strategy" | "observer"
  >("home");

  const [showCode, setShowCode] = useState<boolean>(true);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const consoleBottomRef = useRef<HTMLDivElement>(null);

  // Helper to add custom simulated console logs
  const addLog = (msg: string) => {
    setConsoleLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    if (consoleBottomRef.current) {
      consoleBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [consoleLogs]);

  // Clear logs on pattern switch
  useEffect(() => {
    setConsoleLogs([]);
  }, [activePattern]);

  // --- STATE FOR SPECIFIC SIMULATORS ---

  // 1. Singleton state
  const [singletonLogsFile, setSingletonLogsFile] = useState<string[]>([]);
  const [singletonInputMsg, setSingletonInputMsg] = useState("");

  useEffect(() => {
    // Read initial app.log values
    const logs = JSON.parse(localStorage.getItem("app_logs") || "[]");
    setSingletonLogsFile(logs);

    // Listen to simulated file system writes
    const handleLogUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setSingletonLogsFile((prev) => [...prev, customEvent.detail]);
    };
    window.addEventListener("app-log-updated", handleLogUpdate);
    return () => window.removeEventListener("app-log-updated", handleLogUpdate);
  }, []);

  const runSingletonLog = (clientNum: number) => {
    if (!singletonInputMsg.trim()) return;

    // Capture standard console.log
    const originalConsoleLog = console.log;
    let loggedText = "";
    console.log = (...args: any[]) => {
      loggedText = args.join(" ").trim();
    };

    const loggerInstance = Logger.getInstance();
    loggerInstance.log(`Client ${clientNum}: ${singletonInputMsg}`);

    // Restore
    console.log = originalConsoleLog;

    addLog(`Invoked Logger.getInstance().log(...) from Client ${clientNum}`);
    addLog(`Console Output: ${loggedText}`);

    setSingletonInputMsg("");
  };

  const clearSingletonFile = () => {
    localStorage.removeItem("app_logs");
    setSingletonLogsFile([]);
    addLog("Simulated app.log cleared.");
  };

  // 2. Factory state
  const [factoryType, setFactoryType] = useState<"email" | "sms" | "push">("email");
  const [factoryMsg, setFactoryMsg] = useState("Welcome back!");
  const [factoryAnimState, setFactoryAnimState] = useState<"idle" | "creating" | "sending" | "done">("idle");
  const [factoryOutput, setFactoryOutput] = useState("");

  const runFactory = () => {
    if (!factoryMsg.trim()) return;
    setFactoryAnimState("creating");
    addLog(`Creating notification type: "${factoryType}" via Factory`);

    setTimeout(() => {
      // Create implementation
      const originalConsoleLog = console.log;
      let logged = "";
      console.log = (...args: any[]) => {
        logged = args.join(" ");
      };

      const notifier = NotificationFactory.create(factoryType);

      console.log = originalConsoleLog;

      setFactoryAnimState("sending");
      addLog(`Instantiated Class: ${notifier.constructor.name}`);

      setTimeout(() => {
        console.log = (...args: any[]) => {
          logged = args.join(" ");
        };
        notifier.send(factoryMsg);
        console.log = originalConsoleLog;

        setFactoryOutput(logged);
        setFactoryAnimState("done");
        addLog(`Console Output: ${logged}`);
      }, 1000);
    }, 1000);
  };

  // 3. Builder state
  const [builderName, setBuilderName] = useState("Shiva");
  const [builderAge, setBuilderAge] = useState<number | "">("");
  const [builderEmail, setBuilderEmail] = useState("");
  const [builderCity, setBuilderCity] = useState("");

  const assembledUser = new UserBuilder();
  if (builderName) assembledUser.setName(builderName);
  if (builderAge) assembledUser.setAge(Number(builderAge));
  if (builderEmail) assembledUser.setEmail(builderEmail);
  if (builderCity) assembledUser.setCity(builderCity);
  const finalUser = assembledUser.build();

  // 4. Adapter state
  const [adapterCity, setAdapterCity] = useState("Mumbai");
  const [adapterResult, setAdapterResult] = useState("");
  const [adapterStep, setAdapterStep] = useState<"idle" | "client" | "adapter" | "api" | "complete">("idle");

  const runAdapterDemo = () => {
    setAdapterStep("client");
    addLog(`Client queries Adapter WeatherService: .fetch("${adapterCity}")`);

    setTimeout(() => {
      setAdapterStep("adapter");
      addLog(`Adapter routes call to legacy ExternalWeatherAPI: .getTemperature("${adapterCity}")`);

      setTimeout(() => {
        setAdapterStep("api");
        const api = new ExternalWeatherAPI();
        const apiResult = api.getTemperature(adapterCity);
        addLog(`External API raw response: "${apiResult}"`);

        setTimeout(() => {
          const adapter = new WeatherAdapter(api);
          const finalVal = adapter.fetch(adapterCity);
          setAdapterResult(finalVal);
          setAdapterStep("complete");
          addLog(`Client receives adapted result: "${finalVal}"`);
        }, 800);
      }, 800);
    }, 800);
  };

  // 5. Decorator state
  const [jwtToken, setJwtToken] = useState("valid-token-xyz");
  const [decoratorStatus, setDecoratorStatus] = useState<"idle" | "processing" | "unauthorized" | "success">("idle");
  const [decoratorOutput, setDecoratorOutput] = useState("");

  const runDecoratorDemo = () => {
    setDecoratorStatus("processing");
    addLog("Sending request to protected endpoint with JWT token: " + (jwtToken ? `"${jwtToken}"` : "(Empty)"));

    setTimeout(() => {
      const originalConsoleLog = console.log;
      let logs: string[] = [];
      console.log = (...args: any[]) => {
        logs.push(args.join(" "));
      };

      const getProfile = (req: Request) => {
        console.log("Success: Profile data loaded { user: 'Shiva', access: 'Admin' }");
      };

      const protectedHandler = withAuth(getProfile);
      protectedHandler({ token: jwtToken });

      console.log = originalConsoleLog;

      if (logs.includes("Unauthorized")) {
        setDecoratorStatus("unauthorized");
        setDecoratorOutput("Unauthorized access. Intercepted by Decorator Middleware!");
        addLog("Decorator check failed: Unauthorized (aborted before reaching endpoint)");
      } else {
        setDecoratorStatus("success");
        setDecoratorOutput(logs.join("\n"));
        addLog("Decorator check passed. Target handler executed successfully.");
      }
    }, 1000);
  };

  // 6. Strategy state
  const [paymentAmount, setPaymentAmount] = useState<number>(500);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("upi");
  const [strategyOutput, setStrategyOutput] = useState("");
  const [strategyAnim, setStrategyAnim] = useState(false);

  const runStrategyDemo = () => {
    setStrategyAnim(true);
    addLog(`Instantiating Context with ${paymentMethod.toUpperCase()} strategy`);

    setTimeout(() => {
      const originalConsoleLog = console.log;
      let output = "";
      console.log = (...args: any[]) => {
        output = args.join(" ");
      };

      const strategy = paymentMethod === "card" ? new CardPayment() : new UpiPayment();
      const paymentCtx = new PaymentContext(strategy);
      paymentCtx.execute(paymentAmount);

      console.log = originalConsoleLog;
      setStrategyOutput(output);
      setStrategyAnim(false);
      addLog(`Context execution complete. Output: "${output}"`);
    }, 800);
  };

  // 7. Observer state
  const [subscribers, setSubscribers] = useState<string[]>(["Shiva", "Alex"]);
  const [newSubName, setNewSubName] = useState("");
  const [eventMsg, setEventMsg] = useState("New Design Patterns lecture is live!");
  const [observerLogs, setObserverLogs] = useState<string[]>([]);
  const [observerPulse, setObserverPulse] = useState(false);

  const addSubscriber = () => {
    if (!newSubName.trim()) return;
    if (subscribers.includes(newSubName)) return;
    setSubscribers([...subscribers, newSubName]);
    addLog(`Subscriber added: ${newSubName}`);
    setNewSubName("");
  };

  const removeSubscriber = (name: string) => {
    setSubscribers(subscribers.filter((s) => s !== name));
    addLog(`Subscriber removed: ${name}`);
  };

  const runObserverDemo = () => {
    if (subscribers.length === 0) {
      addLog("Cannot notify: No subscribers registered!");
      return;
    }
    setObserverPulse(true);
    setObserverLogs([]);
    addLog(`Broadcasting message: "${eventMsg}"`);

    const manager = new EventManager();

    // Wire up subscribers
    subscribers.forEach((name) => {
      const originalConsoleLog = console.log;
      let logOutput = "";
      console.log = (...args: any[]) => {
        logOutput = args.join(" ");
      };

      const sub = new UserSubscriber(name);
      manager.subscribe(sub);

      console.log = originalConsoleLog;
    });

    // Notify & capture logs
    const capturedLogs: string[] = [];
    const originalConsoleLog = console.log;
    console.log = (...args: any[]) => {
      capturedLogs.push(args.join(" "));
    };

    manager.notify(eventMsg);
    console.log = originalConsoleLog;

    setObserverLogs(capturedLogs);
    capturedLogs.forEach((log) => addLog(`Notification dispatched -> ${log}`));

    setTimeout(() => {
      setObserverPulse(false);
    }, 1500);
  };

  return (
    <div style={styles.appContainer}>
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar}>
        <div
          onClick={() => setActivePattern("home")}
          style={{ ...styles.sidebarHeader, cursor: "pointer" }}
          title="Go to Home Dashboard"
        >
          <div style={styles.sidebarGlowLogo}>DP</div>
          <div>
            <h1 style={{
              ...styles.logoTitle,
              color: activePattern === "home" ? "var(--color-primary)" : "var(--text-primary)"
            }}>
              Design Patterns
            </h1>
            <span style={styles.logoSubtitle}>TypeScript Visualizer</span>
          </div>
        </div>

        <nav style={styles.nav}>
          <div style={styles.navSectionHeader}>Creational</div>
          <button
            onClick={() => setActivePattern("singleton")}
            style={{
              ...styles.navItem,
              ...(activePattern === "singleton" ? styles.navItemActive : {}),
            }}
          >
            <IconSingleton />
            <span>Singleton Logger</span>
          </button>
          <button
            onClick={() => setActivePattern("factory")}
            style={{
              ...styles.navItem,
              ...(activePattern === "factory" ? styles.navItemActive : {}),
            }}
          >
            <IconFactory />
            <span>Notification Factory</span>
          </button>
          <button
            onClick={() => setActivePattern("builder")}
            style={{
              ...styles.navItem,
              ...(activePattern === "builder" ? styles.navItemActive : {}),
            }}
          >
            <IconBuilder />
            <span>User Builder</span>
          </button>

          <div style={styles.navSectionHeader}>Structural</div>
          <button
            onClick={() => setActivePattern("adapter")}
            style={{
              ...styles.navItem,
              ...(activePattern === "adapter" ? styles.navItemActive : {}),
            }}
          >
            <IconAdapter />
            <span>Weather Adapter</span>
          </button>
          <button
            onClick={() => setActivePattern("decorator")}
            style={{
              ...styles.navItem,
              ...(activePattern === "decorator" ? styles.navItemActive : {}),
            }}
          >
            <IconDecorator />
            <span>Auth Decorator</span>
          </button>

          <div style={styles.navSectionHeader}>Behavioral</div>
          <button
            onClick={() => setActivePattern("strategy")}
            style={{
              ...styles.navItem,
              ...(activePattern === "strategy" ? styles.navItemActive : {}),
            }}
          >
            <IconStrategy />
            <span>Payment Strategy</span>
          </button>
          <button
            onClick={() => setActivePattern("observer")}
            style={{
              ...styles.navItem,
              ...(activePattern === "observer" ? styles.navItemActive : {}),
            }}
          >
            <IconObserver />
            <span>Observer Events</span>
          </button>
        </nav>

        <div style={styles.sidebarFooter}>
          <span>Vite + React + TS App</span>
        </div>
      </aside>

      {/* Main Workspace */}
      <main style={styles.mainContent}>
        {/* Workspace Header */}
        <header style={styles.header}>
          <div>
            <h2 style={styles.headerTitle}>
              {activePattern === "home"
                ? "Design Patterns Overview"
                : `${activePattern.charAt(0).toUpperCase() + activePattern.slice(1)} Pattern`
              }
            </h2>
            <p style={styles.headerSubtitle}>
              {activePattern === "home" && "An interactive visualization portal to learn creational, structural, and behavioral software patterns."}
              {activePattern === "singleton" && "Ensures a class has only one instance and provides a global point of access."}
              {activePattern === "factory" && "Defines an interface for creating objects, letting subclasses decide which class to instantiate."}
              {activePattern === "builder" && "Separates the construction of a complex object from its representation."}
              {activePattern === "adapter" && "Converts the interface of a class into another interface clients expect."}
              {activePattern === "decorator" && "Attaches additional responsibilities to an object dynamically."}
              {activePattern === "strategy" && "Defines a family of algorithms, encapsulates each one, and makes them interchangeable."}
              {activePattern === "observer" && "Defines a one-to-many dependency between objects so that all dependants are notified of changes."}
            </p>
          </div>
          {activePattern !== "home" && (
            <button
              onClick={() => setShowCode(!showCode)}
              style={{
                ...styles.codeToggleBtn,
                ...(showCode ? styles.codeToggleBtnActive : {}),
              }}
            >
              <IconCode />
              <span>{showCode ? "Hide Code" : "Show Code"}</span>
            </button>
          )}
        </header>

        {/* Dashboard Split View */}
        <div style={styles.splitViewContainer}>
          {/* Simulator Panel (Left Panel) */}
          <div style={{ ...styles.splitPanel, flex: activePattern === "home" ? 1 : 1.1 }}>
            <div className="glass-panel" style={styles.panelContent}>
              <div style={styles.panelHeader}>
                <span style={styles.panelTitle}>
                  {activePattern === "home" ? "Understanding Software Design Patterns" : "Interactive Playground"}
                </span>
                <span style={{
                  ...styles.patternPill,
                  ...(activePattern === "home" ? { background: "rgba(16, 185, 129, 0.15)", color: "var(--color-success)" } : {})
                }}>
                  {activePattern === "home" ? "CONCEPT BLOCKS" : "SIMULATOR"}
                </span>
              </div>

              <div style={styles.simulatorArea}>
                {/* 0. HOME DASHBOARD OVERVIEW */}
                {activePattern === "home" && (
                  <div style={styles.homeContainer}>
                    {/* Welcome Banner */}
                    <div style={styles.homeBanner}>
                      <div style={{ flex: 1 }}>
                        <h3 style={styles.homeBannerTitle}>What are Design Patterns?</h3>
                        <p style={styles.homeBannerText}>
                          Design patterns are <strong>reusable blueprints</strong> for solving common, recurring software engineering challenges. Rather than copy-pasting code, a design pattern acts as a template or conceptual guide for structuring classes and communication between objects in a clean, maintainable, and scalable way.
                        </p>
                      </div>
                      <div style={styles.homeBannerGraphic}>
                        <div style={styles.blueprintGrid}>
                          <div style={styles.blueprintLine} />
                          <div style={styles.blueprintCircle} />
                          <span style={styles.blueprintText}>BLUEPRINT</span>
                        </div>
                      </div>
                    </div>

                    {/* The 3 Pillars Grid */}
                    <div style={styles.pillarsGrid}>
                      {/* Creational */}
                      <div className="pillar-card" onClick={() => setActivePattern("singleton")}>
                        <div style={{ ...styles.pillarIconHeader, background: "rgba(139, 92, 246, 0.1)" }}>
                          <IconFactory />
                          <strong style={{ color: "var(--color-primary)" }}>Creational Patterns</strong>
                        </div>
                        <span style={styles.pillarAnalogy}>Analogy: The Constructor / Factory</span>
                        <p style={styles.pillarDesc}>
                          These patterns deal with <strong>object creation mechanisms</strong>, trying to create objects in a manner suitable to the situation instead of instantiating them directly.
                        </p>
                        <ul style={styles.pillarList}>
                          <li><strong>Singleton:</strong> One single instance globally.</li>
                          <li><strong>Factory:</strong> Instantiates subclasses dynamically.</li>
                          <li><strong>Builder:</strong> Assembles complex objects step-by-step.</li>
                        </ul>
                        <div className="pillar-action" style={styles.pillarAction}>Explore Creational ➔</div>
                      </div>

                      {/* Structural */}
                      <div className="pillar-card" onClick={() => setActivePattern("adapter")}>
                        <div style={{ ...styles.pillarIconHeader, background: "rgba(59, 130, 246, 0.1)" }}>
                          <IconAdapter />
                          <strong style={{ color: "var(--color-secondary)" }}>Structural Patterns</strong>
                        </div>
                        <span style={styles.pillarAnalogy}>Analogy: Plugs, Adapters, & Gift Wrappers</span>
                        <p style={styles.pillarDesc}>
                          These patterns describe how to <strong>assemble objects and classes</strong> into larger structures, keeping these structures flexible and efficient.
                        </p>
                        <ul style={styles.pillarList}>
                          <li><strong>Adapter:</strong> Connects incompatible interfaces.</li>
                          <li><strong>Decorator:</strong> Adds behaviors without subclassing.</li>
                        </ul>
                        <div className="pillar-action" style={styles.pillarAction}>Explore Structural ➔</div>
                      </div>

                      {/* Behavioral */}
                      <div className="pillar-card" onClick={() => setActivePattern("strategy")}>
                        <div style={{ ...styles.pillarIconHeader, background: "rgba(6, 182, 212, 0.1)" }}>
                          <IconObserver />
                          <strong style={{ color: "var(--color-accent)" }}>Behavioral Patterns</strong>
                        </div>
                        <span style={styles.pillarAnalogy}>Analogy: Communication Pipelines & Routing</span>
                        <p style={styles.pillarDesc}>
                          These patterns focus on <strong>communication between objects</strong>, detailing how responsibilities and algorithms are shared.
                        </p>
                        <ul style={styles.pillarList}>
                          <li><strong>Strategy:</strong> Swaps algorithms at runtime.</li>
                          <li><strong>Observer:</strong> Broadcasts updates to subscribers.</li>
                        </ul>
                        <div className="pillar-action" style={styles.pillarAction}>Explore Behavioral ➔</div>
                      </div>
                    </div>

                    {/* Why Patterns Matter Card */}
                    <div style={styles.whyPatternsCard}>
                      <h4 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "10px" }}>Why should you learn Design Patterns?</h4>
                      <div style={styles.benefitsGrid}>
                        <div style={styles.benefitItem}>
                          <strong>💡 Save Development Time</strong>
                          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                            Leverage proven software engineering architectures rather than reinventing structure.
                          </p>
                        </div>
                        <div style={styles.benefitItem}>
                          <strong>🧱 Write Maintainable Code</strong>
                          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                            Separation of concerns and loose coupling mean making changes in one component won't break others.
                          </p>
                        </div>
                        <div style={styles.benefitItem}>
                          <strong>🗣️ Speak the Same Language</strong>
                          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                            Saying "we use an Observer here" instantly communicates structure to other developers on your team.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 1. SINGLETON LOGGER SIMULATOR */}
                {activePattern === "singleton" && (
                  <div style={styles.patternSimContainer}>
                    <div style={styles.singletonGlowNode} className="glow-active">
                      <span style={{ fontSize: "0.8rem", color: varColor("text-muted") }}>Global Memory</span>
                      <strong style={{ color: varColor("color-primary"), fontSize: "1.1rem" }}>Logger.instance</strong>
                      <code style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: "4px" }}>
                        ID: #0xFF5A1D2
                      </code>
                    </div>

                    <div style={{ display: "flex", gap: "10px", alignItems: "center", width: "100%" }}>
                      <input
                        type="text"
                        placeholder="Type message to log..."
                        value={singletonInputMsg}
                        onChange={(e) => setSingletonInputMsg(e.target.value)}
                        style={{ flex: 1 }}
                        onKeyDown={(e) => e.key === "Enter" && runSingletonLog(1)}
                      />
                    </div>

                    <div style={styles.singletonGrid}>
                      <div style={styles.clientBox}>
                        <div style={styles.clientTitle}>Client A (Logger Instance)</div>
                        <p style={styles.clientCodeText}>const logger1 = Logger.getInstance();</p>
                        <button
                          onClick={() => runSingletonLog(1)}
                          className="btn-primary"
                          style={{ width: "100%", marginTop: "10px" }}
                        >
                          Trigger logger1.log()
                        </button>
                      </div>

                      <div style={styles.clientBox}>
                        <div style={styles.clientTitle}>Client B (Logger Instance)</div>
                        <p style={styles.clientCodeText}>const logger2 = Logger.getInstance();</p>
                        <button
                          onClick={() => runSingletonLog(2)}
                          className="btn-primary"
                          style={{ width: "100%", marginTop: "10px" }}
                        >
                          Trigger logger2.log()
                        </button>
                      </div>
                    </div>

                    {/* Simulated File Storage */}
                    <div style={styles.simulatedFileStorage}>
                      <div style={styles.fileStorageHeader}>
                        <span>📁 File System: <strong>app.log</strong></span>
                        {singletonLogsFile.length > 0 && (
                          <button onClick={clearSingletonFile} style={styles.clearFileBtn}>
                            Clear File
                          </button>
                        )}
                      </div>
                      <div style={styles.fileContentArea}>
                        {singletonLogsFile.length === 0 ? (
                          <span style={styles.emptyText}>[app.log is empty. Trigger logs above to write to file]</span>
                        ) : (
                          singletonLogsFile.map((logLine, idx) => (
                            <div key={idx} style={styles.logLineText}>
                              💾 {logLine}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. FACTORY NOTIFICATION SIMULATOR */}
                {activePattern === "factory" && (
                  <div style={styles.patternSimContainer}>
                    <div style={styles.factoryContainer}>
                      {/* Configuration panel */}
                      <div style={styles.factoryForm}>
                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Notification Medium</label>
                          <div style={styles.buttonSelectGrid}>
                            {(["email", "sms", "push"] as const).map((t) => (
                              <button
                                key={t}
                                onClick={() => setFactoryType(t)}
                                style={{
                                  ...styles.selectBtnOption,
                                  ...(factoryType === t ? styles.selectBtnOptionActive : {}),
                                }}
                              >
                                {t.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Notification Message</label>
                          <input
                            type="text"
                            value={factoryMsg}
                            onChange={(e) => setFactoryMsg(e.target.value)}
                            style={{ width: "100%" }}
                          />
                        </div>

                        <button
                          onClick={runFactory}
                          disabled={factoryAnimState === "creating" || factoryAnimState === "sending"}
                          className="btn-primary"
                          style={{ width: "100%", marginTop: "10px" }}
                        >
                          Generate & Send via Factory
                        </button>
                      </div>

                      {/* Visual representation */}
                      <div style={styles.factoryVisualizer}>
                        {/* Factory Box */}
                        <div
                          style={{
                            ...styles.factoryMachine,
                            ...(factoryAnimState === "creating" ? styles.factoryMachinePulse : {}),
                          }}
                        >
                          🏗️ Factory
                          <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>NotificationFactory</span>
                        </div>

                        {/* Connection arrow */}
                        <div style={styles.flowArrowContainer}>
                          <div
                            style={{
                              ...styles.flowIndicatorDot,
                              ...(factoryAnimState === "sending" ? styles.flowIndicatorDotActive : {}),
                            }}
                          />
                          <div style={styles.flowLine} />
                        </div>

                        {/* Product Instance */}
                        <div
                          style={{
                            ...styles.factoryProduct,
                            ...(factoryAnimState === "sending" || factoryAnimState === "done" ? styles.factoryProductShow : {}),
                          }}
                        >
                          <span style={styles.productBadge}>
                            {factoryType === "email" && "📧 EmailNotification"}
                            {factoryType === "sms" && "💬 SMSNotification"}
                            {factoryType === "push" && "🔔 PushNotification"}
                          </span>
                          <div style={styles.productMessage}>
                            {factoryAnimState === "done" ? factoryOutput : "Instantiating Class..."}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. BUILDER USER SIMULATOR */}
                {activePattern === "builder" && (
                  <div style={styles.patternSimContainer}>
                    <div style={styles.builderLayoutGrid}>
                      {/* Controls */}
                      <div style={styles.builderForm}>
                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Name</label>
                          <input
                            type="text"
                            value={builderName}
                            onChange={(e) => setBuilderName(e.target.value)}
                            placeholder="John Doe"
                          />
                        </div>
                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Age</label>
                          <input
                            type="number"
                            value={builderAge}
                            onChange={(e) => setBuilderAge(e.target.value === "" ? "" : Number(e.target.value))}
                            placeholder="e.g. 24"
                          />
                        </div>
                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Email</label>
                          <input
                            type="email"
                            value={builderEmail}
                            onChange={(e) => setBuilderEmail(e.target.value)}
                            placeholder="john@example.com"
                          />
                        </div>
                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>City</label>
                          <input
                            type="text"
                            value={builderCity}
                            onChange={(e) => setBuilderCity(e.target.value)}
                            placeholder="Nagpur"
                          />
                        </div>
                      </div>

                      {/* Visual user preview card */}
                      <div style={styles.builderPreview}>
                        <div style={styles.builderCardHeader}>User Object Construction</div>

                        <div style={styles.previewUserCard}>
                          <div style={styles.userCardAvatar}>
                            {builderName ? builderName.substring(0, 2).toUpperCase() : "?"}
                          </div>

                          <div style={styles.userCardDetails}>
                            <h3 style={{ ...styles.userCardDetailVal, opacity: builderName ? 1 : 0.3 }}>
                              {builderName || "Name not set"}
                            </h3>
                            <p style={{ color: varColor("text-secondary"), fontSize: "0.85rem", opacity: builderAge ? 1 : 0.3 }}>
                              Age: {builderAge || "Age not set"}
                            </p>
                            <p style={{ color: varColor("color-accent"), fontSize: "0.85rem", opacity: builderEmail ? 1 : 0.3 }}>
                              ✉️ {builderEmail || "Email not set"}
                            </p>
                            <p style={{ color: varColor("text-muted"), fontSize: "0.85rem", opacity: builderCity ? 1 : 0.3 }}>
                              📍 {builderCity || "City not set"}
                            </p>
                          </div>
                        </div>

                        {/* Code output preview */}
                        <div style={{ marginTop: "15px" }}>
                          <span style={{ fontSize: "0.8rem", color: varColor("text-secondary") }}>Under the hood builder calls:</span>
                          <pre style={{ fontSize: "0.75rem", marginTop: "5px", padding: "10px" }}>
                            {`const user = new UserBuilder()
${builderName ? `  .setName("${builderName}")\n` : ""}${builderAge ? `  .setAge(${builderAge})\n` : ""}${builderEmail ? `  .setEmail("${builderEmail}")\n` : ""}${builderCity ? `  .setCity("${builderCity}")\n` : ""}  .build();`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. ADAPTER WEATHER SIMULATOR */}
                {activePattern === "adapter" && (
                  <div style={styles.patternSimContainer}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "15px" }}>
                      <label style={{ fontSize: "0.9rem" }}>Choose City:</label>
                      <select value={adapterCity} onChange={(e) => setAdapterCity(e.target.value)}>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Nagpur">Nagpur</option>
                        <option value="Pune">Pune</option>
                        <option value="Delhi">Delhi</option>
                      </select>
                      <button onClick={runAdapterDemo} className="btn-primary">
                        Fetch Weather
                      </button>
                    </div>

                    <div style={styles.adapterPipeline}>
                      {/* Client */}
                      <div
                        style={{
                          ...styles.adapterNode,
                          borderColor: adapterStep === "client" ? varColor("color-secondary") : "var(--border-color)",
                        }}
                      >
                        <span style={styles.nodeLabel}>Client App</span>
                        <code style={{ fontSize: "0.75rem" }}>WeatherService.fetch()</code>
                        <div style={styles.nodeStatus}>
                          {adapterStep === "client" && "⚡ Querying adapter..."}
                          {adapterStep === "complete" && "✅ Received adapted result"}
                        </div>
                      </div>

                      {/* Adapter */}
                      <div
                        style={{
                          ...styles.adapterNode,
                          borderColor: adapterStep === "adapter" ? varColor("color-primary") : "var(--border-color)",
                        }}
                      >
                        <span style={styles.nodeLabel}>Adapter Wrapper</span>
                        <code style={{ fontSize: "0.75rem" }}>WeatherAdapter</code>
                        <div style={styles.nodeStatus}>
                          {adapterStep === "adapter" && "⚙️ Translating request..."}
                        </div>
                      </div>

                      {/* Legacy API */}
                      <div
                        style={{
                          ...styles.adapterNode,
                          borderColor: adapterStep === "api" ? varColor("color-accent") : "var(--border-color)",
                        }}
                      >
                        <span style={styles.nodeLabel}>Legacy External Weather API</span>
                        <code style={{ fontSize: "0.75rem" }}>getTemperature()</code>
                        <div style={styles.nodeStatus}>
                          {adapterStep === "api" && "🌡️ Processing raw string output..."}
                        </div>
                      </div>
                    </div>

                    {adapterResult && (
                      <div style={styles.adapterResultCard}>
                        <div style={{ fontSize: "0.85rem", color: varColor("text-muted") }}>Adapted Result:</div>
                        <strong style={{ fontSize: "1.2rem", color: varColor("color-success") }}>
                          {adapterResult}
                        </strong>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. DECORATOR AUTH SIMULATOR */}
                {activePattern === "decorator" && (
                  <div style={styles.patternSimContainer}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "15px" }}>
                      <input
                        type="text"
                        placeholder="Enter JWT Token (e.g. valid-token)"
                        value={jwtToken}
                        onChange={(e) => setJwtToken(e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <button onClick={() => setJwtToken("")} style={styles.clearFileBtn}>
                        Clear Token
                      </button>
                      <button onClick={runDecoratorDemo} className="btn-primary">
                        Invoke Endpoint
                      </button>
                    </div>

                    <div style={styles.decoratorPipeline}>
                      <div style={styles.decClientPacket}>
                        📩 Client Request
                        <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>Token: {jwtToken ? `"${jwtToken}"` : "None"}</span>
                      </div>

                      <div style={{ color: "var(--text-muted)", fontSize: "1.2rem" }}>➔</div>

                      {/* Decorator Gate */}
                      <div
                        style={{
                          ...styles.decoratorGate,
                          ...(decoratorStatus === "unauthorized" ? styles.gateError : {}),
                          ...(decoratorStatus === "success" ? styles.gateSuccess : {}),
                          ...(decoratorStatus === "processing" ? styles.gateProcessing : {}),
                        }}
                      >
                        🛡️ Decorator: withAuth()
                        <span style={{ fontSize: "0.75rem", marginTop: "4px" }}>
                          {decoratorStatus === "processing" && "Verifying token..."}
                          {decoratorStatus === "unauthorized" && "Unauthorized! Blocked."}
                          {decoratorStatus === "success" && "Access Granted!"}
                          {decoratorStatus === "idle" && "Waiting for request..."}
                        </span>
                      </div>

                      <div style={{ color: "var(--text-muted)", fontSize: "1.2rem", opacity: decoratorStatus === "success" ? 1 : 0.3 }}>➔</div>

                      {/* Handler Endpoint */}
                      <div
                        style={{
                          ...styles.decEndpoint,
                          opacity: decoratorStatus === "success" ? 1 : 0.4,
                          borderColor: decoratorStatus === "success" ? varColor("color-success") : "var(--border-color)",
                        }}
                      >
                        🖥️ Endpoint: getProfile()
                      </div>
                    </div>

                    {/* Visual Execution Flow Trace */}
                    <div style={{ marginTop: "15px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", padding: "12px", border: "1px solid var(--border-color)" }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600, color: varColor("text-secondary"), marginBottom: "6px" }}>
                        Execution Trace: How we hit getProfile()
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-primary)", display: "flex", flexDirection: "column", gap: "4px" }}>
                        <div>1. Client invokes: <span style={{ color: varColor("color-accent") }}>protectedHandler({`{ token: "${jwtToken}" }`})</span></div>
                        <div style={{ color: decoratorStatus !== "idle" ? varColor("color-primary") : "var(--text-muted)", transition: "color 0.3s" }}>
                          2. Request intercepts at decorator wrapper: <span style={{ color: varColor("color-primary") }}>withAuth(...)</span>
                        </div>
                        <div style={{ color: (decoratorStatus === "success" || decoratorStatus === "unauthorized") ? (decoratorStatus === "success" ? varColor("color-success") : varColor("color-error")) : "var(--text-muted)", transition: "color 0.3s" }}>
                          3. Auth Check: {jwtToken ? `Token "${jwtToken}" matches -> Success!` : "Token is missing/falsy -> Unauthorized!"}
                        </div>
                        <div style={{ color: decoratorStatus === "success" ? varColor("color-success") : "var(--text-muted)", opacity: decoratorStatus === "unauthorized" ? 0.5 : 1, transition: "color 0.3s" }}>
                          4. Endpoint Execution: {decoratorStatus === "success" ? "getProfile(req) is executed ✅" : "getProfile(req) is NOT reached ❌"}
                        </div>
                      </div>
                    </div>

                    {decoratorOutput && (
                      <div
                        style={{
                          ...styles.decResultCard,
                          borderColor: decoratorStatus === "unauthorized" ? varColor("color-error") : varColor("color-success"),
                          background: decoratorStatus === "unauthorized" ? "rgba(244, 63, 94, 0.05)" : "rgba(16, 185, 129, 0.05)",
                        }}
                      >
                        <div style={{ fontWeight: 600, color: decoratorStatus === "unauthorized" ? varColor("color-error") : varColor("color-success") }}>
                          {decoratorStatus === "unauthorized" ? "❌ Blocked Request" : "✅ Request Success"}
                        </div>
                        <pre style={{ border: "none", background: "none", padding: 0, marginTop: "6px", fontSize: "0.85rem" }}>
                          {decoratorOutput}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* 6. STRATEGY PAYMENT SIMULATOR */}
                {activePattern === "strategy" && (
                  <div style={styles.patternSimContainer}>
                    <div style={styles.strategyContainer}>
                      <div style={styles.strategyForm}>
                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Amount (₹)</label>
                          <input
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(Number(e.target.value))}
                            min="1"
                          />
                        </div>

                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Select Strategy</label>
                          <div style={styles.buttonSelectGrid}>
                            <button
                              onClick={() => setPaymentMethod("card")}
                              style={{
                                ...styles.selectBtnOption,
                                ...(paymentMethod === "card" ? styles.selectBtnOptionActive : {}),
                              }}
                            >
                              💳 Credit Card
                            </button>
                            <button
                              onClick={() => setPaymentMethod("upi")}
                              style={{
                                ...styles.selectBtnOption,
                                ...(paymentMethod === "upi" ? styles.selectBtnOptionActive : {}),
                              }}
                            >
                              📱 UPI Payment
                            </button>
                          </div>
                        </div>

                        <button onClick={runStrategyDemo} className="btn-primary" style={{ width: "100%", marginTop: "10px" }}>
                          Execute Payment
                        </button>
                      </div>

                      <div style={styles.strategyVisuals}>
                        <div style={{ ...styles.strategyPathNode, opacity: paymentMethod === "card" ? 1 : 0.3 }}>
                          <strong>CardPayment Strategy</strong>
                          <span style={{ fontSize: "0.75rem" }}>alg: card-processor</span>
                        </div>
                        <div style={{ ...styles.strategyPathNode, opacity: paymentMethod === "upi" ? 1 : 0.3 }}>
                          <strong>UpiPayment Strategy</strong>
                          <span style={{ fontSize: "0.75rem" }}>alg: upi-gateway</span>
                        </div>

                        {strategyOutput && (
                          <div style={{ ...styles.decResultCard, borderColor: varColor("color-primary"), width: "100%" }}>
                            <div style={{ fontSize: "0.8rem", color: varColor("text-muted") }}>Algorithm Console Out:</div>
                            <strong style={{ fontSize: "1.1rem", color: varColor("text-primary") }}>
                              {strategyOutput}
                            </strong>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. OBSERVER SYSTEM SIMULATOR */}
                {activePattern === "observer" && (
                  <div style={styles.patternSimContainer}>
                    <div style={styles.observerDashboard}>
                      {/* Left: Setup & Message */}
                      <div style={styles.observerPanel}>
                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Add Subscriber</label>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <input
                              type="text"
                              placeholder="Subscriber name"
                              value={newSubName}
                              onChange={(e) => setNewSubName(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && addSubscriber()}
                            />
                            <button onClick={addSubscriber} className="btn-secondary">
                              Add
                            </button>
                          </div>
                        </div>

                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Event Notification Message</label>
                          <input
                            type="text"
                            value={eventMsg}
                            onChange={(e) => setEventMsg(e.target.value)}
                            style={{ width: "100%" }}
                          />
                        </div>

                        <button onClick={runObserverDemo} className="btn-primary" style={{ width: "100%" }}>
                          Publish Event & Notify
                        </button>
                      </div>

                      {/* Right: Subscribers Grid */}
                      <div style={styles.subscribersList}>
                        <div style={styles.subListHeader}>
                          📡 Registered Subscribers ({subscribers.length})
                        </div>
                        <div style={styles.subscribersGrid}>
                          {subscribers.length === 0 ? (
                            <span style={styles.emptyText}>No registered subscribers. Add some on the left.</span>
                          ) : (
                            subscribers.map((name, idx) => (
                              <div
                                key={idx}
                                style={{
                                  ...styles.subscriberCard,
                                  ...(observerPulse ? styles.subscriberCardPulse : {}),
                                }}
                              >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <strong>🧑‍💻 {name}</strong>
                                  <button onClick={() => removeSubscriber(name)} style={styles.subRemoveBtn}>
                                    <IconTrash />
                                  </button>
                                </div>
                                <div style={styles.subLogMessage}>
                                  {observerLogs.find((l) => l.startsWith(name)) || "Idle... Waiting for notifications"}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Visual Logger Output panel (Console Logs simulation) */}
            {activePattern !== "home" && (
              <div className="glass-panel" style={{ ...styles.panelContent, marginTop: "20px" }}>
                <div style={styles.panelHeader}>
                  <span style={styles.panelTitle}>Simulated Output Console</span>
                  <button
                    onClick={() => setConsoleLogs([])}
                    style={styles.clearFileBtn}
                  >
                    Clear Console
                  </button>
                </div>
                <div style={styles.consoleContainer}>
                  {consoleLogs.length === 0 ? (
                    <span style={styles.emptyConsole}>Console empty. Trigger interactions in the simulator above to view logs.</span>
                  ) : (
                    consoleLogs.map((log, idx) => (
                      <div key={idx} style={styles.consoleLogLine}>
                        <span>{log}</span>
                      </div>
                    ))
                  )}
                  <div ref={consoleBottomRef} />
                </div>
              </div>
            )}
          </div>

          {/* Code Viewer Panel (Right Panel) */}
          {showCode && activePattern !== "home" && (
            <div style={{ ...styles.splitPanel, flex: 0.9 }}>
              <div className="glass-panel" style={styles.panelContent}>
                <div style={styles.panelHeader}>
                  <span style={styles.panelTitle}>Pattern Implementation</span>
                  <span style={styles.codePill}>TypeScript</span>
                </div>
                <div style={styles.codeViewerArea}>
                  <pre style={styles.preCodeViewer}>
                    <code>{CODE_SNIPPETS[activePattern]}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Helper function to resolve dynamic CSS variables in JS styles
function varColor(name: string): string {
  if (name === "color-primary") return "#8b5cf6";
  if (name === "color-secondary") return "#3b82f6";
  if (name === "color-accent") return "#06b6d4";
  if (name === "color-success") return "#10b981";
  if (name === "color-error") return "#f43f5e";
  if (name === "text-secondary") return "#9ca3af";
  if (name === "text-muted") return "#6b7280";
  if (name === "text-primary") return "#f3f4f6";
  return "rgba(255, 255, 255, 0.1)";
}

// Inline JS Styles for styling components cleanly and flexibly
const styles: Record<string, React.CSSProperties> = {
  appContainer: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    backgroundColor: "var(--bg-dark)",
    overflow: "hidden",
  },
  sidebar: {
    width: "280px",
    backgroundColor: "var(--bg-sidebar)",
    borderRight: "1px solid var(--border-color)",
    display: "flex",
    flexDirection: "column",
    padding: "24px 16px",
    flexShrink: 0,
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "32px",
  },
  sidebarGlowLogo: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background: "var(--gradient-neon)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "white",
    boxShadow: "0 0 15px rgba(139, 92, 246, 0.4)",
  },
  logoTitle: {
    fontSize: "1.15rem",
    fontWeight: 700,
    color: "var(--text-primary)",
    fontFamily: "var(--font-sans)",
  },
  logoSubtitle: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
  },
  nav: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    overflowY: "auto",
  },
  navSectionHeader: {
    fontSize: "0.7rem",
    fontWeight: 700,
    textTransform: "uppercase",
    color: "var(--text-muted)",
    letterSpacing: "1.5px",
    marginTop: "20px",
    marginBottom: "6px",
    paddingLeft: "10px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 14px",
    borderRadius: "10px",
    color: "var(--text-secondary)",
    fontSize: "0.9rem",
    fontWeight: 500,
    textAlign: "left",
    background: "transparent",
    transition: "all 0.2s ease-in-out",
  },
  navItemActive: {
    background: "rgba(139, 92, 246, 0.15)",
    color: "var(--text-primary)",
    borderLeft: "3px solid var(--color-primary)",
    paddingLeft: "11px",
  },
  sidebarFooter: {
    paddingTop: "15px",
    borderTop: "1px solid var(--border-color)",
    fontSize: "0.75rem",
    color: "var(--text-muted)",
    textAlign: "center",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    padding: "20px 24px",
    borderBottom: "1px solid var(--border-color)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0,
    background: "rgba(11, 14, 26, 0.4)",
  },
  headerTitle: {
    fontSize: "1.5rem",
    fontWeight: 700,
    fontFamily: "var(--font-sans)",
  },
  headerSubtitle: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    marginTop: "4px",
  },
  codeToggleBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    borderRadius: "8px",
    background: "rgba(255, 255, 255, 0.05)",
    color: "var(--text-secondary)",
    border: "1px solid var(--border-color)",
    fontSize: "0.85rem",
    fontWeight: 500,
  },
  codeToggleBtnActive: {
    background: "rgba(139, 92, 246, 0.1)",
    borderColor: "var(--color-primary)",
    color: "var(--text-primary)",
  },
  splitViewContainer: {
    flex: 1,
    display: "flex",
    padding: "20px",
    gap: "20px",
    overflow: "hidden",
  },
  splitPanel: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    height: "100%",
  },
  panelContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    padding: "18px",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid var(--border-color)",
    paddingBottom: "12px",
    marginBottom: "16px",
    flexShrink: 0,
  },
  panelTitle: {
    fontSize: "0.95rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "var(--text-primary)",
  },
  patternPill: {
    fontSize: "0.7rem",
    fontWeight: 700,
    background: "rgba(139, 92, 246, 0.15)",
    color: "var(--color-primary)",
    padding: "2px 8px",
    borderRadius: "4px",
  },
  codePill: {
    fontSize: "0.7rem",
    fontWeight: 700,
    background: "rgba(6, 182, 212, 0.15)",
    color: "var(--color-accent)",
    padding: "2px 8px",
    borderRadius: "4px",
  },
  simulatorArea: {
    flex: 1,
    overflowY: "auto",
  },
  codeViewerArea: {
    flex: 1,
    overflow: "hidden",
    display: "flex",
  },
  preCodeViewer: {
    margin: 0,
    border: "none",
    background: "rgba(0,0,0,0.3)",
    flex: 1,
    borderRadius: "8px",
    overflow: "auto",
  },
  consoleContainer: {
    flex: 1,
    minHeight: "100px",
    maxHeight: "220px",
    background: "#03050c",
    borderRadius: "10px",
    border: "1px solid var(--border-color)",
    padding: "12px",
    overflowY: "auto",
    fontFamily: "var(--font-mono)",
    fontSize: "0.82rem",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  emptyConsole: {
    color: "var(--text-muted)",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: "20px",
  },
  consoleLogLine: {
    color: "#22c55e",
    borderBottom: "1px solid rgba(255,255,255,0.03)",
    paddingBottom: "4px",
    wordBreak: "break-all",
  },

  // Pattern Specific Styles
  patternSimContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "4px",
  },

  // Singleton
  singletonGlowNode: {
    background: "rgba(139, 92, 246, 0.05)",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    textAlign: "center",
  },
  singletonGrid: {
    display: "flex",
    gap: "16px",
  },
  clientBox: {
    flex: 1,
    background: "rgba(255,255,255,0.02)",
    border: "1px solid var(--border-color)",
    borderRadius: "10px",
    padding: "14px",
  },
  clientTitle: {
    fontWeight: 600,
    fontSize: "0.85rem",
    color: "var(--text-primary)",
    marginBottom: "6px",
  },
  clientCodeText: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.75rem",
    color: "var(--text-muted)",
  },
  simulatedFileStorage: {
    background: "rgba(0,0,0,0.25)",
    border: "1px solid var(--border-color)",
    borderRadius: "10px",
    overflow: "hidden",
  },
  fileStorageHeader: {
    background: "rgba(255,255,255,0.03)",
    padding: "10px 14px",
    borderBottom: "1px solid var(--border-color)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.85rem",
  },
  fileContentArea: {
    padding: "12px",
    minHeight: "80px",
    maxHeight: "150px",
    overflowY: "auto",
    fontFamily: "var(--font-mono)",
    fontSize: "0.8rem",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  logLineText: {
    color: "var(--text-secondary)",
  },
  clearFileBtn: {
    fontSize: "0.75rem",
    background: "transparent",
    color: "var(--color-error)",
    fontWeight: 600,
  },
  emptyText: {
    color: "var(--text-muted)",
    fontStyle: "italic",
    textAlign: "center",
    paddingTop: "15px",
  },

  // Factory
  factoryContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  factoryForm: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    background: "rgba(255,255,255,0.02)",
    padding: "16px",
    borderRadius: "10px",
    border: "1px solid var(--border-color)",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  formLabel: {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "var(--text-secondary)",
  },
  buttonSelectGrid: {
    display: "flex",
    gap: "10px",
  },
  selectBtnOption: {
    flex: 1,
    padding: "8px 12px",
    borderRadius: "6px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid var(--border-color)",
    color: "var(--text-secondary)",
    fontSize: "0.82rem",
    fontWeight: 600,
  },
  selectBtnOptionActive: {
    background: "rgba(139, 92, 246, 0.15)",
    borderColor: "var(--color-primary)",
    color: "var(--text-primary)",
  },
  factoryVisualizer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "rgba(0,0,0,0.15)",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid var(--border-color)",
    minHeight: "140px",
  },
  factoryMachine: {
    width: "120px",
    height: "80px",
    borderRadius: "12px",
    border: "2px dashed var(--color-primary)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.95rem",
    fontWeight: "bold",
    background: "rgba(139, 92, 246, 0.05)",
    transition: "all 0.3s ease",
  },
  factoryMachinePulse: {
    boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)",
    borderColor: "var(--color-primary)",
  },
  flowArrowContainer: {
    flex: 1,
    position: "relative",
    height: "2px",
    margin: "0 16px",
  },
  flowLine: {
    width: "100%",
    height: "2px",
    background: "var(--border-color)",
  },
  flowIndicatorDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "var(--color-accent)",
    position: "absolute",
    top: "-3px",
    left: "0",
    opacity: 0,
    transition: "transform 1s linear, opacity 0.2s",
  },
  flowIndicatorDotActive: {
    opacity: 1,
    transform: "translateX(160px)", // Simulates movement to product
  },
  factoryProduct: {
    width: "180px",
    height: "80px",
    borderRadius: "12px",
    border: "1px solid var(--border-color)",
    background: "var(--gradient-card)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
    opacity: 0.1,
    transform: "scale(0.95)",
    transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
  factoryProductShow: {
    opacity: 1,
    transform: "scale(1)",
    borderColor: "var(--color-success)",
  },
  productBadge: {
    fontSize: "0.75rem",
    fontWeight: "bold",
    color: "var(--color-success)",
  },
  productMessage: {
    fontSize: "0.8rem",
    color: "var(--text-secondary)",
    marginTop: "6px",
    textAlign: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
  },

  // Builder
  builderLayoutGrid: {
    display: "flex",
    gap: "20px",
  },
  builderForm: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    background: "rgba(255,255,255,0.02)",
    padding: "16px",
    borderRadius: "10px",
    border: "1px solid var(--border-color)",
  },
  builderPreview: {
    flex: 1,
    background: "rgba(0, 0, 0, 0.15)",
    border: "1px solid var(--border-color)",
    borderRadius: "10px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  builderCardHeader: {
    fontSize: "0.85rem",
    color: "var(--text-muted)",
    marginBottom: "12px",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  previewUserCard: {
    background: "var(--gradient-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  userCardAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "var(--gradient-neon)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: "white",
    fontSize: "1.1rem",
  },
  userCardDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },
  userCardDetailVal: {
    fontSize: "1.05rem",
    fontWeight: 600,
  },

  // Adapter
  adapterPipeline: {
    display: "flex",
    alignItems: "stretch",
    gap: "16px",
    marginTop: "10px",
  },
  adapterNode: {
    flex: 1,
    background: "rgba(255, 255, 255, 0.01)",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    transition: "border-color 0.3s ease",
  },
  nodeLabel: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "var(--text-secondary)",
  },
  nodeStatus: {
    fontSize: "0.75rem",
    color: "var(--color-primary)",
    fontStyle: "italic",
    marginTop: "auto",
  },
  adapterResultCard: {
    background: "rgba(16, 185, 129, 0.04)",
    border: "1px dashed var(--color-success)",
    borderRadius: "10px",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "10px",
  },

  // Decorator
  decoratorPipeline: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "rgba(0,0,0,0.15)",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid var(--border-color)",
    minHeight: "110px",
  },
  decClientPacket: {
    padding: "10px 14px",
    background: "rgba(59, 130, 246, 0.1)",
    border: "1px solid var(--color-secondary)",
    borderRadius: "8px",
    fontSize: "0.82rem",
    fontWeight: 600,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  decoratorGate: {
    padding: "14px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid var(--border-color)",
    fontSize: "0.85rem",
    fontWeight: "bold",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "200px",
    textAlign: "center",
    transition: "all 0.3s ease",
  },
  gateProcessing: {
    borderColor: "var(--color-warning)",
    background: "rgba(251, 191, 36, 0.05)",
    boxShadow: "0 0 10px rgba(251, 191, 36, 0.2)",
  },
  gateSuccess: {
    borderColor: "var(--color-success)",
    background: "rgba(16, 185, 129, 0.05)",
    boxShadow: "0 0 15px rgba(16, 185, 129, 0.25)",
  },
  gateError: {
    borderColor: "var(--color-error)",
    background: "rgba(244, 63, 94, 0.05)",
    boxShadow: "0 0 15px rgba(244, 63, 94, 0.25)",
  },
  decEndpoint: {
    padding: "10px 14px",
    background: "rgba(255,255,255,0.02)",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    fontSize: "0.82rem",
    fontWeight: 600,
    transition: "opacity 0.3s ease",
  },
  decResultCard: {
    marginTop: "16px",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid var(--border-color)",
  },

  // Strategy
  strategyContainer: {
    display: "flex",
    gap: "20px",
  },
  strategyForm: {
    flex: 1,
    background: "rgba(255,255,255,0.02)",
    padding: "16px",
    borderRadius: "10px",
    border: "1px solid var(--border-color)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  strategyVisuals: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "14px",
  },
  strategyPathNode: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    transition: "opacity 0.2s ease, border-color 0.2s",
  },

  // Observer
  observerDashboard: {
    display: "flex",
    gap: "20px",
  },
  observerPanel: {
    flex: 1,
    background: "rgba(255,255,255,0.02)",
    padding: "16px",
    borderRadius: "10px",
    border: "1px solid var(--border-color)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  subscribersList: {
    flex: 1.2,
    background: "rgba(0,0,0,0.15)",
    border: "1px solid var(--border-color)",
    borderRadius: "10px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
  },
  subListHeader: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "var(--text-secondary)",
    marginBottom: "12px",
    borderBottom: "1px solid var(--border-color)",
    paddingBottom: "8px",
  },
  subscribersGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxHeight: "260px",
    overflowY: "auto",
  },
  subscriberCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    transition: "transform 0.1s ease, border-color 0.3s",
  },
  subscriberCardPulse: {
    borderColor: "var(--color-primary)",
    transform: "scale(1.02)",
  },
  subRemoveBtn: {
    background: "transparent",
    color: "var(--text-muted)",
  },
  subLogMessage: {
    fontSize: "0.75rem",
    color: "var(--color-accent)",
    fontStyle: "italic",
  },
  
  // Home Page Overview
  homeContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    padding: "6px",
  },
  homeBanner: {
    background: "linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)",
    border: "1px solid rgba(139, 92, 246, 0.15)",
    borderRadius: "14px",
    padding: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
  },
  homeBannerTitle: {
    fontSize: "1.35rem",
    fontWeight: 700,
    marginBottom: "10px",
    color: "var(--text-primary)",
    fontFamily: "var(--font-sans)",
  },
  homeBannerText: {
    fontSize: "0.95rem",
    lineHeight: "1.6",
    color: "var(--text-secondary)",
  },
  homeBannerGraphic: {
    width: "120px",
    height: "120px",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.01)",
    border: "1px dashed rgba(255, 255, 255, 0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    flexShrink: 0,
  },
  blueprintGrid: {
    width: "100%",
    height: "100%",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "radial-gradient(rgba(59, 130, 246, 0.15) 10%, transparent 10%)",
    backgroundSize: "10px 10px",
  },
  blueprintLine: {
    position: "absolute",
    width: "80%",
    height: "2px",
    background: "rgba(59, 130, 246, 0.3)",
    transform: "rotate(35deg)",
  },
  blueprintCircle: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    border: "2px solid rgba(139, 92, 246, 0.4)",
    position: "absolute",
  },
  blueprintText: {
    position: "absolute",
    bottom: "8px",
    fontSize: "0.6rem",
    fontWeight: "bold",
    letterSpacing: "1px",
    color: "rgba(59, 130, 246, 0.6)",
  },
  pillarsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
  },
  pillarIconHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 14px",
    borderRadius: "10px",
    fontSize: "1rem",
  },
  pillarAnalogy: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
    fontStyle: "italic",
    display: "block",
  },
  pillarDesc: {
    fontSize: "0.85rem",
    lineHeight: "1.5",
    color: "var(--text-secondary)",
  },
  pillarList: {
    listStyleType: "none",
    fontSize: "0.85rem",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginTop: "6px",
    paddingLeft: "4px",
    color: "var(--text-secondary)",
  },
  pillarAction: {
    marginTop: "auto",
    paddingTop: "12px",
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "var(--color-primary)",
    textAlign: "right",
  },
  whyPatternsCard: {
    background: "rgba(255, 255, 255, 0.01)",
    border: "1px solid var(--border-color)",
    borderRadius: "14px",
    padding: "20px",
    marginTop: "8px",
  },
  benefitsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginTop: "12px",
  },
  benefitItem: {
    background: "rgba(0,0,0,0.15)",
    border: "1px solid var(--border-color)",
    borderRadius: "10px",
    padding: "14px",
  },
};
