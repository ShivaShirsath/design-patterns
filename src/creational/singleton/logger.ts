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
    const formatted = `[${new Date().toISOString()}] ${message}\n`;

    console.log(formatted);

    fs.appendFileSync(this.logFilePath, formatted);
  }
}
