import { LogEntity, LogSeverityLevel } from "../entities/log.entity";
import { LogDatasource } from "./log.datasource";

class MockLogDatasource implements LogDatasource {
  private logs: LogEntity[] = [];

  async saveLog(log: LogEntity): Promise<void> {
    this.logs.push(log);
  }
  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    return this.logs;
  }
}

describe("log datasource", () => {
  let datasource: MockLogDatasource;

  const newLog = new LogEntity({
    level: LogSeverityLevel.LOW,
    message: "test message",
    origin: "test origin",
  });

  beforeEach(() => {
    datasource = new MockLogDatasource();
  });

  test("should test the abstract class", async () => {
    const mockLogDatasource = new MockLogDatasource();

    expect(mockLogDatasource).toBeInstanceOf(MockLogDatasource);
    expect(typeof mockLogDatasource.saveLog).toBe("function");
    expect(typeof mockLogDatasource.getLogs).toBe("function");

    await mockLogDatasource.saveLog(newLog);
    const logs = await mockLogDatasource.getLogs(LogSeverityLevel.LOW);

    expect(logs).toHaveLength(1);
    expect(logs[0]).toBeInstanceOf(LogEntity);
    expect(logs[0]).toEqual(newLog);
  });

  it("should save a log entry", async () => {
    await datasource.saveLog(newLog);

    const logs = await datasource.getLogs(LogSeverityLevel.LOW);
    expect(logs.length).toBe(1);
    expect(logs[0]).toEqual(newLog);
  });

  it("should save multiple log entries", async () => {
    await datasource.saveLog(newLog);
    await datasource.saveLog(newLog);

    const logs = await datasource.getLogs(LogSeverityLevel.LOW);

    expect(logs.length).toBe(2);
    expect(logs).toContainEqual(newLog);
    expect(logs[0]).toBeInstanceOf(LogEntity);
  });
});
