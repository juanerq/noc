import * as fs from "fs";
import { LogDatasource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

export class FileSystemDatasource implements LogDatasource {
  private readonly logPathBase = "logs/";
  private readonly logPaths: Record<LogSeverityLevel, string> = {
    [LogSeverityLevel.LOW]: `${this.logPathBase}logs-all.log`,
    [LogSeverityLevel.MEDIUM]: `${this.logPathBase}logs-medium.log`,
    [LogSeverityLevel.HIGH]: `${this.logPathBase}logs-high.log`,
  };

  constructor() {
    this.createLogsFile();
  }

  private createLogsFile(): void {
    if (!fs.existsSync(this.logPathBase)) {
      fs.mkdirSync(this.logPathBase);
    }

    Object.values(this.logPaths).forEach((path) => {
      if (!fs.existsSync(path)) {
        fs.writeFileSync(path, "");
      }
    });
  }

  async saveLog(newLog: LogEntity): Promise<void> {
    const logAsJson = `${JSON.stringify(newLog)}\n`;

    fs.appendFileSync(this.logPaths[LogSeverityLevel.LOW], logAsJson);

    if (newLog.level === LogSeverityLevel.LOW) return;

    fs.appendFileSync(this.logPaths[newLog.level], logAsJson);
  }

  private getLogsFromFile(logPath: string): LogEntity[] {
    const content = fs.readFileSync(logPath, "utf-8");
    if (content.trim() === "") return [];

    return content.trim().split("\n").map(LogEntity.fromJson);
  }

  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    if (!(severityLevel in LogSeverityLevel)) {
      throw new Error("Invalid severity level");
    }

    const logPath = this.logPaths[severityLevel];

    return this.getLogsFromFile(logPath);
  }
}
