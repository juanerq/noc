import * as fs from "fs";
import path from "path";
import { FileSystemDatasource } from "./file-system.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

describe("FileSystemDatasource", () => {
  const logPath = path.join(process.cwd(), "logs");

  beforeEach(() => {
    fs.rmSync(logPath, { recursive: true, force: true });
  });

  test("should create log file if they does not exist", () => {
    new FileSystemDatasource();

    const files = fs.readdirSync(logPath);

    expect(files).toEqual(["logs-all.log", "logs-high.log", "logs-medium.log"]);
  });

  test("should save a og in logs-all.log and logs-medium.log", async () => {
    const fileSystemDatasource = new FileSystemDatasource();
    const log = new LogEntity({
      level: LogSeverityLevel.MEDIUM,
      message: "test",
      origin: "test",
    });

    await fileSystemDatasource.saveLog(log);

    const allLogs = fs.readFileSync(`${logPath}/logs-all.log`, {
      encoding: "utf-8",
    });
    const mediumLogs = fs.readFileSync(`${logPath}/logs-medium.log`, {
      encoding: "utf-8",
    });

    expect(allLogs).toContain(JSON.stringify(log));
    expect(mediumLogs).toContain(JSON.stringify(log));
  });

  test("should save a og in logs-all.log and logs-high.log", async () => {
    const fileSystemDatasource = new FileSystemDatasource();
    const log = new LogEntity({
      level: LogSeverityLevel.HIGH,
      message: "test",
      origin: "test",
    });

    await fileSystemDatasource.saveLog(log);

    const allLogs = fs.readFileSync(`${logPath}/logs-all.log`, {
      encoding: "utf-8",
    });
    const highLogs = fs.readFileSync(`${logPath}/logs-high.log`, {
      encoding: "utf-8",
    });

    expect(allLogs).toContain(JSON.stringify(log));
    expect(highLogs).toContain(JSON.stringify(log));
  });

  test("should return all logs", async () => {
    const logDatasource = new FileSystemDatasource();

    const logLow = new LogEntity({
      level: LogSeverityLevel.LOW,
      message: "test",
      origin: "test",
    });

    const logHigh = new LogEntity({
      level: LogSeverityLevel.HIGH,
      message: "test",
      origin: "test",
    });

    const logMedium = new LogEntity({
      level: LogSeverityLevel.MEDIUM,
      message: "test",
      origin: "test",
    });

    await logDatasource.saveLog(logLow);
    await logDatasource.saveLog(logHigh);
    await logDatasource.saveLog(logMedium);

    const logsLow = await logDatasource.getLogs(LogSeverityLevel.LOW);
    const logsMedium = await logDatasource.getLogs(LogSeverityLevel.MEDIUM);
    const logsHigh = await logDatasource.getLogs(LogSeverityLevel.HIGH);

    expect(logsLow).toEqual(
      expect.arrayContaining([logLow, logHigh, logMedium])
    );
    expect(logsMedium).toEqual(expect.arrayContaining([logMedium]));
    expect(logsHigh).toEqual(expect.arrayContaining([logHigh]));
  });

  test("should not throw an error if path exists", async () => {
    new FileSystemDatasource();
    new FileSystemDatasource();

    expect(true).toBeTruthy();
  });
});
