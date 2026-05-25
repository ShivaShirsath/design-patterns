export default {
  appendFileSync(filePath: string, data: string): void {
    const logs = JSON.parse(localStorage.getItem("app_logs") || "[]");
    logs.push(data.trim());
    localStorage.setItem("app_logs", JSON.stringify(logs));
    
    // Dispatch a custom event to notify UI components about log changes
    window.dispatchEvent(new CustomEvent("app-log-updated", { detail: data.trim() }));
  },
  
  readFileSync(filePath: string, encoding?: string): string {
    const logs = JSON.parse(localStorage.getItem("app_logs") || "[]");
    return logs.join("\n");
  },
  
  existsSync(filePath: string): boolean {
    return true;
  }
};
